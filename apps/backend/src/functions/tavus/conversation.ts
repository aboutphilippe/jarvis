import { log } from "@restackio/ai/function";

interface ConversationInput {
  apiKey?: string;
  replica_id: string;
  persona_id: string;
  properties?: {
    max_call_duration?: number;
    participant_left_timeout?: number;
    participant_absent_timeout?: number;
    enable_recording?: boolean;
    enable_transcription?: boolean;
    apply_greenscreen?: boolean;
    language?: string;
    recording_s3_bucket_name?: string;
    recording_s3_bucket_region?: string;
    aws_assume_role_arn?: string;
  };
}

export async function createTavusConversation(input: ConversationInput) {
  const options = {
    method: "POST",
    headers: {
      "x-api-key": input.apiKey ?? process.env.TAVUS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  };

  try {
    const response = await fetch(
      "https://tavusapi.com/v2/conversations",
      options
    );
    const result = await response.json();
    log.info(result);
    return result;
  } catch (err) {
    log.error("error", { err });
    throw err;
  }
}
