import { prerequisites } from "./data";
import { model } from "./model";
import { google } from "googleapis";
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});
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
    const responseText = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

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
- Here if it is a prerequisite topic then give complete content related to that prerequisite,if not then give content related to that main topic ${topic}.
- Divide the main topic into multiple logical steps (beginner, intermediate, advanced).
- Include relevant projects at the end.

Format:
{
  "roadmap": {
    "title": "Complete Learning Path for ${topic},it should be consise and 2 to 3 words",
    "skillId": "${topic}",
    "description": "Comprehensive learning path for ${topic} including prerequisites and progression from fundamentals to advanced concepts.",
    "prerequisites": ${JSON.stringify(prerequisites[topic]) || []},
    "steps": [
      ${prerequisites[topic]
        ? prerequisites[topic]
          .map(
            (prereq) => `{
        "skillId": "${prereq}",
        "title": "Essential ${prereq} Fundamentals",
        "description": "Core ${prereq} concepts required before learning ${topic}",
        "subTopics": ["List 5-8 key subtopics for ${prereq}"]
      }`
          )
          .join(",\n") + ","
        : ""
      }
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
    "title": "Give best title for this roadmap topic ${topic} it should be consise and 2 to 3 words",
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

export async function generateTopicExplanation(
  topic: string,
  subtopic: string,
  stepTitle: string
) {
  // Create a prompt that avoids template literal interpolation in the output
  // and replaces variables directly to prevent escape character issues
  const safeTopicId = stepTitle.toLowerCase().replace(/\s+/g, "-");
  const safeSkillId = stepTitle.toLowerCase().split(/\s+/)[0];

  // -Ensure at least 5-8 sections minimum
  const prompt = `
   Generate a comprehensive educational explanation for the step "${stepTitle}".
   
   Context Information:
   - Main Topic: "${topic}" (The primary technology or subject area, e.g., "Flutter")
   - Subtopic: "${subtopic}" (A learning category, e.g., "Flutter Fundamentals" or "Core Concepts & UI Design")
   - Step: "${stepTitle}" (The specific concept to explain)
   
   Content Focus Instructions:
   - For subtopics that are clearly categories within the main topic (like "Flutter Fundamentals" or "Core Concepts & UI Design" for Flutter):
     * Focus on explaining "${stepTitle}" as it pertains to "${topic}"
     * Make all examples, code, and explanations specifically about "${topic}"
   
   - For subtopics that represent separate prerequisite skills (like "HTML Fundamentals" would be for React):
     * Focus on explaining "${stepTitle}" as it pertains to "${subtopic}" directly
     * Make all examples, code, and explanations specifically about "${subtopic}"
   
   Ensure:
   - The response is structured in valid JSON format.
   - Provide 5-8 comprehensive sections about "${stepTitle}"
   - The content should be educational, accurate, and progress from beginner to advanced concepts
   - Make sure that given JSON data is in correct format with no syntax errors
   
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
           "language": "Choose a programming language appropriate for the topic",
           "filename": "example-filename"
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
           "language": "Choose a programming language appropriate for the topic",
           "filename": "example-filename"
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
    let responseText = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

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

// Helper function to sanitize JSON string that might have issues

export async function generateSearchQuery(
  topic: string,
  resourcesTitles: string,
  language: string
) {
  const prompt = `I have these resource titles related ${topic} to a programming concept:
"${resourcesTitles}"

Based on these titles, identify the core concept they cover and create an effective YouTube search query.

Your task:
1. Identify the main ${topic} programming concept  ${resourcesTitles} these resources are about.
2. Create a clear, concise search query using this concept + "tutorial"
3. ALWAYS append "in ${language}" at the end .
4. If ${language} is English, do not append anything about language
5. Return ONLY the final search query, nothing else

Example input: "Oracle's Java Reflection Tutorial, Baeldung - Introduction to Java Reflection"
Example output for Tamil: "Java Reflection tutorial in Tamil"
Example output for English: "Java Reflection tutorial"`;

  const response = await model.generateContent(prompt);
  const searchQuery = response.response
    .text()
    .trim()
    .replace(/["\*]/g, "")
    .split("\n")[0];

  console.log("Generated search query:", searchQuery);
  return searchQuery;
}
export async function searchYouTubeVideos(query: string, language: string) {
  // Map common languages to their codes
  const languageMap: Record<string, { langCode: string; regionCode: string }> =
  {
    Tamil: { langCode: "ta", regionCode: "IN" },
    Hindi: { langCode: "hi", regionCode: "IN" },
    English: { langCode: "en", regionCode: "US" },
    Spanish: { langCode: "es", regionCode: "ES" },
    French: { langCode: "fr", regionCode: "FR" },
    German: { langCode: "de", regionCode: "DE" },
    Japanese: { langCode: "ja", regionCode: "JP" },
    Korean: { langCode: "ko", regionCode: "KR" },
    Chinese: { langCode: "zh", regionCode: "CN" },
    Arabic: { langCode: "ar", regionCode: "SA" },
    Russian: { langCode: "ru", regionCode: "RU" },
    // Add more languages as needed
  };

  const langSettings = languageMap[language] || {
    langCode: "en",
    regionCode: "US",
  };

  const response = await youtube.search.list({
    part: ["snippet"],
    q: query,
    type: ["video"],
    maxResults: 30, // Increased to get more candidates
    relevanceLanguage: langSettings.langCode,
    regionCode: langSettings.regionCode,
    videoEmbeddable: "true", // Only get embeddable videos
    videoSyndicated: "true", // Only get videos that can be played outside YouTube
    safeSearch: "moderate", // Add safe search filter
  });

  console.log(
    `Found ${response.data.items?.length || 0
    } initial videos for query: "${query}"`
  );
  return response.data.items || [];
}

export async function filterVideos(
  videos: any,
  searchQuery: string,
  preferredLanguage: string = "en",
  minDurationMinutes: number = 5,
  maxAgeMonths: number = 36
) {
  if (!videos.length) return [];

  const videoIds = videos.map((v: any) => v.id.videoId).join(",");
  const details = await youtube.videos.list({
    part: ["snippet,statistics,contentDetails"],
    id: videoIds,
  });

  console.log(
    `Retrieved detailed information for ${details.data.items?.length || 0
    } videos`
  );

  // Calculate relevance scores for all videos
  const keywordsFromQuery = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((kw) => kw.length > 2);

  const allVideosWithScores =
    details.data.items?.map((video) => {
      const title = video.snippet?.title?.toLowerCase() || "";
      const description = video.snippet?.description?.toLowerCase() || "";

      // Calculate relevance score based on keywords in title and description
      let relevanceScore = 0;
      keywordsFromQuery.forEach((keyword) => {
        // Higher weight for keywords in title
        if (title.includes(keyword)) relevanceScore += 2;
        // Lower weight for keywords in description
        if (description.includes(keyword)) relevanceScore += 1;
        // Bonus for exact phrase matches
        if (title.includes(searchQuery.toLowerCase())) relevanceScore += 5;
      });

      // Add duration info
      const duration = parseDuration(video.contentDetails?.duration || "PT0S");
      const isLanguageMatch = checkIfLanguageVideo(video, preferredLanguage);
      const publishedAt = new Date(video?.snippet?.publishedAt || new Date());
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);
      const isRecent = publishedAt >= cutoffDate;
      const meetsDuration = duration >= minDurationMinutes;

      return {
        video,
        relevanceScore,
        duration,
        isLanguageMatch,
        isRecent,
        publishedAt,
        meetsDuration,
      };
    }) || [];

  // Log all videos with their scores
  console.log("Videos sorted by title relevance:");
  allVideosWithScores
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, Math.min(10, allVideosWithScores.length))
    .forEach((item, index) => {
      console.log(
        `${index + 1}. Score: ${item.relevanceScore}, Title: "${item.video.snippet?.title
        }"`
      );
    });

  // Apply filters while preserving relevance order
  const filteredVideos = allVideosWithScores
    .slice(0, Math.min(10, allVideosWithScores.length))
    .filter((item) => {
      // First, filter by language
      if (!item.isLanguageMatch) {
        return false;
      }

      // Then by recency
      if (!item.isRecent) {
        return false;
      }

      // Finally by duration
      if (!item.meetsDuration) {
        return false;
      }

      return true;
    });

  console.log(`After all filters, ${filteredVideos.length} videos remain`);

  // If we have videos that pass all filters, return top 3 by relevance
  if (filteredVideos.length > 0) {
    // Sort by relevance score (highest first)
    filteredVideos.sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log("Top videos after all filters (sorted by relevance):");
    filteredVideos
      .slice(0, Math.min(3, filteredVideos.length))
      .forEach((item, index) => {
        console.log(
          `${index + 1}. ` +
          `Relevance: ${item.relevanceScore}, ` +
          `Title: "${item.video.snippet?.title}", ` +
          `Duration: ${item.duration}min, ` +
          `Published: ${item.publishedAt.toLocaleDateString()}`
        );
      });

    return filteredVideos
      .slice(0, Math.min(3, filteredVideos.length))
      .map((item) => item.video);
  }

  // First fallback: Try with language and minimum duration, but relax recency
  const languageDurationVideos = allVideosWithScores.filter(
    (item) => item.isLanguageMatch && item.meetsDuration
  );

  if (languageDurationVideos.length > 0) {
    // Sort by relevance score (highest first)
    languageDurationVideos.sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log(
      "Fallback 1: Language and duration matched videos sorted by relevance:"
    );
    languageDurationVideos
      .slice(0, Math.min(3, languageDurationVideos.length))
      .forEach((item, index) => {
        console.log(
          `${index + 1}. ` +
          `Relevance: ${item.relevanceScore}, ` +
          `Title: "${item.video.snippet?.title}", ` +
          `Duration: ${item.duration}min, ` +
          ` Recent: ${item.isRecent}`
        );
      });

    return languageDurationVideos
      .slice(0, Math.min(3, languageDurationVideos.length))
      .map((item) => item.video);
  }

  // Second fallback: Try with just duration requirement
  const durationVideos = allVideosWithScores.filter(
    (item) => item.meetsDuration
  );

  if (durationVideos.length > 0) {
    // Sort by relevance score (highest first)
    durationVideos.sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log("Fallback 2: Duration-matched videos sorted by relevance:");
    durationVideos
      .slice(0, Math.min(3, durationVideos.length))
      .forEach((item, index) => {
        console.log(
          `${index + 1}. ` +
          `Relevance: ${item.relevanceScore}, ` +
          `Title: "${item.video.snippet?.title}", ` +
          `Duration: ${item.duration}min, ` +
          `Language match: ${item.isLanguageMatch}`
        );
      });

    return durationVideos
      .slice(0, Math.min(3, durationVideos.length))
      .map((item) => item.video);
  }

  // Final fallback: Just return top 3 most relevant videos regardless of other criteria
  // This should only happen if no videos meet the duration requirement
  console.log(
    "Final fallback: Most relevant videos regardless of criteria (no videos meet duration requirement)"
  );
  allVideosWithScores.sort((a, b) => b.relevanceScore - a.relevanceScore);

  console.log(
    "Warning: Returning videos that don't meet minimum duration requirement as a last resort"
  );
  allVideosWithScores
    .slice(0, Math.min(3, allVideosWithScores.length))
    .forEach((item, index) => {
      console.log(
        `${index + 1}. ` +
        `Relevance: ${item.relevanceScore}, ` +
        `Title: "${item.video.snippet?.title}", ` +
        `Duration: ${item.duration}min(below minimum requirement)`
      );
    });

  return allVideosWithScores
    .slice(0, Math.min(3, allVideosWithScores.length))
    .map((item) => item.video);
}
export function parseDuration(duration: string): number {
  try {
    // Handle PT1H30M15S format properly
    const hours = duration.match(/(\d+)H/)
      ? parseInt(duration.match(/(\d+)H/)![1])
      : 0;
    const minutes = duration.match(/(\d+)M/)
      ? parseInt(duration.match(/(\d+)M/)![1])
      : 0;
    const seconds = duration.match(/(\d+)S/)
      ? parseInt(duration.match(/(\d+)S/)![1])
      : 0;

    // Convert everything to minutes (including partial minutes from seconds)
    return hours * 60 + minutes + seconds / 60;
  } catch (e) {
    console.error("Error parsing duration:", duration, e);
    return 0;
  }
}

