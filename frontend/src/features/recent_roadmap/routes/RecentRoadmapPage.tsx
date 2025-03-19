import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  RecentRoadmap,
  useRecentRoadmapsStore,
} from '@/lib/store/recentRoadmapStore';
import { RoadmapCard } from '../components/RecentRoadmapCard';
import { Link } from 'react-router';

// Sample data for demonstration
// const sampleRoadmaps: RecentRoadmap[] = [
//   {
//     skill: 'React',
//     score: 85,
//     title: 'Frontend Developer Path',
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
//     progress: 75,
//     preferredLanguage: 'TypeScript',
//   },
//   {
//     skill: 'Node.js',
//     score: 92,
//     title: 'Backend Development',
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
//     progress: 60,
//     preferredLanguage: 'JavaScript',
//   },
//   {
//     skill: 'Python',
//     score: 78,
//     title: 'Data Science Fundamentals',
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
//     progress: 45,
//     preferredLanguage: 'Python',
//   },
//   {
//     skill: 'AWS',
//     score: 88,
//     title: 'Cloud Architecture',
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
//     progress: 30,
//     preferredLanguage: 'YAML',
//   },
//   {
//     skill: 'UI/UX',
//     score: 95,
//     title: 'Design Systems',
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
//     progress: 90,
//     preferredLanguage: 'Figma',
//   },
// ];

type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'progress' | 'score';

export default function RecentRoadmapPage() {
  // In a real app, you'd use the store directly
  // For demo purposes, we'll use local state initialized with sample data
  const {
    recentRoadmaps: roadmaps,
    removeRoadmap,
    clearRoadmaps,
  } = useRecentRoadmapsStore();
  //   const [roadmaps, setRoadmaps] = useState<RecentRoadmap[]>(sampleRoadmaps);
  const [filteredRoadmaps, setFilteredRoadmaps] =
    useState<RecentRoadmap[]>(roadmaps);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Filter and sort roadmaps when dependencies change
  useEffect(() => {
    let result = [...roadmaps];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (roadmap) =>
          roadmap.title.toLowerCase().includes(query) ||
          roadmap.skill.toLowerCase().includes(query) ||
          roadmap.preferredLanguage.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result = sortRoadmaps(result, sortBy);

    setFilteredRoadmaps(result);
  }, [roadmaps, searchQuery, sortBy]);

  // Sort roadmaps based on selected option
  const sortRoadmaps = (
    roadmapsToSort: RecentRoadmap[],
    option: SortOption
  ) => {
    switch (option) {
      case 'recent':
        return [...roadmapsToSort].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      case 'progress':
        return [...roadmapsToSort].sort((a, b) => b.progress - a.progress);
      case 'score':
        return [...roadmapsToSort].sort((a, b) => b.score - a.score);
      default:
        return roadmapsToSort;
    }
  };

  // Functions to simulate store actions
  //   const removeRoadmap = (index: number) => {
  //     // setRoadmaps(roadmaps.filter((_, i) => i !== index));
  //   };

  //   const clearRoadmaps = () => {
  //     // setRoadmaps([]);
  //   };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'recent':
        return 'Most Recent';
      case 'progress':
        return 'Highest Progress';
      case 'score':
        return 'Highest Score';
    }
  };

  return (
    <div className="h-full bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Your Learning Roadmaps
          </h1>
          <div className="flex items-center gap-3">
            {/* <ThemeToggle /> */}
            <Link to={'/skill-selector'}>
              <Button
                variant="default"
                size={isMobile ? 'sm' : 'default'}
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>New Roadmap</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-4 md:p-6 mb-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-sm">
                  All Roadmaps
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="text-sm">
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-sm">
                  Completed
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-[240px] lg:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roadmaps..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 h-10"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span>{getSortLabel(sortBy)}</span>
                        <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortBy('recent')}>
                        Most Recent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('progress')}>
                        Highest Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('score')}>
                        Highest Score
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              {filteredRoadmaps.length > 0 ? (
                <div className={'flex flex-col gap-3'}>
                  {filteredRoadmaps.map((roadmap, index) => (
                    <RoadmapCard
                      key={index}
                      roadmap={roadmap}
                      onRemove={() => removeRoadmap(index)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  searchQuery={searchQuery}
                  onClearSearch={() => setSearchQuery('')}
                />
              )}
            </TabsContent>

            <TabsContent value="in-progress" className="m-0">
              <EmptyState
                title="No in-progress roadmaps"
                description="Roadmaps that are partially completed will appear here."
              />
            </TabsContent>

            <TabsContent value="completed" className="m-0">
              <EmptyState
                title="No completed roadmaps"
                description="Roadmaps that are 100% complete will appear here."
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  searchQuery?: string;
  onClearSearch?: () => void;
}

function EmptyState({
  title = 'No roadmaps found',
  description = 'Create your first learning roadmap to track your progress',
  searchQuery,
  onClearSearch,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="mb-4 text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {searchQuery ? `No results found for "${searchQuery}"` : description}
      </p>
      {searchQuery ? (
        <Button onClick={onClearSearch}>Clear Search</Button>
      ) : (
        <Link to={'/skill-selector'}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Roadmap
          </Button>
        </Link>
      )}
    </div>
  );
}
