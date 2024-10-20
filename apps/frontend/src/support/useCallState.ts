import { DailyMeetingState as CallState, DailyEvent } from '@daily-co/daily-js';
import { useDaily } from '@daily-co/daily-react';
import { useEffect, useState } from 'react';

const events = [
  'loading',
  'loaded',
  'joining-meeting',
  'joined-meeting',
  'left-meeting',
  'error',
] as const satisfies Array<DailyEvent>;

// Adapted from https://github.com/daily-demos/call-object-react/blob/5a5092e/src/components/App/App.js
export function useCallState() {
  const callObject = useDaily();
  const [callState, setCallState] = useState<CallState>(() => {
    return callObject?.meetingState() ?? 'new';
  });

  useEffect(() => {
    if (!callObject) return;

    const onMeetingStateChange = () => {
      const callState = callObject.meetingState();
      setCallState(callState);
    };

    for (const event of events) {
      callObject.on(event, onMeetingStateChange);
    }

    return () => {
      for (const event of events) {
        callObject.off(event, onMeetingStateChange);
      }
    };
  }, [callObject]);

  return callState;
}
