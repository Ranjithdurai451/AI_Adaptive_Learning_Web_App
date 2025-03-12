'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  BookOpen,
  Code,
  ExternalLink,
  Play,
  ThumbsUp,
  Video,
  CheckCircle,
  Info,
  Lightbulb,
  MessageSquare,
  Bookmark,
  Share2,
  Download,
  Clock,
  Award,
  Menu,
} from 'lucide-react';
import type {
  Roadmap,
  Skill,
  TopicExplanation,
  VideoRecommendation,
} from '@/lib/types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface RoadmapViewProps {
  skill: Skill;
  quizPassed: boolean;
  onBack: () => void;
  preferredLanguage: string;
  roadmap: Roadmap;
  //   userData?: UserData;
}

export default function RoadmapView({
  skill,
  quizPassed,
  roadmap,
  onBack,
  preferredLanguage,
}: //   userData,
RoadmapViewProps) {
  //   const roadmap =roadmap;
  console.log(roadmap);
  const videos: VideoRecommendation[] = [];
  const explanations: TopicExplanation[] = [];
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({});
  const [bookmarkedVideos, setBookmarkedVideos] = useState<number[]>([]);

  const topicRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleTopicComplete = (topicId: string) => {
    if (completedTopics.includes(topicId)) {
      setCompletedTopics(completedTopics.filter((id) => id !== topicId));
    } else {
      setCompletedTopics([...completedTopics, topicId]);
    }

    // Update overall progress
    const newProgress = Math.round(
      ((completedTopics.includes(topicId)
        ? completedTopics.length
        : completedTopics.length + 1) /
        explanations.length) *
        100
    );
    setProgress(newProgress);
  };

  const handleToggleNotes = (topicId: string) => {
    setShowNotes({
      ...showNotes,
      [topicId]: !showNotes[topicId],
    });
  };

  const handleUpdateNotes = (topicId: string, content: string) => {
    setNotes({
      ...notes,
      [topicId]: content,
    });
  };

  const handleToggleBookmark = (videoIndex: number) => {
    if (bookmarkedVideos.includes(videoIndex)) {
      setBookmarkedVideos(bookmarkedVideos.filter((i) => i !== videoIndex));
    } else {
      setBookmarkedVideos([...bookmarkedVideos, videoIndex]);
    }
  };

  const scrollToTopic = (topicId: string) => {
    if (topicRefs.current[topicId]) {
      topicRefs.current[topicId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setExpandedTopic(topicId);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const MobileTopicsList = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="mb-4">
          <Menu className="h-4 w-4 mr-2" /> Topics
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <h3 className="font-medium mb-3">Topics</h3>
          <ul className="space-y-1">
            {explanations.length > 0 &&
              explanations.map((topic, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-left ${
                      expandedTopic === topic.id
                        ? 'bg-primary/10 text-primary'
                        : ''
                    }`}
                    onClick={() => {
                      scrollToTopic(topic.id);
                      // Close the sheet on mobile after selecting a topic
                      if (isMobile) {
                        const sheetCloseButton = document.querySelector(
                          '[data-radix-collection-item]'
                        ) as HTMLButtonElement;
                        if (sheetCloseButton) sheetCloseButton.click();
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {completedTopics.includes(topic.id) ? (
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-muted-foreground flex-shrink-0" />
                      )}
                      <span className="truncate">{topic.title}</span>
                    </div>
                  </Button>
                </li>
              ))}
          </ul>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return (
    <Card className="   ">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">
              {skill.name} Learning Roadmap
            </CardTitle>
            <CardDescription>
              {quizPassed
                ? "Based on your quiz results, we've created an advanced learning path for you."
                : "We've prepared a beginner-friendly learning path to help you master this skill."}
            </CardDescription>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm text-muted-foreground mb-1">
              Your progress
            </div>
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-2 w-24" />
              <span className="text-sm font-medium">{progress}%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className=" max-w-dvw ">
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="flex flex-wrap justify-start gap-2 mb-6">
            <TabsTrigger value="overview" className="flex-grow sm:flex-grow-0">
              Overview
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex-grow sm:flex-grow-0">
              Topics & Explanations
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex-grow sm:flex-grow-0">
              Video Tutorials
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex-grow sm:flex-grow-0">
              Projects & Exercises
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold">About {skill.name}</h3>
              <p>{roadmap.description}</p>

              <h3 className="text-xl font-semibold mt-6">Learning Path</h3>
              <ol className="space-y-4 mt-4">
                {roadmap.steps.map((step, index) => (
                  <motion.li
                    key={index}
                    className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setActiveTab('topics')}
                  >
                    <div className="font-medium">
                      {index + 1}. {step.title}
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </motion.li>
                ))}
              </ol>

              {!quizPassed && roadmap.prerequisites.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mt-6">
                    Recommended Prerequisites
                  </h3>
                  <ul className="space-y-2 mt-2">
                    {roadmap.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="bg-muted/50 rounded-lg p-4 mt-6 border">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Learning Tips
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>
                      Start with the fundamentals before moving to advanced
                      topics
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>Practice regularly with the provided exercises</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>
                      Take notes on key concepts to reinforce your learning
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-1" />
                    <span>Build projects to apply what you've learned</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="topics">
            <div className="flex flex-col lg:flex-row gap-6">
              {isMobile ? (
                <MobileTopicsList />
              ) : (
                <div className="lg:w-1/4">
                  <div className="sticky top-4">
                    <h3 className="font-medium mb-3">Topics</h3>
                    <ScrollArea className="h-[calc(100vh-16rem)]">
                      <ul className="space-y-1">
                        {explanations.map((topic, index) => (
                          <li key={index}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`w-full justify-start text-left ${
                                expandedTopic === topic.id
                                  ? 'bg-primary/10 text-primary'
                                  : ''
                              }`}
                              onClick={() => scrollToTopic(topic.id)}
                            >
                              <div className="flex items-center gap-2">
                                {completedTopics.includes(topic.id) ? (
                                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-muted-foreground flex-shrink-0" />
                                )}
                                <span className="truncate">{topic.title}</span>
                              </div>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>

                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Your Progress</h3>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>
                          {completedTopics.length} of {explanations.length}{' '}
                          completed
                        </span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="lg:w-3/4">
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="space-y-8 pr-4">
                    {explanations.map((topic, index) => (
                      <div
                        key={index}
                        ref={(el) => {
                          topicRefs.current[topic.id] = el;
                        }}
                        className={`border rounded-lg p-6 ${
                          expandedTopic === topic.id
                            ? 'border-primary/50 bg-primary/5'
                            : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold">
                              {topic.title}
                            </h3>
                            <Badge variant="outline" className="ml-2">
                              {topic.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleToggleNotes(topic.id)}
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Add notes</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleTopicComplete(topic.id)
                                    }
                                  >
                                    {completedTopics.includes(topic.id) ? (
                                      <CheckCircle className="h-4 w-4 text-primary" />
                                    ) : (
                                      <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Mark as{' '}
                                    {completedTopics.includes(topic.id)
                                      ? 'incomplete'
                                      : 'complete'}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        <div className="mt-4 prose dark:prose-invert max-w-none">
                          <p>{topic.description}</p>

                          <Accordion type="single" collapsible className="mt-4">
                            {topic.sections.map((section, sectionIndex) => (
                              <AccordionItem
                                key={sectionIndex}
                                value={`section-${sectionIndex}`}
                              >
                                <AccordionTrigger className="text-base font-medium">
                                  {section.title}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="mt-2 space-y-4">
                                    <p>{section.content}</p>

                                    {section.example && (
                                      <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                                        <pre>{section.example}</pre>
                                      </div>
                                    )}

                                    {section.tips && (
                                      <div className="bg-primary/5 border border-primary/20 rounded-md p-4 mt-4">
                                        <h4 className="font-medium flex items-center gap-2 text-primary">
                                          <Lightbulb className="h-4 w-4" />
                                          Pro Tips
                                        </h4>
                                        <ul className="mt-2 space-y-2">
                                          {section.tips.map((tip, tipIndex) => (
                                            <li
                                              key={tipIndex}
                                              className="flex items-start gap-2"
                                            >
                                              <Info className="h-4 w-4 text-primary mt-1" />
                                              <span>{tip}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>

                          {topic.resources && (
                            <div className="mt-6">
                              <h4 className="font-medium">
                                Additional Resources
                              </h4>
                              <ul className="mt-2 space-y-1">
                                {topic.resources.map(
                                  (resource, resourceIndex) => (
                                    <li
                                      key={resourceIndex}
                                      className="flex items-center gap-2"
                                    >
                                      <ExternalLink className="h-4 w-4 text-primary" />
                                      <a
                                        href="#"
                                        className="text-primary hover:underline"
                                      >
                                        {resource}
                                      </a>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>

                        <AnimatePresence>
                          {showNotes[topic.id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-6"
                            >
                              <h4 className="font-medium mb-2">Your Notes</h4>
                              <Textarea
                                placeholder="Add your notes here..."
                                className="min-h-[100px]"
                                value={notes[topic.id] || ''}
                                onChange={(e) =>
                                  handleUpdateNotes(topic.id, e.target.value)
                                }
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <h3 className="text-xl font-semibold mb-4">
              Recommended Videos in {preferredLanguage}
            </h3>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                {videos.length > 0 &&
                  videos.map((video, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <img
                          src={`/placeholder.svg?height=200&width=360&text=${encodeURIComponent(
                            video.title
                          )}`}
                          alt={video.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full h-12 w-12"
                          >
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="bg-background/80 hover:bg-background"
                            onClick={() => handleToggleBookmark(index)}
                          >
                            <Bookmark
                              className={`h-5 w-5 ${
                                bookmarkedVideos.includes(index)
                                  ? 'fill-primary text-primary'
                                  : ''
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold line-clamp-2">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{video.creator[0]}</AvatarFallback>
                          </Avatar>
                          <span>{video.creator}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {video.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{video.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Video className="h-4 w-4" />
                            <span>{video.views}</span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="default"
                            className="w-full"
                            size="sm"
                          >
                            <Play className="h-4 w-4 mr-2" /> Watch Video
                          </Button>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">
                                  Share this video
                                </h4>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                  >
                                    Copy Link
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-6 pr-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Hands-on Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roadmap.projects.map((project, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
                          <Code className="h-12 w-12 text-primary/70" />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">
                              {project.title}
                            </CardTitle>
                            <Badge>{project.difficulty}</Badge>
                          </div>
                          <CardDescription>
                            Estimated time: 2-4 hours
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.skills.map((skill, i) => (
                              <Badge key={i} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="default"
                              className="w-full"
                              size="sm"
                            >
                              <Code className="h-4 w-4 mr-2" /> Start Project
                            </Button>
                            <Button variant="outline" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Practice Exercises
                  </h3>
                  <div className="space-y-3">
                    {roadmap.exercises.map((exercise, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Award className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  {exercise.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {exercise.description}
                                </p>
                              </div>
                            </div>
                            <Badge>{exercise.difficulty}</Badge>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full mt-4"
                            size="sm"
                          >
                            Start Exercise
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Award className="h-4 w-4 text-primary" />
          <span>Learning {skill.name} with TechPathAI</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Skills
          </Button>
          <Button size="sm">
            <CheckCircle className="h-4 w-4 mr-1" /> Mark All Complete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
