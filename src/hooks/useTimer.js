import { addSeconds } from "date-fns";
import { useEffect, useRef, useState } from "react";

const useTimer = (date) => {
  const [timer, setTimer] = useState(date);
  const timerId = useRef(null);

  useEffect(() => {
    setTimer(date);
  }, [date]);

  useEffect(() => {
    if (!timer) {
        return;
    }

    // Clear any existing interval before creating new one
    if (timerId.current) {
      clearInterval(timerId.current);
    }

    timerId.current = setInterval(() => {
      setTimer((prevTimer) => addSeconds(prevTimer, 1));
    }, 1000);

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
    };
  }, [!!timer]); // Only depend on whether timer exists, not its value

  return timer;
};

export default useTimer;
