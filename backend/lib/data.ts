export const prerequisites: { [key: string]: string[] } = {
    html: [],
    css: ["html"],
    javascript: ["html", "css"],
    node: ["javascript"],
    express: ["node"],
    mongodb: ["databases", "json"],
    react: ["html", "css", "javascript"],
};

export const basicTopics = ["HTML", "CSS", "JavaScript", "Java"];