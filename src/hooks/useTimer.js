import { addSeconds } from "date-fns";
import { useEffect, useRef, useState } from "react";

const useTimer = (date) => {
  const [timer, setTimer] = useState(date);
  const timerId = useRef(null);
  const isRunning = useRef(false);

  useEffect(() => {
    setTimer(date);
  }, [date]);

  useEffect(() => {
    if (!timer) {
        return;
    }

    // Only start interval if not already running
    if (!isRunning.current) {
      isRunning.current = true;
      timerId.current = setInterval(() => {
        setTimer((prevTimer) => addSeconds(prevTimer, 1));
      }, 1000);
    }

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
        isRunning.current = false;
      }
    };
  }, [timer && !isRunning.current]); // Only depend on timer existence and running state

  return timer;
};

export default useTimer;
