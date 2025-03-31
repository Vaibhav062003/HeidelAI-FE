const API_BASE_URL = 'https://backend-chatbot.koyeb.app';

export interface SearchRequest {
  query: string;
  platforms?: string[];
}

export interface AnalysisResponse {
  platform_queries: Record<string, string>;
  youtube_analysis?: string;
  reddit_analysis?: string;
  web_analysis?: string;
  instagram_analysis?: string;
  combined_analysis?: string;
  relevance_score?: number;
  relevance_justification?: string;
}

export const analyzeQuery = async (request: SearchRequest): Promise<AnalysisResponse> => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};