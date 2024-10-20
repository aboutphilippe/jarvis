"use client";

import { Button, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { ConversationView } from "./ConversationView";
import { triggerWorkflow } from "@/app/actions/trigger";

type ConversationState =
  | {
      name: "IDLE";
    }
  | {
      name: "STARTING";
    }
  | {
      name: "ERROR_STARTING_CONVERSATION";
      error: string;
    }
  | {
      name: "STARTED";
      id: string;
    }
  | {
      name: "ENDED";
    };

async function startConversation() {
  const result = await triggerWorkflow("assistantWorkflow", {}, "tavus");
  if (!result) {
    throw new Error(`Unexpected response status`);
  }

  const conversationId = result.conversation_id;
  return String(conversationId);
}

export function HomePage() {
  const [conversationState, setConversationState] = useState<ConversationState>(
    { name: "IDLE" }
  );

  if (conversationState.name === "ERROR_STARTING_CONVERSATION") {
    return (
      <Stack p="md" align="center">
        <Text>Error starting conversation: {conversationState.error}</Text>
      </Stack>
    );
  }

  if (conversationState.name !== "STARTED") {
    return (
      <Stack p="md" align="center">
        <Button
          loading={conversationState.name === "STARTING"}
          onClick={async () => {
            setConversationState({ name: "STARTING" });
            try {
              const id = await startConversation();
              setConversationState({ name: "STARTED", id });
            } catch (error) {
              setConversationState({
                name: "ERROR_STARTING_CONVERSATION",
                error: String(error),
              });
            }
          }}
        >
          Start Autonomous Assistant
        </Button>
      </Stack>
    );
  }

  return (
    <Stack align="center">
      <ConversationView
        url={`https://tavus.daily.co/${conversationState.id}`}
      />
      <Button
        onClick={async () => {
          try {
            await triggerWorkflow("DailyMessage", {
              conversation_id: conversationState.id,
            });
            alert("Interruption simulated successfully.");
          } catch (error) {
            alert("Failed to simulate interruption.");
          }
        }}
      >
        Simulate Interruption
      </Button>
    </Stack>
  );
}
