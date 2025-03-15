import express from 'express';
import { prerequisites } from './lib/data';
import { generateQuiz, generateRoadmap, generateTopicExplanation } from './lib/utils';
import cors from 'cors';
import { createClient } from 'redis';
const redisClient = createClient({
    url: process.env.REDIS_URL || ''
});
const app = express();
app.use(cors({
    origin: "*",
}));

app.use(express.json());



app.get("/api/generate_quiz", async (req, res): Promise<any> => {
    try {
        const topic = req.query.topic as string;
        if (!topic) res.status(400).json({ error: "Topic is required" });
        const cacheExists = await redisClient.get(topic);
        if (cacheExists) {
            console.log("Cache Hit!!");
            return res.json(JSON.parse(cacheExists));
        }
        const prerequisiteTopics = prerequisites[topic] || [];

        if (prerequisiteTopics.length > 0) {
            const prerequisiteQuiz = await generateQuiz(
                prerequisiteTopics.join(", ")
            );
            if (!prerequisiteQuiz.error) {
                redisClient.set(topic, JSON.stringify(prerequisiteQuiz), {
                    EX: 86400
                });
            }
            return res.json(prerequisiteQuiz);
        }

        const mainQuiz = await generateQuiz(topic);
        if (!mainQuiz.error) {
            redisClient.set(topic, JSON.stringify(mainQuiz), {
                EX: 86400
            });
        }
        return res.json(mainQuiz);
    } catch (error) {
        console.error("Error generating quiz:", error);
        return res.status(500).json({ error: "Error generating quiz" });
    }
});



app.get("/api/generate_roadmap", async (req, res): Promise<any> => {
    try {
        const topic = req.query.topic as string;
        const score = Number(req.query.score) || 0;


        if (!topic) {
            return res.status(400).json({ error: "Topic are required" });
        }
        const cacheExists = await redisClient.get(`${topic}-${score}`);
        if (cacheExists) {
            console.log("Cache Hit!!");
            return res.json(JSON.parse(cacheExists));
        }


        const roadmapData = await generateRoadmap(score, topic);
        if (!roadmapData.error) {
            redisClient.set(`${topic}-${score}`, JSON.stringify(roadmapData), {
                EX: 86400
            });
        }
        return res.json(roadmapData);
    } catch (error) {
        console.error("Error generating roadmap:", error);
        return res.status(500).json({ error: "Error generating roadmap" });
    }
});

app.get("/api/generate_topic_explanation", async (req, res): Promise<any> => {
    try {
        const topic = req.query.topic as string;
        const stepTitle = req.query.stepTitle as string;
        // Validate input
        if (!topic || !stepTitle) {
            return res
                .status(400)
                .json({ error: "Topic and Step Title are required." });
        }
        const cacheExists = await redisClient.get(`${topic}-${stepTitle}`);
        if (cacheExists) {
            console.log("Cache Hit!!");
            return res.json(JSON.parse(cacheExists));
        }

        const explanation = await generateTopicExplanation(topic, stepTitle);
        if (explanation.error) {
            return res.status(400).json(explanation);
        }



        redisClient.set(`${topic}-${stepTitle}`, JSON.stringify(explanation), {
            EX: 86400
        });
        return res.json(explanation);
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/clear_cache', async (req, res) => {
    try {
        await redisClient.flushAll(); // Clears all keys in Redis
        console.log('Redis cache cleared!');
        res.json({ message: 'Redis cache cleared successfully!' });
    } catch (error) {
        console.error('Error clearing Redis cache:', error);
        res.status(500).json({ message: 'Failed to clear cache' });
    }
});



const port = process.env.PORT || 3000;

app.listen(port, async () => {
    redisClient.on("error", err => console.log(err));
    await redisClient.connect();

    console.log(`Server running at http://localhost:${port}`);
});











