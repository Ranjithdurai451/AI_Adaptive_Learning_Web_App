
import type { Quiz, Roadmap, Skill, VideoRecommendation, TopicExplanation } from "./types"

export const skills: Skill[] = [
  { id: "html", name: "HTML", level: "basic" },
  { id: "css", name: "CSS", level: "basic" },
  { id: "javascript", name: "JavaScript", level: "intermediate" },
  { id: "react", name: "React", level: "advanced" },
  { id: "angular", name: "Angular", level: "advanced" },
  { id: "vue", name: "Vue.js", level: "advanced" },
  { id: "node", name: "Node.js", level: "advanced" },
  { id: "python", name: "Python", level: "intermediate" },
  { id: "java", name: "Java", level: "intermediate" },
  { id: "csharp", name: "C#", level: "intermediate" },
  { id: "sql", name: "SQL", level: "intermediate" },
  { id: "mongodb", name: "MongoDB", level: "intermediate" },
  { id: "typescript", name: "TypeScript", level: "advanced" },
  { id: "git", name: "Git", level: "basic" },
  { id: "docker", name: "Docker", level: "advanced" },
  { id: "aws", name: "AWS", level: "advanced" },
  { id: "graphql", name: "GraphQL", level: "advanced" },
  { id: "flutter", name: "Flutter", level: "advanced" },
  { id: "swift", name: "Swift", level: "intermediate" },
  { id: "kotlin", name: "Kotlin", level: "intermediate" },
]

const quizzes: Quiz[] = [
  {
    skillId: "react",
    questions: [
      {
        question: "What is HTML used for?",
        options: [
          "Styling web pages",
          "Creating the structure of web pages",
          "Adding interactivity to web pages",
          "Server-side programming",
        ],
        answer: "Creating the structure of web pages",
      },
      {
        question: "Which CSS property is used to change the text color?",
        options: ["color", "text-color", "font-color", "text-style"],
        answer: "color",
      },
      {
        question: "What does DOM stand for in JavaScript?",
        options: ["Document Object Model", "Data Object Model", "Document Oriented Model", "Digital Object Model"],
        answer: "Document Object Model",
      },
      {
        question: "Which of the following is NOT a JavaScript data type?",
        options: ["String", "Boolean", "Character", "Number"],
        answer: "Character",
      },
      {
        question: "What is the correct way to create a function in JavaScript?",
        options: [
          "function = myFunction() {}",
          "function myFunction() {}",
          "function:myFunction() {}",
          "create function myFunction() {}",
        ],
        answer: "function myFunction() {}",
      },
    ],
  },
  {
    skillId: "angular",
    questions: [
      {
        question: "What is the correct HTML element for the largest heading?",
        options: ["<h1>", "<heading>", "<head>", "<h6>"],
        answer: "<h1>",
      },
      {
        question: "Which CSS property controls the spacing between elements?",
        options: ["spacing", "margin", "padding", "border"],
        answer: "margin",
      },
      {
        question: "How do you declare a JavaScript variable?",
        options: ["v carName;", "variable carName;", "var carName;", "declare carName;"],
        answer: "var carName;",
      },
      {
        question: "What will the following code return: Boolean(10 > 9)",
        options: ["true", "false", "NaN", "undefined"],
        answer: "true",
      },
      {
        question: "How do you add a comment in JavaScript?",
        options: [
          "// This is a comment",
          "<!-- This is a comment -->",
          "/* This is a comment */",
          "# This is a comment",
        ],
        answer: "// This is a comment",
      },
    ],
  },
  {
    skillId: "vue",
    questions: [
      {
        question: "What does CSS stand for?",
        options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
        answer: "Cascading Style Sheets",
      },
      {
        question: "Which HTML attribute is used to define inline styles?",
        options: ["styles", "style", "css", "class"],
        answer: "style",
      },
      {
        question: "How do you create an array in JavaScript?",
        options: [
          'var colors = (1:"red", 2:"green", 3:"blue")',
          'var colors = ["red", "green", "blue"]',
          'var colors = "red", "green", "blue"',
          'var colors = {"red", "green", "blue"}',
        ],
        answer: 'var colors = ["red", "green", "blue"]',
      },
      {
        question: "Which event occurs when a user clicks on an HTML element?",
        options: ["onmouseover", "onchange", "onclick", "onmouseclick"],
        answer: "onclick",
      },
      {
        question: "How do you round the number 7.25 to the nearest integer in JavaScript?",
        options: ["Math.round(7.25)", "round(7.25)", "Math.rnd(7.25)", "rnd(7.25)"],
        answer: "Math.round(7.25)",
      },
    ],
  },
  {
    skillId: "node",
    questions: [
      {
        question: "What is the correct HTML for creating a hyperlink?",
        options: [
          '<a url="http://example.com">Example</a>',
          '<a href="http://example.com">Example</a>',
          '<hyperlink href="http://example.com">Example</hyperlink>',
          '<link="http://example.com">Example</link>',
        ],
        answer: '<a href="http://example.com">Example</a>',
      },
      {
        question: "Which CSS property is used to make text bold?",
        options: ["font-weight", "text-style", "font-style", "text-weight"],
        answer: "font-weight",
      },
      {
        question: "What is the correct way to write a JavaScript array?",
        options: [
          'var colors = "red", "green", "blue"',
          'var colors = ("red", "green", "blue")',
          'var colors = ["red", "green", "blue"]',
          'var colors = {"red", "green", "blue"}',
        ],
        answer: 'var colors = ["red", "green", "blue"]',
      },
      {
        question: "How do you find the number with the highest value of x and y?",
        options: ["Math.ceil(x, y)", "top(x, y)", "Math.max(x, y)", "Math.highest(x, y)"],
        answer: "Math.max(x, y)",
      },
      {
        question: "Which operator is used to assign a value to a variable?",
        options: ["=", "*", "-", "x"],
        answer: "=",
      },
    ],
  },
]

