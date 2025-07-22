import type { Skill } from "./types";

export const skills: Skill[] = [
  { id: "html", name: "HTML", level: "basic" },
  { id: "css", name: "CSS", level: "basic" }, // depends on HTML
  { id: "javascript", name: "JavaScript", level: "intermediate" }, // depends on HTML, CSS
  { id: "nodejs", name: "Node.js", level: "intermediate" }, // depends on JavaScript
  { id: "express", name: "Express.js", level: "advanced" }, // depends on Node.js
  { id: "mongodb", name: "MongoDB", level: "intermediate" }, // depends on JavaScript
  { id: "react", name: "React.js", level: "advanced" }, // depends on HTML, CSS, JS
  { id: "java", name: "Java", level: "basic" }, // no prerequisites
  { id: "golang", name: "Go", level: "basic" }, // no prerequisites
  { id: "flutter", name: "Flutter", level: "advanced" }, // depends on HTML, CSS, JS
  { id: "dsa", name: "Data Structures & Algorithms", level: "basic" }, // no prerequisites
  { id: "python", name: "Python", level: "basic" }, // no prerequisites
  { id: "honojs", name: "Hono.js", level: "advanced" }, // depends on JavaScript, Node.js
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
  honojs: ["javascript", "hello"],
};
