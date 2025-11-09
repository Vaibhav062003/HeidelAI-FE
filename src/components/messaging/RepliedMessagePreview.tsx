import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RepliedMessagePreview = ({ repliedMessage, currentMessage }: { repliedMessage: any, currentMessage:any }) => {
  if (!repliedMessage) return null;
  const isAgent = repliedMessage.role === "agent";
  const isAgentCurrentMessage = currentMessage.role === "customer";

  let textToDisplay = ""

  if(currentMessage.role == repliedMessage.role){
    textToDisplay = isAgent ? "You replied to yourself" : "Replied to themselves"
  } else {
    textToDisplay = isAgent ? "Replied to you" : "You replied to " + (repliedMessage.sender_name || "Customer")
  }

  return (
    <div className={`flex flex-col ${isAgentCurrentMessage ? "items-start" : "items-end"} p-1 rounded-2xl `}>
      <p
        className={`text-sm ${
          isAgentCurrentMessage ? "pl-1.5 text-left" : "pr-1.5 text-right"
        } w-full text-gray-700 mb-1`}
      >
        {textToDisplay}
      </p>
    
      <div 
        className={`flex ${isAgentCurrentMessage ? "flex-row" : "flex-row-reverse"} gap-2`}
      >
        <div className="h-[38px] w-[4px] bg-gray-200 rounded-xl" />

        {repliedMessage.content && (
          <p className="text-sm text-gray-500 border p-2 rounded-xl max-w-[180px] truncate">
            {repliedMessage.content}
          </p>
        )}

      </div>
    </div>
  );
};
