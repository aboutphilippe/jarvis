'use client';

import { Button, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { ConversationView } from './ConversationView';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';

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
      callObject: DailyCall;
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

  const callObject = DailyIframe.createCallObject();
  callObject.join({ url: conversationUrl });
  return callObject;
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
            const callObject = await startConversation();
            setConversationState({ name: 'STARTED', callObject });
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

  return <ConversationView callObject={conversationState.callObject} />;
}

export function HomePage() {
  return (
    <Stack p="md" gap="md" align="center">
      <HomePageContent />
    </Stack>
  );
}
