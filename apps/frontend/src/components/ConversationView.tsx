import { Stack } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { useDaily } from '@daily-co/daily-react';
import { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@/providers/DailyProvider';
import { useCallState } from '@/support/useCallState';

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

  // This ensures we re-render when the call state changes so that the useEffect
  // below will be run if necessary.
  useCallState();

  const [audioTrack, videoTrack] = getRemoteStream(callObject);
  console.log({ audioTrack, videoTrack });

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
