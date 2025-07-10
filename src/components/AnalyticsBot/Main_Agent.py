from dataclasses import dataclass
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import google.generativeai as genai
import asyncio
import logging
import aiohttp
import json  # Import the json module
from contextlib import asynccontextmanager  # Import asynccontextmanager
import requests
from tavily import TavilyClient
import datetime

def extract_conclusions(response_text):
    if "CONCLUSIONS:" in response_text:
        return response_text.split("CONCLUSIONS:")[1].strip()
    return response_text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# YouTube API Key (Replace with your actual API key)

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyBVY2HB4BHkrPw8Vo0i_9AbwImaKo8vgWM"  # Replace with your API key
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(
    'gemini-2.0-flash-thinking-exp-01-21',
    generation_config={
        'temperature': 0.1 # Lower temperature for more focused responses
        # 'max_output_tokens': 2048
    }
)

finalmodel = genai.GenerativeModel(
    'gemini-2.0-flash-thinking-exp-01-21',
    generation_config={
        # 'temperature': 0, # Lower temperature for more focused responses
        # 'max_output_tokens': 2048
    }
)

YOUTUBE_API_KEY = "AIzaSyD9QrQOVh0xUUraRQaR6LdgImr5jFATW2I"
@dataclass
class QueryAnalysisDeps:
    query: str
    platforms: List[str]
    user_context: Optional[str] = None

class QueryResult(BaseModel):
    platform_queries: dict = Field(description="Platform-specific search queries")


class QueryAgent:
    def __init__(self):
        self.model = model
        self.system_prompt = ("""
        You are QueryCraft, an AI system that transforms user queries into optimized platform-specific search queries. Output must strictly follow this format:
        YouTube: [query]
        Instagram: [hashtags]
        Reddit: [query]
        Google: [query]
        Do not include explanations or markdown formatting.
        """)

    
    async def generate_platform_queries(self, query: str, platforms: List[str]) -> dict:
        platform_queries = {}
        for platform in platforms:
            # Platform-Specific Query Generation Prompt
            pprompt = f"""
            Your task is to generate a search query specifically for the {platform} platform based on the user's request.

            User Query: "{query}"

            ONLY return the result in this exact format — no extra lines, no markdown, no explanations.

            Format:
            {platform.capitalize()}: [query or hashtags]

            Guidelines:
            ### YouTube: Use 3-5 descriptive keywords, which will help finding proper video related to User Query
            ### Instagram Hashtags
                - if name of person is added just with his name as hastag (e.g. narendra modi)
                - dont create separete hastag with location if location is given.
                - example narendra modi speech in india hastag should be narendra modi, naredramodispeech 
                - Convert concepts to hashtag format (word or CombinedPhrase WITHOUT #)
                - always use person name while creating hastag if person name is given in query
                - Include 3-4 relevant tags without spaces or punctuation
                - Start with most specific, then add other related things as tags to reach wider audience
                - be concise to Query only dont go off topic must include main key points from topic only no other
            ### Reddit
                always have subreddit prefix compulsory 
                -generate two three reddit query compulsory each with separate 
                -separate each query with ","
                -generate one query using the location as the subreddit prefix if a location is mentioned in the query (e.g., r/india, r/pune).
                -Ensure the person's name is included as the main topic if mentioned in the query (e.g., r/india narendra modi) nothing else should be given other than that not at all.
                -Use only one subreddit prefix per query. Avoid including multiple subreddit prefixes unless explicitly requested.
                -Strictly use keywords from the query to target a specific subreddit. Avoid adding unrelated terms.
                -Prioritize targeting politically diverse subreddits when applicable.
                -Place the subreddit prefix at the beginning of the query (e.g., r/india reasons for NCP loss).
                -Avoid creating subreddit prefixes if the query does not specify a location or subreddit context.
                -Ensure the query remains concise and directly relevant to the topic, avoiding unnecessary details. 
            ### Google: Focus on natural search terms or use operators if helpful.

            Output must start with **exactly**:
            {platform.capitalize()}:
            """

            try:
                response = self.model.generate_content(pprompt)  # Use pprompt here
                raw_query = response.text.strip() if response.text else query
                # Extract only the line starting with the platform name
                lines = raw_query.splitlines()
                platform_line = next(
                    (line for line in lines if line.strip().lower().startswith(f"{platform.lower()}:")), 
                    raw_query
                )
                # Remove the platform prefix and extra spaces
                sanitized_query = (
                    platform_line.split(":", 1)[-1].strip()
                )
                platform_queries[platform] = sanitized_query
            except Exception as e:
                print(f"Error generating query for {platform}: {e}")
                platform_queries[platform] = query
        return platform_queries

async def process_query(query: str, platforms: List[str], user_context: Optional[str] = None):
    agent = QueryAgent()
    # Generate platform-specific queries
    platform_queries = await agent.generate_platform_queries(
        query=query,
        platforms=platforms
    )

    return QueryResult(
        platform_queries=platform_queries,
    )
    
class SearchConfig(BaseModel):
    topic: str = Field(..., description="Search topic to crawl")
    num_results: int = Field(
        default=10, 
        ge=1, 
        le=50, 
        description="Number of search results to fetch"
    )
    max_concurrent: int = Field(
        default=5, 
        ge=1, 
        le=10, 
        description="Maximum concurrent requests (ignored in this version)"
    )

class CrawlResult(BaseModel):
    url: str
    content: str
    topic: str
    status: str = Field(..., pattern="^(success|failed)$")


class TavilySearchConfig(BaseModel):
    topic: str = Field(..., description="Search topic to query Tavily")
    max_results: int = Field(
        default=10, 
        ge=1, 
        le=50, 
        description="Maximum number of search results to fetch"
    )

class TavilyCrawlResult(BaseModel):
    url: str
    content: str
    topic: str
    status: str = Field(..., pattern="^(success|failed)$")

class TavilySearchAgent(BaseModel):
    search_config: TavilySearchConfig
    client: Optional[TavilyClient] = None  # Add client as an optional field

    class Config:
        arbitrary_types_allowed = True
    
    def __init__(self, search_config: TavilySearchConfig, api_key: str):
        super().__init__(search_config=search_config)  # Initialize Pydantic fields
        self.client = TavilyClient(api_key=api_key)  # Initialize Tavily client with API key

    async def execute(self) -> List[TavilyCrawlResult]:
        """Execute a search using Tavily API and return results."""
        try:
            # Perform the search with Tavily
            response = await asyncio.to_thread(
                self.client.search,
                query=self.search_config.topic,
                max_results=self.search_config.max_results,
                search_depth="basic"  # Use "advanced" for deeper results if needed
            )
            
            results = []
            for result in response.get("results", []):
                crawl_result = TavilyCrawlResult(
                    url=result.get("url", ""),
                    content=result.get("content", ""),
                    topic=self.search_config.topic,
                    status="success" if result.get("content") else "failed"
                )
                results.append(crawl_result)
                
                if crawl_result.status == "success":
                    content_preview = crawl_result.content[:50] + "..." if len(crawl_result.content) > 50 else crawl_result.content
                    # logger.info(f"✓ Successfully fetched content from: {crawl_result.url}")
                    # logger.info(f"  Content preview: {content_preview}")
                    # logger.info(f"  Extracted {len(crawl_result.content.split())} words")
                else:
                    logger.info(f"✗ Failed to fetch content from: {crawl_result.url}")
            
            if not results:
                logger.warning("No results found from Tavily search")
            else:
                logger.info(f"Successfully fetched {len(results)} results from Tavily")
            
            return [r for r in results if r.status == "success" and len(r.content) > 100]  # Filter valid results
        
        except Exception as e:
            logger.error(f"Tavily search error: {str(e)}")
            return []

