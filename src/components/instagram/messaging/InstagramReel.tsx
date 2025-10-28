import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface InstagramReelProps {
  profileImage?: string;
  reelVideoUrl: string;
  title: string;
  timestamp: string;
  viewOnInstagramUrl?: string;
}

export default function InstagramReel({
  profileImage = "/icons/ig_no_pfp.jpg",
  reelVideoUrl,
  title,
  timestamp,
  viewOnInstagramUrl,
}: InstagramReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [loopCount, setLoopCount] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle looping exactly 2 times when not full-screen
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (!isFullscreen) {
        if (loopCount < 1) {
          // play second time
          setLoopCount(prev => prev + 1);
          video.play();
        } else {
          // after two loops, pause and show overlay
          video.pause();
          setShowOverlay(true);
        }
      } else {
        // in fullscreen mode, we allow infinite loop
        video.play();
      }
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [loopCount, isFullscreen]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 800);
    } else {
      video.pause();
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 800);
    }
  };

  const handleUnmuteClick = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !isMuted;
    video.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleFullscreenClick = () => {
    setIsFullscreen(true);
  };

  const handleExitFullscreen = () => {
    setIsFullscreen(false);
    // reset loop count maybe
    setLoopCount(0);
    setShowOverlay(false);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  };

  return (
    <>
      <div className={`max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}>
        {/* Header */}
        <div className="flex items-center p-3">
          <Image
            src={profileImage}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div className="ml-3">
            <p className="font-semibold text-sm">Instagram User</p>
          </div>
          {isFullscreen && viewOnInstagramUrl && (
            <button
              className="ml-auto mr-3 text-white underline"
              onClick={() => window.open(viewOnInstagramUrl, "_blank")}
            >
              View on Instagram
            </button>
          )}
          {isFullscreen && (
            <button
              className="text-white pr-3"
              onClick={handleExitFullscreen}
            >
              ✕
            </button>
          )}
        </div>

        {/* Video */}
        <div className={`relative w-full ${isFullscreen ? "h-screen" : "h-[350px]"} bg-gray-100`}>
          <video
            ref={videoRef}
            src={reelVideoUrl}
            muted={isMuted}
            loop={isFullscreen}  // if fullscreen allow loop via native loop
            className="object-cover w-full h-full"
            onClick={handleVideoClick}
            autoPlay
            playsInline
          />
          {/* overlay for play/pause preview */}
          {showOverlay && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black bg-opacity-40 p-4 rounded-full">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  {videoRef.current && videoRef.current.paused ? (
                    <path fillRule="evenodd" d="M4.5 3.5l11 6.5-11 6.5V3.5z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" clipRule="evenodd" />
                  )}
                </svg>
              </div>
            </div>
          )}
          {/* Unmute button */}
          <button
            className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-full p-2"
            onClick={handleUnmuteClick}
          >
            {isMuted ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 5v10l7-5-7-5z" />
                <path fillRule="evenodd" d="M4 5a1 1 0 00-1 1v8a1 1 0 001 1h1v-2H5V8h-.5V7H4zm2 0v10h1V5H6z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 5v10l7-5-7-5z" />
              </svg>
            )}
          </button>
          {/* Fullscreen button */}
          {!isFullscreen && (
            <button
              className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded-full p-2 text-white"
              onClick={handleFullscreenClick}
            >
              ⤢
            </button>
          )}
        </div>

        {/* Caption & timestamp */}
        {!isFullscreen && (
          <div className="px-4 py-3">
            <p className="text-sm">
              <span className="font-semibold mr-2">Instagram User</span>
              {title}
            </p>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
              {timestamp}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