const roadmaps: Roadmap[] = [
  {
    skillId: "html",
    description:
      "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It defines the structure and content of web pages.",
    prerequisites: [],
    steps: [
      {
        title: "HTML Basics",
        description: "Learn the fundamental structure of HTML documents, tags, elements, and attributes.",
      },
      {
        title: "HTML Forms",
        description: "Master creating interactive forms with various input types and form validation.",
      },
      {
        title: "Semantic HTML",
        description: "Understand how to use semantic elements to improve accessibility and SEO.",
      },
      {
        title: "HTML5 Features",
        description: "Explore modern HTML5 features like audio, video, canvas, and local storage.",
      },
    ],
    projects: [
      {
        title: "Personal Portfolio",
        description: "Create a simple portfolio website showcasing your skills and projects.",
        difficulty: "Beginner",
        skills: ["HTML", "Basic CSS"],
      },
      {
        title: "Recipe Collection",
        description: "Build a website that displays various recipes with structured content.",
        difficulty: "Beginner",
        skills: ["HTML", "Lists", "Images"],
      },
    ],
    exercises: [
      {
        title: "Create a Registration Form",
        description: "Build a user registration form with various input types and validation.",
        difficulty: "Easy",
      },
      {
        title: "Build a Product Catalog",
        description: "Create a structured catalog of products using appropriate HTML elements.",
        difficulty: "Medium",
      },
      {
        title: "Implement a Blog Layout",
        description: "Design a blog layout with articles, comments, and navigation using semantic HTML.",
        difficulty: "Medium",
      },
    ],
  },
  {
    skillId: "react",
    description:
      "React is a JavaScript library for building user interfaces, particularly single-page applications. It's used for handling the view layer and allows you to create reusable UI components.",
    prerequisites: ["HTML", "CSS", "JavaScript"],
    steps: [
      {
        title: "React Fundamentals",
        description: "Learn the core concepts of React including components, JSX, and props.",
      },
      {
        title: "State Management",
        description: "Master React state, hooks, and context API for managing application state.",
      },
      {
        title: "Routing in React",
        description: "Implement client-side routing using React Router for single-page applications.",
      },
      {
        title: "Advanced Patterns",
        description: "Explore advanced React patterns like render props, HOCs, and custom hooks.",
      },
      {
        title: "Performance Optimization",
        description: "Learn techniques to optimize React applications for better performance.",
      },
    ],
    projects: [
      {
        title: "Task Management App",
        description: "Build a todo application with features like adding, editing, and filtering tasks.",
        difficulty: "Intermediate",
        skills: ["React", "Hooks", "State Management"],
      },
      {
        title: "E-commerce Product Page",
        description: "Create a product page with image gallery, reviews, and add-to-cart functionality.",
        difficulty: "Intermediate",
        skills: ["React", "Context API", "CSS-in-JS"],
      },
      {
        title: "Social Media Dashboard",
        description: "Develop a dashboard that displays social media metrics and allows user interaction.",
        difficulty: "Advanced",
        skills: ["React", "Data Visualization", "API Integration"],
      },
    ],
    exercises: [
      {
        title: "Build a Counter Component",
        description: "Create a simple counter with increment and decrement functionality using hooks.",
        difficulty: "Easy",
      },
      {
        title: "Implement a Form with Validation",
        description: "Build a form with real-time validation using React state and conditional rendering.",
        difficulty: "Medium",
      },
      {
        title: "Create a Data Table with Sorting and Filtering",
        description: "Develop a table component that allows sorting and filtering of data.",
        difficulty: "Hard",
      },
    ],
  },
]

