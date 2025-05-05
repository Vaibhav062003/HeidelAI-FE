from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import logging
from ing import fetch_all_user_data, analyze_with_gemini, compare_accounts_with_gemini

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

@app.websocket("/ws/influencer")
async def websocket_endpoint(websocket: WebSocket):
    logger.info("New WebSocket connection attempt")
    await websocket.accept()
    logger.info("WebSocket connection established")
    
    try:
        while True:
            # Receive usernames from frontend
            data = await websocket.receive_text()
            logger.info(f"Received data: {data}")
            usernames = [username.strip() for username in data.split(",")]
            logger.info(f"Processing usernames: {usernames}")
            
            # Send initial status
            await websocket.send_json({
                "type": "status",
                "content": "Starting analysis..."
            })
            
            analyses = {}
            raw_data = {}
            
            # Process each username
            for username in usernames:
                try:
                    logger.info(f"Fetching data for username: {username}")
                    data = fetch_all_user_data(username, max_media_count=10)
                    
                    if data and 'business_discovery' in data:
                        logger.info(f"Successfully fetched data for {username}")
                        
                        # Send status update
                        await websocket.send_json({
                            "type": "status",
                            "content": f"Analyzing {username}'s profile..."
                        })
                        
                        logger.info(f"Starting analysis for {username}")
                        analysis = analyze_with_gemini(data)
                        analyses[username] = analysis
                        raw_data[username] = data
                        
                        await websocket.send_json({
                            "type": "analysis",
                            "content": {
                                "username": username,
                                "analysis": analysis
                            }
                        })
                        logger.info(f"Analysis sent for {username}")
                        
                    else:
                        logger.error(f"Failed to fetch data for {username}")
                        await websocket.send_json({
                            "type": "error",
                            "content": f"Failed to fetch data for @{username}. Please ensure the username is correct and the account is public."
                        })
                        
                except Exception as e:
                    logger.error(f"Error processing {username}: {str(e)}", exc_info=True)
                    await websocket.send_json({
                        "type": "error",
                        "content": f"Error processing @{username}: {str(e)}"
                    })
            
            # Compare accounts if multiple usernames provided
            if len(usernames) > 1 and len(analyses) > 1:
                logger.info("Starting account comparison")
                try:
                    await websocket.send_json({
                        "type": "status",
                        "content": "Generating comparison analysis..."
                    })
                    
                    comparison = compare_accounts_with_gemini(
                        analyses[usernames[0]],
                        analyses[usernames[1]],
                        raw_data[usernames[0]],
                        raw_data[usernames[1]]
                    )
                    
                    await websocket.send_json({
                        "type": "comparison",
                        "content": comparison
                    })
                    logger.info("Comparison completed and sent")
                    
                except Exception as e:
                    logger.error(f"Error in comparison: {str(e)}", exc_info=True)
                    await websocket.send_json({
                        "type": "error",
                        "content": f"Error generating comparison: {str(e)}"
                    })
            
            # Send completion message
            await websocket.send_json({
                "type": "complete",
                "content": "Analysis complete"
            })
            logger.info("Analysis complete, sent final message")
            
    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        try:
            await websocket.send_json({
                "type": "error",
                "content": f"An unexpected error occurred: {str(e)}"
            })
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting FastAPI server")
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")