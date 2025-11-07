import { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Plus, Reply } from "lucide-react";

interface MessageActionsPopoverProps {
  onReact: (emoji: string) => void;
  onReply: () => void;
  onClose: () => void; 
  isAgent: boolean;
}

const defaultEmojis = ["❤️"];
// const defaultEmojis = ["❤️", "😂", "😮", "😢", "👍", "👎"];

export const MessageActionsPopover: React.FC<MessageActionsPopoverProps> = ({
  isAgent,
  onReact,
  onReply,
  onClose,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);

  const handleReact = (emoji: string) => {
    onReact(emoji);
    onClose(); 
  };

  const handleReply = () => {
    onReply();
    onClose(); 
  };

  const handleEmojiMouseEnter = (emoji: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setHoveredEmoji(emoji);
    const btn = e.currentTarget as HTMLButtonElement;
    btn.style.transition = "transform 180ms ease";
    btn.style.transform = "translateY(-4px) scale(1.4)";
  };

  const handleEmojiMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setHoveredEmoji(null);
    const btn = e.currentTarget as HTMLButtonElement;
    btn.style.transform = "";
  };

  return (
    <div
      className={`absolute animate-in fade-in duration-200 -top-8 ${
        isAgent ? "right-0" : "left-0"
      } flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 rounded-full px-2 py-1 shadow-md z-50`}
    >
      {!showPicker ? (
        <>
          {defaultEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              onMouseEnter={(e) => handleEmojiMouseEnter(emoji, e)}
              onMouseLeave={handleEmojiMouseLeave}
              className={`text-xl hover:scale-110 transition-all duration-180 ${
                hoveredEmoji && hoveredEmoji !== emoji 
                  ? 'opacity-100 brightness-75' 
                  : 'opacity-100'
              }`}
            >
              {emoji}
            </button>
          ))}

          {/* <button
            onClick={() => setShowPicker(true)}
            className="p-1 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="More emojis"
          >
            <Plus size={18} className="text-gray-600 dark:text-gray-300" />
          </button> */}

          <div className="w-[2px] h-5 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Reply icon */}
          <button
            onClick={handleReply}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Reply"
          >
            <Reply size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </>
      ) : (
        <div className="absolute top-10 right-0 z-50">
          <Picker
            data={data}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onEmojiSelect={(emoji: any) => {
              handleReact(emoji.native);
              setShowPicker(false);
            }}
            theme="light"
            previewPosition="none"
          />
        </div>
      )}
    </div>
  );
};
