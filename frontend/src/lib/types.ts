export interface Skill {
  id: string
  name: string
  level: "basic" | "intermediate" | "advanced"
  icon?: string
}

export interface Quiz {
  skillId: string
  questions: {
    question: string
    options: string[]
    answer: string
  }[]
}
export type Questions = {
  question: string
  options: string[]
  answer: string
}[]

export interface VideoRecommendation {
  title: string
  creator: string
  duration: string
  likes: string
  views: string
  description: string
  language: string
  url: string
}

export interface Project {
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  skills: string[]
}

export interface Exercise {
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
}

export interface Roadmap {
  title: string
  skillId: string
  description: string
  prerequisites: string[]
  steps: {
    skillId: string;
    subTopics: string[]
    title: string
    description: string
  }[]
  projects: Project[]
}

export interface TopicExplanation {
  id: string
  skillId: string
  title: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  description: string
  sections: {
    title: string
    content: string
    example?: string
    tips?: string[]
  }[]
  resources?: string[]
}

