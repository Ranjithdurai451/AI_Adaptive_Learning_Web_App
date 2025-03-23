
import { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import PracticeQuizContent from "../components/PracticeQuizContent"
import PracticeQuizSetup from "../components/PracticeQuizSetup"
import PracticeQuizResults from "../components/PracticeQuizResults"
import { useNavigate, useSearchParams } from "react-router"
import { practiceQuiz } from "@/lib/actions"
import Loader from "@/Layouts/Root/components/Loader"
import { ArrowLeft } from "lucide-react"

export default function PracticeQuizLayout() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic") || "";
  const topicScore = searchParams.get("score") || 0;
  const preferredLanguage = searchParams.get('preferredLanguage') || '';
  const [step, setStep] = useState<"welcome" | "setup" | "quiz" | "results">("setup")
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState("medium")
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([])
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<{ question: string; userAnswer: string; correctAnswer: string }[]>([])

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("quizState")
    if (savedState) {
      try {
        const { step, numQuestions, difficulty, currentQuestions, score, answers, selectedTopics } = JSON.parse(savedState)
        setStep(step)
        setNumQuestions(numQuestions)
        setDifficulty(difficulty)
        setCurrentQuestions(currentQuestions)
        setScore(score)
        setSelectedTopics(selectedTopics)
        setAnswers(answers || [])

        if (step === "quiz") {
          toast("Quiz Resumed", {
            description: "Your previous quiz session has been restored.",
          })
        }
      } catch (e) {
        console.error("Error loading saved state:", e)
        localStorage.removeItem("quizState")
      }
    }
  }, [])

  // Save state to localStorage
  useEffect(() => {
    if (step !== "welcome") {
      localStorage.setItem(
        "quizState",
        JSON.stringify({
          step,
          numQuestions,
          difficulty,
          currentQuestions,
          score,
          answers,
          selectedTopics
        }),
      )
    } else {
      localStorage.removeItem("quizState")
    }
  }, [step, numQuestions, difficulty, currentQuestions, score, answers, selectedTopics])



  const handleStartQuiz = async (questions: number, level: string, topics: string[]) => {
    setIsLoading(true)

    const selectedQuestions = await practiceQuiz(topics.join(','), questions, level)

    setNumQuestions(questions)
    setDifficulty(level)
    setSelectedTopics(topics);
    setCurrentQuestions(selectedQuestions.questions)
    setAnswers([])
    setScore(0)
    setStep("quiz")
  }
  useEffect(() => {
    if (currentQuestions.length > 0) {
      setIsLoading(false);
    }
  }, [currentQuestions])

  const handleQuizComplete = (
    finalScore: number,
    questionAnswers: { question: string; userAnswer: string; correctAnswer: string }[],
  ) => {
    setScore(finalScore)
    setAnswers(questionAnswers)
    setStep("results")

    // Show toast based on score
    const percentage = Math.round((finalScore / currentQuestions.length) * 100)
    if (percentage >= 80) {
      toast("Excellent work! 🎉", {
        description: `You scored ${finalScore} out of ${currentQuestions.length}!`,
      })
    } else if (percentage >= 60) {
      toast("Good job! 👍", {
        description: `You scored ${finalScore} out of ${currentQuestions.length}!`,
      })
    } else {
      toast("Keep practicing! 💪", {
        description: `You scored ${finalScore} out of ${currentQuestions.length}!`,
      })
    }
  }

  const handleReset = () => {
    setStep("setup")
    setScore(0)
    setCurrentQuestions([])
    setAnswers([])
    setSelectedTopics([]);
    localStorage.removeItem("quizState")
  }

  const onBack = () => {
    navigate(`/roadmap?selectedSkill=${topic}&score=${topicScore}&preferredLanguage=${preferredLanguage}`);
  };
  if (isLoading) {
    return <Loader text={" Preparing a Quiz for you"} />
  }

  return (
    <div className="h-full flex flex-col bg-background transition-colors duration-300">

      <div className="w-full flex items-center justify-between px-4 py-2 border-b border-border">
        <button
          onClick={onBack}
          className="gap-2 flex justify-center items-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>
      <main className="flex-1 flex flex-col">
        {step === "setup" && <PracticeQuizSetup onStart={handleStartQuiz} onBack={handleReset} mainTopic={topic} />}
        {step === "quiz" && <PracticeQuizContent questions={currentQuestions} onComplete={handleQuizComplete} />}
        {step === "results" && (
          <PracticeQuizResults
            score={score}
            totalQuestions={currentQuestions.length}
            answers={answers}
            difficulty={difficulty}
            onReset={handleReset}
            onTryAgain={() => handleStartQuiz(numQuestions, difficulty, selectedTopics)}
          />
        )}
      </main>
      <Toaster />
    </div>
  )
}
