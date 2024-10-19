'use client';

import { Button, Stack, Text } from '@mantine/core';
import { useState } from 'react';

export default function StartButton() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  return (
    <Stack gap="md">
      <Button
        onClick={async () => {
          const res = await fetch('/api/create-conversation', {
            method: 'POST',
          });
          const data = await res.json();
          setServerMessage(data);
        }}
      >
        Start Conversation
      </Button>

      {serverMessage ? <Text>{JSON.stringify(serverMessage)}</Text> : null}
    </Stack>
  );
}
