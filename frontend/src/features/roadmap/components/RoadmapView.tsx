import { Button } from "@/components/ui/button";
import { useRecentRoadmapsStore } from "@/lib/store/recentRoadmapStore";
import { Roadmap } from "@/lib/types";
import { toSlug } from "@/lib/utils";
import {
  ChevronUp,
  ChevronDown,
  FileText,
  CheckCircle2,
  Info,
  ArrowLeft,
  ArrowRight,
  BarChart2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

type RoadmapViewProps = {
  skill: string;
  roadmap: Roadmap;
  preferredLanguage: string;
  score: number;
};

const RoadmapView = ({
  score,
  skill,
  roadmap,
  preferredLanguage,
}: RoadmapViewProps) => {
  const navigate = useNavigate();

  // Generate a unique key for this roadmap
  const roadmapKey = `roadmap-${skill}-${score}-${preferredLanguage}`;
  const completedTopicsKey = `${roadmapKey}-completed`;
  const expandedDaysKey = `${roadmapKey}-expanded`;
  // Initialize state from localStorage
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>(
    () => {
      try {
        const saved = localStorage.getItem(expandedDaysKey);
        return saved ? JSON.parse(saved) : {};
      } catch (error) {
        console.error("Error loading expanded days from localStorage:", error);
        return {};
      }
    }
  );

  const [completedTopics, setCompletedTopics] = useState<
    Record<string, boolean>
  >(() => {
    try {
      const saved = localStorage.getItem(completedTopicsKey);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Error loading completed topics from localStorage:", error);
      return {};
    }
  });

  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });

  // Save to recents function
  // Get the addOrUpdateRecentRoadmap function from the store
  const addOrUpdateRecentRoadmap = useRecentRoadmapsStore(
    (state) => state.addRecentRoadmap
  );

  // Your existing useEffect, modified to use the Zustand store for recents
  useEffect(() => {
    // Calculate progress
    let totalTopics = 0;
    roadmap.steps.forEach((step) => {
      totalTopics += step.subTopics.length;
    });
    const completedCount =
      Object.values(completedTopics).filter(Boolean).length;
    const percentage =
      totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
    const newProgress = {
      completed: completedCount,
      total: totalTopics,
      percentage: percentage,
    };
    setProgress(newProgress);

    // Save completed topics to localStorage
    const completedTopicsKey = `completed-topics-${skill}-${score}`;
    localStorage.setItem(completedTopicsKey, JSON.stringify(completedTopics));

    // Create recent roadmap object
    const recentRoadmap = {
      skill,
      score,
      title: roadmap.title,
      timestamp: new Date().toISOString(),
      progress: percentage,
      preferredLanguage,
      steps: roadmap.steps.map((step) => ({
        title: step.title,
        skillId: step.skillId,
        expanded: expandedDays[step.title] || false,
      })),
    };

    // Add or update in Zustand store (which handles localStorage)
    addOrUpdateRecentRoadmap(recentRoadmap);
  }, [
    completedTopics,
    expandedDays,
    preferredLanguage,
    roadmap,
    score,
    skill,
    addOrUpdateRecentRoadmap,
  ]);

  const toggleDay = (day: string) => {
    const newExpandedDays = {
      ...expandedDays,
      [day]: !expandedDays[day],
    };

    setExpandedDays(newExpandedDays);

    // Save expanded state to localStorage
    localStorage.setItem(expandedDaysKey, JSON.stringify(newExpandedDays));
  };

  const toggleTopicCompletion = (
    stepId: string,
    topicIndex: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    // Create a proper key using stepId and topicIndex
    // Make sure stepId is a valid string
    const safeStepId = stepId || `step-${topicIndex}`;
    const topicKey = `${safeStepId}-topic-${topicIndex}`;

    setCompletedTopics((prev) => {
      const newCompletedTopics = {
        ...prev,
        [topicKey]: !prev[topicKey],
      };

      // Save to localStorage immediately
      localStorage.setItem(
        completedTopicsKey,
        JSON.stringify(newCompletedTopics)
      );

      return newCompletedTopics;
    });
  };

  const isTopicCompleted = (stepId: string, topicIndex: number) => {
    // Make sure stepId is a valid string
    const safeStepId = stepId || `step-${topicIndex}`;
    const topicKey = `${safeStepId}-topic-${topicIndex}`;
    return completedTopics[topicKey] || false;
  };

  const onBack = () => {
    navigate(`/`);
  };
  const navigateToPracticeQuiz = () => {
    navigate(`/roadmap/practice-quiz?topic=${skill}&score=${score}&preferredLanguage=${preferredLanguage}`)
  }

  return (
    <>
      <div className="w-full flex items-center justify-between px-4 py-2 border-b border-border">
        <button
          onClick={onBack}
          className="gap-2 flex justify-center items-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 ">
        {/* Header with title and badge */}
        <div className="mb-6 mt-4">
          <div className="flex w-full justify-between ">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-primary">
                {roadmap.title}
              </h1>
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                FAQ
              </span>
            </div>
            <Button onClick={navigateToPracticeQuiz}>  Practice Quiz</Button>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {roadmap.description}
          </p>
        </div>

        {/* Progress card */}
        <div className="bg-card rounded-lg p-4 mb-6 border border-border/50 hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              <span className="text-sm">
                Progress:{" "}
                <span className="font-medium">
                  {progress.completed}/{progress.total}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
              <span className="text-primary text-sm whitespace-nowrap">
                {progress.percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Steps accordion */}
        <div className="space-y-4">
          {roadmap.steps.map((item, stepIndex) => (
            <div
              key={`step-${stepIndex}`}
              className="bg-card border border-border/50 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Step header (always visible) */}
              <div
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted/30 transition-colors duration-200"
                onClick={() => {
                  toggleDay(item.title);
                }}
              >
                <div className="flex flex-col gap-0.5 max-w-[85%]">
                  <h2 className="font-medium">{item.title}</h2>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs py-0.5 px-2 bg-muted/50 rounded-full">
                    {item.subTopics.length}
                  </span>
                  {expandedDays[item.title] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Step content (expandable) */}
              {expandedDays[item.title] && (
                <div className="border-t border-border">
                  <div className="grid grid-cols-1 divide-y divide-border">
                    {/* Table header - desktop only */}
                    <div className="hidden sm:grid sm:grid-cols-12 bg-muted/30 text-xs uppercase text-muted-foreground font-medium">
                      <div className="col-span-1 py-2 px-3 flex items-center justify-center">
                        Done
                      </div>
                      <div className="col-span-8 py-2 px-3">Topic</div>
                      <div className="col-span-3 py-2 px-3">Resources</div>
                    </div>

                    {/* Topic rows */}
                    {item.subTopics.map((topic, index) => (
                      <div
                        key={`topic-${index}`}
                        className={`group grid grid-cols-12 gap-1 transition-colors duration-200 ${isTopicCompleted(topic, index)
                          ? "bg-primary/5"
                          : "hover:bg-muted/20"
                          }`}
                        onClick={(e) => toggleTopicCompletion(topic, index, e)}
                      >
                        {/* Status checkbox */}
                        <div className="col-span-2 sm:col-span-1 py-3 px-2 flex justify-center items-center">
                          <button
                            className="w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                            aria-label={
                              isTopicCompleted(topic, index)
                                ? "Mark as incomplete"
                                : "Mark as complete"
                            }
                            onClick={(e) =>
                              toggleTopicCompletion(topic, index, e)
                            }
                          >
                            {isTopicCompleted(topic, index) ? (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground group-hover:border-primary transition-colors"></div>
                            )}
                          </button>
                        </div>

                        {/* Topic content */}
                        <div
                          className={`col-span-10 sm:col-span-8 py-3 pr-2 pl-0 sm:px-3 font-medium text-sm ${isTopicCompleted(topic, index)
                            ? "line-through opacity-70"
                            : ""
                            }`}
                        >
                          {topic}

                          {/* Mobile-only topic number */}
                          <div className="sm:hidden mt-1">
                            <span className="text-xs text-muted-foreground">
                              Topic {index + 1}
                            </span>
                          </div>
                        </div>

                        {/* Resource buttons */}
                        <div className="col-span-12 sm:col-span-3 pb-3 pt-0 sm:py-3 px-3 flex gap-3 items-center sm:justify-start justify-end">
                          <button
                            className="p-1.5 rounded-md hover:bg-muted/60 transition-colors"
                            aria-label="Read article"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/roadmap/${toSlug(
                                  topic
                                )}?topic=${skill}&subtopic=${item.title
                                }&score=${score}&preferredLanguage=${preferredLanguage}`
                              );
                            }}
                          >
                            <FileText className="w-4 h-4 text-blue-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation footer */}
        <div className="mt-6 mb-4 flex flex-wrap justify-between items-center gap-3 p-3 sm:p-4 bg-card rounded-lg border border-border/50">
          <button className="text-xs sm:text-sm text-primary font-medium hover:underline flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Join community</span>
          </button>

          <div className="flex gap-2">
            <Link
              to={"/skill-selector"}
              className="px-3 py-1.5 border border-border rounded-md text-xs font-medium hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Prev</span>
            </Link>
            <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              <span>Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoadmapView;
