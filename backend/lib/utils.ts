import { prerequisites } from "./data";
import { model } from "./model";

// Function to generate quiz
export async function generateQuiz(topic: string) {
  try {


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
  } catch (error) {
    console.error("Error generating topic explanation:", error);
    return {
      error: "Failed to generate explanation. Please try again.",
      details: error,
    };

  }
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
    console.error("Error generating topic explanation:", error);
    return {
      error: "Failed to generate explanation. Please try again.",
      details: error,
    };

  }
}



// export async function generateTopicExplanation(topic: string, stepTitle: string) {
//
//
//   // Create a prompt that requests specifically formatted content
//   const prompt = `
//    Generate a comprehensive educational explanation for the "${topic}" under the step "${stepTitle}". 
//    Ensure:
//    - The response is structured in valid JSON format.
//    -  The data like content,example,code,resources should be ${stepTitle} basic to pro level in that language or technology or concept.This is the main thing to ensure And only do this if ${stepTitle} is langauage or framework or technology,other everything should should be content of this main topic ${topic}.
//    - Makesure that given json data is must can be parsed and used in the frontend.
//    - And this information and content generated should be simple and easy to understand for the user. 
//    
//       The response must be formatted as valid JSON with this exact structure:
//       {
//         "id": "${stepTitle.toLowerCase().replace(/\s+/g, "-")}",
//         "skillId": "${stepTitle.toLowerCase().split(/\s+/)[0]}",
//         "title": "${stepTitle}",
//         "difficulty": "Choose an appropriate difficulty level (Beginner, Intermediate, or Advanced)",
//         "description": "Write a concise 2-3 sentence overview of ${stepTitle}.",
//         "estimatedReadingTime": "Estimate appropriate reading time in minutes",
//         "lastUpdated": "Current date in Month DD, YYYY format",
//         "author": "${stepTitle} Team",
//         "sections": [
//           {
//             "id": "section-1-id",
//             "title": "First Main Concept of ${stepTitle}",
//             "content": "Write 3-4 detailed paragraphs explaining this concept. Include technical details, history if relevant, and explain why this concept is important.",
//
//               "example":{
//               "code": "Provide a practical code example demonstrating this concept if applicable.",
//               "language": "Choose a programming language (JavaScript, Python, etc.)",
//               "filename": "example.js or it can be title of the code"
//               },
//
//             "tips": [
//               "Provide 3 practical tips for working with this concept",
//               "Each tip should be specific and actionable",
//               "Include best practices"
//             ]
//           },
//           {
//             "id": "section-2-id",
//             "title": "Second Main Concept of ${stepTitle}",
//             "content": "Write 3-4 detailed paragraphs explaining this concept.",
//            "example":{
//               "code": "Provide a practical code example demonstrating this concept if applicable.",
//               "language": "Choose a programming language (JavaScript, Python, etc.)",
//               "filename": "example.js or it can be title of the code"
//               },
//             "tips": [
//               "Provide 3 practical tips for working with this concept",
//               "Each tip should be specific and actionable",
//               "Include best practices"
//             ]
//           },
//           /* Include at least 5-7 sections covering the main concepts of ${stepTitle} */
//         ],
//         "resources": [
//           {
//             "title": "Official ${stepTitle} Documentation",
//             "url": "https://example.com/${stepTitle.toLowerCase()}/docs"
//           },
//           {
//             "title": "Recommended ${stepTitle} Tutorial",
//             "url": "https://example.com/tutorials/${stepTitle.toLowerCase()}"
//           },
//           /* Include 3-5 relevant resources */
//         ]
//       }`;
//
//   try {
//     // In a real implementation, this would call an AI model
//     const result = await model.generateContent(prompt);
//     // console.log("AI Response:", result.response.text()); // Debugging log
//     // Clean the response text by removing any code block formatting
//     let responseText = result.response
//       .text()
//       .replace(/```json|```/g, "")
//       .trim();
//
//     // Parse and return the JSON
//     return JSON.parse(responseText);
//   } catch (error) {
//     console.error("Error generating topic explanation:", error);
//     return {
//       error: "Failed to generate explanation. Please try again.",
//       details: error,
//     };
//   }
// }
export async function generateTopicExplanation(topic: string, stepTitle: string) {
  // Create a prompt that avoids template literal interpolation in the output
  // and replaces variables directly to prevent escape character issues
  const safeTopicId = stepTitle.toLowerCase().replace(/\s+/g, "-");
  const safeSkillId = stepTitle.toLowerCase().split(/\s+/)[0];

  const prompt = `
   Generate a comprehensive educational explanation for the "${topic}" under the step "${stepTitle}". 
   Ensure:
   - The response is structured in valid JSON format.
   - The data like content, example, code, resources should be relevant to "${stepTitle}" from basic to pro level in that language or technology or concept.
   - This should only focus on "${stepTitle}" if it's a language or framework or technology; otherwise, everything should be content related to the main topic "${topic}".
   - Make sure the generated JSON data can be properly parsed and used in the frontend.
   - The information and content should be simple and easy to understand for users.
   
   The response must be formatted as valid JSON with this exact structure:
   {
     "id": "${safeTopicId}",
     "skillId": "${safeSkillId}",
     "title": "${stepTitle}",
     "difficulty": "Choose an appropriate difficulty level (Beginner, Intermediate, or Advanced)",
     "description": "Write a concise 2-3 sentence overview.",
     "estimatedReadingTime": "Estimate appropriate reading time in minutes",
     "lastUpdated": "Current date in Month DD, YYYY format",
     "author": "Expert Team",
     "sections": [
       {
         "id": "section-1",
         "title": "First Main Concept",
         "content": "Write 3-4 detailed paragraphs explaining this concept. Include technical details, history if relevant, and explain why this concept is important.",
         "example": {
           "code": "Provide a practical code example demonstrating this concept if applicable.",
           "language": "Choose a programming language (JavaScript, Python, etc.)",
           "filename": "example.js"
         },
         "tips": [
           "Provide 3 practical tips for working with this concept",
           "Each tip should be specific and actionable",
           "Include best practices"
         ]
       },
       {
         "id": "section-2",
         "title": "Second Main Concept",
         "content": "Write 3-4 detailed paragraphs explaining this concept.",
         "example": {
           "code": "Provide a practical code example demonstrating this concept if applicable.",
           "language": "Choose a programming language (JavaScript, Python, etc.)",
           "filename": "example.js"
         },
         "tips": [
           "Provide 3 practical tips for working with this concept",
           "Each tip should be specific and actionable",
           "Include best practices"
         ]
       }
     ],
     "resources": [
       {
         "title": "Official Documentation",
         "url": "https://example.com/docs"
       },
       {
         "title": "Recommended Tutorial",
         "url": "https://example.com/tutorials"
       }
     ]
   }`;

  try {
    // Call the AI model
    const result = await model.generateContent(prompt);

    // Process the response text:
    // 1. Get the raw text
    // 2. Remove any markdown code block delimiters
    // 3. Trim whitespace
    let responseText = result.response.text().replace(/```json|```/g, "").trim();

    // Extra safety: Handle potential $ characters and other problematic escape sequences
    responseText = responseText.replace(/\$(?!{)/g, "\\$"); // Escape standalone $ characters

    // Remove any control characters that might be in the response
    responseText = responseText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    try {
      // Attempt to parse the JSON
      const parsedJson = JSON.parse(responseText);
      return parsedJson;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);

      // Fallback: Try a more aggressive cleaning approach if normal parsing fails
      const sanitizedResponse = sanitizeJsonString(responseText);
      return JSON.parse(sanitizedResponse);
    }
  } catch (error) {
    console.error("Error generating topic explanation:", error);
    return {
      error: "Failed to generate explanation. Please try again.",
      details: error,
    };
  }
}

