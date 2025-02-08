import { useEffect } from "react";
import useClock from "../../hooks/useClock"
import ClockDisplay from "../shared/ClockDisplay";

const LocalClock = ({clock , updateClock }) => {
  const {date,offset,timezone} = useClock(clock.timezone, clock.offset);
  
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
            date && (
              <ClockDisplay 
                  date={date}
                  offset={offset}
                  timezone={timezone}
                  title={clock.title}
              />
            )
          }
    </div>
  )
}

export default LocalClock;