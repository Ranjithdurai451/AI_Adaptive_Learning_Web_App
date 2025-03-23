
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Share2, Trophy, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { triggerConfetti } from "@/lib/utils"

interface PracticeQuizResultsProps {
  score: number
  totalQuestions: number
  answers: { question: string; userAnswer: string; correctAnswer: string }[]
  difficulty: string
  onReset: () => void
  onTryAgain: () => void
}

export default function PracticeQuizResults({
  score,
  totalQuestions,
  answers,
  difficulty,
  onReset,
  onTryAgain,
}: PracticeQuizResultsProps) {
  const [activeTab, setActiveTab] = useState("summary")

  useEffect(() => {
    if (score / totalQuestions >= 0.7) {
      triggerConfetti()
    }
  }, [score, totalQuestions])

  const percentage = Math.round((score / totalQuestions) * 100)

  let message = ""
  let emoji = ""

  if (percentage >= 90) {
    message = "Outstanding! You're a web development expert!"
    emoji = "🏆"
  } else if (percentage >= 70) {
    message = "Great job! You have solid web development knowledge!"
    emoji = "🎉"
  } else if (percentage >= 50) {
    message = "Good effort! Keep learning and practicing!"
    emoji = "👍"
  } else {
    message = "Keep studying! You'll improve with practice."
    emoji = "📚"
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Quiz Results",
          text: `I scored ${score} out of ${totalQuestions} (${percentage}%) on the Web Dev Quiz!`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(`I scored ${score} out of ${totalQuestions} (${percentage}%) on the Web Dev Quiz!`)
        .then(() => {
          alert("Result copied to clipboard!")
        })
        .catch((error) => console.log("Error copying to clipboard", error))
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Quiz Complete!</h1>
          <p className="text-muted-foreground">Here's how you did</p>
        </div>

        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
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
                          ${percentage >= 70 ? "text-green-500" : percentage >= 50 ? "text-yellow-500" : "text-red-500"}
                        `}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{percentage}%</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="text-4xl">{emoji}</div>
                    <h2 className="text-xl font-semibold">{message}</h2>
                    <p className="text-muted-foreground">
                      You scored {score} out of {totalQuestions} questions correctly.
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                      <Badge variant="outline" className="capitalize">
                        {difficulty} level
                      </Badge>
                      <Badge variant="secondary">{totalQuestions} questions</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div
                    className={`border rounded-lg p-3 text-center ${percentage >= 50 ? "border-primary/50 bg-primary/5" : "opacity-50"}`}
                  >
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-xs font-medium">Beginner</div>
                  </div>
                  <div
                    className={`border rounded-lg p-3 text-center ${percentage >= 70 ? "border-primary/50 bg-primary/5" : "opacity-50"}`}
                  >
                    <div className="text-2xl mb-1">⭐</div>
                    <div className="text-xs font-medium">Intermediate</div>
                  </div>
                  <div
                    className={`border rounded-lg p-3 text-center ${percentage >= 90 ? "border-primary/50 bg-primary/5" : "opacity-50"}`}
                  >
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-xs font-medium">Expert</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" className="flex items-center justify-center gap-2" onClick={onTryAgain}>
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                  </Button>
                  {/* <Button className="flex items-center justify-center gap-2" onClick={handleShare}> */}
                  {/*   <Share2 className="h-4 w-4" /> */}
                  {/*   Share Result */}
                  {/* </Button> */}
                  <Button className="flex items-center gap-2" onClick={onReset}>
                    <Trophy className="h-4 w-4" />
                    New Quiz
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
                    const isCorrect = answer.userAnswer === answer.correctAnswer
                    const userAnswerText = answer.userAnswer ? answer.userAnswer.split(". ")[1] : "No answer"
                    const correctAnswerText = answer.correctAnswer.split(". ")[1]

                    return (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <div
                              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                            >
                              {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            </div>
                            <span className="text-sm font-medium truncate max-w-[250px] sm:max-w-[350px]">
                              {answer.question}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-9">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">Your Answer:</div>
                              <div
                                className={`text-sm p-2 rounded ${isCorrect ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"}`}
                              >
                                {userAnswerText}
                              </div>
                            </div>

                            {!isCorrect && (
                              <div className="space-y-1">
                                <div className="text-sm font-medium">Correct Answer:</div>
                                <div className="text-sm p-2 rounded bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                                  {correctAnswerText}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setActiveTab("summary")} className="flex items-center gap-2">
                    Back to Summary
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" onClick={onReset}>
                    <Trophy className="h-4 w-4" />
                    New Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

