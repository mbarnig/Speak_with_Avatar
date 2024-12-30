import OpenAI from "openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Set up OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is securely loaded
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Validate messages input
    if (!Array.isArray(messages)) {
      return new Response("Invalid input: 'messages' should be an array.", {
        status: 400,
      });
    }

    // Call the OpenAI API with streaming enabled
    const stream = await openai.chat.completions.create({
      model: "gpt-4", // Use a valid model name
      messages,
      stream: true, // Enable streaming
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error during OpenAI API call:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

    return new Response("Internal Server Error", { status: 500 });
  }
}
