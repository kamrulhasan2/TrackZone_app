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
    <div className="bg-card/45 backdrop-blur-md border border-border/55 rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5">
          
          {/* Live pulsing tag */}
          <div className="absolute top-6 right-6 flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Live</span>
          </div>

          <div className="max-w-2xl">
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
         
    </div>
  )
}

export default memo(LocalClock);
