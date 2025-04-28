"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  AlertTriangle,
  Trophy,
  RotateCcw,
} from "lucide-react";
import type { Questions } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router";
import { renderTextWithCodeHighlights } from "@/features/roadmap/routes/TopicExplanation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "sonner";
import { triggerConfetti } from "@/lib/utils";

interface QuizViewProps {
  skillName: string;
  Questions: Questions;
  onBack: () => void;
  preferredLanguage: string;
}

export default function QuizView({
  Questions,
  onBack,
  skillName,
  preferredLanguage,
}: QuizViewProps) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    {
      question: string;
      userAnswer: string;
      correctAnswer: string;
    }[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [timerActive, setTimerActive] = useState(true);
  const [timeWarning, setTimeWarning] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const timerRef = useRef<HTMLDivElement>(null);

  const currentQuestion = Questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / Questions.length) * 100;

  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 10 && prev > 5 && !timeWarning) {
          setTimeWarning(true);
          // Shake the timer
          timerRef.current?.classList.add("animate-shake");
          setTimeout(() => {
            timerRef.current?.classList.remove("animate-shake");
          }, 500);
        }

        if (prev <= 5) {
          // Pulse the timer in red
          timerRef.current?.classList.add("animate-pulse");
        }

        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswerCorrect && !showResults) {
            handleAnswer("");
            toast("Time's up!", {
              description: "You ran out of time for this question.",
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      setTimeWarning(false);
      timerRef.current?.classList.remove("animate-pulse", "animate-shake");
    };
  }, [timerActive, isAnswerCorrect, showResults]);

  useEffect(() => {
    setTimeLeft(30);
    setTimerActive(true);
    setTimeWarning(false);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (showResults && score / Questions.length >= 0.7) {
      triggerConfetti();
    }
  }, [showResults, score, Questions.length]);

  const handleAnswer = (answer: string) => {
    if (isAnswerCorrect !== null) return;

    setSelectedAnswer(answer);
    setTimerActive(false);

    const isCorrect = answer === currentQuestion.answer;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      setScore(score + 1);
      toast("Correct!", {
        description: "Great job! You got it right.",
      });
    } else {
      toast("Incorrect", {
        description: "The correct answer was: " + currentQuestion.answer,
      });
    }

    // Save the answer
    const newAnswers = [...answers];
    newAnswers.push({
      question: currentQuestion.question,
      userAnswer: answer || "No answer",
      correctAnswer: currentQuestion.answer,
    });
    setAnswers(newAnswers);

    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < Questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const calculateScore = () => {
    return (score / Questions.length) * 100;
  };

  const onComplete = () => {
    const score = calculateScore() >= 60 ? 100 : 50;
    navigate(
      `/roadmap?selectedSkill=${skillName}&score=${score}&preferredLanguage=${preferredLanguage}`,
    );
  };

  const handleTryAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResults(false);
    setIsAnswerCorrect(null);
    setScore(0);
    setTimeLeft(30);
    setTimerActive(true);
  };

  const percentage = Math.round(calculateScore());

  let message = "";
  let emoji = "";

  if (percentage >= 90) {
    message = "Outstanding! You're a pro at " + skillName + "!";
    emoji = "🏆";
  } else if (percentage >= 70) {
    message = "Great job! You have solid knowledge of " + skillName + "!";
    emoji = "🎉";
  } else if (percentage >= 50) {
    message = "Good effort! Keep learning and practicing!";
    emoji = "👍";
  } else {
    message = "Keep studying! You'll improve with practice.";
    emoji = "📚";
  }

  if (showResults) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-2xl w-full mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Quiz Complete!</h1>
            <p className="text-muted-foreground">Here's how you did</p>
          </div>

          <Tabs
            defaultValue="summary"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="answers">Your Answers</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Quiz Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full -rotate-90"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="10"
                          className="text-muted/20"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="10"
                          strokeDasharray={`${percentage * 2.83}, 283`}
                          strokeLinecap="round"
                          className={`
                            transition-all duration-1000 ease-out
                            ${
                              percentage >= 70
                                ? "text-green-500"
                                : percentage >= 50
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }
                          `}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="text-4xl">{emoji}</div>
                      <h2 className="text-xl font-semibold">{message}</h2>
                      <p className="text-muted-foreground">
                        You scored {score} out of {Questions.length} questions
                        correctly.
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                        <Badge variant="outline" className="capitalize">
                          {skillName}
                        </Badge>
                        <Badge variant="secondary">
                          {Questions.length} questions
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div
                      className={`border rounded-lg p-3 text-center ${
                        percentage >= 50
                          ? "border-primary/50 bg-primary/5"
                          : "opacity-50"
                      }`}
                    >
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-xs font-medium">Beginner</div>
                    </div>
                    <div
                      className={`border rounded-lg p-3 text-center ${
                        percentage >= 70
                          ? "border-primary/50 bg-primary/5"
                          : "opacity-50"
                      }`}
                    >
                      <div className="text-2xl mb-1">⭐</div>
                      <div className="text-xs font-medium">Intermediate</div>
                    </div>
                    <div
                      className={`border rounded-lg p-3 text-center ${
                        percentage >= 90
                          ? "border-primary/50 bg-primary/5"
                          : "opacity-50"
                      }`}
                    >
                      <div className="text-2xl mb-1">🏆</div>
                      <div className="text-xs font-medium">Expert</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                      onClick={handleTryAgain}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Try Again
                    </Button>
                    <Button
                      className="flex items-center gap-2"
                      onClick={onComplete}
                    >
                      <Trophy className="h-4 w-4" />
                      Continue to Roadmap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="answers" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Question Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {answers.map((answer, index) => {
                      const isCorrect =
                        answer.userAnswer === answer.correctAnswer;
                      const userAnswerText =
                        answer.userAnswer === "No answer"
                          ? "No answer"
                          : answer.userAnswer;
                      const correctAnswerText = answer.correctAnswer;

                      return (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 text-left">
                              <div
                                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                  isCorrect
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {isCorrect ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                              </div>
                              <span className="text-sm font-medium truncate max-w-[250px] sm:max-w-[350px]">
                                {renderTextWithCodeHighlights(answer.question)}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pl-9">
                              <div className="space-y-1">
                                <div className="text-sm font-medium">
                                  Your Answer:
                                </div>
                                <div
                                  className={`text-sm p-2 rounded ${
                                    isCorrect
                                      ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                                      : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                  }`}
                                >
                                  {renderTextWithCodeHighlights(userAnswerText)}
                                </div>
                              </div>

                              {!isCorrect && (
                                <div className="space-y-1">
                                  <div className="text-sm font-medium">
                                    Correct Answer:
                                  </div>
                                  <div className="text-sm p-2 rounded bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                                    {renderTextWithCodeHighlights(
                                      correctAnswerText,
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>

                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("summary")}
                      className="flex items-center gap-2"
                    >
                      Back to Summary
                    </Button>
                    <Button
                      className="flex items-center gap-2"
                      onClick={onComplete}
                    >
                      <Trophy className="h-4 w-4" />
                      Continue to Roadmap
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-2xl mx-auto w-full">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Badge variant="outline" className="px-2 py-1">
            Question {currentQuestionIndex + 1}/{Questions.length}
          </Badge>
          <div className="flex items-center gap-2">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold">{score}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto">
                <p className="text-sm">Your current score</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            Progress: {Math.round(progress)}%
          </span>
          <div
            ref={timerRef}
            className={`flex items-center gap-1 px-2 py-1 rounded ${
              timeLeft < 10 ? "text-red-500 bg-red-50 dark:bg-red-950/20" : ""
            }`}
          >
            <Clock className="h-4 w-4" />
            <span className="font-medium">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {renderTextWithCodeHighlights(currentQuestion.question)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => isAnswerCorrect === null && handleAnswer(option)}
                disabled={isAnswerCorrect !== null}
                className={`
                  p-4 rounded-lg border text-left transition-all relative overflow-hidden
                  ${
                    isAnswerCorrect !== null &&
                    option === currentQuestion.answer
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : isAnswerCorrect !== null &&
                          option === selectedAnswer &&
                          option !== currentQuestion.answer
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                        : "border-input hover:border-primary/50 hover:bg-muted/50"
                  }
                  ${
                    isAnswerCorrect === null
                      ? "hover:shadow-md active:scale-[0.99]"
                      : ""
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(
                      65 + currentQuestion.options.indexOf(option),
                    )}
                  </div>
                  <span>{renderTextWithCodeHighlights(option)}</span>

                  {isAnswerCorrect !== null &&
                    option === currentQuestion.answer && (
                      <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                    )}
                  {isAnswerCorrect !== null &&
                    option === selectedAnswer &&
                    option !== currentQuestion.answer && (
                      <XCircle className="ml-auto h-5 w-5 text-red-500" />
                    )}
                </div>

                {isAnswerCorrect !== null &&
                  option === currentQuestion.answer && (
                    <div className="absolute bottom-0 left-0 h-1 bg-green-500 w-full"></div>
                  )}
                {isAnswerCorrect !== null &&
                  option === selectedAnswer &&
                  option !== currentQuestion.answer && (
                    <div className="absolute bottom-0 left-0 h-1 bg-red-500 w-full"></div>
                  )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2 mt-4">
        <AlertTriangle className="h-4 w-4" />
        <span>Select an answer before the timer runs out</span>
      </div>

      {/* {isAnswerCorrect !== null && (
        <Alert
          variant={isAnswerCorrect ? 'default' : 'destructive'}
          className="mt-4"
        >
          <div className="flex items-center gap-2">
            {isAnswerCorrect ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {isAnswerCorrect ? 'Correct!' : 'Incorrect'}
            </AlertTitle>
          </div>
          <AlertDescription>
            {isAnswerCorrect
              ? 'Great job! Moving to the next question...'
              : `The correct answer is: ${renderTextWithCodeHighlights(
                  currentQuestion.answer
                )}`}
          </AlertDescription>
        </Alert>
      )} */}
    </div>
  );
}
