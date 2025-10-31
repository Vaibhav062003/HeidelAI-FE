import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface InstagramStoryProps {
  id?: string;
  sharedBy?: string;
  storyOwnerName: string;
  storyMediaUrl: string;
  isActive?: boolean; // to control one-at-a-time autoplay
  onPlay?: (id: string) => void;
  isMuted?: boolean;
  onMuteToggle?: (muted: boolean) => void;
  isAgent?: boolean;
  timestamp: string;
  isLatest?: boolean;
}

export default function InstagramStory({
  id,
  sharedBy = "You",
  storyOwnerName,
  storyMediaUrl,
  isActive = false,
  onPlay,
  isLatest = false,
  isMuted = true,
  onMuteToggle,
  isAgent = false,
  timestamp
}: InstagramStoryProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isPhoto, setIsPhoto] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Detect if the media is video or photo or expired
  useEffect(() => {
    let didCancel = false;

    const tryVideo = () =>
      new Promise<boolean>((resolve) => {
        const video = document.createElement("video");
        video.src = storyMediaUrl;
        video.onloadedmetadata = () => resolve(true);
        video.onerror = () => resolve(false);
      });

    const tryPhoto = () =>
      new Promise<boolean>((resolve) => {
        if (typeof window === "undefined") return resolve(false);
        const img = new window.Image();
        img.src = storyMediaUrl;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });

    (async () => {
      const videoSuccess = await tryVideo();
      if (didCancel) return;

      if (videoSuccess) {
        setIsVideo(true);
        setIsPhoto(false);
        setIsExpired(false);
        return;
      }

      const photoSuccess = await tryPhoto();
      if (didCancel) return;

      if (photoSuccess) {
        setIsVideo(false);
        setIsPhoto(true);
        setIsExpired(false);
      } else {
        setIsVideo(false);
        setIsPhoto(false);
        setIsExpired(true);
      }
    })();

    return () => {
      didCancel = true;
    };
  }, [storyMediaUrl]);

  // Ensure only one video plays at a time
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return; 

    const playVideo = async () => {
      try {
        const anyPlaying = Array.from(document.querySelectorAll("video")).some(
          (v) => !v.paused && v !== video
        );

        if (isActive) {
          await video.play();
        } else if (isLatest && !anyPlaying) {
          // Autoplay latest only if nothing else is playing
          await video.play();
        } else {
          video.pause();
        }
      } catch {
        // Ignore autoplay restrictions silently
      }
    };

    playVideo();
  }, [isActive, isLatest, isVideo]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    setShowOverlay(true);
    if (video.paused) {
      onPlay?.(id || "");
      video.play();
    } else {
      video.pause();
    }
    setTimeout(() => setShowOverlay(false), 400);
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !isMuted;
    video.muted = newMuted;
    onMuteToggle?.(newMuted);
  };

  return (
    <div className="flex flex-col items-start p-1 rounded-2xl w-fit max-w-[220px] ">
      {/* Text */}
      <p
        className={`text-sm ${
          isAgent ? "pr-3 text-right" : "pl-1.5 text-left"
        } w-full text-gray-700 mb-1`}
      >
        Shared a story.
      </p>

      {/* Story preview */}
      <div
        className={`flex ${isAgent ? "flex-row-reverse" : "flex-row"} gap-2`}
      >
        {isExpired ? (
          <>
            <div className="h-[25px] w-[4px] bg-gray-200 rounded-xl" />
            <p className="text-sm text-gray-500">Story unavailable.</p>
          </>
        ) : (
          <>
            <div className="h-[330px] w-[4px]  bg-gray-200 rounded-xl" />
            <div className="relative w-[190px] h-[330px] cursor-pointer rounded-2xl overflow-hidden bg-gray-100">
              {isVideo ? (
                <>
                  <video
                    ref={videoRef}
                    src={storyMediaUrl}
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                    onClick={handleVideoClick}
                  />
                  {/* Mute toggle */}
                  <button
                    onClick={handleMuteToggle}
                    className="absolute bottom-2 right-2 bg-black/50 text-white p-1 rounded-full text-xs"
                  >
                    {isMuted ? "🔇" : "🔊"}
                  </button>

                  {/* Overlay when play/pause toggled */}
                  {showOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                      {videoRef.current?.paused ? (
                        <svg
                          className="w-10 h-10 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 3.5l11 6.5-11 6.5V3.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-10 h-10 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 4h2v12H6V4zm6 0h2v12h-2V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </>
              ) : (
                isPhoto && (
                  <Image
                    src={storyMediaUrl}
                    alt={`${storyOwnerName}'s story`}
                    fill
                    className="object-cover"
                  />
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* Timestamp */}
      <div className={`py-1 w-full ${isAgent ? "pr-2" : "pl-2"}`}>
        <p
          className={`text-xs ${
            isAgent ? "text-right" : "text-left"
          } text-gray-500 mt-1 uppercase tracking-wide`}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
}
