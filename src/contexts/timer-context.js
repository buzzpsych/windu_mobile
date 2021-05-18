import React from "react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import utility from "../common/utility";
momentDurationFormatSetup(moment);

const TimerContext = React.createContext();

export function calculateTimeDiff(startTime) {
  const timeDiff = moment.duration(moment().diff(startTime));
  const durationFormat = timeDiff.format("HH:mm:ss");
  const timer = utility.intoTimeFormat(durationFormat.length, durationFormat);

  return timer;
}

function TimerProvider({ children, initialTime, throttling }) {
  const [time, setTime] = React.useState(initialTime);
  const intervalHandle = React.useRef({ timer: null });
  const modalizeRef = React.useRef();

  // Initialize
  React.useEffect(() => {
    intervalHandle.current.timer = null;
    return () => clearInterval(intervalHandle.current.timer);
  }, []);

  // Timer start
  const startHandler = React.useCallback(
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
  const resetHandler = React.useCallback(() => {
    clearInterval(intervalHandle.current.timer);
    intervalHandle.current.timer = null;
    setTime(() => initialTime);
  }, [initialTime]);

  const value = React.useMemo(() => {
    return {
      time,
      startHandler,
      resetHandler,
      setTime,
      modalizeRef,
    };
  }, [time]);

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
}

function useTimer() {
  const context = React.useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerContext");
  }
  return context;
}
export { TimerProvider, useTimer };
