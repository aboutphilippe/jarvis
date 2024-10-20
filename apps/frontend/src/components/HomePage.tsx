'use client';

import { Button, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { ConversationView } from './ConversationView';

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
      url: string;
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
  const { conversationUrl } = Object(data);
  return String(conversationUrl);
}

export function HomePage() {
  const [conversationState, setConversationState] = useState<ConversationState>(
    { name: 'IDLE' },
  );

  if (conversationState.name === 'ERROR_STARTING_CONVERSATION') {
    return (
      <Stack p="md" align="center">
        <Text>Error starting conversation: {conversationState.error}</Text>
      </Stack>
    );
  }

  if (conversationState.name !== 'STARTED') {
    return (
      <Stack p="md" align="center">
        <Button
          loading={conversationState.name === 'STARTING'}
          onClick={async () => {
            setConversationState({ name: 'STARTING' });
            try {
              const url = await startConversation();
              setConversationState({ name: 'STARTED', url });
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
      </Stack>
    );
  }

  return (
    <Stack align="center">
      <ConversationView url={conversationState.url} />
    </Stack>
  );
}
