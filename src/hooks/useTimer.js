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

    timerId.current = setInterval(() => {
      setTimer((prevTimer) => addSeconds(prevTimer, 1));
    }, 1000);

    return () => {
      clearInterval(timerId.current);
      timerId.current = null;
    };
  }, [timer]);

  return timer;
};

export default useTimer;