// Topic explanations for detailed learning
const topicExplanations: TopicExplanation[] = [
  {
    id: "html-structure",
    skillId: "html",
    title: "HTML Document Structure",
    difficulty: "Beginner",
    description:
      "Learn about the basic structure of an HTML document and how different elements work together to create a webpage.",
    sections: [
      {
        title: "Document Type Declaration",
        content:
          "Every HTML document begins with a DOCTYPE declaration that tells the browser which version of HTML the page is using. For HTML5, the declaration is simple: <!DOCTYPE html>",
        example:
          "<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Webpage</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>",
        tips: [
          "Always include the DOCTYPE declaration at the very beginning of your HTML document",
          "The DOCTYPE is case-insensitive, but lowercase is recommended for HTML5",
        ],
      },
      {
        title: "The <html> Element",
        content:
          "The <html> element is the root element of an HTML page. All other elements must be descendants of this element. It should include the lang attribute to specify the language of the document.",
        example: '<html lang="en">\n  <!-- All your content goes here -->\n</html>',
        tips: [
          "Always specify the language with the lang attribute for better accessibility",
          "The <html> element should contain exactly one <head> element and one <body> element",
        ],
      },
      {
        title: "The <head> Element",
        content:
          "The <head> element contains meta-information about the document, such as its title, character set, styles, scripts, and other meta information.",
        example:
          '<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Page Title</title>\n  <link rel="stylesheet" href="styles.css">\n</head>',
        tips: [
          "Always include a title element as it's required for valid HTML",
          "Use meta tags to provide information about your document to browsers and search engines",
          "The viewport meta tag is essential for responsive design",
        ],
      },
      {
        title: "The <body> Element",
        content:
          "The <body> element contains all the content that is visible to users, such as text, images, links, tables, lists, etc.",
        example:
          "<body>\n  <header>\n    <h1>Website Title</h1>\n    <nav><!-- Navigation links --></nav>\n  </header>\n  <main>\n    <article><!-- Main content --></article>\n  </main>\n  <footer><!-- Footer content --></footer>\n</body>",
        tips: [
          "Use semantic elements like <header>, <nav>, <main>, <article>, and <footer> to structure your content",
          "Proper structure helps with accessibility and SEO",
        ],
      },
    ],
    resources: ["MDN Web Docs: HTML Basics", "W3Schools: HTML Tutorial", "HTML5 Doctor: HTML5 Element Index"],
  },
  {
    id: "html-elements",
    skillId: "html",
    title: "HTML Elements and Tags",
    difficulty: "Beginner",
    description: "Understand the various HTML elements and tags used to structure and format content on a webpage.",
    sections: [
      {
        title: "Headings",
        content:
          "HTML provides six levels of headings, <h1> through <h6>, with <h1> being the highest (or most important) level and <h6> the lowest. Headings are used to structure your content hierarchically.",
        example: "<h1>Main Title</h1>\n<h2>Subtitle</h2>\n<h3>Section Title</h3>\n<h4>Subsection Title</h4>",
        tips: [
          "Use only one <h1> per page for proper document structure",
          "Don't skip heading levels (e.g., don't go from <h2> to <h4>)",
          "Headings help screen readers navigate your content, improving accessibility",
        ],
      },
      {
        title: "Paragraphs and Text Formatting",
        content:
          "The <p> element defines a paragraph. Text formatting elements like <strong>, <em>, <mark>, and <span> can be used to highlight or emphasize text within paragraphs.",
        example:
          '<p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>\n<p>You can also <mark>highlight text</mark> or use a <span style="color: blue;">span for styling</span>.</p>',
        tips: [
          "Use <strong> for important text (renders as bold) and <em> for emphasized text (renders as italic)",
          "Avoid using <b> and <i> as they don't convey semantic meaning",
          "The <span> element is useful for applying styles to specific portions of text",
        ],
      },
      {
        title: "Lists",
        content:
          "HTML offers three types of lists: ordered lists (<ol>), unordered lists (<ul>), and description lists (<dl>). List items are defined with the <li> element.",
        example:
          "<h3>Unordered List</h3>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n\n<h3>Ordered List</h3>\n<ol>\n  <li>First step</li>\n  <li>Second step</li>\n</ol>",
        tips: [
          "Use unordered lists when the order of items doesn't matter",
          "Use ordered lists when the sequence is important",
          "Lists can be nested inside other lists",
        ],
      },
      {
        title: "Links and Anchors",
        content:
          "The <a> (anchor) element creates hyperlinks to other web pages, files, locations within the same page, email addresses, or any other URL.",
        example:
          '<a href="https://example.com">Visit Example</a>\n<a href="#section-id">Jump to Section</a>\n<a href="mailto:info@example.com">Send Email</a>',
        tips: [
          "Always include descriptive text between the opening and closing tags",
          'Use the target="_blank" attribute to open links in a new tab',
          'When using target="_blank", add rel="noopener noreferrer" for security',
        ],
      },
    ],
    resources: ["MDN Web Docs: HTML Elements Reference", "HTML.com: HTML Cheat Sheet", "W3C HTML Specification"],
  },
  {
    id: "html-forms",
    skillId: "html",
    title: "HTML Forms and Input Elements",
    difficulty: "Intermediate",
    description:
      "Learn how to create interactive forms to collect user input using various form controls and input types.",
    sections: [
      {
        title: "Form Basics",
        content:
          "The <form> element is a container for different types of input elements. It specifies where and how to send the form data when submitted.",
        example:
          '<form action="/submit-form" method="post">\n  <!-- Form controls go here -->\n  <input type="submit" value="Submit">\n</form>',
        tips: [
          "The action attribute specifies where to send the form data when submitted",
          "The method attribute specifies the HTTP method to use (get or post)",
          "Use get for non-sensitive data and post for sensitive data or when changing data on the server",
        ],
      },
      {
        title: "Text Input Fields",
        content:
          "Text input fields allow users to enter text. There are several types of text inputs, including single-line text fields, password fields, and multi-line text areas.",
        example:
          '<label for="username">Username:</label>\n<input type="text" id="username" name="username" placeholder="Enter your username">\n\n<label for="password">Password:</label>\n<input type="password" id="password" name="password">\n\n<label for="message">Message:</label>\n<textarea id="message" name="message" rows="4" cols="50"></textarea>',
        tips: [
          "Always use the <label> element to associate a label with an input field",
          "The for attribute of the label should match the id of the input",
          "Use placeholder text to provide hints about the expected input",
        ],
      },
      {
        title: "Selection Elements",
        content:
          "Selection elements allow users to choose from predefined options. These include radio buttons, checkboxes, and dropdown lists.",
        example:
          '<h4>Radio Buttons</h4>\n<input type="radio" id="male" name="gender" value="male">\n<label for="male">Male</label>\n<input type="radio" id="female" name="gender" value="female">\n<label for="female">Female</label>\n\n<h4>Checkboxes</h4>\n<input type="checkbox" id="bike" name="vehicle" value="bike">\n<label for="bike">I have a bike</label>\n<input type="checkbox" id="car" name="vehicle" value="car">\n<label for="car">I have a car</label>\n\n<h4>Dropdown List</h4>\n<label for="country">Country:</label>\n<select id="country" name="country">\n  <option value="usa">USA</option>\n  <option value="canada">Canada</option>\n  <option value="uk">UK</option>\n</select>',
        tips: [
          "Radio buttons with the same name attribute form a group where only one can be selected",
          "Checkboxes allow multiple selections",
          "Use the selected attribute to preselect an option in a dropdown",
        ],
      },
      {
        title: "Form Validation",
        content:
          "HTML5 provides built-in form validation features that help ensure users enter the correct type of data before submitting a form.",
        example:
          '<input type="email" id="email" name="email" required>\n<input type="number" id="age" name="age" min="18" max="100">\n<input type="url" id="website" name="website" pattern="https://.*">',
        tips: [
          "Use the required attribute to make a field mandatory",
          "Input types like email, url, and number have built-in validation",
          "Use min, max, and pattern attributes for more specific validation rules",
          "For complex validation, you'll need JavaScript",
        ],
      },
    ],
    resources: ["MDN Web Docs: HTML Forms Guide", "W3Schools: HTML Forms Tutorial", "Web.dev: Form Best Practices"],
  },
  {
    id: "react-intro",
    skillId: "react",
    title: "Introduction to React",
    difficulty: "Intermediate",
    description:
      "Understand the core concepts of React, its benefits, and how it differs from traditional web development approaches.",
    sections: [
      {
        title: "What is React?",
        content:
          "React is a JavaScript library for building user interfaces, particularly single-page applications. It was developed by Facebook and is maintained by Facebook and a community of individual developers and companies. React allows developers to create large web applications that can change data without reloading the page.",
        example: "",
        tips: [
          "React is not a full framework like Angular; it's focused on the view layer",
          "React can be used with other libraries or frameworks",
          "React follows a component-based architecture",
        ],
      },
      {
        title: "Virtual DOM",
        content:
          "One of React's key features is the Virtual DOM. Instead of updating the browser's DOM directly, React creates a virtual representation of the DOM in memory and uses a diffing algorithm to determine the most efficient way to update the browser's DOM.",
        example: "",
        tips: [
          "The Virtual DOM makes React applications faster by minimizing direct DOM manipulations",
          "React only updates what's necessary, not the entire DOM",
          "This approach is more efficient than traditional DOM manipulation",
        ],
      },
      {
        title: "JSX",
        content:
          "JSX (JavaScript XML) is a syntax extension for JavaScript that looks similar to HTML. It allows you to write HTML-like code in your JavaScript files, making it easier to visualize the UI you're building.",
        example:
          "// JSX syntax\nconst element = <h1>Hello, world!</h1>;\n\n// Equivalent JavaScript without JSX\nconst element = React.createElement('h1', null, 'Hello, world!');",
        tips: [
          "JSX is not required for React, but it makes code more readable and easier to write",
          "JSX gets compiled to regular JavaScript by tools like Babel",
          "You can embed JavaScript expressions in JSX using curly braces {}",
        ],
      },
      {
        title: "Components",
        content:
          "Components are the building blocks of React applications. A component is a self-contained module that renders some output. There are two types of components: function components and class components.",
        example:
          "// Function component\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n\n// Class component\nclass Welcome extends React.Component {\n  render() {\n    return <h1>Hello, {this.props.name}</h1>;\n  }\n}",
        tips: [
          "Function components are simpler and now preferred with the introduction of Hooks",
          "Components should follow the Single Responsibility Principle",
          "Break down complex UIs into smaller, reusable components",
        ],
      },
    ],
    resources: [
      "React Official Documentation",
      "React Tutorial for Beginners",
      "Understanding React Component Lifecycle",
    ],
  },
  {
    id: "react-components",
    skillId: "react",
    title: "React Components and Props",
    difficulty: "Intermediate",
    description: "Learn how to create and compose React components, and how to pass data between them using props.",
    sections: [
      {
        title: "Component Types",
        content:
          "React components can be defined as function components or class components. Function components are simpler and, with the introduction of Hooks, can now handle state and side effects.",
        example:
          "// Function component\nfunction Greeting(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\n// Class component\nclass Greeting extends React.Component {\n  render() {\n    return <h1>Hello, {this.props.name}!</h1>;\n  }\n}",
        tips: [
          "Function components are now preferred over class components",
          "Class components are still useful for error boundaries and certain lifecycle methods",
          "Always start component names with a capital letter",
        ],
      },
      {
        title: "Props",
        content:
          "Props (short for properties) are how you pass data from a parent component to a child component. They are read-only and help make your components reusable.",
        example:
          '// Parent component\nfunction App() {\n  return <Greeting name="John" age={25} />;\n}\n\n// Child component\nfunction Greeting(props) {\n  return (\n    <div>\n      <h1>Hello, {props.name}!</h1>\n      <p>You are {props.age} years old.</p>\n    </div>\n  );\n}',
        tips: [
          "Props are immutable - a component cannot change its own props",
          "Use destructuring to make your code cleaner: function Greeting({ name, age }) { ... }",
          "You can pass any JavaScript value as a prop, including objects, arrays, and functions",
        ],
      },
      {
        title: "Children Props",
        content:
          "The children prop is a special prop that allows you to pass components as data to other components, enabling component composition.",
        example:
          '// Parent component\nfunction Card(props) {\n  return (\n    <div className="card">\n      {props.children}\n    </div>\n  );\n}\n\n// Usage\nfunction App() {\n  return (\n    <Card>\n      <h2>Title</h2>\n      <p>Content goes here</p>\n    </Card>\n  );\n}',
        tips: [
          "The children prop allows for flexible component composition",
          "It's useful for creating wrapper or layout components",
          "You can manipulate or filter children using React.Children utilities",
        ],
      },
      {
        title: "PropTypes",
        content:
          "PropTypes is a library that helps you catch bugs by validating the types of props passed to your components. It's especially useful in larger applications.",
        example:
          "import PropTypes from 'prop-types';\n\nfunction Greeting({ name, age }) {\n  return (\n    <div>\n      <h1>Hello, {name}!</h1>\n      <p>You are {age} years old.</p>\n    </div>\n  );\n}\n\nGreeting.propTypes = {\n  name: PropTypes.string.isRequired,\n  age: PropTypes.number\n};\n\nGreeting.defaultProps = {\n  age: 25\n};",
        tips: [
          "PropTypes are checked in development mode only",
          "Use defaultProps to specify default values for props",
          "Consider using TypeScript for more robust type checking",
        ],
      },
    ],
    resources: [
      "React Docs: Components and Props",
      "Understanding React PropTypes",
      "React Component Composition Patterns",
    ],
  },
  {
    id: "react-state",
    skillId: "react",
    title: "React State and Hooks",
    difficulty: "Intermediate",
    description: "Learn how to manage state in React components using hooks, and understand the component lifecycle.",
    sections: [
      {
        title: "Understanding State",
        content:
          "State is a JavaScript object that stores data that may change over time and affects the component's rendering. Unlike props, state is managed within the component.",
        example:
          "// Class component with state\nclass Counter extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { count: 0 };\n  }\n\n  render() {\n    return (\n      <div>\n        <p>Count: {this.state.count}</p>\n        <button onClick={() => this.setState({ count: this.state.count + 1 })}>\n          Increment\n        </button>\n      </div>\n    );\n  }\n}",
        tips: [
          "Never modify state directly; always use setState() in class components",
          "State updates may be asynchronous",
          "State updates are merged (shallow)",
        ],
      },
      {
        title: "useState Hook",
        content:
          "The useState hook allows function components to have state. It returns a stateful value and a function to update it.",
        example:
          "import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}",
        tips: [
          "You can call useState multiple times in a single component",
          "The initial state is only used during the first render",
          "If your state update depends on the previous state, use the functional form: setCount(prevCount => prevCount + 1)",
        ],
      },
      {
        title: "useEffect Hook",
        content:
          "The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in class components.",
        example:
          "import React, { useState, useEffect } from 'react';\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n\n  // Similar to componentDidMount and componentDidUpdate\n  useEffect(() => {\n    document.title = `You clicked ${count} times`;\n    \n    // Similar to componentWillUnmount\n    return () => {\n      document.title = 'React App';\n    };\n  }, [count]); // Only re-run if count changes\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}",
        tips: [
          "The second argument to useEffect is an array of dependencies",
          "An empty dependency array ([]) means the effect runs only once after the initial render",
          "Omitting the dependency array means the effect runs after every render",
          "The cleanup function (returned from useEffect) runs before the component unmounts or before the effect runs again",
        ],
      },
      {
        title: "Other Hooks",
        content:
          "React provides several other built-in hooks, such as useContext, useReducer, useCallback, useMemo, and useRef. You can also create custom hooks to reuse stateful logic between components.",
        example:
          "// useContext example\nimport React, { useContext } from 'react';\n\nconst ThemeContext = React.createContext('light');\n\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>Themed Button</button>;\n}\n\n// Custom hook example\nfunction useWindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  \n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n  \n  return width;\n}",
        tips: [
          "useContext provides a way to pass data through the component tree without manually passing props",
          "useReducer is an alternative to useState for complex state logic",
          "Custom hooks let you extract component logic into reusable functions",
        ],
      },
    ],
    resources: ["React Docs: Hooks at a Glance", "A Complete Guide to useEffect", "Building Your Own Hooks"],
  },
]