// Helper function to detect if a video matches a specific language
function checkIfLanguageVideo(video: any, language: string): boolean {
  if (!video) return false;

  // Map of language to their language codes and keywords
  const languageMap: Record<string, { code: string; keywords: string[] }> = {
    english: {
      code: "en",
      keywords: ["english", "eng", "in english", "english tutorial"],
    },
    tamil: {
      code: "ta",
      keywords: ["tamil", "தமிழ்", "தமிழில்", "தமிழ", "tamizh"],
    },
    hindi: { code: "hi", keywords: ["hindi", "हिंदी", "हिन्दी", "in hindi"] },
    spanish: {
      code: "es",
      keywords: ["spanish", "español", "espanol", "en español"],
    },
    french: {
      code: "fr",
      keywords: ["french", "français", "francais", "en français"],
    },
    german: { code: "de", keywords: ["german", "deutsch", "auf deutsch"] },
    japanese: {
      code: "ja",
      keywords: ["japanese", "日本語", "japan", "ジャパニーズ"],
    },
    korean: { code: "ko", keywords: ["korean", "한국어", "korea", "코리안"] },
    chinese: {
      code: "zh",
      keywords: ["chinese", "中文", "mandarin", "cantonese", "普通话", "國語"],
    },
    arabic: { code: "ar", keywords: ["arabic", "العربية", "عربى", "بالعربية"] },
    russian: {
      code: "ru",
      keywords: ["russian", "русский", "россия", "на русском"],
    },
    // Add more languages as needed
  };

  // Normalize language input to lowercase for case-insensitive matching
  const normalizedLanguage = language.toLowerCase();

  // If the language isn't in our map, we'll do a simple match on the language name
  const languageData = languageMap[normalizedLanguage] || {
    code: normalizedLanguage,
    keywords: [normalizedLanguage],
  };

  // Check title and description for language indicators
  const title = video.snippet?.title?.toLowerCase() || "";
  const description = video.snippet?.description?.toLowerCase() || "";
  const channelTitle = video.snippet?.channelTitle?.toLowerCase() || "";
  const tags =
    video.snippet?.tags?.map((tag: string) => tag.toLowerCase()) || [];

  // Check if any language keywords are present in title, description, channel name, or tags
  const hasLanguageKeyword = languageData.keywords.some(
    (keyword) =>
      title.includes(keyword) ||
      description.includes(keyword) ||
      channelTitle.includes(keyword) ||
      tags.some((tag: string) => tag.includes(keyword))
  );

  // Check if the video has the preferred language in its default language setting
  const defaultLanguage = video.snippet?.defaultLanguage || "";
  const defaultAudioLanguage = video.snippet?.defaultAudioLanguage || "";

  return (
    hasLanguageKeyword ||
    defaultLanguage === languageData.code ||
    defaultAudioLanguage === languageData.code
  );
}

