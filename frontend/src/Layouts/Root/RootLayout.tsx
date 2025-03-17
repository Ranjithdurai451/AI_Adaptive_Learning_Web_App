import { useTheme } from "@/components/ui/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { Link, Outlet } from "react-router";
import { useEffect, useState } from "react";
import SparkLoader from "./components/SparkLoader";
import { cn } from "@/lib/utils";
import { useVideoStore } from "@/lib/store/useVideoStore";
import YouTubeCard from "./components/YoutubeCard";

export default function RootLayout() {
  const { theme, setTheme } = useTheme();
  // const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const { selectedVideo, setSelectedVideo } = useVideoStore();
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleLoaderComplete = () => {
    setLoading(false);
    document.body.style.overflow = "";

    // Slight delay before showing content for a smoother transition
    setTimeout(() => {
      setContentVisible(true);
    }, 100);
  };

  // Prevent scrolling during loader animation
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    }
  }, [loading]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {loading ? (
        <SparkLoader onComplete={handleLoaderComplete} />
      ) : (
        <>
          {/* {location.pathname === "/" && <BackgroundPaths />} */}
          <div
            className={cn(
              " transition-opacity duration-700 ease-out",
              contentVisible ? "opacity-100" : "opacity-0",
              "h-dvh w-dvw  flex flex-col overflow-hidden"
            )}
          >
            <header className="shadow-md sticky top-0 z-5 bg-background/90 backdrop-blur-sm border-b border-border flex justify-between items-center p-4 ">
              <Link to={"/"} className=" text-xl font-bold">
                SparkLearn
              </Link>
              <div className="flex items-center gap-4">
                <button
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-200"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </header>

            <main className="flex-grow    z-3 overflow-auto custom-scrollbar ">
              <Outlet />
            </main>
          </div>
          {selectedVideo && (
            <div
              onClick={() => setSelectedVideo(null)}
              className="fixed inset-0 flex justify-center items-center bg-black/70 z-50"
            >
              <YouTubeCard videoId={selectedVideo} />
            </div>
          )}
        </>
      )}
    </>
  );
}
