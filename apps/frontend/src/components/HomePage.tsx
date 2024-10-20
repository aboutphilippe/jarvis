'use client';

import { Button, Stack, Text } from '@mantine/core';
import { useState } from 'react';

type ConversationState =
  | {
      name: 'IDLE';
    }
  | {
      name: 'STARTING';
    }
  | {
      name: 'ERROR_STARTING_CONVERSATION';
      error: string;
    }
  | {
      name: 'STARTED';
      conversationId: string;
    }
  | {
      name: 'ENDED';
    };

async function startConversation() {
  const response = await fetch('/api/create-conversation', {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`Unexpected response status ${response.status}`);
  }
  const data = await response.json();
  const { conversationId } = Object(data);
  return String(conversationId);
}

function HomePageContent() {
  const [conversationState, setConversationState] = useState<ConversationState>(
    { name: 'IDLE' },
  );

  if (conversationState.name === 'ERROR_STARTING_CONVERSATION') {
    return <Text>Error starting conversation: {conversationState.error}</Text>;
  }

  if (conversationState.name !== 'STARTED') {
    return (
      <Button
        loading={conversationState.name === 'STARTING'}
        onClick={async () => {
          setConversationState({ name: 'STARTING' });
          try {
            const conversationId = await startConversation();
            setConversationState({ name: 'STARTED', conversationId });
          } catch (error) {
            setConversationState({
              name: 'ERROR_STARTING_CONVERSATION',
              error: String(error),
            });
          }
        }}
      >
        Start Conversation
      </Button>
    );
  }

  return <Text>Conversation ID {conversationState.conversationId}</Text>;
}

export function HomePage() {
  return (
    <Stack p="md" gap="md" align="center">
      <HomePageContent />
    </Stack>
  );
}
