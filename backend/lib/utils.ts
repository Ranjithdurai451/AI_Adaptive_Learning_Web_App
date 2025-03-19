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
- Divide the main topic into multiple logical steps (beginner, intermediate, advanced).
- Include relevant projects at the end.

Format:
{
  "roadmap": {
    "title": "Complete Learning Path for ${topic}",
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
    "title": "Give best title for this roadmap topic ${topic}",
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
  stepTitle: string
) {
  // Create a prompt that avoids template literal interpolation in the output
  // and replaces variables directly to prevent escape character issues
  const safeTopicId = stepTitle.toLowerCase().replace(/\s+/g, "-");
  const safeSkillId = stepTitle.toLowerCase().split(/\s+/)[0];

  // -Ensure atleast 5-8 sections minimum
  const prompt = `
   Generate a comprehensive educational explanation for the "${topic}" under the step "${stepTitle}". 
   Ensure:
   - The response is structured in valid JSON format.
   - The data like content, example, code, resources should be relevant to "${stepTitle}" from basic to pro level in that language or technology or concept.
   - This should only focus on "${stepTitle}" if it's a language or framework or technology; otherwise, everything should be content related to the main topic "${topic}".
   - Make sure the generated JSON data can be properly parsed and used in the frontend.
   - The information and content should be simple and easy to understand for users.
   - The content should be simple ,easy to understand and more informative
   - Give  proper section title so that we can fetch related corresponding video from youtube
   - Makesure that given json data is in correct format
   
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
           "language": "Choose a programming language (JavaScript, Python, etc.)",
           "filename": "example.js"
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
           "language": "Choose a programming language (JavaScript, Python, etc.)",
           "filename": "example.js"
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

export async function generateSearchQuery(
  topic: string,
  resourcesTitles: string,
  language: string
) {
  const prompt = `I have these resource titles related to a programming concept:
"${resourcesTitles}"

Based on these titles, identify the core concept they cover and create an effective YouTube search query.

Your task:
1. Identify the main programming concept these resources are about
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
  const languageMap: Record<string, { langCode: string; regionCode: string }> = {
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
    `Found ${response.data.items?.length || 0} initial videos for query: "${query}"`
  );
  return response.data.items || [];
}

export async function filterVideos(videos: any, enforceRecentOnly = true) {
  if (!videos.length) return [];

  const videoIds = videos.map((v: any) => v.id.videoId).join(",");
  const details = await youtube.videos.list({
    part: ["snippet,statistics,contentDetails,topicDetails"],
    id: videoIds,
  });

  console.log(
    `Retrieved detailed information for ${details.data.items?.length || 0} videos`
  );

  // First filter step: apply basic quality criteria
  const filtered = details.data.items?.filter((video) => {
    // Parse duration properly
    const duration = parseDuration(video.contentDetails?.duration || "PT0S");
    const publishedAt = new Date(video?.snippet?.publishedAt || new Date());
    const likeCount = parseInt(video?.statistics?.likeCount || "0");
    const viewCount = parseInt(video?.statistics?.viewCount || "0");
    const commentCount = parseInt(video?.statistics?.commentCount || "0");
    const likeToViewRatio = viewCount > 0 ? likeCount / viewCount : 0;

    // Check if the video title contains keywords that suggest it's a tutorial
    const titleLower = video.snippet?.title?.toLowerCase() || "";
    const descriptionLower = video.snippet?.description?.toLowerCase() || "";

    const isTutorial =
      titleLower.includes("tutorial") ||
      titleLower.includes("guide") ||
      titleLower.includes("learn") ||
      titleLower.includes("how to") ||
      descriptionLower.includes("tutorial") ||
      descriptionLower.includes("step by step");

    // Check if video has educational topics
    const hasEducationalTopic = video.topicDetails?.topicCategories?.some(
      (topic: string) =>
        topic.includes("Education") ||
        topic.includes("Knowledge") ||
        topic.includes("Science") ||
        topic.includes("Technology")
    ) || false;

    // Enhanced quality checks
    const hasGoodEngagement = (likeCount >= 10 && viewCount >= 1500) || (likeToViewRatio > 0.02);
    const hasComments = commentCount > 5; // Videos with comments suggest user engagement
    const hasReasonableDuration = duration >= 3 && duration <= 60; // Between 3 and 60 minutes
    const hasGoodContent = isTutorial || hasEducationalTopic;

    // Log filtering decisions for debugging
    console.log(
      `Video "${video.snippet?.title}" - Duration: ${duration}min, Likes: ${likeCount}, Views: ${viewCount}, Like/View: ${likeToViewRatio.toFixed(4)}, Comments: ${commentCount}, Tutorial: ${isTutorial}, Educational: ${hasEducationalTopic}`
    );

    if (enforceRecentOnly) {
      // For recent videos: published within the last 3 years
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
      return (
        hasGoodEngagement &&
        hasReasonableDuration &&
        hasComments &&
        publishedAt >= threeYearsAgo &&
        hasGoodContent
      );
    } else {
      // For older videos: looser criteria but still ensure good quality
      return hasGoodEngagement && hasReasonableDuration && hasComments && hasGoodContent;
    }
  });

  console.log(`After filtering, ${filtered?.length || 0} videos remain`);
  return filtered || [];
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

export function selectBestVideo(videos: any, preferredLanguage: string = "en") {
  if (!videos.length) return [];
  if (videos.length === 1) return [videos[0]];

  // Score and rank the videos
  const scoredVideos = videos.map((video: any) => {
    // Calculate base score
    const score = calculateVideoScore(video);
    // Check if the video matches the preferred language
    const isPreferredLanguageVideo = checkIfLanguageVideo(
      video,
      preferredLanguage
    );
    // Apply language bonus if the video is in the preferred language
    const languageBonus = isPreferredLanguageVideo ? 50 : 0;

    // Calculate average watch time (approximation)
    const viewCount = parseInt(video.statistics?.viewCount || "0");
    const duration = parseDuration(video.contentDetails?.duration || "PT0S");
    const likeCount = parseInt(video.statistics?.likeCount || "0");
    const estimatedRetentionRate = Math.min(0.9, 0.3 + (likeCount / (viewCount || 1)) * 50);
    const estimatedWatchTime = duration * estimatedRetentionRate;
    const watchTimeScore = Math.min(20, estimatedWatchTime / 3);

    return {
      video,
      score: score + languageBonus + watchTimeScore,
      isPreferredLanguageVideo,
      watchTimeScore
    };
  });

  // Sort by score (highest first)
  scoredVideos.sort((a: any, b: any) => b.score - a.score);

  // Log the top 5 videos for debugging
  console.log(
    `Top 5 videos by score (with ${preferredLanguage} language priority):`
  );
  scoredVideos.slice(0, 5).forEach((item: any, index: number) => {
    console.log(
      `${index + 1}. Score: ${item.score.toFixed(2)}, Lang: ${item.isPreferredLanguageVideo}, WatchTime: ${item.watchTimeScore.toFixed(2)}, Title: "${item.video.snippet.title}", Views: ${item.video.statistics.viewCount}`
    );
  });

  // Return the top 3 videos
  return scoredVideos.slice(0, 3).map((item: any) => item.video);
}

// Helper function to detect if a video matches a specific language
function checkIfLanguageVideo(video: any, language: string): boolean {
  if (!video) return false;

  // Map of language to their language codes and keywords
  const languageMap: Record<string, { code: string; keywords: string[] }> = {
    english: { code: "en", keywords: ["english", "eng", "in english", "english tutorial"] },
    tamil: { code: "ta", keywords: ["tamil", "தமிழ்", "தமிழில்", "தமிழ", "tamizh"] },
    hindi: { code: "hi", keywords: ["hindi", "हिंदी", "हिन्दी", "in hindi"] },
    spanish: { code: "es", keywords: ["spanish", "español", "espanol", "en español"] },
    french: { code: "fr", keywords: ["french", "français", "francais", "en français"] },
    german: { code: "de", keywords: ["german", "deutsch", "auf deutsch"] },
    japanese: { code: "ja", keywords: ["japanese", "日本語", "japan", "ジャパニーズ"] },
    korean: { code: "ko", keywords: ["korean", "한국어", "korea", "코리안"] },
    chinese: {
      code: "zh",
      keywords: ["chinese", "中文", "mandarin", "cantonese", "普通话", "國語"]
    },
    arabic: { code: "ar", keywords: ["arabic", "العربية", "عربى", "بالعربية"] },
    russian: { code: "ru", keywords: ["russian", "русский", "россия", "на русском"] },
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
  const tags = video.snippet?.tags?.map((tag: string) => tag.toLowerCase()) || [];

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

function calculateVideoScore(video: any) {
  try {
    // Parse video metrics
    const likes = parseInt(video.statistics?.likeCount || "0");
    const views = parseInt(video.statistics?.viewCount || "0");
    const comments = parseInt(video.statistics?.commentCount || "0");
    const daysSinceUpload = Math.max(
      1,
      (Date.now() - new Date(video.snippet.publishedAt).getTime()) /
      (1000 * 86400)
    );
    const duration = parseDuration(video.contentDetails?.duration || "PT0S");

    // Score title relevance
    const title = video.snippet?.title?.toLowerCase() || "";
    const description = video.snippet?.description?.toLowerCase() || "";

    // Expanded keywords for better content detection
    const titleScore =
      (title.includes("tutorial") ? 7 : 0) +
      (title.includes("explain") ? 4 : 0) +
      (title.includes("guide") ? 4 : 0) +
      (title.includes("learn") ? 3 : 0) +
      (title.includes("how to") ? 4 : 0) +
      (title.includes("step by step") ? 5 : 0) +
      (title.includes("beginner") ? 3 : 0) +
      (title.includes("complete") ? 2 : 0) +
      (title.includes("course") ? 3 : 0);

    // Check description quality
    const descriptionScore =
      (description.length > 500 ? 5 : 0) +
      (description.includes("tutorial") ? 2 : 0) +
      (description.includes("learn") ? 1 : 0) +
      (description.includes("summary") ? 2 : 0);

    // Check if the video has chapters/timestamps (suggests organized content)
    const hasChapters = description.includes("0:00") ||
      description.match(/\d+:\d+/g)?.length > 3;
    const chapterScore = hasChapters ? 5 : 0;

    // Check if video has subtitles/closed captions
    const hasSubtitles = video.contentDetails?.caption === "true";
    const subtitleScore = hasSubtitles ? 4 : 0;

    // Check if channel is verified
    const isVerified = video.snippet?.channelId?.startsWith("UC") || false; // Simplified check
    const verifiedScore = isVerified ? 2 : 0;

    // Dynamic weight adjustments
    const viewsNormalized = Math.min(1, Math.log10(views + 1) / 6); // Normalize to 0-1 scale
    const likesNormalized = Math.min(1, Math.log10(likes + 1) / 4);
    const commentsNormalized = Math.min(1, Math.log10(comments + 1) / 3);
    const likeViewRatio = views > 0 ? Math.min(0.5, likes / views * 2) : 0;
    const recencyFactor = 1 / Math.sqrt(daysSinceUpload);

    // Prefer videos between 10-30 minutes (ideal tutorial length)
    const durationFactor =
      duration > 5 && duration < 45 ? 1 - Math.abs(duration - 20) / 30 : 0.1;

    // Calculate final score with balanced weights
    const score =
      viewsNormalized * 15 +
      likesNormalized * 20 +
      commentsNormalized * 10 +
      likeViewRatio * 15 +
      recencyFactor * 15 +
      durationFactor * 15 +
      titleScore * 2.5 +
      descriptionScore * 1.5 +
      chapterScore +
      subtitleScore +
      verifiedScore;

    return score;
  } catch (e) {
    console.error("Error calculating score:", e);
    return 0;
  }
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
    const likeRatio = views > 0 ? (likes / views * 100).toFixed(2) + "%" : "N/A";

    // Format view count with commas
    const formattedViews = new Intl.NumberFormat().format(views);

    // Calculate video age
    const publishDate = new Date(video.snippet.publishedAt);
    const now = new Date();
    const ageInDays = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24));
    const ageText = ageInDays < 30 ?
      `${ageInDays} days ago` :
      ageInDays < 365 ?
        `${Math.floor(ageInDays / 30)} months ago` :
        `${Math.floor(ageInDays / 365)} years ago`;

    return {
      title: video.snippet.title,
      url: `https://youtu.be/${video.id}`,
      publishedAt: video.snippet.publishedAt,
      // publishedFormatted: ageText,
      likes: video.statistics?.likeCount || "0",
      views: formattedViews,
      // likeRatio: likeRatio,
      duration: durationText,
      videoId: video.id,
      // thumbnails: video.snippet.thumbnails,
      // channelTitle: video.snippet.channelTitle,
      // channelId: video.snippet.channelId,
      // channelUrl: `https://www.youtube.com/channel/${video.snippet.channelId}`,
      // description: video.snippet.description,
      // hasSubtitles: video.contentDetails?.caption === "true"
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
  title: string,
  retries = 3
): Promise<any> => {
  let attempt = 0;
  while (attempt < retries) {
    const explanation = await generateTopicExplanation(topic, title);
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