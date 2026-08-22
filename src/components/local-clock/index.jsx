import { useEffect, memo, useCallback } from "react";
import useClock from "../../hooks/useClock"
import ClockActions from "../shared/clock-actions/ClockActions";
import ClockDisplay  from "../shared/clock-display/ClockDisplay";
import useTimer from "../../hooks/useTimer";

const LocalClock = ({clock , updateClock ,createClock, deleteClock}) => {
  const {date,offset,timezone} = useClock(clock.timezone, clock.offset);

  const timer = useTimer(date);
  
  const memoizedUpdateClock = useCallback(() => {
    updateClock({
      date,
      timezone,
      offset,
    });
  }, [updateClock, date, timezone, offset]);
 
  useEffect(() => {
    if (date) {
      memoizedUpdateClock();
    }
  }, [date, memoizedUpdateClock]);
  

  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          {
            timer && (
              <ClockDisplay 
                  date={timer}
                  offset={offset}
                  timezone={timezone}
                  title={clock.title}             
              />
            )
          }

          <ClockActions 
            clock={clock}
            updateClock={updateClock}
            local={true}
            createClock={createClock}
            deleteClock={deleteClock}
         />
         
    </div>
  )
}

export default memo(LocalClock);
