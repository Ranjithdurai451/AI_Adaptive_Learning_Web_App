import express from 'express';
import { prerequisites } from './lib/data';
import { generateQuiz, generateRoadmap } from './lib/utils';
import cors from 'cors';



const app = express();
app.use(cors({
    origin: "*",
}));

app.use(express.json());



app.get("/api/generate_quiz", async (req, res) => {
    console.log("Triggered");
    try {
        const topic = req.query.topic as string;
        if (!topic) res.status(400).json({ error: "Topic is required" });

        const prerequisiteTopics = prerequisites[topic] || [];

        if (prerequisiteTopics.length > 0) {
            const prerequisiteQuiz = await generateQuiz(
                prerequisiteTopics.join(", ")
            );
            res.json(prerequisiteQuiz);
        }

        const mainQuiz = await generateQuiz(topic);

        res.json(mainQuiz);
    } catch (error) {
        console.error("Error generating quiz:", error);
        res.status(500).json({ error: "Error generating quiz" });
    }
});



app.get("/api/generate_roadmap", async (req, res) => {
    try {
        const topic = req.query.topic as string;
        const score = Number(req.query.score) || 0;

        console.log("Topic:", topic);
        console.log("Score:", score);

        if (!topic) {
            res.status(400).json({ error: "Topic are required" });
        }


        const roadmapData = await generateRoadmap(score, topic);
        res.json(roadmapData);
    } catch (error) {
        console.error("Error generating roadmap:", error);
        res.status(500).json({ error: "Error generating roadmap" });
    }
});



const port = process.env.PORT || 3000;
// const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});











