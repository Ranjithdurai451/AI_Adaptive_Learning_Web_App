
import { Button } from '@/components/ui/button';
import {
  Trash2,
  Clock,
  MoreHorizontal,
  Share2,
  BookOpen,
  BarChart2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RecentRoadmap } from '@/lib/store/recentRoadmapStore';
import { useNavigate } from 'react-router';
import { formatRelativeTime } from '@/lib/utils';

interface RoadmapCardProps {
  roadmap: RecentRoadmap;
  onRemove: () => void;
}

export function RoadmapCard({ roadmap, onRemove }: RoadmapCardProps) {


  // Get color based on progress
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-primary';
  };

  const navigate = useNavigate();

  const navigateToRoadmap = (
    skill: string,
    score: number,
    preferredLanguage: string
  ) => {
    navigate(
      `/roadmap?selectedSkill=${skill}&score=${score}&preferredLanguage=${preferredLanguage}`
    );
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
          <h3 className="font-semibold text-base truncate">{roadmap.title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-medium text-xs">
              Score: {roadmap.score}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {roadmap.preferredLanguage}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 sm:mb-0">
          <span>{roadmap.skill}</span>
          <span>•</span>
          <Clock className="h-3 w-3" />
          <span>{formatRelativeTime(roadmap.timestamp)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex-1 sm:w-32">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <BarChart2 className="w-3 h-3 text-muted-foreground" />
            <div className="flex-1 flex items-center gap-2">
              <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`absolute h-full ${getProgressColor(
                    roadmap.progress
                  )} rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${roadmap.progress || 0}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-primary whitespace-nowrap">
                {roadmap.progress || 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    navigateToRoadmap(
                      roadmap.skill,
                      roadmap.score,
                      roadmap.preferredLanguage
                    )
                  }
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Continue Learning</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard
                    .writeText('https://example.com')
                    .then(() => {
                      alert('Link copied to clipboard');
                    })
                    .catch((err) => {
                      console.error('Failed to copy link', err);
                    });
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>

              {/* <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                <span>Favorite</span>
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onRemove}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
