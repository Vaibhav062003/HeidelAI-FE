import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Tag, AlertTriangle, Clock } from "lucide-react";

interface ConversationSummaryProps {
  summary?: {
    key_points: string[];
    sentiment: "positive" | "neutral" | "negative";
    intent: string;
    urgency: "low" | "medium" | "high";
    category: string;
    duration: string;
    ai_suggestions: string[];
    labels: string[];
  };
}

const ConversationSummary = ({
  summary = {
    key_points: [
      "Customer reported issues with recent order",
      "Seeking refund for damaged product",
      "Previously contacted support twice",
    ],
    sentiment: "negative",
    intent: "Refund Request",
    urgency: "high",
    category: "Customer Service",
    duration: "15 minutes",
    ai_suggestions: [
      "Offer immediate refund",
      "Provide shipping label for return",
      "Consider compensation for inconvenience",
    ],
    labels: ["Urgent", "Refund", "Priority Customer", "Previous Issue"],
  },
}: ConversationSummaryProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-600";
      case "negative":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  return (
    <Card className="p-4 bg-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <h3 className="font-medium">AI Summary</h3>
          </div>
          <Badge
            variant="secondary"
            className={getSentimentColor(summary.sentiment)}
          >
            {summary.sentiment.charAt(0).toUpperCase() +
              summary.sentiment.slice(1)}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getUrgencyColor(summary.urgency)}>
            {summary.urgency.toUpperCase()} Priority
          </Badge>
          <Badge variant="outline">{summary.category}</Badge>
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            {summary.duration}
          </Badge>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Key Points</h4>
          <ul className="space-y-1">
            {summary.key_points.map((point, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {point}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">AI Suggestions</h4>
          <ul className="space-y-1">
            {summary.ai_suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Labels</h4>
          <div className="flex flex-wrap gap-2">
            {summary.labels.map((label, index) => (
              <Badge key={index} variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConversationSummary;