export function formatVideoData(video: any) {
  if (!video) return null;

  try {
    const durationText = formatDuration(
      video.contentDetails?.duration || "PT0S"
    );

    // Calculate like to view ratio percentage
    const likes = parseInt(video.statistics?.likeCount || "0");
    const views = parseInt(video.statistics?.viewCount || "0");
    const likeRatio =
      views > 0 ? ((likes / views) * 100).toFixed(2) + "%" : "N/A";

    // Format view count with commas
    const formattedViews = new Intl.NumberFormat().format(views);

    // Calculate video age
    const publishDate = new Date(video.snippet.publishedAt);
    const now = new Date();
    const ageInDays = Math.floor(
      (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const ageText =
      ageInDays < 30
        ? `${ageInDays} days ago`
        : ageInDays < 365
          ? `${Math.floor(ageInDays / 30)} months ago`
          : `${Math.floor(ageInDays / 365)} years ago`;

    return {
      title: video.snippet.title,
      url: `https://youtu.be/${video.id}`,
      publishedAt: video.snippet.publishedAt,
      likes: video.statistics?.likeCount || "0",
      views: formattedViews,
      duration: durationText,
      videoId: video.id,
    };
  } catch (e) {
    console.error("Error formatting video data:", e);
    return null;
  }
}

// Helper to format duration in human-readable format
function formatDuration(isoDuration: string): string {
  try {
    const hours = isoDuration.match(/(\d+)H/)
      ? parseInt(isoDuration.match(/(\d+)H/)![1])
      : 0;
    const minutes = isoDuration.match(/(\d+)M/)
      ? parseInt(isoDuration.match(/(\d+)M/)![1])
      : 0;
    const seconds = isoDuration.match(/(\d+)S/)
      ? parseInt(isoDuration.match(/(\d+)S/)![1])
      : 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  } catch (e) {
    return "0:00";
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

export const fetchWithRetry = async (
  topic: string,
  subtopic: string,
  title: string,
  retries = 3
): Promise<any> => {
  let attempt = 0;
  while (attempt < retries) {
    const explanation = await generateTopicExplanation(topic, subtopic, title);
    if (!explanation.error) return explanation;
    console.error(
      `Retry ${attempt + 1} failed for: ${title},
  explanation.error`
    );
    attempt++;
    // await Bun.sleep(2000); // Wait 2s before retry
  }
  return { error: "Failed to fetch explanation" };
};
