import { Stack } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useDaily } from '@daily-co/daily-react';
import { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@/providers/DailyProvider';

function getRemoteStream(
  callObject: DailyCall | null,
): [MediaStreamTrack | undefined, MediaStreamTrack | undefined] {
  const participants = callObject?.participants();
  if (participants) {
    for (const [id, participant] of Object.entries(participants)) {
      if (id !== 'local') {
        const audioTrack = participant.tracks.audio.persistentTrack;
        const videoTrack = participant.tracks.video.persistentTrack;
        if (audioTrack && videoTrack) {
          return [audioTrack, videoTrack] as const;
        }
      }
    }
  }
  return [undefined, undefined];
}

export function ConversationViewContent() {
  const videoElRef = useRef<HTMLVideoElement>(null);

  const callObject = useDaily();

  const [audioTrack, videoTrack] = getRemoteStream(callObject);
  console.log({ audioTrack, videoTrack });

  // TODO: Replace this with an actual state change listener
  const [_count, setCount] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setCount((count) => count + 1);
    }, 500);
  }, []);

  useEffect(() => {
    const videoEl = videoElRef.current;
    if (videoEl && audioTrack && videoTrack) {
      videoEl.srcObject = new MediaStream([audioTrack, videoTrack]);
    }
  }, [audioTrack, videoTrack]);

  return (
    <Stack align="center">
      <video autoPlay playsInline ref={videoElRef} />
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
