import getGeminiResponse from "@/lib/ai-services/gemini";

export async function POST(request: Request) {
    const { prompt } = await request.json();
    const geminiResponse = await getGeminiResponse(prompt);

    console.log("Gemini Response:", geminiResponse);
    return new Response(geminiResponse);
}