from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio
import json
import logging
from Main_Agent import AggregatorAgent, RefineQueryAgent, RefineContextAgent, FollowUpQuestionAgent, QueryAgent

app = FastAPI()

logger = logging.getLogger("uvicorn")

# === Request Models ===
class QueryRequest(BaseModel):
    query: str
    platforms: List[str]

class FollowUpResponse(BaseModel):
    answers: Dict[str, str]

class ContextResponse(BaseModel):
    refined_query: str
    context: Dict[str, str]

# === Instantiate Agents ===
query_agent = QueryAgent()
refine_query_agent = RefineQueryAgent(query_agent)
refine_context_agent = RefineContextAgent(query_agent)

@app.post("/start")
async def start_query(req: QueryRequest):
    refined_query = req.query
    responses = {}
    MAX_REFINEMENT_QUESTIONS = 3

    for _ in range(MAX_REFINEMENT_QUESTIONS):
        follow_up_question = refine_query_agent.generate_refinement_question(refined_query)
        if follow_up_question == "NO_MORE_QUESTIONS":
            break
        return {
            "question": follow_up_question,
            "refined_query": refined_query,
            "step": "refinement",
        }

    return {
        "refined_query": refined_query,
        "step": "refinement-complete"
    }

@app.post("/refine")
async def refine(req: FollowUpResponse):
    last_query = list(req.answers.values())[-1]
    original_question = list(req.answers.keys())[0]
    refined_query = refine_context_agent.refine_query_with_context(original_question, req.answers)
    return {
        "refined_query": refined_query,
        "step": "refinement",
    }

@app.post("/analyze/prepare")
async def analyze_prepare(req: QueryRequest):
    agent = AggregatorAgent()
    platform_queries = await agent.generate_queries(query=req.query, platforms=req.platforms)

    analysis_results = {}
    raw_data = {}

    for platform, pquery in platform_queries.platform_queries.items():
        if platform == "youtube":
            data = await agent.scrape_youtube(pquery)
            analysis = await agent.analyze_youtube(data, req.query)
        elif platform == "reddit":
            data = await agent.scrape_reddit(pquery)
            analysis = await agent.analyze_reddit(data, req.query)
        elif platform == "google":
            data = await agent.scrape_web(pquery)
            analysis = await agent.analyze_web(data, req.query)
        elif platform == "instagram":
            data = await agent.scrape_instagram(pquery)
            analysis = await agent.analyze_instagram(data, req.query)
        else:
            continue

        raw_data[platform] = [d.model_dump() for d in data]
        analysis_results[platform] = analysis

    follow_up_agent = FollowUpQuestionAgent(query_agent)
    follow_up_questions = await follow_up_agent.ask_follow_up_questions(
        youtube_analysis=analysis_results.get("youtube", ""),
        reddit_analysis=analysis_results.get("reddit", ""),
        web_analysis=analysis_results.get("google", ""),
        instagram_analysis=analysis_results.get("instagram", "")
    )

    return {
        "platform_queries": platform_queries.platform_queries,
        "individual_analysis": analysis_results,
        "follow_up_questions": follow_up_questions,
        "raw_data": raw_data,
        "step": "awaiting-followup-context"
    }

@app.post("/analyze/finalize")
async def analyze_finalize(req: ContextResponse):
    agent = AggregatorAgent()
    combined = await agent.analyze_combined(
        youtube_analysis=req.context.get("youtube", ""),
        reddit_analysis=req.context.get("reddit", ""),
        web_analysis=req.context.get("google", ""),
        instagram_analysis=req.context.get("instagram", ""),
        refined_context=json.dumps(req.context)
    )
    return {
        "combined_analysis": combined,
        "step": "final-analysis-complete"
    }

