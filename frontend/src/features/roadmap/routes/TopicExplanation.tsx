import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

import {
  ArrowLeft,
  Type,
  Menu,
  ChevronRight,
  ArrowUp,
  Youtube,
  Info,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import Loader from '@/Layouts/Root/components/Loader';
import {
  generateDetailedExplanation,
  generateDetailedExplanationWithVideos,
} from '@/lib/actions';
import CodeBlock from '@/components/ui/CodeBlock';
import { CombinedResponse, LearningResource } from '@/lib/types';
import { useVideoStore } from '@/lib/store/useVideoStore';
export const renderTextWithCodeHighlights = (text: string) => {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*[^*\s]\*|`[^`]+`|\*)/g) // Ensure correct splitting
    .map((part, index) => {
      if (part === '*') {
        return <br key={index} />; // Insert a new line
      }
      if (/^\*\*(.+)\*\*$/.test(part)) {
        return (
          <strong className="  underline underline-offset-2" key={index}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (/^\*(.+)\*$/.test(part)) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      if (/^`(.+)`$/.test(part)) {
        return (
          <code
            key={index}
            className=" mx-1 bg-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
};
export default function TopicExplanation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || '';
  const title = useParams().title as string;
  const preferredLanguage =
    (searchParams.get('preferredLanguage') as string) || 'english';
  const score = Number(searchParams.get('score'));
  const [topicData, setTopicData] = useState<CombinedResponse | null>();
  // console.log(topicData);

  useEffect(() => {
    // Fetch topic data based on the topic ID
    // console.log('Fetching topic explanation for:', topic, title);
    if (!localStorage.getItem(`${topic}-${title}-${preferredLanguage}`)) {
      generateDetailedExplanationWithVideos(
        topic,
        title,
        preferredLanguage
      ).then((response) => {
        console.log(response);
        if (!response.error)
          localStorage.setItem(
            `${topic}-${title}-${preferredLanguage}`,
            JSON.stringify(response)
          );
        setTopicData(response);
      });
    } else {
      setTopicData(
        JSON.parse(
          localStorage.getItem(`${topic}-${title}-${preferredLanguage}`) || ''
        )
      );
    }
  }, []);

  useEffect(() => {
    // console.log(topicData);
    if (topicData) {
      setActiveSection(topicData?.sections[0]?.id);
      setIsLoading(false);
    }
  }, [topicData]);

  const [isLoading, setIsLoading] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [activeSection, setActiveSection] = useState<string | null>();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const mainRef = useRef<HTMLDivElement>(null);

  // Calculate reading progress and handle scroll
  useEffect(() => {
    if (
      (topicData && isLoading) ||
      !topicData?.sections ||
      topicData.sections.length === 0
    ) {
      return;
    }

    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const scrollPosition = element.scrollTop;
        const progress =
          totalHeight > 0 ? (scrollPosition / totalHeight) * 100 : 0;
        setReadingProgress(progress);

        // Show/hide scroll to top button
        setShowScrollToTop(scrollPosition > 300);

        // Update active section based on scroll position
        if (topicData.sections && topicData.sections.length > 0) {
          let currentSection = topicData.sections[0].id;
          for (const sectionId in sectionRefs.current) {
            const sectionElement = sectionRefs.current[sectionId];
            if (sectionElement) {
              const { top } = sectionElement.getBoundingClientRect();
              if (top < 200) {
                currentSection = sectionId;
              }
            }
          }
          setActiveSection(currentSection);
        }
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => {
        contentElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isLoading, topicData]);

  // Handle font size
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      case 'x-large':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionRefs.current[sectionId]) {
      sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setVideo = useVideoStore((state) => state.setSelectedVideo);

  const onBack = () => {
    localStorage.removeItem(`${topic}-${title}-${preferredLanguage}`);
    navigate(
      `/roadmap?selectedSkill=${topic}&score=${score}&preferredLanguage=${preferredLanguage}`
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader text="Loading topic explanation..." />
        </div>
      ) : (
        <div className={`h-full bg-background `} ref={mainRef}>
          {/* Simple header with minimal controls */}
          <header className="sticky top-0 z-30 px-4 py-3 border-b bg-background/95 backdrop-blur-sm border-border">
            <div className="container flex items-center justify-between mx-auto">
              <button
                onClick={onBack}
                className="gap-2 flex justify-center items-center"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <div className="flex items-center gap-3">
                {/* Table of contents for mobile */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 xl:hidden "
                    >
                      <Menu className="w-4 h-4" />
                      <span className="sr-only sm:not-sr-only">Sections</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                    <div className="py-4">
                      <h2 className="mb-4 text-xl font-semibold pl-8 ">
                        Table of Contents
                      </h2>
                      <div className="space-y-1">
                        {topicData?.sections.map((section, index) => (
                          <div key={section.id} className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                'w-full justify-start text-left pl-8 relative',
                                activeSection === section.id &&
                                  'text-primary font-medium'
                              )}
                              onClick={() => {
                                scrollToSection(section.id);
                                // Close the sheet
                                document
                                  .querySelector('[data-radix-collection-item]')
                                  ?.dispatchEvent(
                                    new MouseEvent('click', { bubbles: true })
                                  );
                              }}
                            >
                              {activeSection === section.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full" />
                              )}
                              <span className=" text-xs text-muted-foreground">
                                {index + 1}.
                              </span>
                              <span className="w-[80%] truncate">
                                {section.title}
                              </span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                  onClick={() =>
                    setFontSize(
                      fontSize === 'small'
                        ? 'medium'
                        : fontSize === 'medium'
                        ? 'large'
                        : fontSize === 'large'
                        ? 'x-large'
                        : 'small'
                    )
                  }
                >
                  <Type className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {fontSize === 'small'
                      ? 'Small'
                      : fontSize === 'medium'
                      ? 'Medium'
                      : fontSize === 'large'
                      ? 'Large'
                      : 'X-Large'}
                  </span>
                </Button>
              </div>
            </div>
          </header>

          <div className="container flex flex-col gap-6 px-4 py-6 mx-auto xl:flex-row">
            {/* Table of contents sidebar for desktop */}
            <aside className="flex-shrink-0 hidden w-64 xl:block lg:w-72">
              <div className="sticky overflow-hidden top-20">
                <h2 className="mb-4 text-lg font-semibold">
                  Table of Contents
                </h2>
                <div className="pr-2 space-y-1">
                  {topicData?.sections.map((section, index) => (
                    <div key={section.id} className="relative group">
                      {/* Active section indicator */}
                      {activeSection === section.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full" />
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'w-full justify-start text-left  relative hover:bg-muted/50',
                          activeSection === section.id
                            ? 'text-primary font-medium'
                            : 'text-foreground/80'
                        )}
                        onClick={() => scrollToSection(section.id)}
                      >
                        <span className=" text-xs text-muted-foreground">
                          {index + 1}.
                        </span>
                        <span className="w-[80%] truncate">
                          {section.title}
                        </span>

                        <ChevronRight
                          className={cn(
                            'h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity',
                            activeSection === section.id ||
                              'group-hover:opacity-100'
                          )}
                        />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="pt-6 mt-6 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Reading Time</span>
                    <Badge variant="outline">
                      {topicData?.estimatedReadingTime}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm">
                      {Math.round(readingProgress)}%
                    </span>
                  </div>
                  <Progress value={readingProgress} className="h-1.5 mt-1.5" />
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 max-w-3xl">
              {/* Title and info */}

              {/* Content sections */}
              <div
                className="h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar p-4"
                ref={contentRef}
              >
                <div className={cn('pr-4 space-y-10', getFontSizeClass())}>
                  <div className="">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge>
                        {renderTextWithCodeHighlights(
                          topicData?.difficulty || ''
                        )}
                      </Badge>
                    </div>

                    <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                      {renderTextWithCodeHighlights(topicData?.title || '')}{' '}
                    </h1>
                    <p className="text-muted-foreground">
                      {topicData?.description}
                    </p>
                  </div>
                  {topicData?.sections.map((section, index) => (
                    <section
                      key={section.id}
                      id={section.id}
                      ref={(el) => {
                        sectionRefs.current[section.id] = el as HTMLDivElement;
                      }}
                      className=""
                    >
                      <div className="flex gap-2">
                        <h2 className="flex items-center mb-4 text-xl font-semibold sm:text-2xl">
                          <span className="mr-2 text-primary">
                            {index + 1}.
                          </span>
                          {renderTextWithCodeHighlights(section.title)}{' '}
                        </h2>
                        {/* {(topicData?.videos[section?.title].default?.video) ? (
                          <button
                            className="flex items-center justify-center w-8 h-8  rounded-md hover:bg-muted/60 transition-colors"
                            aria-label="Watch video"
                            onClick={() =>
                              // console.log(
                              //   topicData.videos[section.title]?.default?.video
                              //     .url
                              // )
                              setVideo(
                                topicData.videos[section.title].default?.video
                              )
                            }
                          >
                            <ExternalLink className="w-5 h-5 text-red-600" />
                          </button>

                        ) : (<div className="flex  h-9 items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Info className="w-5 h-5" />
                          <span>Soon</span>
                        </div>)} */}
                      </div>

                      <div className="prose dark:prose-invert max-w-none">
                        {section.content.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-4 leading-relaxed">
                            {renderTextWithCodeHighlights(paragraph)}
                          </p>
                        ))}
                        {section.example && (
                          <div className="p-4 my-6  rounded-md bg-muted ">
                            {/* <pre className="font-mono text-sm">
                                {section.example}
                              </pre> */}
                            <CodeBlock
                              key={section.example.code}
                              code={section.example.code}
                              filename={section.example.filename}
                              language={section.example.language}
                            />
                          </div>
                        )}
                        {section.tips && section.tips.length > 0 && (
                          <div className="p-4 my-6 rounded-md bg-muted">
                            <h4 className="mb-3 font-medium">Key Points</h4>
                            <ul className="pl-5 space-y-2 list-disc">
                              {section.tips.map((tip) => (
                                <li key={tip}>
                                  {renderTextWithCodeHighlights(tip)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {/* Section divider */}
                      <Separator className="mt-10" />
                    </section>
                  ))}

                  {/* Additional resources */}
                  <section className="pt-4">
                    <h2 className="flex items-center mb-4 text-xl font-semibold sm:text-2xl underline underline-offset-2">
                      {/* <span className="mr-2 text-primary">#</span> */}
                      Additional Resources
                    </h2>
                    <ul className="pl-5 space-y-3 list-disc">
                      {topicData?.resources.map((resource, index) => (
                        <li key={index}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="pt-4">
                    <h2 className="flex items-center mb-4 text-xl font-semibold sm:text-2xl underline underline-offset-2">
                      {/* <span className="mr-2 text-primary">#</span> */}
                      Youtube Videos
                    </h2>
                    <ul className="pl-5 space-y-3 list-disc">
                      {topicData?.videos.map((video, index) => (
                        <li key={index}>
                          <button
                            onClick={() => setVideo(video)}
                            className="hover:underline"
                          >
                            {video.title.length > 50
                              ? `${video.title.substring(0, 50)}...`
                              : video.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            </main>
          </div>

          {/* Scroll to top button */}
          <AnimatePresence>
            {showScrollToTop && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed z-20 bottom-20 right-4 md:bottom-4"
              >
                <Button
                  size="icon"
                  className="rounded-full shadow-lg"
                  onClick={scrollToTop}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
