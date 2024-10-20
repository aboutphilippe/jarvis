import { log } from "@restackio/ai/function";

interface PersonaInput {
  apiKey?: string;
  default_replica_id: string;
  system_prompt: string;
  layers?: {
    llm?: {
      model: string;
      base_url: string;
      api_key: string;
      tools?: Array<{
        type: string;
        function: {
          name: string;
          description: string;
          parameters: {
            type: string;
            properties: any;
            required: string[];
          };
        };
      }>;
    };
    vqa: {
      enable_vision: boolean;
    };
  };
}

export async function createTavusPersona(input: PersonaInput) {
  const options = {
    method: "POST",
    headers: {
      "x-api-key": input.apiKey ?? process.env.TAVUS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  };

  try {
    const response = await fetch("https://tavusapi.com/v2/personas", options);
    const result = await response.json();
    log.info(result);
    return result;
  } catch (err) {
    log.error("error", { err });
    throw err;
  }
}
