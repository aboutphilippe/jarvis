'use client';

import { Button, Stack, Text } from '@mantine/core';
import { useState } from 'react';

type ConversationData = {
  conversationId: string;
};

export function HomePage() {
  const [conversationData, setConversationData] =
    useState<ConversationData | null>(null);

  return (
    <Stack p="md" gap="md" align="center">
      <Button
        onClick={async () => {
          const res = await fetch('/api/create-conversation', {
            method: 'POST',
          });
          const data = await res.json();
          setConversationData(data);
        }}
      >
        Start Conversation
      </Button>

      {conversationData ? (
        <Text>{JSON.stringify(conversationData)}</Text>
      ) : null}
    </Stack>
  );
}