@app.websocket("/ws/analyze")
async def websocket_analyze(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_json()
        query = data.get("query")
        platforms = data.get("platforms", [])

        agent = AggregatorAgent()
        total_steps = 2 + len(platforms)  # 1: queries, N: per-platform, 1: follow-up, 1: final
        current_step = 0

        # Step 1: Generating queries
        await websocket.send_json({
            "type": "status",
            "content": "📝 Generating platform-specific queries..."
        })
        await websocket.send_json({
            "type": "progress",
            "percent": int((current_step / total_steps) * 100)
        })
        platform_queries = await agent.generate_queries(query=query, platforms=platforms)
        current_step += 1
        await websocket.send_json({
            "type": "progress",
            "percent": int((current_step / total_steps) * 100)
        })

        analysis_results = {}
        raw_data = {}

        # Step 2: Per-platform scraping and analysis
        for idx, (platform, pquery) in enumerate(platform_queries.platform_queries.items()):
            await websocket.send_json({
                "type": "status",
                "content": f"🔍 Scraping and analyzing data from {platform} ({idx+1}/{len(platform_queries.platform_queries)})..."
            })
            await websocket.send_json({
                "type": "progress",
                "percent": int((current_step / total_steps) * 100)
            })

            if platform == "youtube":
                data = await agent.scrape_youtube(pquery)
                analysis = await agent.analyze_youtube(data, query)
            elif platform == "reddit":
                data = await agent.scrape_reddit(pquery)
                analysis = await agent.analyze_reddit(data, query)
            elif platform == "google":
                data = await agent.scrape_web(pquery)
                analysis = await agent.analyze_web(data, query)
            elif platform == "instagram":
                data = await agent.scrape_instagram(pquery)
                analysis = await agent.analyze_instagram(data, query)
            else:
                continue

            raw_data[platform] = [d.model_dump() for d in data]
            analysis_results[platform] = analysis

            current_step += 1
            await websocket.send_json({
                "type": "progress",
                "percent": int((current_step / total_steps) * 100)
            })

        # Step 3: Follow-up questions
        await websocket.send_json({
            "type": "status",
            "content": "💡 Generating follow-up questions based on all data..."
        })
        await websocket.send_json({
            "type": "progress",
            "percent": int((current_step / total_steps) * 100)
        })
        follow_up_agent = FollowUpQuestionAgent(query_agent)
        follow_up_questions = await follow_up_agent.ask_follow_up_questions(
            youtube_analysis=analysis_results.get("youtube", ""),
            reddit_analysis=analysis_results.get("reddit", ""),
            web_analysis=analysis_results.get("google", ""),
            instagram_analysis=analysis_results.get("instagram", "")
        )
        current_step += 1
        await websocket.send_json({
            "type": "progress",
            "percent": int((current_step / total_steps) * 100)
        })

        await websocket.send_json({
            "type": "follow_up_questions",
            "questions": follow_up_questions,
            "step": "awaiting-followup-context"
        })

        user_context = await websocket.receive_json()
        refined_context = user_context.get("context", {})

        # Step 4: Final combined analysis
        await websocket.send_json({
            "type": "status",
            "content": "🧠 Performing final combined analysis..."
        })
        await websocket.send_json({
            "type": "progress",
            "percent": int((current_step / total_steps) * 100)
        })
        combined = await agent.analyze_combined(
            youtube_analysis=analysis_results.get("youtube", ""),
            reddit_analysis=analysis_results.get("reddit", ""),
            web_analysis=analysis_results.get("google", ""),
            instagram_analysis=analysis_results.get("instagram", ""),
            refined_context=json.dumps(refined_context)
        )
        current_step += 1
        await websocket.send_json({
            "type": "progress",
            "percent": 100
        })

        await websocket.send_json({
            "type": "final_result",
            "combined_analysis": combined,
            "platform_queries": platform_queries.platform_queries,
            "individual_analysis": analysis_results,
            "raw_data": raw_data,
            "step": "final-analysis-complete"
        })

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected.")
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "content": f"Error occurred: {str(e)}"
        })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")