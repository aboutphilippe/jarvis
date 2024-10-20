import { Stack } from '@mantine/core';
import { DailyCall } from '@daily-co/daily-js';
import { useEffect, useRef, useState } from 'react';

export function ConversationView(props: { callObject: DailyCall }) {
  const { callObject } = props;
  const [meetingState, setMeetingState] = useState<'joining' | 'joined'>(
    'joining',
  );
  const stackRef = useRef<HTMLDivElement>(null);

  console.log({ callObject });

  const iframe = callObject.iframe();

  useEffect(() => {
    const onJoined = () => {
      setMeetingState('joined');
    };
    callObject.on('joined-meeting', onJoined);
    return () => {
      callObject.off('joined-meeting', onJoined);
    };
  }, [callObject]);

  useEffect(() => {
    const containerEl = stackRef.current;
    console.log({ meetingState, iframe });
    if (containerEl && iframe) {
      containerEl.appendChild(iframe);
      return () => {
        containerEl.removeChild(iframe);
      };
    }
  }, [iframe, meetingState]);

  return <Stack ref={stackRef} />;
}
