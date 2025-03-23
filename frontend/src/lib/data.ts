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




export const quizData = {
  questions: [
    {
      question: "What does HTML stand for?",
      options: [
        "A. Hyper Text Markup Language",
        "B. High Tech Machine Language",
        "C. Hyperlink and Text Management Language",
        "D. Home Tool Markup Language",
      ],
      answer: "A. Hyper Text Markup Language",
    },
    {
      question: "Which CSS property is used to control the text size?",
      options: ["A. font-style", "B. text-size", "C. font-size", "D. text-style"],
      answer: "C. font-size",
    },
    {
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["A. Number", "B. String", "C. Boolean", "D. Character"],
      answer: "D. Character",
    },
    {
      question: "What will be the output of the following HTML code: `<p>Hello <b>World</b>!</p>`?",
      options: [
        "A. Hello World!",
        "B. Hello <b>World</b>!",
        "C. Hello <strong>World</strong>!",
        "D. <b>Hello World!</b>",
      ],
      answer: "A. Hello World!",
    },
    {
      question: "What will be the output of the following JavaScript code: `console.log(2 + '2');`?",
      options: ["A. 4", "B. 22", "C. Error", "D. NaN"],
      answer: "B. 22",
    },
    {
      question: "What CSS selector targets all paragraph elements?",
      options: ["A. .paragraph", "B. #paragraph", "C. p", "D. element.paragraph"],
      answer: "C. p",
    },
    {
      question: "You have a button element that's not responding to click events. What is a potential cause?",
      options: [
        "A. The button element has a z-index of 0.",
        "B. The button element is disabled.",
        "C. The button element's parent element has `overflow: hidden`.",
        "D. All of the above.",
      ],
      answer: "B. The button element is disabled.",
    },
    {
      question:
        "Your JavaScript code is throwing a 'TypeError: Cannot read property 'value' of null'. What does this likely mean?",
      options: [
        "A. You're trying to access a property of a string that is null.",
        "B. You're trying to access a property of an object that is null.",
        "C. You're trying to access a property of a DOM element that does not exist.",
        "D. All of the above are possible.",
      ],
      answer: "C. You're trying to access a property of a DOM element that does not exist.",
    },
    {
      question:
        "You need to create a responsive image that adapts to different screen sizes. Which HTML element and attribute combination is best suited?",
      options: [
        "A. `<img src='image.jpg' width='100%'>`",
        "B. `<image src='image.jpg' style='max-width: 100%; height: auto;'>`",
        "C. `<picture><source srcset='image-small.jpg' media='(max-width: 600px)'><img src='image-large.jpg'></picture>`",
        "D. `<img>` element with a media query in CSS.",
      ],
      answer:
        "C. `<picture><source srcset='image-small.jpg' media='(max-width: 600px)'><img src='image-large.jpg'></picture>`",
    },
    {
      question:
        "You want to dynamically add a class 'active' to an HTML element when a button is clicked. Which JavaScript code snippet achieves this?",
      options: [
        "A. `document.getElementById('myButton').onclick = function() { this.classList.add('active'); }`",
        "B. `document.getElementById('myButton').addEventListener('click', function() { this.className += ' active'; });`",
        "C. `document.getElementById('myButton').addEventListener('click', function() { this.classList.add('active'); });`",
        "D. All of the above can work but B is less optimal.",
      ],
      answer:
        "C. `document.getElementById('myButton').addEventListener('click', function() { this.classList.add('active'); });`",
    },
  ],
}