// Helper function to sanitize problematic JSON strings
function sanitizeJsonString(jsonString: string): string {
  // Replace problematic escape sequences
  let sanitized = jsonString
    // Fix common escape sequence issues
    .replace(/\\/g, "\\\\") // Double all backslashes first
    .replace(/\\\\"/g, '\\"') // Fix any double-escaped quotes
    .replace(/\\\\n/g, "\\n") // Fix any double-escaped newlines
    .replace(/\\\\t/g, "\\t") // Fix any double-escaped tabs
    .replace(/\\\\\//g, "\\/") // Fix any double-escaped forward slashes

    // Handle unicode escape sequences
    .replace(/\\\\u([0-9a-fA-F]{4})/g, "\\u$1");

  // Last resort: strip out any characters that might still cause issues
  sanitized = sanitized.replace(/[^\x20-\x7E]/g, "");

  return sanitized;
}

export const fetchWithRetry = async (topic: string, title: string, retries = 3): Promise<any> => {
  let attempt = 0;
  while (attempt < retries) {
    const explanation = await generateTopicExplanation(topic, title);
    if (!explanation.error) return explanation;
    console.error(`Retry ${attempt + 1} failed for: ${title}`, explanation.error);
    attempt++;
    // await Bun.sleep(2000); // Wait 2s before retry
  }
  return { error: "Failed to fetch explanation" };
};


