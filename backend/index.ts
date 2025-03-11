import express from 'express';
import { prerequisites } from './lib/data';
import { generateQuiz } from './lib/utils';
import cors from 'cors';



const app = express();
app.use(cors({
    origin: "*",
}));

app.use(express.json());



app.post("/api/generate_quiz", async (req, res) => {
    console.log("Triggered");
    try {
        const { topic } = req.body;
        if (!topic) res.status(400).json({ error: "Topic is required" });

        const prerequisiteTopics = prerequisites[topic] || [];

        if (prerequisiteTopics.length > 0) {
            const prerequisiteQuiz = await generateQuiz(
                prerequisiteTopics.join(", ")
            );
            res.json({
                prerequisites: prerequisiteTopics,
                prerequisiteQuiz,
            });
        }

        const mainQuiz = await generateQuiz(topic);

        res.json({ quiz: mainQuiz });
    } catch (error) {
        console.error("Error generating quiz:", error);
        res.status(500).json({ error: "Error generating quiz" });
    }
});
const port = process.env.PORT || 3000;




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});











