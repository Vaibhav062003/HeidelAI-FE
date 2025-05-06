from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn
import json
import google.generativeai as genai

# Import existing classes and functions from Main_Agent.py
from Main_Agent import (
    AggregatorAgent, 
    QueryResult,
    TavilySearchConfig,
    HashtagSearchConfig
)

GEMINI_API_KEY = "AIzaSyB7x81BRsUcQwfMcnENs0NumkaaRPkY_gM"  # Replace with your API key
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(
    'gemini-2.0-flash-thinking-exp-01-21',
    generation_config={
        'temperature': 0.1 # Lower temperature for more focused responses
        # 'max_output_tokens': 2048
    }
)

app = FastAPI(
    title="Political Analysis API",
    description="API for analyzing political data across multiple platforms",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class SearchRequest(BaseModel):
    query: str = Field(..., description="Search query to analyze")
    platforms: List[str] = Field(
        default=["youtube", "reddit", "google", "instagram"],
        description="List of platforms to analyze"
    )

class AnalysisResponse(BaseModel):
    platform_queries: dict
    youtube_analysis: Optional[str]
    reddit_analysis: Optional[str]
    web_analysis: Optional[str]
    instagram_analysis: Optional[str]
    combined_analysis: Optional[str]
    relevance_score: Optional[float]
    relevance_justification: Optional[str]

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_query(request: SearchRequest):
    try:
        # Initialize AggregatorAgent
        aggregator = AggregatorAgent()

        # Generate platform-specific queries
        query_result = await aggregator.generate_queries(
            query=request.query, 
            platforms=request.platforms
        )

        # Initialize variables for analyses
        youtube_analysis = ""
        reddit_analysis = ""
        web_analysis = ""
        instagram_analysis = ""

        # Process each platform
        for platform, platform_query in query_result.platform_queries.items():
            if platform == "youtube":
                youtube_data = await aggregator.scrape_youtube(platform_query)
                youtube_analysis = await aggregator.analyze_youtube(youtube_data, request.query)
            elif platform == "reddit":
                reddit_data = await aggregator.scrape_reddit(platform_query)
                reddit_analysis = await aggregator.analyze_reddit(reddit_data, request.query)
            elif platform == "google":
                web_data = await aggregator.scrape_web(platform_query)
                web_analysis = await aggregator.analyze_web(web_data, request.query)
            elif platform == "instagram":
                instagram_data = await aggregator.scrape_instagram(platform_query)
                instagram_analysis = await aggregator.analyze_instagram(instagram_data, request.query)

        # Get combined analysis
        combined_analysis = await aggregator.analyze_combined(
            youtube_analysis,
            reddit_analysis,
            web_analysis,
            instagram_analysis
        )

        # Check relevance
        relevance_result = await aggregator.check_relevance(request.query, combined_analysis)

        return AnalysisResponse(
            platform_queries=query_result.platform_queries,
            youtube_analysis=youtube_analysis,
            reddit_analysis=reddit_analysis,
            web_analysis=web_analysis,
            instagram_analysis=instagram_analysis,
            combined_analysis=combined_analysis,
            relevance_score=relevance_result["relevance_score"],
            relevance_justification=relevance_result["justification"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    aggregator = AggregatorAgent()
    
    try:
        while True:
            # Receive initial query
            initial_query = await websocket.receive_text()
            
            # Start refinement process
            refinement_prompt_template = """
            You are an expert query analysis and refinement system. Your task is to carefully understand the user's original query and generate a SINGLE relevant follow-up question to refine their information need.

            Original query: "{query}"

            ## Guidelines for generating the follow-up question:
            - Always ask for location or try to get location based on the original query.
            - ask location only once and if the user provides the location then dont ask again.
            - Focus on clarifying the user's intent (e.g., specific aspects, timeframes, content types).
            - Avoid asking for unnecessary details.
            - Ensure the question is concise and directly related to the query.
            - If no further clarification is needed, return "NO_MORE_QUESTIONS".

            Return ONLY the follow-up question as plain text, without quotes or additional explanation.
            """

            MAX_REFINEMENT_QUESTIONS = 3
            refined_query = initial_query
            responses = {}

            # Send initial acknowledgment
            await websocket.send_text(json.dumps({
                "type": "status",
                "content": "Starting query refinement process..."
            }))

            # Query refinement loop
            for i in range(MAX_REFINEMENT_QUESTIONS):
                prompt = refinement_prompt_template.format(query=refined_query)
                response = model.generate_content(prompt)
                question = response.text.strip()

                if question == "NO_MORE_QUESTIONS":
                    break

                # Send refinement question to frontend
                await websocket.send_text(json.dumps({
                    "type": "question",
                    "content": question
                }))

                # Wait for user's answer
                user_response = await websocket.receive_text()
                responses[f"refinement_{i+1}"] = user_response
                refined_query = f"{initial_query} {user_response}"

            # Start analysis process
            await websocket.send_text(json.dumps({
                "type": "status",
                "content": "Starting data collection and analysis..."
            }))

            # Generate platform-specific queries
            query_result = await aggregator.generate_queries(
                query=refined_query,
                platforms=["youtube", "reddit", "google", "instagram"]
            )

            # Process each platform
            platform_analyses = {}
            for platform, platform_query in query_result.platform_queries.items():
                await websocket.send_text(json.dumps({
                    "type": "status",
                    "content": f"Analyzing {platform} data..."
                }))

                analysis = None
                if platform == "youtube":
                    data = await aggregator.scrape_youtube(platform_query)
                    analysis = await aggregator.analyze_youtube(data, refined_query)
                elif platform == "reddit":
                    data = await aggregator.scrape_reddit(platform_query)
                    analysis = await aggregator.analyze_reddit(data, refined_query)
                elif platform == "google":
                    data = await aggregator.scrape_web(platform_query)
                    analysis = await aggregator.analyze_web(data, refined_query)
                elif platform == "instagram":
                    data = await aggregator.scrape_instagram(platform_query)
                    analysis = await aggregator.analyze_instagram(data, refined_query)
                
                if analysis is not None:
                    platform_analyses[platform] = analysis

            # Perform combined analysis
            combined_analysis = await aggregator.analyze_combined(
                platform_analyses.get("youtube", ""),
                platform_analyses.get("reddit", ""),
                platform_analyses.get("web", ""),
                platform_analyses.get("instagram", "")
            )

            # Send final analysis
            await websocket.send_text(json.dumps({
                "type": "result",
                "content": combined_analysis
            }))

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {str(e)}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "content": str(e)
        }))
    finally:
        await websocket.close()

if __name__ == "__main__":
    uvicorn.run("main_fastapi:app", host="0.0.0.0", port=8000, reload=True)