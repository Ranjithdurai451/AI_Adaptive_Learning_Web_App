import React, { useState, useEffect } from "react";
import { useVideoStore } from "@/lib/store/useVideoStore";
import { X, ExternalLink } from "lucide-react";

interface YouTubeCardProps {
  videoId: string;
}

interface VideoDetails {
  title: string;
  channelName: string;
  views: string;
  publishedAt: string;
  description: string;
}

const YouTubeCard: React.FC<YouTubeCardProps> = ({ videoId }) => {
  const { selectedVideo, setSelectedVideo } = useVideoStore();

  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching video details
    setIsLoading(true);
    setTimeout(() => {
      setVideoDetails({
        title: "How to Build Amazing React Components",
        channelName: "CodeMaster",
        views: "1.2M",
        publishedAt: "2 weeks ago",
        description:
          "Learn how to create reusable, performant and beautiful React components with advanced techniques. In this tutorial, we'll cover component architecture, state management, styling strategies, and optimization techniques.",
      });
      setIsLoading(false);
    }, 1000);
  }, [videoId]);

  if (!selectedVideo) return null;

  const handleOpenInNewTab = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={
        "fixed inset-0 z-50 flex items-center justify-center bg-white/25 dark:bg-black/50 bg-opacity-75 transition-all duration-300  p-4"
      }
    >
      <div
        className={
          "bg-white dark:bg-secondary rounded-lg shadow-xl overflow-hidden transition-all duration-30 w-full max-w-4xl h-auto max-h-[90vh]"
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {videoDetails?.title}
            </h2>
          )}
          <div className="flex space-x-2">
            <button
              onClick={handleOpenInNewTab}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open in new tab"
            >
              <ExternalLink className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setSelectedVideo(null)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className={"relative w-full aspect-video"}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
              <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          <iframe
            className="w-full h-full  aspect-video"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Mobile Controls */}
        {/* <div className="md:hidden fixed bottom-4 right-4 flex space-x-2">
          <button
            onClick={() => setSelectedVideo(null)}
            className="p-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="p-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full shadow-lg"
          >
            <ExternalLink className="w-6 h-6" />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default YouTubeCard;
