// Type definition for conversation object
export interface Conversation {
  id: string;
  platform: string;
  customer_id: string;
  customer_name: string;
  email: string;
  billingAddress: string;
  shippingAddress: string;
  gstin: string;
  last_message: string;
  timestamp: string;
  unread_count: number;
  avatar_url: string;
  is_ai_enabled: boolean;
  assigned_agent_id: string | null;
  priority: "low" | "medium" | "high";
  sentiment: "positive" | "neutral" | "negative";
  query?: string;
}