import { useState } from "react";
import { MessageActionsPopover } from "./MessageActionPopover";
import MessageReaction  from "./MessageReaction";
import api from "@/lib/session_api";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MessageWrapper = ({ message, index, children }: any) => {
  const [showActions, setShowActions] = useState(false);

  const handleReact = async (emoji: string) => {
    console.log("Reacted with:", emoji, "on message:", message.id);
    // TODO: send reaction to backend
    const response = await api.post('/api/instagram/conversations/send_reaction', {
      "message_id": String(message.id),
    });
    console.log("Reaction response:", response.data);
    if (response.data.status == "error") {
      toast.error("Failed to send reaction");
    }
  };

  const handleReply = () => {
    console.log("Replying to:", message.id);
    // TODO: handle reply input
  };

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showActions && (
        <MessageActionsPopover
          isAgent={message.role === "agent"}
          onReact={handleReact}
          onReply={handleReply}
          onClose={() => setShowActions(false)} 
        />
      )}

      {children}

      {message.reaction && (
        <div className={`flex ${message.role === "customer" ? "justify-start" : "justify-end"} mt-1`}>
          <MessageReaction
            reaction={message.reaction}
            messageId={message.id}
          />
        </div>
      )}
    </div>
  );
};
