import { executeChild, log, step } from "@restackio/ai/workflow";
import * as functions from "../functions";

export async function assistantWorkflow() {
  const replicaId = "r79e1c033f";

  const { persona_id } = await step<typeof functions>({
    taskQueue: "tavus",
  }).createTavusPersona({
    default_replica_id: replicaId,
    system_prompt: "You are a helpful assistant named JARVIS.",
    layers: {
      llm: {
        model: "proxy",
        api_key: "test",
        base_url: "https://711b-136-25-28-117.ngrok-free.app",
      },
      vqa: {
        enable_vision: true,
      },
    },
  });

  const result = await step<typeof functions>({
    taskQueue: "tavus",
  }).createTavusConversation({
    replica_id: replicaId,
    persona_id,
    properties: {
      max_call_duration: 60000000,
      participant_absent_timeout: 60000000,
      participant_left_timeout: 60000000,
    },
  });

  log.info("tavusConversation", { result });

  return result;
}
