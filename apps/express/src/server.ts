import { openai } from "@ai-sdk/openai";
import { StreamData, streamText, generateText, tool } from "ai";
import { z } from "zod";
import "dotenv/config";
import express, { Request, Response } from "express";

const app = express();

app.post("/chat/completions", async (req: Request, res: Response) => {
  // use stream data (optional):
  const data = new StreamData();
  data.append("initialized call");

  // Define tools
  const tools = {
    weather: tool({
      description: "Get the weather in a location",
      parameters: z.object({
        location: z.string().describe("The location to get the weather for"),
      }),
      execute: async ({ location }: { location: string }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
    cityAttractions: tool({
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }: { city: string }) => {
        if (city === "San Francisco") {
          return {
            attractions: [
              "Golden Gate Bridge",
              "Alcatraz Island",
              "Fisherman's Wharf",
            ],
          };
        } else {
          return { attractions: [] };
        }
      },
    }),
  };

  // Use generateText with tools
  const result = await streamText({
    model: openai("gpt-4o"),
    tools,
    prompt:
      "What is the weather in San Francisco and what attractions should I visit?",
  });

  // Stream result to response
  result.pipeDataStreamToResponse(res, { data, sendUsage: true });

  data.append("call completed");
  data.close();
});

app.listen(8080, () => {
  console.log(`Example app listening on port ${8080}`);
});
