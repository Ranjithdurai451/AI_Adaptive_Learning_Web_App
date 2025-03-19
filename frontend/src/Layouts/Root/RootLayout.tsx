import { useTheme } from '@/components/ui/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import SparkLoader from './components/SparkLoader';
import { cn } from '@/lib/utils';
import { Link, Outlet, useLocation } from 'react-router';
import RecentRoadmaps from '../../features/recent_roadmap/components/RecentRoadmaps';
import YouTubeCard from './components/YoutubeCard';

export default function RootLayout() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  // Only show loader when on the home route "/"
  const [loading, setLoading] = useState(location.pathname === '/');
  const [contentVisible, setContentVisible] = useState(!loading);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleLoaderComplete = () => {
    setLoading(false);
    document.body.style.overflow = '';

    setTimeout(() => {
      setContentVisible(true);
    }, 100);
  };

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    }
  }, [loading]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {loading ? (
        <SparkLoader onComplete={handleLoaderComplete} />
      ) : (
        <div
          className={cn(
            'transition-opacity duration-700 ease-out',
            contentVisible ? 'opacity-100' : 'opacity-0',
            'h-dvh w-dvw flex flex-col overflow-hidden'
          )}
        >
          <header className="shadow-md sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border flex justify-between items-center p-4">
            <Link to="/" className="text-xl font-bold">
              <span className="hidden sm:block">SparkLearn</span>
              <span className="sm:hidden block">SL</span>
            </Link>
            <div className="flex items-center gap-4">
              {location.pathname === '/' && <RecentRoadmaps />}
              <button
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-200"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </header>

          <main className="flex-grow z-3 overflow-auto custom-scrollbar">
            <Outlet />
          </main>
        </div>
      )}
      <YouTubeCard />
    </>
  );
}
