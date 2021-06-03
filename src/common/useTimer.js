import React, { useState, useRef, useCallback, useEffect } from "react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import utility from "./utility";
momentDurationFormatSetup(moment);

export function calculateTimeDiff(startTime) {
  const timeDiff = moment.duration(moment(new Date()).diff(startTime));
  const durationFormat = timeDiff.format("HH:mm:ss");

  const timer = utility.intoTimeFormat(durationFormat.length, durationFormat);

  return timer;
}

export function useTimer(initialState = "00:00:00", throttling = 1000) {
  // State
  const [time, setTime] = useState(initialState);
  const intervalHandle = useRef({ timer: null });

  // Initialize
  useEffect(() => {
    return () => clearInterval(intervalHandle.current.timer);
  }, []);

  // Timer start
  const startHandler = useCallback(
    (start) => {
      if (!intervalHandle.current.timer) {
        const updateTimer = () => {
          const timeDiff = calculateTimeDiff(start);
          setTime(timeDiff);
        };

        intervalHandle.current.timer = setInterval(updateTimer, throttling);
      }
    },
    [setTime, time, intervalHandle]
  );

  // Timer reset
  const resetHandler = useCallback(() => {
    clearInterval(intervalHandle.current.timer);
    intervalHandle.current.timer = null;
    setTime(() => initialState);
  }, [initialState]);

  return React.useMemo(() => {
    return {
      startHandler,
      resetHandler,
      time,
      setTime,
    };
  }, [time]);
}
