import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function askAI(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate a concise, human-readable commit message in a single line (max 6-7 words) without prefixes: ${prompt}`
        },
      ],
    });

    // Ensure the function always returns a string
    return completion.choices[0]?.message?.content ?? "No response from AI.";
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Error: Unable to fetch AI response.";
  }
}
