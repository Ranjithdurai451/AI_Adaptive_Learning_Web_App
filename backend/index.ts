import { prerequisites } from "./lib/data";
import {
  fetchWithRetry,
  filterVideos,
  formatVideoData,
  generateQuiz,
  generateRoadmap,
  generateSearchQuery,
  searchYouTubeVideos,
} from "./lib/utils";
import { createClient } from "redis";
import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import pLimit from "p-limit";
import type { CombinedResponse, LearningResource, Resource } from "./lib/types";

/**
 * Initialize Redis client with connection URL from environment variable
 */
const redisClient = createClient({
  url: process.env.REDIS_URL || "",
});

// Setup Redis error handling
redisClient.on("error", (err) => console.log("[Redis] Connection Error:", err));
redisClient.on("connect", () => console.log("[Redis] Connected successfully"));

/**
 * Initialize Elysia server with extended idle timeout
 * to handle longer-running requests
 */
const app = new Elysia({
  serve: {
    idleTimeout: 200,
  },
});

// Apply CORS middleware to allow cross-origin requests
app.use(cors({
  origin: process.env.FRONTEND_BASE_URL
}));


app.get("/api", () => {
  return {
    message: "Welcome to the Adaptive Learning API",
  };
})


/**
 * API endpoint to generate quiz questions for a given topic
 * Uses Redis cache to store results for performance
 */
app.get("/api/generate_quiz", async ({ query }) => {
  console.log("[Quiz API] Received request for topic:", query.topic);
  try {
    const topic = query.topic;
    if (!topic) {
      console.log("[Quiz API] Error: Missing topic parameter");
      return { error: "Topic is required" };
    }

    // Check if we have a cached response
    const cacheExists = await redisClient.get(topic);
    if (cacheExists) {
      console.log("[Quiz API] Cache hit for topic:", topic);
      return JSON.parse(cacheExists);
    }
    console.log("[Quiz API] Cache miss for topic:", topic);

    // Handle prerequisites if they exist
    const prerequisiteTopics = prerequisites[topic] || [];
    console.log("[Quiz API] Prerequisites for topic:", prerequisiteTopics);

    // Generate quiz based on prerequisites or the topic itself
    const quizData =
      prerequisiteTopics.length > 0
        ? await generateQuiz(prerequisiteTopics.join(", "))
        : await generateQuiz(topic);

    // Cache successful quiz data
    if (!quizData.error) {
      console.log("[Quiz API] Caching quiz data for topic:", topic);
      redisClient.set(topic, JSON.stringify(quizData), { EX: 86400 }); // Cache for 24 hours
    } else {
      console.log("[Quiz API] Error generating quiz:", quizData.error);
    }

    return quizData;
  } catch (error) {
    console.error("[Quiz API] Unexpected error:", error);
    return { error: "Error generating quiz" };
  }
});

/**
 * API endpoint to generate a learning roadmap based on topic and user's score
 * Uses Redis cache to store results for performance
 */
app.get("/api/generate_roadmap", async ({ query }) => {
  console.log(
    "[Roadmap API] Received request for topic:",
    query.topic,
    "with score:",
    query.score
  );
  try {
    const topic = query.topic;
    const score = Number(query.score) || 0;

    if (!topic) {
      console.log("[Roadmap API] Error: Missing topic parameter");
      return { error: "Topic is required" };
    }

    // Create a unique cache key combining topic and score
    const cacheKey = `${topic}-${score}`;
    const cacheExists = await redisClient.get(cacheKey);
    if (cacheExists) {
      console.log("[Roadmap API] Cache hit for key:", cacheKey);
      return JSON.parse(cacheExists);
    }
    console.log("[Roadmap API] Cache miss for key:", cacheKey);

    // Generate roadmap data
    console.log(
      "[Roadmap API] Generating roadmap for score:",
      score,
      "and topic:",
      topic
    );
    const roadmapData = await generateRoadmap(score, topic);

    // Cache successful roadmap data
    if (!roadmapData.error) {
      console.log("[Roadmap API] Caching roadmap data for key:", cacheKey);
      redisClient.set(cacheKey, JSON.stringify(roadmapData), {
        EX: Number(process.env.REDIS_CACHE_EXP_DURATION) || 2592000, // Default to 30 days
      });
    } else {
      console.log("[Roadmap API] Error generating roadmap:", roadmapData.error);
    }

    return roadmapData;
  } catch (error) {
    console.error("[Roadmap API] Unexpected error:", error);
    return { error: "Error generating roadmap" };
  }
});

/**
 * API endpoint to generate explanation for a specific topic and step
 * Uses Redis cache to store results for performance
 */
app.get("/api/generate_topic_explanation", async ({ query }) => {
  console.log(
    "[Explanation API] Received request for topic:",
    query.topic,
    "subtopic :",
    query.subtopic,
    "step:",
    query.stepTitle
  );
  try {
    const { topic, subtopic, stepTitle } = query;
    if (!topic || !stepTitle) {
      console.log("[Explanation API] Error: Missing required parameters");
      return { error: "Topic and Step Title are required." };
    }

    // Create a unique cache key combining topic and step
    const cacheKey = `${topic}-${stepTitle}`;
    const cacheExists = await redisClient.get(cacheKey);
    if (cacheExists) {
      console.log("[Explanation API] Cache hit for key:", cacheKey);
      return JSON.parse(cacheExists);
    }
    console.log("[Explanation API] Cache miss for key:", cacheKey);

    // Generate explanation with retry mechanism
    console.log(
      "[Explanation API] Fetching explanation with retry for topic:",
      topic,
      "step:",
      stepTitle
    );
    const explanation = await fetchWithRetry(topic, subtopic, stepTitle);

    // Store the successful response in cache
    if (explanation && !explanation.error) {
      console.log("[Explanation API] Caching explanation for key:", cacheKey);
      await redisClient.set(cacheKey, JSON.stringify(explanation), {
        EX: Number(process.env.REDIS_CACHE_EXP_DURATION) || 2592000, // Default to 30 days
      });
    } else {
      console.log(
        "[Explanation API] Error generating explanation:",
        explanation?.error
      );
    }

    return explanation;
  } catch (error) {
    console.error("[Explanation API] Unexpected error:", error);
    return { error: "Internal Server Error" };
  }
});

