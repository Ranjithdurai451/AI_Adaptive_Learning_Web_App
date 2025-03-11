import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Star, TrendingUp } from "lucide-react";
export function ScrollableFilterButtons({
  activeFilter,
  setActiveFilter,
  hasRecommended,
}: {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  hasRecommended: boolean;
}) {
  return (
    <div className="flex overflow-x-auto pb-2 -mx-1 px-1 gap-1 md:gap-2 w-full scrollbar-none">
      <Button
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setActiveFilter('all')}
        className="text-xs whitespace-nowrap sm:size-default"
      >
        All Skills
      </Button>
      {hasRecommended && (
        <Button
          variant={activeFilter === 'recommended' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('recommended')}
          className="text-xs whitespace-nowrap sm:size-default"
        >
          <Sparkles className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
          <span className="hidden md:inline">Recommended</span>
          <span className="md:hidden ml-1">Rec</span>
        </Button>
      )}
      <Button
        variant={activeFilter === 'beginner' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setActiveFilter('beginner')}
        className="text-xs whitespace-nowrap sm:size-default"
      >
        <BookOpen className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
        <span className="hidden md:inline">Beginner</span>
        <span className="md:hidden ml-1">Beg</span>
      </Button>
      <Button
        variant={activeFilter === 'intermediate' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setActiveFilter('intermediate')}
        className="text-xs whitespace-nowrap sm:size-default"
      >
        <Star className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
        <span className="hidden md:inline">Intermediate</span>
        <span className="md:hidden ml-1">Int</span>
      </Button>
      <Button
        variant={activeFilter === 'advanced' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setActiveFilter('advanced')}
        className="text-xs whitespace-nowrap sm:size-default"
      >
        <TrendingUp className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
        <span className="hidden md:inline">Advanced</span>
        <span className="md:hidden ml-1">Adv</span>
      </Button>
    </div>
  );
} 
