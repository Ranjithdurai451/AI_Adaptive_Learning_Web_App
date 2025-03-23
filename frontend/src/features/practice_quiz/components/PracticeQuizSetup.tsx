"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ArrowRight, Brain, Zap, Flame, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skill } from "@/lib/types"
import { prerequisites, skills } from "@/lib/data"



interface PracticeQuizSetupProps {
  onStart: (questions: number, level: string, topics: string[]) => void
  onBack: () => void
  mainTopic: string // Add mainTopic from params
}

export default function PracticeQuizSetup({ onStart, onBack, mainTopic }: PracticeQuizSetupProps) {
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState("medium")
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [showTopicError, setShowTopicError] = useState(false)
  const [availableTopics, setAvailableTopics] = useState<Skill[]>([])

  useEffect(() => {
    // Initialize selected topics with main topic
    setSelectedTopics([mainTopic])
    
    // Get prerequisites for the main topic if any
    const prereqs = prerequisites[mainTopic] || []
    
    // Create available topics array including main topic and its prerequisites
    if (prereqs.length > 0) {
      // Filter skills to only include main topic and its prerequisites
      const topicsToShow = skills.filter(skill => 
        skill.id === mainTopic || prereqs.includes(skill.id)
      )
      setAvailableTopics(topicsToShow)
    } else {
      // If no prerequisites, just show the main topic
      const mainSkill = skills.find(skill => skill.id === mainTopic)
      setAvailableTopics(mainSkill ? [mainSkill] : [])
    }
  }, [mainTopic])

  const handleTopicChange = (topicId: string, checked: boolean) => {
    setShowTopicError(false)
    
    if (checked) {
      setSelectedTopics([...selectedTopics, topicId])
    } else {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId))
    }
  }

  const handleStartQuiz = () => {
    if (selectedTopics.length === 0) {
      setShowTopicError(true)
      return
    }
    onStart(numQuestions, difficulty, selectedTopics)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Quiz Setup</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quiz Settings</CardTitle>
            <CardDescription>Configure your quiz experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Number of Questions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="questions" className="text-base font-medium">
                  Number of Questions
                </Label>
                <Badge variant="outline">{numQuestions}</Badge>
              </div>
              <Slider
                id="questions"
                min={1}
                max={30}
                step={1}
                value={[numQuestions]}
                onValueChange={(value) => setNumQuestions(value[0])}
                className="py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>15</span>
                <span>30</span>
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-base font-medium">
                Difficulty Level
              </Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty" className="w-full">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-green-500" />
                      <span>Easy</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hard">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-red-500" />
                      <span>Hard</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Topic Selection */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-medium">
                  Topics
                </Label>
                {prerequisites[mainTopic]?.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Main topic and its prerequisites are shown below
                  </p>
                )}
              </div>
              
              {showTopicError && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="ml-2 text-sm">
                    Please select at least one topic
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                {availableTopics.map((topic) => {
                  const isMainTopic = topic.id === mainTopic;
                  return (
                    <div
                      key={topic.id}
                      className={`flex items-center space-x-2 border rounded-lg p-3 transition-colors cursor-pointer ${
                        selectedTopics.includes(topic.id)
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:bg-slate-50 dark:hover:bg-slate-900/20"
                      } ${isMainTopic ? "relative overflow-hidden" : ""}`}
                      onClick={() => handleTopicChange(topic.id, !selectedTopics.includes(topic.id))}
                    >
                      {isMainTopic && (
                        <Badge 
                          className="absolute -right-8 top-0 rotate-45 transform px-6 py-1 text-xs bg-primary text-primary-foreground"
                        >
                          Main
                        </Badge>
                      )}
                      <Checkbox
                        id={`topic-${topic.id}`}
                        checked={selectedTopics.includes(topic.id)}
                        onCheckedChange={(checked) => handleTopicChange(topic.id, checked as boolean)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <div className="flex flex-col">
                        <label
                          htmlFor={`topic-${topic.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {topic.name}
                        </label>
                        {!isMainTopic && (
                          <span className="text-xs text-muted-foreground">Prerequisite</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex justify-between gap-4">
              <Button variant="outline" onClick={onBack} className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                className="flex-1 flex items-center justify-center group"
                onClick={handleStartQuiz}
              >
                Start Quiz
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}