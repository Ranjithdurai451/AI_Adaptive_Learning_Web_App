import type { Roadmap, Skill } from "./types";

export const skills: Skill[] = [
  { id: "html", name: "HTML", level: "basic" },
  { id: "css", name: "CSS", level: "basic" },
  { id: "javascript", name: "JavaScript", level: "intermediate" },
  { id: "node", name: "Node.js", level: "intermediate" },
  { id: "express", name: "Express", level: "advanced" },
  { id: "mongodb", name: "MongoDB", level: "advanced" },
  { id: "react", name: "React", level: "advanced" },
  { id: "javascript", name: "JavaScript", level: "intermediate" },
  { id: "node", name: "Node.js", level: "intermediate" },
  { id: "express", name: "Express", level: "advanced" },
  { id: "mongodb", name: "MongoDB", level: "advanced" },
  { id: "react", name: "React", level: "advanced" },
  { id: "javascript", name: "JavaScript", level: "intermediate" },
  { id: "node", name: "Node.js", level: "intermediate" },
  { id: "express", name: "Express", level: "advanced" },
  { id: "mongodb", name: "MongoDB", level: "advanced" },
  { id: "react", name: "React", level: "advanced" },
  { id: "go", name: "Go", level: "advanced" },
];

export const prerequisites: { [key: string]: string[] } = {
  html: [],
  css: ["html"],
  javascript: ["html", "css"],
  node: ["javascript"],
  express: ["node"],
  mongodb: ["databases", "json"],
  react: ["javascript", "css"],
};

export const roadmaps: Roadmap = {
  title: "React Mastery: From Novice to Expert",
  skillId: "react",
  description:
    "This roadmap is designed to guide you from the very basics of React to advanced concepts, equipping you with the skills to build complex and performant web applications. It covers everything from setting up your environment and understanding JSX to managing state with Redux and optimizing performance. Follow this path diligently, practice regularly, and you'll become a proficient React developer. Remember consistent effort and hands-on experience are key to mastering React.",
  prerequisites: [
    "HTML",
    "CSS",
    "JavaScript (ES6+)",
    "Basic understanding of DOM",
  ],
  steps: [
    {
      skillId: "react-fundamentals",
      title: "React Fundamentals",
      description:
        "Understanding the core concepts of React is crucial for building a strong foundation.",
      subTopics: [
        "Introduction to React",
        "Setting up a React environment (Create React App, Vite)",
        "JSX syntax",
        "Components (Functional and Class)",
        "Props",
        "State",
        "Event Handling",
        "Conditional Rendering",
        "Lists and Keys",
        "React Fragments",
      ],
    },
    {
      skillId: "react-hooks",
      title: "React Hooks",
      description:
        "Hooks allow you to use state and other React features without writing a class.",
      subTopics: [
        "useState Hook",
        "useEffect Hook",
        "useContext Hook",
        "useReducer Hook",
        "useRef Hook",
        "useMemo Hook",
        "useCallback Hook",
        "Custom Hooks",
      ],
    },
    {
      skillId: "react-state-management",
      title: "State Management",
      description:
        "Managing application state efficiently is vital for complex applications.",
      subTopics: [
        "Context API",
        "Redux (Redux Toolkit)",
        "MobX",
        "Recoil",
        "Zustand",
      ],
    },
    {
      skillId: "react-routing",
      title: "React Routing",
      description:
        "Implementing navigation and routing in your React application.",
      subTopics: [
        "React Router DOM",
        "Single Page Application (SPA) concepts",
        "Route parameters",
        "Nested routes",
        "Programmatic navigation",
        "Lazy loading routes",
      ],
    },
    {
      skillId: "react-form-handling",
      title: "Form Handling",
      description: "Working with forms in React applications.",
      subTopics: [
        "Controlled components",
        "Uncontrolled components",
        "Form validation",
        "Handling form submission",
        "Form libraries (Formik, React Hook Form)",
      ],
    },
    {
      skillId: "react-api-integration",
      title: "API Integration",
      description:
        "Fetching and interacting with APIs from your React application.",
      subTopics: [
        "Fetch API",
        "Axios",
        "Handling API responses",
        "Error handling",
        "Data transformation",
        "Using environment variables for API keys",
      ],
    },
    {
      skillId: "react-testing",
      title: "Testing React Components",
      description:
        "Ensuring the reliability and quality of your React code through testing.",
      subTopics: [
        "Unit Testing (Jest, Mocha)",
        "Integration Testing (React Testing Library)",
        "End-to-End Testing (Cypress, Selenium)",
        "Test-Driven Development (TDD)",
        "Mocking API calls",
      ],
    },
    {
      skillId: "react-performance-optimization",
      title: "Performance Optimization",
      description:
        "Techniques to improve the performance of your React applications.",
      subTopics: [
        "Code splitting",
        "Lazy loading",
        "Memoization (useMemo, useCallback, React.memo)",
        "Virtualization (react-window, react-virtualized)",
        "Profiling tools (React Profiler)",
        "Optimizing images and assets",
        "Server-Side Rendering (SSR) and Next.js",
      ],
    },
    {
      skillId: "react-advanced-concepts",
      title: "Advanced React Concepts",
      description:
        "Delving into more complex and nuanced aspects of React development.",
      subTopics: [
        "Higher-Order Components (HOCs)",
        "Render Props",
        "Context Providers",
        "Portals",
        "Error Boundaries",
        "Concurrent Mode",
        "Suspense",
      ],
    },
    {
      skillId: "react-tooling-ecosystem",
      title: "React Tooling and Ecosystem",
      description:
        "Familiarizing yourself with the broader ecosystem of tools and libraries available to React developers.",
      subTopics: [
        "Component Libraries (Material-UI, Ant Design, Chakra UI)",
        "State Management Libraries (Redux, MobX, Recoil)",
        "Form Libraries (Formik, React Hook Form)",
        "Animation Libraries (Framer Motion, React Spring)",
        "Build Tools (Webpack, Parcel, Rollup)",
        "Linting and Formatting (ESLint, Prettier)",
        "Type Checking (TypeScript)",
      ],
    },
  ],
  projects: [
    {
      title: "Simple To-Do App",
      description: "A basic application for managing a list of tasks.",
      difficulty: "Beginner",
      skills: [
        "React Fundamentals",
        "JSX",
        "Components",
        "State",
        "Event Handling",
      ],
    },
    {
      title: "Weather App",
      description: "Fetch weather data from an API and display it.",
      difficulty: "Intermediate",
      skills: [
        "React Fundamentals",
        "React Hooks",
        "API Integration",
        "State Management",
      ],
    },
    {
      title: "E-commerce Product Listing",
      description:
        "Display a list of products with filtering and sorting options.",
      difficulty: "Intermediate",
      skills: [
        "React Fundamentals",
        "React Hooks",
        "API Integration",
        "State Management",
        "Conditional Rendering",
      ],
    },
    {
      title: "Blog Application with Authentication",
      description:
        "A full-fledged blog application with user authentication and CRUD operations.",
      difficulty: "Advanced",
      skills: [
        "React Fundamentals",
        "React Hooks",
        "State Management (Redux or Context)",
        "React Routing",
        "API Integration",
        "Form Handling",
        "Authentication",
      ],
    },
  ],
};

// Topic explanations for detailed learning
