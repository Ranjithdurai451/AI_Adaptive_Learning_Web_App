import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Clock, BarChart2, X, ChevronDown, Search } from 'lucide-react';
import { useRecentRoadmapsStore } from '@/lib/store/recentRoadmapStore';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const RecentRoadmaps = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get state and actions from Zustand store
  const { recentRoadmaps, removeRoadmap: removeRoadmapFromStore } =
    useRecentRoadmapsStore();

  const navigateToRoadmap = (
    skill: string,
    score: number,
    preferredLanguage: string
  ) => {
    navigate(
      `/roadmap?selectedSkill=${skill}&score=${score}&preferredLanguage=${preferredLanguage}`
    );
    setIsOpen(false);
  };

  const removeRoadmap = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    removeRoadmapFromStore(index);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Clear search when opening
      setSearchTerm('');
      // Focus search input when dropdown opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Recently';
    }
  };

  // Filter roadmaps based on search term
  const filteredRoadmaps = recentRoadmaps.filter(
    (roadmap) =>
      roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roadmap.skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Handle escape key to close dropdown
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={cn(
          'flex items-center justify-between w-full px-4 py-2.5 text-sm rounded-lg',
          'bg-card hover:bg-muted/40 transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75',
          'border shadow-sm',
          isOpen ? 'border-primary shadow-md' : 'border-border/40'
        )}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-medium">Recent Roadmaps</span>
        </div>
        <div className="flex items-center gap-2">
          {recentRoadmaps.length > 0 && (
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {recentRoadmaps.length}
            </span>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform duration-300',
              isOpen ? 'rotate-180' : ''
            )}
          />
        </div>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-card rounded-lg shadow-lg border border-border/40 overflow-hidden"
            style={{ minWidth: '280px', maxWidth: '320px' }}
          >
            {/* Search bar */}
            <div className="p-2 border-b border-border/40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search roadmaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-muted/30 rounded-md border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Roadmap list */}
            <div
              className="max-h-64 overflow-y-auto"
              style={{ scrollbarWidth: 'thin' }}
            >
              {filteredRoadmaps.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="w-12 h-12 opacity-40" />
                    <p className="text-sm">
                      {searchTerm
                        ? 'No matching roadmaps found'
                        : 'No recent roadmaps'}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-xs text-primary hover:underline mt-1"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                filteredRoadmaps.map((roadmap, index) => (
                  <div
                    key={`${roadmap.skill}-${roadmap.score}-${index}`}
                    className="group p-3 border-b last:border-b-0 border-border/40 hover:bg-muted/30 cursor-pointer transition-all duration-200"
                    onClick={() =>
                      navigateToRoadmap(
                        roadmap.skill,
                        roadmap.score,
                        roadmap.preferredLanguage
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-full text-primary shrink-0">
                          <span className="font-medium text-sm">
                            {roadmap.skill.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm group-hover:text-primary transition-colors duration-200 truncate">
                            {roadmap.title}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(roadmap.timestamp)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => removeRoadmap(e, index)}
                        className="p-1.5 rounded-full hover:bg-muted/60 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary"
                        aria-label="Remove from recent roadmaps"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <BarChart2 className="w-3 h-3 text-muted-foreground" />
                      <div className="flex-1 flex items-center gap-2">
                        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="absolute h-full bg-primary rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${roadmap.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-primary whitespace-nowrap">
                          {roadmap.progress || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {filteredRoadmaps.length > 0 && (
              <div className="p-2 border-t border-border/40 bg-muted/10">
                <button
                  onClick={() => navigate('/roadmaps')}
                  className="w-full text-center text-xs font-medium text-primary hover:underline py-1.5"
                >
                  View all roadmaps
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecentRoadmaps;
