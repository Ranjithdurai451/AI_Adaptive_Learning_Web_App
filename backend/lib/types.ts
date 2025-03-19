

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



export interface VideoData {
  videoId: string;
  title: string;
  url: string;
  publishedAt: string;
  likes: string;
  views: string;
  duration: string;
}

export interface VideoResult {
  video: VideoData;
}

export interface VideoError {
  error: string;
}

// export interface TopicVideoMap {
//   [topic: string]: {
//     [subtopic: string]: VideoResult | VideoError;
//   };
// }

export interface CombinedResponse extends LearningResource {
  videos: VideoData[] | VideoError[];
}

// Type definitions for the topic explanation
export interface ExampleCode {
  code: string;
  language: string;
  filename: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  example: ExampleCode;
  tips: string[];
}

export interface Resource {
  title: string;
  url: string;
}




// export interface SectionVideoMap {
//   [sectionTitle: string]: VideoResult | VideoError;
// }