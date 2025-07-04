import getGeminiResponse from "@/lib/ai-services/gemini";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { prompt } = await request.json();
    const geminiResponse = await getGeminiResponse(prompt);

    console.log("Gemini Response:", geminiResponse);
    return NextResponse.json(geminiResponse);
}