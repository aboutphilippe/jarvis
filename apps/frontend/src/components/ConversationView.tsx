import { Stack } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { useLocalSessionId, useVideoTrack } from '@daily-co/daily-react';
import { DailyProvider } from '@/providers/DailyProvider';

export function ConversationViewContent() {
  const localVideoElement = useRef<HTMLVideoElement>(null);

  const sessionId = useLocalSessionId();
  const videoTrack = useVideoTrack(sessionId);

  const { persistentTrack } = videoTrack;

  useEffect(() => {
    const el = localVideoElement.current;
    if (!persistentTrack || !el) {
      return;
    }
    el.srcObject = persistentTrack && new MediaStream([persistentTrack]);
  }, [persistentTrack]);

  return (
    <Stack align="center">
      <video autoPlay muted playsInline ref={localVideoElement} />
    </Stack>
  );
}

export function ConversationView(props: { url: string }) {
  return (
    <DailyProvider url={props.url}>
      <ConversationViewContent />
    </DailyProvider>
  );
}
