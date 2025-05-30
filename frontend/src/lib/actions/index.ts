import axios from "axios";
import { prerequisites } from "../data";
const axiosObj = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export async function startServer() {
  try {
    const response = await axiosObj.get('');
    console.log(response.data);
  } catch (error) {
    console.log("Error", error);
  }
}

export async function generateQuiz(topic: string) {
  try {
    const prerequisiteTopics = prerequisites[topic] || [];
    const response = await axiosObj.get(`/generate_quiz?topic=${prerequisiteTopics.join(',')}`);
    return response.data;
  } catch (error) {
    console.error("Error generating quiz:", error);
  }
}

export async function generateRoadmap(topic: string, score: number) {
  try {
    const response = await axiosObj.get(
      `/generate_roadmap?topic=${topic}&score=${score}`
    );
    return response.data;
  } catch (error) {
    console.error("Error generating quiz:", error);
  }
}
export async function generateDetailedExplanation(
  topic: string,
  subtopic: string,
  stepTitle: string
) {
  try {
    const response = await axiosObj.get(
      `/generate_topic_explanation?topic=${topic}&stepTitle=${stepTitle}&subtopic=${subtopic}`
    );
    return response.data;
  } catch (error) {
    console.error("Error generating quiz:", error);
  }
}
export async function generateDetailedExplanationWithVideos(
  topic: string,
  subtopic: string,
  stepTitle: string,
  language: string
) {
  try {
    const response = await axiosObj.get(
      `/generate_topic_explanation_with_videos?topic=${topic}&stepTitle=${stepTitle}&language=${language}&subtopic=${subtopic}`
    );
    return response.data;
  } catch (error) {
    console.error("Error generating quiz:", error);
  }
}

export async function clearCache() {
  try {
    const response = await axiosObj.get(`/clear_cache`);
    console.log(response.data);
  } catch (error) {
    console.error("Error generating quiz:", error);
  }
}


export async function practiceQuiz(topic: string, numberOfQuestions: number, level: string) {
  try {

    // Build the query string with all parameters
    const queryParams = new URLSearchParams({
      topic: topic,
      level: level,
      questions: numberOfQuestions.toString()
    });

    // Make the API request
    const response = await axiosObj.get(`/generate_quiz?${queryParams.toString()}`);

    console.log(`[Practice Quiz] Generated ${numberOfQuestions} questions at ${level} difficulty for ${topic}`);

    return response.data;
  } catch (error) {
    console.error("Error generating practice quiz:", error);
    return {
      error: "Failed to generate quiz. Please try again.",
      details: error instanceof Error ? error.message : String(error)
    };
  }
}