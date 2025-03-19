import { prerequisites } from "./lib/data";
import {
  fetchWithRetry,
  filterVideos,
  formatVideoData,
  generateQuiz,
  generateRoadmap,
  generateSearchQuery,
  generateTopicExplanation,
  searchYouTubeVideos,
  selectBestVideo,
} from "./lib/utils";
import { createClient } from "redis";
import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import pLimit from "p-limit";
import type { CombinedResponse, LearningResource, Resource } from "./lib/types";
import { redis } from "googleapis/build/src/apis/redis";

// interface CombinedResponse extends TopicExplanation {
//   videos: SectionVideoMap;
// }

const redisClient = createClient({
  url: process.env.REDIS_URL || "",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const app = new Elysia({
  serve: {
    idleTimeout: 200,
  },
});

app.use(cors()); // Apply CORS middleware
// app.use(Elysia.json()); // Ensure JSON parsing is handled

// Generate Quiz API
app.get("/api/generate_quiz", async ({ query }) => {
  try {
    const topic = query.topic;
    if (!topic) return { error: "Topic is required" };

    const cacheExists = await redisClient.get(topic);
    if (cacheExists) {
      console.log("Cache Hit!!");
      return JSON.parse(cacheExists);
    }

    const prerequisiteTopics = prerequisites[topic] || [];
    const quizData =
      prerequisiteTopics.length > 0
        ? await generateQuiz(prerequisiteTopics.join(", "))
        : await generateQuiz(topic);

    if (!quizData.error) {
      redisClient.set(topic, JSON.stringify(quizData), { EX: 86400 });
    }

    return quizData;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { error: "Error generating quiz" };
  }
});

// Generate Roadmap API
app.get("/api/generate_roadmap", async ({ query }) => {
  try {
    const topic = query.topic;
    const score = Number(query.score) || 0;

    if (!topic) return { error: "Topic is required" };

    const cacheKey = `${topic}-${score}`;
    const cacheExists = await redisClient.get(cacheKey);
    if (cacheExists) {
      console.log("Cache Hit!!");
      return JSON.parse(cacheExists);
    }

    const roadmapData = await generateRoadmap(score, topic);
    if (!roadmapData.error) {
      redisClient.set(cacheKey, JSON.stringify(roadmapData), {
        EX: Number(process.env.REDIS_CACHE_EXP_DURATION) || 2592000,
      });
    }

    return roadmapData;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return { error: "Error generating roadmap" };
  }
});

// Generate Topic Explanation API
app.get("/api/generate_topic_explanation", async ({ query }) => {
  try {
    const { topic, stepTitle } = query;
    if (!topic || !stepTitle)
      return { error: "Topic and Step Title are required." };

    const cacheKey = `${topic}-${stepTitle}`;
    const cacheExists = await redisClient.get(cacheKey);
    if (cacheExists) {
      console.log("Cache Hit!!");
      return JSON.parse(cacheExists);
    }

    // Call the retry function
    const explanation = await fetchWithRetry(topic, stepTitle);

    // Store the successful response in cache
    if (explanation && !explanation.error)
      await redisClient.set(cacheKey, JSON.stringify(explanation), {
        EX: Number(process.env.REDIS_CACHE_EXP_DURATION) || 2592000,
      });

    return explanation;
  } catch (error) {
    console.error("API Error:", error);
    return { error: "Internal Server Error" };
  }
});

app.get("/api/generate_topic_explanation_with_videos", async ({ query }) => {
  try {
    const { topic, stepTitle, language = "English" } = query;
    console.log("Started")
    let explanation: LearningResource | null = null;
    if (!topic || !stepTitle) {
      return { error: "Topic and Step Title are required." };
    }

    const cacheKey = `${topic}-${stepTitle}-${language}`;
    const cacheExists = await redisClient.get(cacheKey);
    if (cacheExists) {
      console.log("Cache Hit!!");
      const combined_cache_response = JSON.parse(
        cacheExists
      ) as CombinedResponse;
      return combined_cache_response;
    } else {
      explanation = await fetchWithRetry(topic, stepTitle);

      if (!explanation || "error" in explanation) {
        return explanation || { error: "Failed to generate topic explanation" };
      }


      const resourcesTitles = explanation.resources
        .map((resource: Resource) => resource.title)
        .join(",");
      const combinedSearchQuery = await generateSearchQuery(
        topic,
        resourcesTitles,
        language
      );

      const videos = await searchYouTubeVideos(combinedSearchQuery, language);
      let filteredVideos = await filterVideos(videos, true);

      if (!filteredVideos || filteredVideos.length === 0) {
        console.log("No recent videos found, looking for older videos...");
        filteredVideos = await filterVideos(videos, false);
      }

      let bestVideos = [];
      if (filteredVideos && filteredVideos.length > 0) {
        bestVideos = selectBestVideo(filteredVideos, language);
      }

      const formattedVideos = bestVideos.map(formatVideoData);

      const result: CombinedResponse = {
        ...explanation,
        videos: formattedVideos.length > 0 ? formattedVideos : [{ error: "No suitable videos found" }],
      };

      redisClient.set(cacheKey, JSON.stringify(result), {
        EX: Number(process.env.REDIS_CACHE_EXP_DURATION) || 2592000,
      });

      return result;
    }
  } catch (error) {
    console.error("API Error:", error);
    return { error: "Internal Server Error" };
  }
});



// Clear Cache API
app.get("/api/clear_cache", async () => {
  try {
    await redisClient.flushAll();
    console.log("Redis cache cleared!");
    return { message: "Redis cache cleared successfully!" };
  } catch (error) {
    console.error("Error clearing Redis cache:", error);
    return { message: "Failed to clear cache" };
  }
});

// Start the server
app.listen(process.env.PORT || 3000, async () => {
  await redisClient.connect(); // Ensure Redis is connected before using it
  console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});