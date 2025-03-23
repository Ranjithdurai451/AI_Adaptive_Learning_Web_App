"use client"

import { useState, useEffect, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, Award, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { toast } from "sonner"

interface PracticeQuizContentProps {
  questions: any[]
  onComplete: (score: number, answers: { question: string; userAnswer: string; correctAnswer: string }[]) => void
}

export default function PracticeQuizContent({ questions, onComplete }: PracticeQuizContentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds per question
  const [timerActive, setTimerActive] = useState(true)
  const [answers, setAnswers] = useState<{ question: string; userAnswer: string; correctAnswer: string }[]>([])
  const [timeWarning, setTimeWarning] = useState(false)
  const timerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!timerActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 10 && prev > 5 && !timeWarning) {
          setTimeWarning(true)
          // Shake the timer
          timerRef.current?.classList.add("animate-shake")
          setTimeout(() => {
            timerRef.current?.classList.remove("animate-shake")
          }, 500)
        }

        if (prev <= 5) {
          // Pulse the timer in red
          timerRef.current?.classList.add("animate-pulse")
        }

        if (prev <= 1) {
          clearInterval(timer)
          if (!showResult) {
            handleAnswer("")
            toast("Time's up!", {
              description: "You ran out of time for this question.",
            })
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      setTimeWarning(false)
      timerRef.current?.classList.remove("animate-pulse", "animate-shake")
    }
  }, [timerActive, showResult])

  useEffect(() => {
    setTimeLeft(30)
    setTimerActive(true)
    setTimeWarning(false)
  }, [currentQuestion])

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setTimerActive(false)
    setShowResult(true)

    // Check if answer is correct
    const isCorrect = answer === questions[currentQuestion].answer
    if (isCorrect) {
      setScore(score + 1)
      toast("Correct!", {
        description: "Great job! You got it right.",
      })
    } else {
      toast("Incorrect", {
        description: "The correct answer was: " + questions[currentQuestion].answer.split(". ")[1],
      })
    }

    // Save the answer
    setAnswers([
      ...answers,
      {
        question: questions[currentQuestion].question,
        userAnswer: answer,
        correctAnswer: questions[currentQuestion].answer,
      },
    ])

    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer("")
        setShowResult(false)
      } else {
        const finalAnswers = [
          ...answers,
          {
            question: questions[currentQuestion].question,
            userAnswer: answer,
            correctAnswer: questions[currentQuestion].answer,
          },
        ]
        onComplete(score + (isCorrect ? 1 : 0), finalAnswers)
      }
    }, 1500)
  }

  const question = questions[currentQuestion]
  const options = question.options.map((option: string) => {
    const value = option.split(". ")[0]
    const text = option.split(". ")[1]
    return { value: option, label: text, prefix: value }
  })

  // Calculate progress percentage
  const progressPercentage = (currentQuestion / questions.length) * 100

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-2xl mx-auto w-full">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="px-2 py-1">
            Question {currentQuestion + 1}/{questions.length}
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

        <Progress value={progressPercentage} className="h-2" />

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Progress: {Math.round(progressPercentage)}%</span>
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
          <CardTitle className="text-lg">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-3">
            {options.map((option: any) => (
              <button
                key={option.value}
                onClick={() => !showResult && handleAnswer(option.value)}
                disabled={showResult}
                className={`
                  p-4 rounded-lg border text-left transition-all relative overflow-hidden
                  ${
                    showResult && option.value === question.answer
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : showResult && option.value === selectedAnswer && option.value !== question.answer
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                        : "border-input hover:border-primary/50 hover:bg-muted/50"
                  }
                  ${!showResult ? "hover:shadow-md active:scale-[0.99]" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {option.prefix}
                  </div>
                  <span>{option.label}</span>

                  {showResult && option.value === question.answer && (
                    <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                  )}
                  {showResult && option.value === selectedAnswer && option.value !== question.answer && (
                    <XCircle className="ml-auto h-5 w-5 text-red-500" />
                  )}
                </div>

                {showResult && option.value === question.answer && (
                  <div className="absolute bottom-0 left-0 h-1 bg-green-500 w-full"></div>
                )}
                {showResult && option.value === selectedAnswer && option.value !== question.answer && (
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
    </div>
  )
}