import { Stack } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { useDaily } from '@daily-co/daily-react';
import { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@/providers/DailyProvider';
import { useCallState } from '@/support/useCallState';
import { getParticipantList } from '@/support/getParticipantList';

function getRemoteStream(
  callObject: DailyCall | null,
): [MediaStreamTrack | undefined, MediaStreamTrack | undefined] {
  const participants = getParticipantList(callObject);
  for (const participant of participants) {
    if (participant.local) continue;
    const audioTrack = participant.tracks.audio.persistentTrack;
    const videoTrack = participant.tracks.video.persistentTrack;
    if (audioTrack && videoTrack) {
      return [audioTrack, videoTrack] as const;
    }
  }
  return [undefined, undefined];
}

export function ConversationViewContent() {
  const videoElRef = useRef<HTMLVideoElement>(null);

  const callObject = useDaily();

  // This ensures we re-render when the call state changes so that the useEffect
  // below will be run when the audioTrack or videoTrack change.
  useCallState();

  const [audioTrack, videoTrack] = getRemoteStream(callObject);

  useEffect(() => {
    const videoEl = videoElRef.current;
    if (videoEl && audioTrack && videoTrack) {
      videoEl.srcObject = new MediaStream([audioTrack, videoTrack]);
    }
  }, [audioTrack, videoTrack]);

  return (
    <Stack align="center">
      <video
        style={{ maxWidth: '400px' }}
        autoPlay
        playsInline
        ref={videoElRef}
      />
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
