import axios from 'axios';
const axiosObj = axios.create({

    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    }
});


export async function generateQuiz(topic: string) {
    try {

        const response = await axiosObj.post("/generate_quiz", { topic });
        return response.data;
    } catch (error) {
        console.error("Error generating quiz:", error);

    }
}

