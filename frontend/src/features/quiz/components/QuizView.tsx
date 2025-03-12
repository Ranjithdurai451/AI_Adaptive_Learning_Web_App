'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import type { Questions } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router';
import { skills } from '@/lib/data';

interface QuizViewProps {
  skillName: string;
  Questions: Questions;
  onBack: () => void;
}

export default function QuizView({
  Questions,
  onBack,
  skillName,
}: QuizViewProps) {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>(
    Array(Questions.length).fill('')
  );
  const [showResults, setShowResults] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const currentQuestion = Questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / Questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);

    const isCorrect = selectedAnswer === currentQuestion.answer;
    setIsAnswerCorrect(isCorrect);

    setTimeout(() => {
      if (currentQuestionIndex < Questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
      } else {
        setShowResults(true);
      }
    }, 1000);
  };

  const calculateScore = () => {
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === Questions[index].answer) {
        correctCount++;
      }
    });
    return (correctCount / Questions.length) * 100;
  };

  const onComplete = (passed: boolean) => {
    navigate(`/roadmap?selectedSkill=${skillName}:score=${calculateScore()}`);
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <div className=" w-full h-full flex justify-center items-center">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>
              {passed
                ? 'Great job! You have the foundational knowledge needed.'
                : 'You might need to strengthen some foundational skills first.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{score.toFixed(0)}%</div>
              <p className="text-muted-foreground">
                {passed ? 'You passed!' : 'Keep learning and try again.'}
              </p>
            </div>

            <Progress value={score} className="h-3" />

            <div className="space-y-4 mt-6">
              {Questions.map((question, index) => {
                const isCorrect = answers[index] === question.answer;
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your answer: {answers[index]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Correct answer: {question.answer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Skills
            </Button>
            <Button onClick={() => onComplete(passed)}>
              Continue to Roadmap
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className=" w-full h-full flex justify-center items-center">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {Questions.length}
            </div>
          </div>
          <CardTitle className="mt-4">Knowledge Check: {skillName}</CardTitle>
          <CardDescription>
            Let's assess your foundational knowledge before creating your
            personalized roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} className="h-2" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>

            <RadioGroup
              value={selectedAnswer || ''}
              onValueChange={handleAnswerSelect}
            >
              {currentQuestion.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-1 py-2">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {isAnswerCorrect !== null && (
            <Alert variant={isAnswerCorrect ? 'default' : 'destructive'}>
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
                  : `The correct answer is: ${currentQuestion.answer}`}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null || isAnswerCorrect !== null}
          >
            {currentQuestionIndex < Questions.length - 1
              ? 'Next Question'
              : 'Finish Quiz'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