// Add more roadmaps for other skills as needed

export function getQuizForSkill(skillId: string): Quiz {
  return quizzes.find((quiz) => quiz.skillId === skillId) || quizzes[0]
}

export function getRoadmapForSkill(skillId: string): Roadmap {
  const roadmap = roadmaps.find((r) => r.skillId === skillId)

  if (roadmap) {
    return roadmap
  }

  // Return a generic roadmap if specific one not found
  return {
    skillId: skillId,
    description: `${skillId.charAt(0).toUpperCase() + skillId.slice(1)} is a popular technology in web development. This roadmap will guide you through learning it step by step.`,
    prerequisites: [],
    steps: [
      {
        title: "Fundamentals",
        description: `Learn the core concepts of ${skillId.charAt(0).toUpperCase() + skillId.slice(1)}.`,
      },
      {
        title: "Intermediate Concepts",
        description: "Deepen your understanding with more advanced topics.",
      },
      {
        title: "Advanced Techniques",
        description: "Master professional-level skills and best practices.",
      },
      {
        title: "Real-world Application",
        description: "Apply your knowledge to build production-ready applications.",
      },
    ],
    projects: [
      {
        title: "Beginner Project",
        description: `Build a simple application using ${skillId.charAt(0).toUpperCase() + skillId.slice(1)}.`,
        difficulty: "Beginner",
        skills: [skillId.charAt(0).toUpperCase() + skillId.slice(1)],
      },
      {
        title: "Intermediate Project",
        description: "Create a more complex application with multiple features.",
        difficulty: "Intermediate",
        skills: [skillId.charAt(0).toUpperCase() + skillId.slice(1), "Web Development"],
      },
    ],
    exercises: [
      {
        title: "Basic Exercise",
        description: `Practice the fundamentals of ${skillId.charAt(0).toUpperCase() + skillId.slice(1)}.`,
        difficulty: "Easy",
      },
      {
        title: "Intermediate Challenge",
        description: "Solve more complex problems to strengthen your skills.",
        difficulty: "Medium",
      },
      {
        title: "Advanced Problem",
        description: "Tackle difficult challenges that test your mastery.",
        difficulty: "Hard",
      },
    ],
  }
}