# class WebScraperAgent(BaseModel):
#     search_config: SearchConfig
    
#     class Config:
#         arbitrary_types_allowed = True
    
#     async def search(self, query: str, num_results) -> List[str]:
#         try:
#             results = list(search(query, num_results=num_results, lang='en'))
#             logger.info(f"Fetched {len(results)} Google results for query: {query}")
#             return results
#         except Exception as e:
#             logger.error(f"Google search error: {str(e)}")
#             return []
    
#     async def crawl(self, url: str) -> str:
#         try:
#             browser_config = BrowserConfig(
#                 headless=True,
#                 verbose=False,
#                 user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
#             )
            
#             run_config = CrawlerRunConfig(
#                 cache_mode=CacheMode.ENABLED,
#                 screenshot=False
#             )
            
#             async with AsyncWebCrawler(config=browser_config) as crawler:
#                 result = await crawler.arun(url=url, config=run_config)
#                 if not result:
#                     return ""
                
#                 # Extract only <p> tags and <article> content
#                 extracted_content = self._extract_p_and_article_tags(result.html)
#                 return extracted_content
                
#         except Exception as e:
#             logger.error(f"Error crawling {url}: {str(e)}")
#             return ""
    
#     def _extract_p_and_article_tags(self, html_content: str) -> str:
#         """
#         Extract only text from <p> tags and <article> elements.
#         """
#         try:
#             soup = BeautifulSoup(html_content, 'html.parser')
#             extracted_text = []
            
#             # First try to get content from article tags
#             articles = soup.find_all('article')
#             if articles:
#                 for article in articles:
#                     # Get all paragraph tags within each article
#                     paragraphs = article.find_all('p')
#                     if paragraphs:
#                         for p in paragraphs:
#                             text = p.get_text(strip=True)
#                             if text and len(text) > 20:  # Only include paragraphs with substantial content
#                                 extracted_text.append(text)
            
#             # If no articles or not enough content in articles, get all paragraphs from the page
#             if not extracted_text or len('\n'.join(extracted_text)) < 200:
#                 paragraphs = soup.find_all('p')
#                 for p in paragraphs:
#                     text = p.get_text(strip=True)
#                     if text and len(text) > 20:  # Only include paragraphs with substantial content
#                         extracted_text.append(text)
            
#             # Join all extracted paragraphs with newlines
#             result = '\n\n'.join(extracted_text)
            
#             # If we still don't have enough content, try to get text from main, section, or div.content elements
#             if len(result) < 200:
#                 main_elements = soup.find_all(['main', 'section', 'div'], class_=['content', 'article-content', 'post-content'])
#                 for element in main_elements:
#                     # Only get direct text, not text from nested elements we've already processed
#                     for text in element.stripped_strings:
#                         if len(text) > 50:  # Only substantial content
#                             extracted_text.append(text)
                
#                 result = '\n\n'.join(extracted_text)
            
#             return result
                
#         except Exception as e:
#             logger.error(f"Error extracting p and article tags: {str(e)}")
#             return "Content extraction failed"
    
#     async def execute(self) -> List[CrawlResult]:
#         # Fetch URLs from Google search
#         urls = await self.search(
#             self.search_config.topic, 
#             self.search_config.num_results
#         )
        
#         if not urls:
#             logger.warning("No URLs found from Google search")
#             return []
        
#         # Create tasks for all URLs
#         tasks = [self.crawl(url) for url in urls]
#         logger.info(f"Processing {len(tasks)} URLs in parallel")
        
#         # Run all tasks concurrently
#         results = []
#         batch_results = await asyncio.gather(*tasks)
        
#         # Process results
#         for url, content in zip(urls, batch_results):
#             result = CrawlResult(
#                 url=url,
#                 content=content or "",
#                 topic=self.search_config.topic,
#                 status="success" if content else "failed"
#             )
#             results.append(result)
            
#             if result.status == "success":
#                 content_preview = content[:50] + "..." if len(content) > 50 else content
#                 logger.info(f"✓ Successfully scraped paragraphs from: {url}")
#                 logger.info(f"  Content preview: {content_preview}")
#                 logger.info(f"  Extracted {len(content.split())} words")
#             else:
#                 logger.info(f"✗ Failed to extract paragraphs from: {url}")
        
#         # Filter out empty results
#         valid_results = [r for r in results if r.status == "success" and len(r.content) > 100]
        
#         if not valid_results:
#             logger.warning("No valid paragraph content extracted from any URL")
#         else:
#             logger.info(f"Successfully extracted paragraph content from {len(valid_results)} URLs")
        
#         return valid_results

# AI Analysis Agent with deep analysis
class AIAnalysisAgent(BaseModel):
    class Config:
        arbitrary_types_allowed = True

    async def analyze_dataset(self, crawl_results: List[CrawlResult], query:str) -> str:
        if not crawl_results:
            return "No paragraph content was found for analysis."
        
        formatted_data = self._format_crawl_results(crawl_results)
        prompt = f"""
        Analyze the provided web-scraped content and extract only the most relevant information related to the query. Ensure the analysis is concise and focused. Follow these steps:
        1. Identify and summarize the parts of the content that directly address the query.
        2. Highlight key points, arguments, and evidence that align with the query's intent.
        3. Exclude any unrelated or off-topic information.
        4. If political parties are mentioned, analyze their relevance in detail.
        Query: {query}
        Content: {formatted_data}
        Provide a plain-text summary with a clear focus on the relevant data.
        """
        try:
            response = model.generate_content(prompt)
            summary = response.text.strip() if response.text else ""
            if not summary:
                logger.error("Empty response from AI model.")
                return "Data collection failed: The AI model returned an empty response."
            return summary
        except Exception as e:
            logger.error(f"Error collecting and summarizing data: {e}")
            return f"Data collection failed due to an error: {str(e)}"
    
    def _format_crawl_results(self, crawl_results: List[CrawlResult]) -> str:
        """
        Format crawl results containing only paragraph content.
        """
        formatted_results = []
        
        for i, result in enumerate(crawl_results, 1):
            if result.status == "success" and result.content:
                # Limit content length to avoid token limits
                content_sample = result.content[:2000].replace('\n\n', '\n').strip()
                formatted_results.append(f"""{result.url}
                    CONTENT EXCERPT:
                    {content_sample}
                    -------------------
                                    """)
                
        return "\n".join(formatted_results)

