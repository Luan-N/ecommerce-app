const geminiPayload = {
  contents: [
    {
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ],
};

async function POST(request: Request) {
  const API_KEY = process.env.GEMINI_API_KEY;

  //Internal Server Error
  if (!API_KEY) {
    return Response.json({ error: "API key is missing" }, { status: 500 });
  }

  try {
    // Bad Request
    const { prompt } = await request.json();
    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(geminiPayload),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error("Error from Gemini API:", errorData);
      return new Response(
        JSON.stringify({
          error: "Failed to generate content from Gemini API",
          details: errorData,
        }),
        {
          status: geminiResponse.status,
        }
      );
    }

    const geminiResult = await geminiResponse.json();
    const generatedText =
      geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(JSON.stringify({ generatedText: generatedText }), {
      status: 200, // OK
    });
  } catch (error: unknown) {
    console.error("Error in Gemini API request:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error }),
      {
        status: 500, // Internal Server Error
      }
    );
  }
}
