import { prerequisites } from "./lib/data";
import {
  fetchWithRetry,
  generateQuiz,
  generateRoadmap,
  generateTopicExplanation,
} from "./lib/utils";
import { createClient } from "redis";
import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import pLimit from "p-limit";

const redisClient = createClient({
  url: process.env.REDIS_URL || "",
});

await redisClient.connect(); // Ensure Redis is connected before using it

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
    const explanation = await generateTopicExplanation(topic, stepTitle);

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

app.get("/api/generate_batch_explanations", async ({ query }) => {
  try {
    const { topic, stepTitles } = query as {
      topic: string;
      stepTitles: string;
    };
    if (!topic || !stepTitles) {
      return { error: "Topic and stepTitles (comma-separated) are required." };
    }

    const stepTitlesArray = stepTitles.split(",").map((title) => title.trim());
    const redisKeys = stepTitlesArray.map((title) => `${topic}-${title}`);

    // 🚀 Step 1: Optimize Redis Lookup (Use `mget` instead of `multi()`)
    const cachedData = await redisClient.mGet(redisKeys);

    let results: Record<string, any> = {};
    let missingTitles: string[] = [];

    // 🚀 Step 2: Separate Cached & Missing Data Efficiently
    cachedData.forEach((cachedItem, index) => {
      if (cachedItem) {
        results[stepTitlesArray[index]] = JSON.parse(cachedItem);
      } else {
        missingTitles.push(stepTitlesArray[index]);
      }
    });

    // 🚀 Step 3: Fetch Missing Explanations Efficiently
    if (missingTitles.length > 0) {
      console.log(`Fetching missing explanations for: ${missingTitles}`);

      const limit = pLimit(3);
      const fetchPromises = missingTitles.map((title) =>
        limit(() => generateTopicExplanation(topic, title))
      );

      const newExplanations = await Promise.all(fetchPromises);

      // 🚀 Step 4: Store New Results in Redis in One Batch (Use `mset`)
      const redisPayload: string[] = [];
      newExplanations.forEach((explanation, index) => {
        const title = missingTitles[index];
        results[title] = explanation;
        redisPayload.push(`${topic}-${title}`, JSON.stringify(explanation));
      });

      if (redisPayload.length > 0) {
        const redisPayloadObject = Object.fromEntries(
          redisPayload.reduce((acc, _, i, arr) => {
            if (i % 2 === 0) acc.push([arr[i], arr[i + 1]]);
            return acc;
          }, [] as [string, string][])
        );
        await redisClient.mSet(redisPayloadObject);
        await Promise.all(
          missingTitles.map(
            (title) => redisClient.expire(`${topic}-${title}`, 86400) // Set TTL
          )
        );
      }
    }

    return results;
  } catch (error) {
    console.error("Batch API Error:", error);
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
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});
