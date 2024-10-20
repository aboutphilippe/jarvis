import { executeChild, log, step } from "@restackio/ai/workflow";
import * as functions from "../functions";

export async function assistantWorkflow() {
  const replicaId = "r79e1c033f";

  const { persona_id } = await step<typeof functions>({}).createTavusPersona({
    default_replica_id: replicaId,
    layers: {
      vqa: {
        enable_vision: true,
      },
    },
  });

  const result = await step<typeof functions>({}).createTavusConversation({
    replica_id: replicaId,
    persona_id,
    properties: {
      max_call_duration: 600000,
      participant_absent_timeout: 60000,
      participant_left_timeout: 60000,
    },
  });

  log.info("tavusConversation", { result });

  return result;
}
