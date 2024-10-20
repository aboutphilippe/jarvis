import { Stack } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { useDaily } from '@daily-co/daily-react';
import { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@/providers/DailyProvider';

function getFirstNonLocalVideoTrack(callObject: DailyCall | null) {
  const participants = callObject?.participants();
  if (!participants) {
    return;
  }
  for (const [id, participant] of Object.entries(participants)) {
    if (id !== 'local') {
      const videoTrack = participant.tracks.video.persistentTrack;
      if (videoTrack) {
        return videoTrack;
      }
    }
  }
}

export function ConversationViewContent() {
  const videoElRef = useRef<HTMLVideoElement>(null);

  const callObject = useDaily();

  const videoTrack = getFirstNonLocalVideoTrack(callObject);
  console.log({ videoTrack });

  useEffect(() => {
    const videoEl = videoElRef.current;
    if (videoEl && videoTrack) {
      videoEl.srcObject = new MediaStream([videoTrack]);
    }
  }, [videoTrack]);

  return (
    <Stack align="center">
      <video autoPlay muted playsInline ref={videoElRef} />
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
