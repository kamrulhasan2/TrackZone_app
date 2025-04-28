import { useEffect } from "react";
import useClock from "../../hooks/useClock"
import ClockActions from "../shared/clock-actions/ClockActions";
import ClockDisplay  from "../shared/clock-display/ClockDisplay";
import useTimer from "../../hooks/useTimer";

const LocalClock = ({clock , updateClock ,createClock, deleteClock}) => {
  const {date,offset,timezone} = useClock(clock.timezone, clock.offset);

  const timer = useTimer(date);
 
  
  useEffect(() => {
    updateClock({
      date,
      timezone,
      offset,
    });
  }, [date]);
  

  
  return (
    <div>
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

export default LocalClock;