/**
 * API endpoint to generate topic explanation enhanced with relevant YouTube videos
 * Combines topic explanation with filtered video content
 * Uses Redis cache to store results for performance
 */
app.get("/api/generate_topic_explanation_with_videos", async ({ query }) => {
  try {
    const { topic, subtopic, stepTitle, language = "English" } = query;
    console.log(
      "[Explanation+Videos API] Started processing request for topic:",
      topic,
      "subtopic :",
      query.subtopic,
      "step:",
      stepTitle,
      "language:",
      language
    );

    let explanation: LearningResource | null = null;
    if (!topic || !stepTitle || !subtopic) {
      console.log(
        "[Explanation+Videos API] Error: Missing required parameters"
      );
      return { error: "Topic and Step Title are required." };
    }

    // Create a unique cache key combining topic, step, and language
    const cacheKey = `${topic}-${stepTitle}-${language}`;
    const cacheExists = await redisClient.get(cacheKey);

    if (cacheExists) {
      console.log("[Explanation+Videos API] Cache hit for key:", cacheKey);
      const combined_cache_response = JSON.parse(
        cacheExists
      ) as CombinedResponse;
      return combined_cache_response;
    } else {
      console.log("[Explanation+Videos API] Cache miss for key:", cacheKey);

      // First, get the topic explanation
      console.log("[Explanation+Videos API] Fetching topic explanation");
      explanation = await fetchWithRetry(topic, subtopic, stepTitle);

      if (!explanation || "error" in explanation) {
        console.log(
          "[Explanation+Videos API] Failed to generate explanation:",
          explanation?.error
        );
        return explanation || { error: "Failed to generate topic explanation" };
      }

      // Extract resource titles for video search
      const resourcesTitles = explanation.resources
        .map((resource: Resource) => resource.title)
        .join(",");
      const combinedTitles = resourcesTitles
        .concat(",")
        .concat(explanation.title);

      console.log(
        "[Explanation+Videos API] Generating search query based on resources:",
        combinedTitles
      );

      // Generate optimized search query for YouTube
      const combinedSearchQuery = await generateSearchQuery(
        topic,
        combinedTitles,
        language
      );

      console.log(
        "[Explanation+Videos API] Searching YouTube with query:",
        combinedSearchQuery
      );
      const videos = await searchYouTubeVideos(combinedSearchQuery, language);
      console.log(
        `[Explanation+Videos API] Found ${videos.length} initial videos from YouTube search`
      );

      // First try to filter videos with standard recency (24 months)
      console.log(
        "[Explanation+Videos API] Filtering videos with 24 month recency requirement"
      );
      let filteredVideos = await filterVideos(
        videos,
        combinedSearchQuery,
        language,
        5,
        24
      );

      // If no suitable videos found, try with extended timeframe (48 months)
      if (!filteredVideos || filteredVideos.length === 0) {
        console.log(
          "[Explanation+Videos API] No recent videos found within 24 months, extending to 48 months"
        );
        filteredVideos = await filterVideos(
          videos,
          combinedSearchQuery,
          language,
          5,
          48
        );
      }

      // Format the videos that were filtered
      console.log(
        `[Explanation+Videos API] Found ${filteredVideos.length} filtered videos for response`
      );
      const formattedVideos = filteredVideos.map(formatVideoData);

      // Combine explanation with videos
      const result: CombinedResponse = {
        ...explanation,
        videos:
          formattedVideos.length > 0
            ? formattedVideos
            : [{ error: "No suitable videos found" }],
      };

      console.log("[Explanation+Videos API] Caching combined result");
      redisClient.set(cacheKey, JSON.stringify(result), {
        EX: Number(process.env.REDIS_CACHE_EXP_DURATION) || 2592000, // Default to 30 days
      });

      return result;
    }
  } catch (error) {
    console.error("[Explanation+Videos API] Unexpected error:", error);
    return { error: "Internal Server Error" };
  }
});

/**
 * API endpoint to clear Redis cache
 * Useful for development and testing
 */
app.get("/api/clear_cache", async () => {
  console.log("[Cache API] Received request to clear Redis cache");
  try {
    await redisClient.flushAll();
    console.log("[Cache API] Redis cache cleared successfully!");
    return { message: "Redis cache cleared successfully!" };
  } catch (error) {
    console.error("[Cache API] Error clearing Redis cache:", error);
    return { message: "Failed to clear cache" };
  }
});

app.get("*", async () => {
  return {
    error: "Route not found",
    message: "Try to access /api endpoints instead",
  };
})
// Start the server
app.listen(process.env.PORT || 3000, async () => {
  console.log("[Server] Initializing server...");
  try {
    await redisClient.connect(); // Ensure Redis is connected before using it
    console.log(
      `[Server] Server running at http://localhost:${process.env.PORT || 3000}`
    );
    console.log("[Server] Redis client connected successfully");
  } catch (error) {
    console.error("[Server] Failed to connect to Redis:", error);
    console.log("[Server] Server starting without Redis connection");
  }
});