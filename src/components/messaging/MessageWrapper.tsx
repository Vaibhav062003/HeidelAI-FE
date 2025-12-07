import { useRef, useState } from "react";
import { MessageActionsPopover } from "./MessageActionPopover";
import MessageReaction  from "./MessageReaction";
import api from "@/lib/session_api";
import { RepliedMessagePreview } from "./RepliedMessagePreview";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MessageWrapper = ({ message, index, children, allMessages }: any) => {
  const anchorRef = useRef(null);
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
    if(message.platform == "instagram") {
      toast.warning("Can't reply to Instagram messages yet ☹️");
      return;
    }
    // TODO: handle reply input
  };

  const repliedMessage =
    message.type === "message_reply"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? allMessages?.find((m: any) => m.id === message.payload?.mid)
      : null;

  return (
    <div
      ref={anchorRef}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showActions && message.platform !== "whatsapp" && (
        <MessageActionsPopover
          anchorRef={anchorRef}
          isAgent={message.role === "agent"}
          onReact={handleReact}
          onReply={handleReply}
          onClose={() => setShowActions(false)} 
        />
      )}

      {repliedMessage && <RepliedMessagePreview repliedMessage={repliedMessage} currentMessage={message} />}

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
