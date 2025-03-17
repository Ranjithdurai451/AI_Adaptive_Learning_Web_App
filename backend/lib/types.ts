type Example = {
  code: string;
  language: string;
  filename: string;
};

type Section = {
  id: string;
  title: string;
  content: string;
  example: Example;
  tips: string[];
};

type Resource = {
  title: string;
  url: string;
};

export type LearningResource = {
  id: string;
  skillId: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  estimatedReadingTime: string;
  lastUpdated: string;
  author: string;
  sections: Section[];
  resources: Resource[];
};

