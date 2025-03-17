import axios from 'axios';
const axiosObj = axios.create({

    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    }
});


export async function generateQuiz(topic: string) {
    try {

        const response = await axiosObj.get(`/generate_quiz?topic=${topic}`);
        return response.data;
    } catch (error) {
        console.error("Error generating quiz:", error);

    }
}

export async function generateRoadmap(topic: string, score: number) {
    try {

        const response = await axiosObj.get(`/generate_roadmap?topic=${topic}&score=${score}`);
        return response.data;
    } catch (error) {
        console.error("Error generating quiz:", error);

    }
}
export async function generateDetailedExplanation(topic: string, stepTitle: string) {
    try {

        const response = await axiosObj.get(`/generate_topic_explanation?topic=${topic}&stepTitle=${stepTitle}`);
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

