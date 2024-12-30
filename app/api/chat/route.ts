import { Configuration, OpenAIApi } from "openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Set up OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is securely loaded
});
const openai = new OpenAIApi(configuration);

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
    const completion = await openai.createChatCompletion(
      {
        model: "gpt-4", // Use a valid model name
        messages,
        stream: true, // Enable streaming
      },
      { responseType: "stream" } // Ensure streaming response
    );

    return new Response(completion.data, {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error during OpenAI API call:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
