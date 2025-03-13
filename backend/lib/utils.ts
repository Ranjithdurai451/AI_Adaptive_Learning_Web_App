import { prerequisites } from "./data";
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
  let roadmapPrompt = ``;
  if (score <= 60) {
    roadmapPrompt = `  
Generate a valid JSON roadmap for learning "${topic}" based on a quiz score of ${score}%.

Ensure:
- Output is strictly in valid JSON format (without extra characters).
- The roadmap covers concepts from beginner to pro level.
- If score is below 60%, include prerequisite topics before the main topic.
- Divide the main topic into multiple logical steps (beginner, intermediate, advanced).
- Include relevant projects at the end.

Format:
{
  "roadmap": {
    "title": "Complete Learning Path for ${topic}",
    "skillId": "${topic}",
    "description": "Comprehensive learning path for ${topic} including prerequisites and progression from fundamentals to advanced concepts.",
    "prerequisites": ${JSON.stringify(prerequisites[topic]) || []},
    "steps": [
      ${prerequisites[topic] ? prerequisites[topic].map((prereq) => `{
        "skillId": "${prereq}",
        "title": "Essential ${prereq} Fundamentals",
        "description": "Core ${prereq} concepts required before learning ${topic}",
        "subTopics": ["List 5-8 key subtopics for ${prereq}"]
      }`).join(",\n") + "," : ""}
      {
        "skillId": "${topic}-basics",
        "title": "Beginner ${topic}",
        "description": "Fundamental concepts of ${topic}",
        "subTopics": ["List 5-8 beginner subtopics"]
      },
      {
        "skillId": "${topic}-intermediate",
        "title": "Intermediate ${topic}",
        "description": "Building on the basics with more complex ${topic} concepts",
        "subTopics": ["List 5-8 intermediate subtopics"]
      },
      {
        "skillId": "${topic}-advanced",
        "title": "Advanced ${topic}",
        "description": "Professional-level ${topic} skills and techniques",
        "subTopics": ["List 5-8 advanced subtopics"]
      }
    ],
    "projects": [
      {
        "title": "Beginner Project",
        "description": "A simple project to apply basic ${topic} concepts",
        "difficulty": "Beginner",
        "skills": ["List 2-3 relevant skills"]
      },
      {
        "title": "Intermediate Project",
        "description": "A more complex project integrating multiple ${topic} skills",
        "difficulty": "Intermediate",
        "skills": ["List 3-4 relevant skills"]
      },
      {
        "title": "Advanced Project",
        "description": "A comprehensive project showcasing professional ${topic} proficiency",
        "difficulty": "Advanced",
        "skills": ["List 4-5 relevant skills"]
      }
    ]
  }
}
  `;
  } else {
    roadmapPrompt = `
  Generate a valid JSON roadmap based on a quiz score of ${score}% for ${topic}.

Ensure:
- Output is strictly in valid JSON format (without extra characters).
- The roadmap covers all concepts from beginner to pro.
- The roadmap is divided into multiple logical steps or sections, not just one big step.
- Each step should contain relevant subtopics grouped by difficulty/theme.
- Give proper progression from scratch to pro.
- Include projects at the end.

Format:
{
  "roadmap": {
    "title": "Give best title for this roadmap topic ${topic}",
    "skillId": "${topic}",
    "description": "Comprehensive learning path for ${topic} including prerequisites (about 5-8 lines)",
    "prerequisites": [],
    "steps": [
      {
        "stepId": "step-1",
        "title": "Step 1: Beginner Concepts", 
        "description": "Description of this step",
        "subTopics": ["Subtopic 1.1", "Subtopic 1.2", "Subtopic 1.3"]
      },
      {
        "stepId": "step-2",
        "title": "Step 2: Intermediate Concepts",
        "description": "Description of this step",
        "subTopics": ["Subtopic 2.1", "Subtopic 2.2", "Subtopic 2.3"]
      },
      {
        "stepId": "step-3", 
        "title": "Step 3: Advanced Concepts",
        "description": "Description of this step",
        "subTopics": ["Subtopic 3.1", "Subtopic 3.2", "Subtopic 3.3"]
      }
    ],
    "projects": [
      {
        "title": "Project Title",
        "description": "Project Description",
        "difficulty": "Beginner/Intermediate/Advanced",
        "skills": ["Skill 1", "Skill 2"]
      }
    ]
  }
}
  `;
  }


  try {
    const result = await model.generateContent(roadmapPrompt);
    let roadmapText = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    // console.log("AI Response:", roadmapText); // Debugging log

    const parsedRoadmap = JSON.parse(roadmapText);
    // Ensure roadmap is always an array
    // if (!Array.isArray(parsedRoadmap.roadmap)) {
    //   console.error("Roadmap is not an array:", parsedRoadmap);
    //   return { roadmap: [] };
    // }

    return parsedRoadmap;
  } catch (error) {
    console.error("Error parsing roadmap JSON:", error);
    return { roadmap: {} }; // Return empty array on failure
  }
}