export function getVideoRecommendations(skillId: string, language: string): VideoRecommendation[] {
  // This would normally come from an API that analyzes YouTube videos
  // Here we're simulating with mock data

  const videos: VideoRecommendation[] = [
    {
      title: `Complete ${skillId.toUpperCase()} Tutorial for Beginners`,
      creator: "Tech Academy",
      duration: "2:15:30",
      likes: "45K",
      views: "1.2M",
      description: `A comprehensive guide to ${skillId.charAt(0).toUpperCase() + skillId.slice(1)} from the ground up. Perfect for beginners.`,
      language: "English",
      url: "#",
    },
    {
      title: `${skillId.charAt(0).toUpperCase() + skillId.slice(1)} Crash Course 2023`,
      creator: "Code Masters",
      duration: "1:45:20",
      likes: "32K",
      views: "890K",
      description: `Learn ${skillId.charAt(0).toUpperCase() + skillId.slice(1)} in just under 2 hours with this fast-paced, project-based tutorial.`,
      language: "English",
      url: "#",
    },
    {
      title: `Advanced ${skillId.charAt(0).toUpperCase() + skillId.slice(1)} Techniques`,
      creator: "Pro Coder",
      duration: "3:20:15",
      likes: "28K",
      views: "650K",
      description: `Take your ${skillId.charAt(0).toUpperCase() + skillId.slice(1)} skills to the next level with advanced concepts and patterns.`,
      language: "English",
      url: "#",
    },
    {
      title: `${skillId.charAt(0).toUpperCase() + skillId.slice(1)} for Job Interviews`,
      creator: "Tech Career Guide",
      duration: "1:10:45",
      likes: "19K",
      views: "420K",
      description: `Prepare for ${skillId.charAt(0).toUpperCase() + skillId.slice(1)} technical interviews with common questions and challenges.`,
      language: "English",
      url: "#",
    },
    {
      title: `Building Real-World Projects with ${skillId.charAt(0).toUpperCase() + skillId.slice(1)}`,
      creator: "Project Dev",
      duration: "4:30:00",
      likes: "37K",
      views: "780K",
      description: `Learn by doing! Create 5 complete projects using ${skillId.charAt(0).toUpperCase() + skillId.slice(1)} from start to finish.`,
      language: "English",
      url: "#",
    },
  ]

  // Filter by language if not English
  if (language !== "English") {
    // In a real app, we would have actual videos in different languages
    // Here we're just modifying the titles to simulate different languages
    return videos.map((video) => ({
      ...video,
      title: `[${language}] ${video.title}`,
      description: `[${language} subtitles] ${video.description}`,
      language,
    }))
  }

  return videos
}

export function getTopicExplanations(skillId: string): TopicExplanation[] {
  return topicExplanations.filter((topic) => topic.skillId === skillId)
}

export function needsPrerequisites(skill: Skill): boolean {
  return skill.level === "advanced"
}