# Data Processor
class WebDataProcessor:
    def __init__(self, search_config: TavilySearchConfig, tavily_api_key: str):
        self.scraper_agent = TavilySearchAgent(search_config=search_config, api_key=tavily_api_key)
        self.analysis_agent = AIAnalysisAgent()

    async def process_query(self, search_config: TavilySearchConfig) -> str:
        # Set the search config
        self.scraper_agent.search_config = search_config
        
        # Fetch content using Tavily
        crawl_results = await self.scraper_agent.execute()

        if not crawl_results:
            logger.warning("No content found")
            return "Analysis could not be completed: No content was found."

        # Analyze the content with deep analysis
        analysis_result = await self.analysis_agent.analyze_dataset(crawl_results, query=search_config.topic)

        # Save the analysis results
        self.save_to_json(analysis_result, "web_analysis_results.json")
        
        return analysis_result

    def save_to_json(self, analysis_result: str, filename: str):

        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump({"analysis": analysis_result}, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Error saving to JSON: {str(e)}")

YOUTUBE_API_KEY = "AIzaSyDh73McvzphxQss1PBdL863ayXThVV6QCk"
YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/"

# Pydantic models for structured data
class VideoComment(BaseModel):
    text: str
    like_count: int  # Like count for the comment
    dislike_count: Optional[int] = None  # Dislike count (not available in YouTube API)

class VideoDetails(BaseModel):
    video_id: str
    title: str
    description: str
    channel: str
    views: str
    likes: str
    comments: List[VideoComment]
    url: str

# Custom exception for YouTube API errors
class YouTubeAPIError(Exception):
    """Raised when YouTube API encounters an error"""
    pass

# YouTube Scraper Agent
class YoutubeScrapperAgent:
    def __init__(self):
        self.session = None
        self.rate_limiter = asyncio.Semaphore(3)

    @asynccontextmanager
    async def session_context(self):
        try:
            self.session = aiohttp.ClientSession()
            yield self
        finally:
            if self.session:
                await self.session.close()

    async def search_videos(self, query: str, max_results: int = 5) -> List[str]:
        """
        Search for videos based on a query and return their video IDs.
        """
        url = (
            f"{YOUTUBE_BASE_URL}search?part=snippet&q={query}&type=video"
            f"&maxResults={max_results}&key={YOUTUBE_API_KEY}"
        )
        async with self.session.get(url) as response:
            if response.status != 200:
                raise YouTubeAPIError(f"Search failed: {await response.text()}")
            data = await response.json()
            return [item["id"]["videoId"] for item in data.get("items", [])]

    async def get_video_details(self, video_id: str) -> dict:
        url = (
            f"{YOUTUBE_BASE_URL}videos?part=snippet,statistics&id={video_id}"
            f"&key={YOUTUBE_API_KEY}"
        )
        async with self.session.get(url) as response:
            if response.status != 200:
                raise YouTubeAPIError(f"Failed to fetch video details: {await response.text()}")
            data = await response.json()
            if not data.get("items"):
                return None
            video = data["items"][0]
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            return {
                "video_id": video_id,
                "url": video_url,
                "title": video["snippet"]["title"],
                "description": video["snippet"].get("description", ""),
                "channel": video["snippet"]["channelTitle"],
                "views": video["statistics"].get("viewCount", "0"),
                "likes": video["statistics"].get("likeCount", "0"),
                "comments": []
            }

    async def get_video_comments(self, video_id: str, max_results: int = 10) -> List[VideoComment]:
        """
        Fetch top-level comments for a specific video.
        If comments are disabled, return an empty list.
        """
        url = (
            f"{YOUTUBE_BASE_URL}commentThreads?part=snippet&videoId={video_id}"
            f"&maxResults={max_results}&key={YOUTUBE_API_KEY}"
        )
        try:
            async with self.session.get(url) as response:
                if response.status != 200:
                    error_data = await response.json()
                    if "commentsDisabled" in error_data.get("error", {}).get("message", ""):
                        logger.warning(f"Comments are disabled for video ID: {video_id}")
                        return []  # Return an empty list for disabled comments
                    raise YouTubeAPIError(f"Failed to fetch comments: {await response.text()}")
                data = await response.json()
                return [
                    VideoComment(
                        text=item["snippet"]["topLevelComment"]["snippet"]["textDisplay"],
                        like_count=item["snippet"]["topLevelComment"]["snippet"].get("likeCount", 0),
                        dislike_count=None  # Dislike count is not available in YouTube API
                    )
                    for item in data.get("items", [])
                ]
        except Exception as e:
            logger.error(f"Error fetching comments for video ID {video_id}: {e}")
            return []

    async def fetch_youtube_data(self, query: str, max_videos: int = 20, max_comments: int = 30) -> List[VideoDetails]:
        """
        Fetch video details and comments for a given query.
        """
        async with self.rate_limiter:
            video_ids = await self.search_videos(query, max_results=max_videos)
            results = []
            for video_id in video_ids:
                video_details = await self.get_video_details(video_id)
                if video_details:
                    video_comments = await self.get_video_comments(video_id, max_results=max_comments)
                    video_details["comments"] = video_comments
                    results.append(VideoDetails(**video_details))
            return results

    async def process_query(self, query: str, max_videos: int = 5, max_comments: int = 10) -> List[VideoDetails]:
        """
        Process a user query and return structured video data.
        """
        async with self.session_context() as agent:
            return await agent.fetch_youtube_data(query, max_videos=max_videos, max_comments=max_comments)

# YouTube Analysis Agent
# Update just the analyze_dataset method in the YouTubeAnalysisAgent class
class YouTubeAnalysisAgent(BaseModel):
    class Config:
        arbitrary_types_allowed = True

    async def analyze_dataset(self, videos: List[VideoDetails], query: str) -> str:
        formatted_data = self._format_videos(videos)
        """
        Analyze YouTube data using the YouTubeAnalysisAgent.
        """
        prompt = f"""
        Analyze the provided YouTube video data to extract the most relevant information related to the query. Follow these steps:
        1. Summarize the key points discussed in the video titles and descriptions also watch the video using link/url in video data
        2. Identify any recurring themes or patterns across the videos.
        3. Exclude unrelated or off-topic information.
        4. Focus only on content directly addressing the query.
        5. please provide detailed information given in videos dont miss anything
        Query: {query}
        Video Data: {videos}
        Provide the summary as plain text, focusing only on relevant data.
        """
        try:
            response = model.generate_content(prompt)
            summary = response.text.strip() if response.text else ""
            if not summary:
                logger.error("Empty response from AI model.")
                return "Data collection failed: The AI model returned an empty response."
            return summary
        except Exception as e:
            logger.error(f"Error collecting and summarizing data: {e}")
            return f"Data collection failed due to an error: {str(e)}"

    def _format_videos(self, videos: List[VideoDetails]) -> str:
        """
        Format video details into a readable string for the prompt.
        """
        formatted_videos = []
        for video in videos:
            formatted_comments = "\n".join([f"- Comment: {comment.text} (Likes: {comment.like_count})" for comment in video.comments])
            formatted_videos.append(f"""
            **Video Title:** {video.title}
            **URL:** {video.url}
            **Channel:** {video.channel}
            **Views:** {video.views}
            **Likes:** {video.likes}
            **Description:** {video.description}
            **Comments:**
            {formatted_comments or "No comments available."}
            """)
        return "\n".join(formatted_videos)

# YouTube Data Processor
class YouTubeDataProcessor:
    """
    A processor to integrate YouTubeScraperAgent and YouTubeAnalysisAgent.
    """
    def __init__(self):
        self.youtube_scraper_agent = YoutubeScrapperAgent()
        self.analysis_agent = YouTubeAnalysisAgent()

    async def process_query(self, query: str, max_videos: int = 5, max_comments: int = 10) -> str:
        """
        Fetch YouTube data, save it, and analyze it as a single dataset.
        """
        # Step 1: Fetch YouTube data using the scraper agent
        videos = await self.youtube_scraper_agent.process_query(query=query, max_videos=max_videos, max_comments=max_comments)

        # Step 2: Save the raw fetched data to a JSON file
     

        # Step 3: Analyze the fetched data using the analysis agent
        analysis_result = await self.analysis_agent.analyze_dataset(videos, query=SearchConfig.topic)

        # Step 4: Save the analysis results to a JSON file
        self.save_to_json(analysis_result, "youtube_analysis_results.json")

        return analysis_result



    def save_to_json(self, analysis_result : str, filename: str):
        """
        Save analysis results to a JSON file.
        """
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(analysis_result, f, ensure_ascii=False, indent=4)
        logger.info(f"Analysis results saved to {filename}")



REDDIT_API_URL = "https://www.reddit.com"

class RedditSearchConfig(BaseModel):
    topic: str = Field(..., description="Search topic to scrape from Reddit")
    limit: int = Field(
        default=20, 
        ge=1, 
        le=100, 
        description="Number of Reddit posts to fetch"
    )

class RedditComment(BaseModel):
    body: str
    author: Optional[str]
    score: int
    replies: List["RedditComment"] = []  # Recursive structure for nested replies

class RedditPost(BaseModel):
    title: str
    subreddit: str
    score: int
    image: Optional[str] = None
    platform: str = "reddit"
    comments: List[RedditComment] = []


class RedditScraperAgent:
    async def fetch_reddit_data(self, queries: str, limit: int = 10) -> List[RedditPost]:
        """
        Fetch Reddit posts and their comments based on multiple search queries.
        """
        all_reddit_posts = []
        try:
            # Split the combined query into individual subreddit queries
            query_list = [q.strip() for q in queries.split(',') if q.strip()]
            logger.info(f"Reddit queries to process: {query_list}")

            for query in query_list:
                try:
                    # Construct the URL for each query
                    url = f"https://www.reddit.com/search.json?q={requests.utils.quote(query)}&limit={limit}&sort=top"
                    logger.info(f"Constructed Reddit URL: {url}")

                    headers = {"User-Agent": "Mozilla/5.0"}
                    response = requests.get(url, headers=headers, timeout=10)
                    response.raise_for_status()
                    data = response.json()
                    posts = data.get("data", {}).get("children", [])

                    for post in posts:
                        post_data = post["data"]
                        post_url = f"https://www.reddit.com{post_data['permalink']}.json"
                        post_response = requests.get(post_url, headers=headers, timeout=10)
                        post_response.raise_for_status()
                        post_details = post_response.json()
                        comments = self._extract_comments(post_details[1]["data"]["children"])

                        reddit_post = RedditPost(
                            title=post_data["title"],
                            subreddit=post_data["subreddit"],
                            score=post_data["score"],
                            image=post_data["thumbnail"] if post_data["thumbnail"].startswith("http") else None,
                            comments=comments
                        )
                        all_reddit_posts.append(reddit_post)

                    logger.info(f"Fetched {len(posts)} Reddit posts for query: {query}")
                except Exception as e:
                    logger.error(f"Error fetching data for query '{query}': {e}")

            logger.info(f"Total Reddit posts fetched: {len(all_reddit_posts)}")
            return all_reddit_posts
        except Exception as e:
            logger.error(f"Reddit search error: {e}")
            return []

    def _extract_comments(self, comments_data: list) -> List[RedditComment]:
        """
        Recursively extract comments and their nested replies.
        """
        comments = []
        for comment in comments_data:
            if comment["kind"] == "t1":  # t1 indicates a comment
                comment_data = comment["data"]
                replies = []
                if comment_data.get("replies"):
                    replies = self._extract_comments(comment_data["replies"]["data"]["children"])

                reddit_comment = RedditComment(
                    body=comment_data.get("body", ""),
                    author=comment_data.get("author", "[deleted]"),
                    score=comment_data.get("score", 0),
                    replies=replies
                )
                comments.append(reddit_comment)
        return comments

# Reddit Analysis Agent
class RedditAnalysisAgent(BaseModel):
    class Config:
        arbitrary_types_allowed = True

    async def analyze_dataset(self, posts: List[RedditPost],query: str) -> str:
        formatted_data = self._format_posts(posts)
        prompt = f"""
        Analyze the provided Reddit posts and comments to extract the most relevant information related to the query. Follow these steps:
        1. Read all posts and comments together to identify parts directly addressing the query.
        2. Summarize key points, arguments, and evidence into a concise and cohesive summary.
        3. Exclude unrelated or off-topic information.
        4. If the data is not related to the query, return "null" or indicate that data scraping was incomplete.
        Query: {query}
        Content: {formatted_data}
        Provide the summary as plain text, focusing only on relevant data.
        """
        try:
            response = model.generate_content(prompt)
            summary = response.text.strip() if response.text else ""
            if not summary:
                logger.error("Empty response from AI model.")
                return "Data collection failed: The AI model returned an empty response."
            return summary
        except Exception as e:
            logger.error(f"Error collecting and summarizing data: {e}")
            return f"Data collection failed due to an error: {str(e)}"
        
    def _format_posts(self, posts: List[RedditPost]) -> str:
        """
        Format Reddit post details into a readable string for the prompt.
        """
        formatted_posts = []
        for post in posts:
            formatted_comments = "\n".join(
                [f"- Comment by {comment.author}: {comment.body} (Score: {comment.score})" for comment in post.comments]
            )
            formatted_posts.append(f"""
            **Post Title:** {post.title}
            **Subreddit:** {post.subreddit}
            **Score:** {post.score}
            **Image:** {post.image or 'No image'}
            **Comments:**
            {formatted_comments or "No comments available."}
            """)
        return "\n".join(formatted_posts)

# Reddit Data Processor
class RedditDataProcessor:
    """
    A processor to integrate Reddit scraping and analysis agents.
    """
    def __init__(self):
        self.scraper_agent = RedditScraperAgent()
        self.analysis_agent = RedditAnalysisAgent()

    async def process_query(self, topic: str, limit: int = 10) -> str:
        """
        Fetch Reddit data, save it, and analyze it as a single dataset.
        """
        # Step 1: Fetch Reddit data using the scraper agent
        posts = await self.scraper_agent.fetch_reddit_data(topic, limit)

        # Step 2: Save the raw fetched data to a JSON file
        self.save_raw_data(posts, "reddit_raw_data.json")

        # Step 3: Analyze the fetched data using the analysis agent
        analysis_result = await self.analysis_agent.analyze_dataset(posts, query=topic)

        # Step 4: Save the analysis results to a JSON file
        self.save_to_json(analysis_result, "reddit_analysis_results.json")

        return analysis_result

    def save_raw_data(self, posts: List[RedditPost], filename: str):
        """
        Save raw Reddit data (post details and comments) to a JSON file.
        """
        raw_data = [post.model_dump() for post in posts]  # Convert Pydantic models to dictionaries
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(raw_data, f, ensure_ascii=False, indent=4)
        logger.info(f"Raw Reddit data saved to {filename}")

    def save_to_json(self, data: str, filename: str):
        """
        Save analysis results to a JSON file.
        """
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(data)
        logger.info(f"Analysis results saved to {filename}")


# Configuration for Instagram
user_id = "17841438674306985"
access_token = "EAAHPjYclZCTEBO9k47ZCwZCDdPAtLutdwULVtKTg6Lu5RuRtRO8mLyDmZAganPIqG0LoLNIyyDv3lATPXaoEUeQZA6R1ooynFKn1b3lsyVehC26IjSddZCXTykUU663uokVQEjmZAyAmARKvxKD0lbkYWDZBjwvhZB0HwZAEw4nZBbxrxl5OyZBb8Qch30Qj4I5ZCqyi48SqP6uXejd3tCfSs"

class HashtagSearchConfig(BaseModel):
    hashtag: str
    num_results: int = 10

class HashtagCrawlResult(BaseModel):
    url: str
    content: str
    hashtag: str
    status: str

class HashtagScraperAgent(BaseModel):
    search_config: HashtagSearchConfig
    
    class Config:
        arbitrary_types_allowed = True

    async def get_hashtag_id(self, hashtag: str) -> str:
        url = "https://graph.facebook.com/v22.0/ig_hashtag_search"
        params = {
            "user_id": user_id,
            "q": hashtag,
            "access_token": access_token
        }
        response = requests.get(url, params=params)
        data = response.json()
        return data["data"][0]["id"] if data.get("data") else None

    async def fetch_hashtag_top(self, hashtag_id: str) -> dict:
        url = f"https://graph.facebook.com/{hashtag_id}/top_media"
        params = {
            "user_id": user_id,
            "fields": "id,media_type,media_url,comments_count,like_count,caption,timestamp,permalink",
            "access_token": access_token,
            "limit": self.search_config.num_results
        }
        response = requests.get(url, params=params)
        return response.json()

    async def execute(self) -> List[HashtagCrawlResult]:
        # Split the hashtag string into individual hashtags
        hashtags = self.search_config.hashtag.split()
        all_results = []

        for hashtag in hashtags:
            hashtag_id = await self.get_hashtag_id(hashtag)
            if not hashtag_id:
                logger.warning(f"No hashtag ID found for '{hashtag}'")
                continue

            top_media = await self.fetch_hashtag_top(hashtag_id)
            results = []
            for post in top_media.get("data", []):
                result = HashtagCrawlResult(
                    url=post.get("permalink", ""),
                    content=post.get("caption", ""),
                    hashtag=hashtag,  # Use the specific hashtag being processed
                    status="success" if post.get("caption") else "failed"
                )
                results.append(result)
                
                if result.status == "success":
                    logger.info(f"✓ Successfully scraped post from: {result.url}")
                    # logger.info(f"  Content preview: {result.content[:50]}...")
                else:
                    logger.info(f"✗ Failed to extract content from: {result.url}")
            
            all_results.extend(results)

        return all_results

class HashtagAnalysisAgent(BaseModel):
    class Config:
        arbitrary_types_allowed = True

    async def analyze_dataset(self, crawl_results: List[HashtagCrawlResult], query: str) -> str:
        if not crawl_results:
            return "No content was found for analysis."
        
        formatted_data = self._format_crawl_results(crawl_results)
        prompt = f"""
        Analyze the provided Instagram posts and comments to extract the most relevant information related to the query. Follow these steps:
        1. Read captions and comments to identify parts directly addressing the query.
        2. Summarize key points, arguments, and evidence into a concise and cohesive summary.
        3. Exclude unrelated or off-topic information.
        4. If the data is not related to the query, drop it.
        Query: {query}
        Content: {formatted_data}
        Provide the summary as plain text, focusing only on relevant data.
        """
        try:
            response = model.generate_content(prompt)
            summary = response.text.strip() if response.text else ""
            if not summary:
                logger.error("Empty response from AI model.")
                return "Data collection failed: The AI model returned an empty response."
            return summary
        except Exception as e:
            logger.error(f"Error collecting and summarizing data: {e}")
            return f"Data collection failed due to an error: {str(e)}"
    
    def _format_crawl_results(self, crawl_results: List[HashtagCrawlResult]) -> str:
        formatted_results = []
        for i, result in enumerate(crawl_results, 1):
            if result.status == "success" and result.content:
                formatted_results.append(f"""Post {i}:
                    URL: {result.url}
                    Caption: {result.content[:200]}...
                    -------------------
                                    """)
        return "\n".join(formatted_results)

class HashtagDataProcessor:
    def __init__(self, search_config: HashtagSearchConfig):
        self.scraper_agent = HashtagScraperAgent(search_config=search_config)
        self.analysis_agent = HashtagAnalysisAgent()

    async def process_query(self) -> str:
        crawl_results = await self.scraper_agent.execute()

        if not crawl_results:
            logger.warning("No content found")
            return "Analysis could not be completed: No content was found."

        analysis_result = await self.analysis_agent.analyze_dataset(crawl_results, query=self.scraper_agent.search_config.hashtag)

        self.save_to_json(analysis_result, f"{self.scraper_agent.search_config.hashtag}_analysis.json")

        return analysis_result

    def save_to_json(self, analysis_result: str, filename: str):
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({'analysis': analysis_result}, f, ensure_ascii=False, indent=4)
        logger.info(f"Analysis results saved to {filename}")

from pydantic import BaseModel
import datetime
import logging

logger = logging.getLogger(__name__)

class FinalAnalysisAgent(BaseModel):
    model: genai.GenerativeModel
    class Config:
        arbitrary_types_allowed = True

    def __init__(self, model: genai.GenerativeModel):
        super().__init__(model=model)

    async def analyze_combined(self, youtube_analysis: str, reddit_analysis: str, web_analysis: str, instagram_analysis: str = "", refined_context: str = "") -> str:
        """
        Perform combined analysis across multiple platforms.
        """
        timestamp = datetime.datetime.now().strftime("%B %d, %Y at %H:%M:%S")

        try:
            # Section 1: Generate prompts
            prompts = {
                "key_entities": f"""
                Analyze the multi-platform data collected on {timestamp} and focus on:
                1. KEY ENTITIES AND INDIVIDUALS:
                - List each named person/organization mentioned.
                - Detail their roles, actions, and relationships.
                - Include direct quotes or timestamps when available.
                - Compare portrayals across platforms.
                based on refined_context: {refined_context} do the things
                Platform Data:
                YouTube: {youtube_analysis}
                Reddit: {reddit_analysis}
                Web: {web_analysis}
                Instagram: {instagram_analysis}
                
Guidelines:
            - Ensure clarity and cohesion.
            - Highlight contradictions or agreements across platforms.
            - Maintain a neutral tone.
                """,

                "event_timeline": f"""
                Analyze the multi-platform data collected on {timestamp} and focus on:
                2. EVENT/TOPIC TIMELINE:
                - Chronologically order major developments.
                - Note which platforms reported which.
                - Highlight timing discrepancies.
                based on refined_context: {refined_context} do the things
                Platform Data:
                YouTube: {youtube_analysis}
                Reddit: {reddit_analysis}
                Web: {web_analysis}
                Instagram: {instagram_analysis}
                
Guidelines:
            - Ensure clarity and cohesion.
            - Highlight contradictions or agreements across platforms.
            - Maintain a neutral tone.
                """,

                "viewpoint_analysis": f"""
                Analyze the multi-platform data collected on {timestamp} and focus on:
                3. VIEWPOINT ANALYSIS:
                - Break down perspectives by platform.
                - Quantify support/opposition.
                - Note demographics if available.
                - Identify consensus.
                based on refined_context: {refined_context} do the things
                Platform Data:
                YouTube: {youtube_analysis}
                Reddit: {reddit_analysis}
                Web: {web_analysis}
                Instagram: {instagram_analysis}
                
Guidelines:
            - Ensure clarity and cohesion.
            - Highlight contradictions or agreements across platforms.
            - Maintain a neutral tone.
                """,

                "evidence_sources": f"""
                Analyze the multi-platform data collected on {timestamp} and focus on:
                4. EVIDENCE AND SOURCES:
                - List cited sources.
                - Note verified vs unverified claims.
                - Include platform-specific evidence.
                based on refined_context: {refined_context} do the things
                Platform Data:
                YouTube: {youtube_analysis}
                Reddit: {reddit_analysis}
                Web: {web_analysis}
                Instagram: {instagram_analysis}
                
Guidelines:
            - Ensure clarity and cohesion.
            - Highlight contradictions or agreements across platforms.
            - Maintain a neutral tone.
                """,

                "contextual_factors": f"""
                Analyze the multi-platform data collected on {timestamp} and focus on:
                5. CONTEXTUAL FACTORS:
                - Cultural/historical context.
                - Relevant policies.
                - Economic/social impact.
                based on refined_context: {refined_context} do the things
                Platform Data:
                YouTube: {youtube_analysis}
                Reddit: {reddit_analysis}
                Web: {web_analysis}
                Instagram: {instagram_analysis}
                
Guidelines:
            - Ensure clarity and cohesion.
            - Highlight contradictions or agreements across platforms.
            - Maintain a neutral tone.
                """
            }

            # Section 2: Call model
            key_entities_result = self.model.generate_content(prompts["key_entities"]).text.strip()
            event_timeline_result = self.model.generate_content(prompts["event_timeline"]).text.strip()
            viewpoint_analysis_result = self.model.generate_content(prompts["viewpoint_analysis"]).text.strip()
            evidence_sources_result = self.model.generate_content(prompts["evidence_sources"]).text.strip()
            contextual_factors_result = self.model.generate_content(prompts["contextual_factors"]).text.strip()

            # Section 3: Combine results
            combined_analysis = (
                f"Key Entities:\n{key_entities_result}\n\n"
                f"Event Timeline:\n{event_timeline_result}\n\n"
                f"Viewpoint Analysis:\n{viewpoint_analysis_result}\n\n"
                f"Evidence Sources:\n{evidence_sources_result}\n\n"
                f"Contextual Factors:\n{contextual_factors_result}"
            )
            return combined_analysis

        except Exception as e:
            logger.error(f"Error in final analysis: {e}")
            return f"Analysis failed due to error: {str(e)}"

class RelevanceAgent(BaseModel):
    class Config:
        arbitrary_types_allowed = True

    async def check_relevance(self, query: str, combined_analysis: str) -> dict:
        prompt = f"""
        Evaluate the relevance of the combined analysis to the original query. Follow these steps:
        1. Identify the main focus of the query: "{query}".
        2. Assess how well the analysis addresses this focus.
        3. Provide a relevance score (0-1) and a brief justification.
        Combined Analysis: {combined_analysis}
        Return the result as a JSON string in this format:
        {"relevance_score": X, "justification": "Y"}
        """
        try:
            response = model.generate_content(prompt)
            result = response.text.strip() if response.text else "{}"
            filtered_result = extract_conclusions(result)
            return eval(filtered_result)  # Convert filtered JSON string to dict
        except Exception as e:
            logger.error(f"Error checking relevance: {e}")
            return {"relevance_score": 0.0, "justification": "Failed to evaluate relevance due to an error."}

class AggregatorAgent:
    def __init__(self, tavily_api_key: str = "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"):  # Add your Tavily API key
        self.query_agent = QueryAgent()
        self.web_scraper_agent = TavilySearchAgent(
            search_config=TavilySearchConfig(topic="", max_results=10),
            api_key=tavily_api_key
        )
        self.youtube_scraper_agent = YoutubeScrapperAgent()
        self.reddit_scraper_agent = RedditScraperAgent()
        self.web_analysis_agent = AIAnalysisAgent()
        self.youtube_analysis_agent = YouTubeAnalysisAgent()
        self.reddit_analysis_agent = RedditAnalysisAgent()
        self.instagram_scraper_agent = HashtagScraperAgent(search_config=HashtagSearchConfig(hashtag=""))
        self.instagram_analysis_agent = HashtagAnalysisAgent()
        self.final_analysis_agent = FinalAnalysisAgent(model=genai.GenerativeModel(
            'gemini-2.0-flash-thinking-exp-01-21',
        ))
        self.check_relavance_agent = RelevanceAgent()
        # Add refinement and follow-up agents
        self.follow_up_agent = FollowUpQuestionAgent(self.query_agent)
        self.refine_query_agent = RefineQueryAgent(self.query_agent)
        self.refine_context_agent = RefineContextAgent(self.query_agent)

    async def scrape_web(self, query: str) -> List[TavilyCrawlResult]:
        """Scrape web data using the TavilySearchAgent."""
        self.web_scraper_agent.search_config.topic = query
        return await self.web_scraper_agent.execute()

    async def generate_queries(self, query: str, platforms: List[str]) -> QueryResult:
        """
        Generate platform-specific queries using the QueryAgent.
        """
        return await process_query(query=query, platforms=platforms)

    async def scrape_youtube(self, query: str) -> List[VideoDetails]:
        """
        Scrape YouTube data using the YoutubeScrapperAgent.
        """
        return await self.youtube_scraper_agent.process_query(query=query, max_videos=5, max_comments=10)

    async def scrape_reddit(self, query: str) -> List[RedditPost]:
        """
        Scrape Reddit data using the RedditScraperAgent.
        """
        return await self.reddit_scraper_agent.fetch_reddit_data(queries=query, limit=10)

    # async def scrape_web(self, query: str) -> List<CrawlResult]:
    #     """
    #     Scrape web data using the WebScraperAgent.
    #     """
    #     self.web_scraper_agent.search_config.topic = query
    #     return await self.web_scraper_agent.execute()

    async def analyze_youtube(self, videos: List[VideoDetails], query: str) -> str:
        """
        Analyze YouTube data using the YouTubeAnalysisAgent.
        """
        return await self.youtube_analysis_agent.analyze_dataset(videos, query=query)

    async def analyze_reddit(self, posts: List[RedditPost],query:str) -> str:
        """
        Analyze Reddit data using the RedditAnalysisAgent.
        """
        return await self.reddit_analysis_agent.analyze_dataset(posts, query=query)

    async def analyze_web(self, crawl_results: List[CrawlResult],query:str) -> str:
        """
        Analyze web data using the AIAnalysisAgent.
        """
        return await self.web_analysis_agent.analyze_dataset(crawl_results, query=query)

    async def scrape_instagram(self, query: str) -> List[HashtagCrawlResult]:
        """
        Scrape Instagram data using the HashtagScraperAgent.
        """
        self.instagram_scraper_agent.search_config.hashtag = query.lstrip('#')  # Remove # if present
        return await self.instagram_scraper_agent.execute()

    async def analyze_instagram(self, crawl_results: List[HashtagCrawlResult],query:str) -> str:
        """
        Analyze Instagram data using the HashtagAnalysisAgent.
        """
        return await self.instagram_analysis_agent.analyze_dataset(crawl_results, query=query)

    async def analyze_combined(self, youtube_analysis: str, reddit_analysis: str, web_analysis: str, instagram_analysis: str = "", refined_context: str= "") -> str:
        """
        Perform a combined analysis using the FinalAnalysisAgent.
        """
        return await self.final_analysis_agent.analyze_combined(youtube_analysis, reddit_analysis, web_analysis, instagram_analysis, refined_context=refined_context)
    
    async def check_relevance(self, query: str, combined_analysis: str) -> dict:
        """
        Check the relevance of the combined analysis to the original query.
        """
        return await self.check_relavance_agent.check_relevance(query, combined_analysis)

    def save_to_json(self, data: Dict, filename: str):
        """
        Save aggregated data to a JSON file.
        """
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        logger.info(f"Data saved to {filename}")

    def save_analysis_results(self, analysis_result: str, filename: str):
        """
        Save analysis results to a JSON file.
        """
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(analysis_result)
        logger.info(f"Analysis results saved to {filename}")

    def save_aggregated_raw_data(self, youtube_data: List[VideoDetails], reddit_data: List[RedditPost], web_data: List[CrawlResult], instagram_data: List[HashtagCrawlResult], filename: str):
        aggregated_data = {
            "youtube": [video.model_dump() for video in youtube_data],
            "reddit": [post.model_dump() for post in reddit_data],
            "web": [result.model_dump() for result in web_data],
            "instagram": [result.model_dump() for result in instagram_data]
        }
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(aggregated_data, f, ensure_ascii=False, indent=4)
        logger.info(f"Aggregated raw data saved to {filename}")

class FollowUpQuestionAgent:
    def __init__(self, query_agent):
        self.query_agent = query_agent

    async def ask_follow_up_questions(
        self, youtube_analysis: str, reddit_analysis: str, web_analysis: str, instagram_analysis: str
    ) -> str:
        """
        Ask follow-up questions one at a time and collect responses to refine the context.
        """
        print("\nLet's refine the context with a few targeted questions.")
        follow_up_context = {}

        # Generate questions prompt
        questions_prompt = f"""
        Based on the platform-specific analyses, generate 2-3 follow-up questions. Return each question on a new line.
        Focus on:
        1. Political beneficiary/target identification
        2. Strategic goals and objectives
        3. Target audience and emotional tone

        Platform analyses:
        YouTube: {youtube_analysis}
        Reddit: {reddit_analysis}
        Web: {web_analysis}
        Instagram: {instagram_analysis}

        Return only the numbered questions, one per line.
        """

        # Get questions from the model
        response = self.query_agent.model.generate_content(questions_prompt)
        questions = response.text.strip().split('\n')

        # Ask questions one at a time
        for question in questions:
            if not question.strip():
                continue

            # Clean up the question format
            clean_question = question.strip().lstrip('123456789.').strip()
            print(f"\nQ: {clean_question}")

            # Get user response
            user_response = input("A: ").strip()

            if user_response:
                # Store both question and answer
                follow_up_context[clean_question] = user_response

        # Return the refined context as a JSON string
        return json.dumps(follow_up_context, indent=2)

class RefineQueryAgent:
    def __init__(self, query_agent):
        self.query_agent = query_agent

    def generate_refinement_question(self, refined_query: str) -> str:
        refinement_prompt_template = """
        You are an expert in query analysis and refinement. Your task is to understand the user's original query and generate a single follow-up question to refine their information need.
        Original query: "{query}"
        Guidelines:
        1. Ask for location if relevant and not already provided.
        2. Focus on clarifying intent (e.g., specific aspects, timeframes, content types).
        3. Avoid unnecessary or repetitive questions.
        4. Ensure the question is concise and directly related to the query.
        5. If no further clarification is needed, return "NO_MORE_QUESTIONS".
        Return only the follow-up question as plain text, without quotes or additional explanation.
        """
        refinement_prompt = refinement_prompt_template.format(query=refined_query)
        response = self.query_agent.model.generate_content(refinement_prompt)
        return response.text.strip()

class RefineContextAgent:
    def __init__(self, query_agent):
        self.query_agent = query_agent

    def refine_query_with_context(self, query: str, responses: dict) -> str:
        refinement_context_prompt = f"""
        You are an expert in query analysis and refinement. Your task is to understand the user's original query and their responses to follow-up questions, then produce a precise and comprehensive refined query.
        Original query: "{query}"
        Additional context from user:
        {json.dumps(responses, indent=2)}
        Guidelines:
        1. Identify the core intent of the original query (e.g., facts, opinions, comparisons).
        2. Integrate user-provided context (e.g., aspects, timeframes, content types).
        3. Ensure the refined query is concise, specific, and aligned with the user's information needs.
        Return only the refined query as plain text, without quotes or additional explanation.
        """
        response = self.query_agent.model.generate_content(refinement_context_prompt)
        return response.text.strip()

async def main():
    try:
        # Initialize individual AggregatorAgents
        youtube_agent = AggregatorAgent()
        reddit_agent = AggregatorAgent()
        web_agent = AggregatorAgent()
        instagram_agent = AggregatorAgent()
        final_analysis_agent = FinalAnalysisAgent(model=genai.GenerativeModel(
            'gemini-2.0-flash-thinking-exp-01-21',
        ))
        query_agent = QueryAgent()
        refine_query_agent = RefineQueryAgent(query_agent)
        refine_context_agent = RefineContextAgent(query_agent)

   

        # Get user input
        print("Hello! I'm here to help you search and analyze data across platforms.")
        query = input("Enter your search query: ").strip()
        if not query:
            print("Query cannot be empty. Please try again.")
            return

        # Interactive query refinement
        print("\nLet's refine your query step-by-step:")
        responses = {}
        refined_query = query

        MAX_REFINEMENT_QUESTIONS = 3
        question_count = 0

        while question_count < MAX_REFINEMENT_QUESTIONS:
            # Generate a follow-up question
            follow_up_question = refine_query_agent.generate_refinement_question(refined_query)

            # Check if no more questions are needed
            if follow_up_question == "NO_MORE_QUESTIONS":
                print("\nNo further refinements needed. Proceeding with the refined query.")
                break

            # Ask the follow-up question
            print(f"\nQ: {follow_up_question}")
            user_response = input("A: ").strip()

            # If the user provides a response, add it to the context
            if user_response:
                responses[follow_up_question] = user_response

                # Refine the query using QueryAgent
                refined_query = refine_context_agent.refine_query_with_context(query, responses)
                print(f"\nRefined query: {refined_query}")

                # Increment the question count
                question_count += 1
            else:
                print("Skipping this question.")

        # If the maximum number of questions is reached
        if question_count == MAX_REFINEMENT_QUESTIONS:
            print("\nMaximum number of refinement questions reached. Proceeding with the refined query.")

        # Get platforms after query refinement
        platforms_input = input("Enter platforms (comma-separated, e.g., youtube,reddit,google,instagram), or press Enter for all: ").strip()
        if platforms_input:
            platforms = [platform.strip() for platform in platforms_input.split(",")]
        else:
            platforms = ["youtube", "reddit", "google", "instagram"]  # Default to all platforms
        print(f"Selected platforms: {', '.join(platforms)}")

        # Validate platforms
        valid_platforms = {"youtube", "reddit", "google", "instagram"}
        platforms = [p for p in platforms if p in valid_platforms]
        if not platforms:
            print("No valid platforms selected. Exiting.")
            return

        # Generate platform-specific queries using QueryAgent
        # Create an instance of AggregatorAgent
        aggregator_agent = AggregatorAgent()

        # Generate platform-specific queries using QueryAgent
        query_result = await aggregator_agent.generate_queries(query=query, platforms=platforms)
        logger.info(f"Generated queries: {query_result.platform_queries}")
        print(f"\nGenerated platform-specific queries: {json.dumps(query_result.platform_queries, indent=2)}")

        # Initialize lists to hold raw data
        youtube_data = []
        reddit_data = []
        web_data = []
        instagram_data = []

        # Scrape and analyze data for each platform
        youtube_analysis = ""
        reddit_analysis = ""
        web_analysis = ""
        instagram_analysis = ""

        for platform, platform_query in query_result.platform_queries.items():
            print(f"\nProcessing {platform.capitalize()} with query: {platform_query}")
            if platform == "youtube":
                youtube_data = await aggregator_agent.scrape_youtube(platform_query)
                youtube_analysis = await aggregator_agent.analyze_youtube(youtube_data, query)
                aggregator_agent.save_analysis_results(youtube_analysis, "youtube_analysis_results.json")
            elif platform == "reddit":
                reddit_data = await aggregator_agent.scrape_reddit(platform_query)
                reddit_analysis = await aggregator_agent.analyze_reddit(reddit_data, query)
                aggregator_agent.save_analysis_results(reddit_analysis, "reddit_analysis_results.json")
            elif platform == "google":
                web_data = await aggregator_agent.scrape_web(platform_query)
                web_analysis = await aggregator_agent.analyze_web(web_data, query )
                aggregator_agent.save_analysis_results(web_analysis, "web_analysis_results.json")
            elif platform == "instagram":
                instagram_data = await aggregator_agent.scrape_instagram(platform_query)
                instagram_analysis = await aggregator_agent.analyze_instagram(instagram_data, query)
                aggregator_agent.save_analysis_results(instagram_analysis, "instagram_analysis_results.json")
            else:
                logger.warning(f"Unsupported platform: {platform}")

        # Save all raw data in one aggregated file
        aggregator_agent.save_aggregated_raw_data(youtube_data, reddit_data, web_data, instagram_data, "aggregated_raw_data.json")

        # Initialize and use the FollowUpQuestionAgent
        follow_up_agent = FollowUpQuestionAgent(query_agent)
        refined_context = await follow_up_agent.ask_follow_up_questions(
            youtube_analysis, reddit_analysis, web_analysis, instagram_analysis
        )

        print("Analysis started be patient!! might take few minutes")
        # Perform final combined analysis with refined context
        combined_analysis = await aggregator_agent.final_analysis_agent.analyze_combined(
            youtube_analysis, 
            reddit_analysis, 
            web_analysis, 
            instagram_analysis,
            refined_context=refined_context
        )
        aggregator_agent.save_analysis_results(combined_analysis, "combined_analysis_results.json")
        print("\nCombined Analysis Results done")

        # Check relevance
        # relevance_result = await aggregator_agent.check_relevance(query, combined_analysis)
        # aggregator_agent.save_to_json(relevance_result, "relevance_check_results.json")
        # print(f"\nRelevance Check:\nRelevance Score: {relevance_result['relevance_score']}\nJustification: {relevance_result['justification']}")

        logger.info("All data has been successfully aggregated and saved.")
        print("\nAll processing complete! Results have been saved to JSON files.")
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(main())

