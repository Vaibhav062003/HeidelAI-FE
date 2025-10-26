import Image from "next/image";
import { useState } from "react";

interface InstagramPostProps {
  username: string;
  profileImage?: string;
  caption: string;
  mediaUrl: string;
  timestamp: string;
}

export default function InstagramPost({
  username,
  profileImage = "/icons/ig_no_pfp.jpg",
  caption,
  mediaUrl,
  timestamp,
}: InstagramPostProps) {
  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-3">
        <Image
          src={profileImage || "/icons/ig_no_pfp.jpg"}
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
      <div className="relative w-[400px] h-[400px] bg-gray-100">
        <Image
          src={mediaUrl}
          alt="Instagram media"
          fill
          className="object-cover"
        />
      </div>

      {/* Caption */}
      <div className="px-4 py-3">
        <p className="text-sm">
          <span className="font-semibold mr-2">{username}</span>
          {caption}
        </p>
        <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
          {timestamp}
        </p>
      </div>
    </div>
  );
}
