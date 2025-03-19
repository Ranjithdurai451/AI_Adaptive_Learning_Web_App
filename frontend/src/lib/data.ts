import type { Skill } from "./types";

export const skills: Skill[] = [
  { id: "html", name: "HTML", level: "basic" },
  { id: "css", name: "CSS", level: "basic" },
  { id: "javascript", name: "JavaScript", level: "intermediate" },
  { id: "nodejs", name: "Node.js", level: "intermediate" },
  { id: "express", name: "Express.js", level: "advanced" },
  { id: "mongodb", name: "MongoDB", level: "advanced" },
  { id: "react", name: "React.js", level: "advanced" },
  { id: "java", name: "Java", level: "advanced" },
  { id: "golang", name: "Go", level: "intermediate" },
  { id: "flutter", name: "Flutter", level: "advanced" },
  { id: "dsa", name: "Data Structures & Algorithms", level: "advanced" },
  { id: "python", name: "Python", level: "advanced" },
  { id: "honojs", name: "Hono.js", level: "advanced" }
];

// Update prerequisites to include all skills with proper IDs
export const prerequisites: Record<string, string[]> = {
  html: [],
  css: ["html"],
  javascript: ["html", "css"],
  nodejs: ["javascript"],
  express: ["nodejs"],
  mongodb: ["javascript"],
  react: ["html", "css", "javascript"],
  java: [],
  golang: [],
  flutter: ["html", "css", "javascript"],
  dsa: [],
  python: [],
  honojs: ["javascript", "nodejs"]
};



