import Image from "next/image";
import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

interface InstagramPostProps {
  username: string;
  profileImage?: string;
  caption: string;
  mediaUrl: string;
  timestamp: string;
}

export default function InstagramPost({
  username,
  profileImage = "/default-avatar.png",
  caption,
  mediaUrl,
}: InstagramPostProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-3">
        <Image
          src={profileImage}
          alt={username}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="ml-3">
          <p className="font-semibold text-sm">{username}</p>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full h-[400px] bg-gray-100">
        <Image
          src={mediaUrl}
          alt="Instagram media"
          fill
          className="object-cover"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex space-x-4">
          <Heart
            className={`cursor-pointer ${liked ? "fill-red-500 text-red-500" : ""}`}
            onClick={() => setLiked(!liked)}
          />
          <MessageCircle className="cursor-pointer" />
          <Send className="cursor-pointer" />
        </div>
        <Bookmark className="cursor-pointer" />
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm">
          <span className="font-semibold mr-2">{username}</span>
          {caption}
        </p>
      </div>
    </div>
  );
}
