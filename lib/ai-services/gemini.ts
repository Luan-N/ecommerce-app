import { ApiError } from "../errors";

export default async function getGeminiResponse(prompt: string, model: string = "gemini-2.5-flash-preview-05-20") {
  const API_KEY = process.env.GEMINI_API_KEY;

  //Internal Server Error
  if (!API_KEY) {
    console.error("Gemini API key is missing");
    throw new ApiError("API key is missing", 500);
  }

  try {
    // Bad Request
    if (!prompt) {
      throw new ApiError("Prompt is required", 400);
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const geminiResult = await geminiResponse.json();
    const generatedText =
      geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return generatedText;
  } catch (error) {
    console.error("Error in Gemini API request:", error);
    throw error;
  }
}
