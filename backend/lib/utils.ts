import { model } from "./model";

// Function to generate quiz
export async function generateQuiz(topic: string) {

  const total_number_of_questions = 1;
  const prompt = `
        Generate a JSON quiz for ${topic} with exactly ${total_number_of_questions} questions these structured categories:
        - Basic Concept (30%)
        - Code Interpretation (30%)
        - Debugging (20%)
        - Scenario-Based (20%)

         Ensure:
           - The total number of questions is exactly ${total_number_of_questions}.
           - Each question has four answer choices: A, B, C, and D.
           - The correct answer is specified.
       Format:
        {
          "questions": [
            { "question": "...", "options": ["all answers must come in multiple values, give with option "], "answer": "coorect answer full string,give with option" }
          ]
        }`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text().replace(/```json|```/g, "").trim();

  // return responseText;
  return JSON.parse(responseText);
}

export async function generateRoadmap(score: number, topic: string) {
  const roadmapPrompt = `
    Generate a valid JSON roadmap based on a quiz score of ${score}% for ${topic}. 
    Output strictly in *valid JSON format* without extra characters. Do not include explanations.
    based on topic generate values striclty following below example format and roadmap steps to cover all concepts to learn ${topic} from beginner to pro.

    Ensure:
      -Output strictly in *valid JSON format* without extra characters. Do not include explanations.
      -roadmap steps to cover all concepts to learn ${topic} from beginner to pro

    Format:
    {
      "roadmap": [
        {
    skillId: "${topic}",
    description:
      "${topic}",
    prerequisites: [],
    steps: [
      {
        skillId:"${topic},
        title: "",
        description: "",
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        difficulty: "",
        skills: ["",""],
      },
    ],
    exercises: [
      {
        title: "",
        description: "",
        difficulty: "",
      },
    ],
  },
],

    }
  `;

  try {
    const result = await model.generateContent(roadmapPrompt);
    let roadmapText = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    console.log("AI Response:", roadmapText); // Debugging log

    const parsedRoadmap = JSON.parse(roadmapText);

    // Ensure roadmap is always an array
    if (!Array.isArray(parsedRoadmap.roadmap)) {
      console.error("Roadmap is not an array:", parsedRoadmap);
      return { roadmap: [] };
    }

    return parsedRoadmap;
  } catch (error) {
    console.error("Error parsing roadmap JSON:", error);
    return { roadmap: [] }; // Return empty array on failure
  }
}