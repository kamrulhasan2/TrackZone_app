import { memo, useMemo } from "react";
import { formatDistance } from "date-fns";
import useClock from "../../hooks/useClock";
import ClockActions from "../shared/clock-actions/ClockActions";
import ClockDisplay from "../shared/clock-display/ClockDisplay";
import useTimer from "../../hooks/useTimer";
import EventUI from "../shared/event-ui/EventUI";

const ClockLIstItem = ({clock, updateClock, deleteClock,localClock}) => {
    const {date} = useClock(clock.timezone, clock.offset);

    const timer = useTimer(date);
    
    const timeDifference = useMemo(() => {
        if (!localClock || !timer) return '';
        return formatDistance(localClock, timer);
    }, [localClock, timer]);

    if(!date || !timer) return null;
    
  return (
    <div className="bg-card/45 backdrop-blur-md border border-border/55 rounded-xl p-5 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between h-full">
        <div className="space-y-4">
            <ClockDisplay
                date={timer}
                offset={clock.offset}
                timezone={clock.timezone}
                title={clock.title}
            />
            
            {/* Time Difference Tag */}
            {timeDifference && (
              <div className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Offset from Local</span>
                <span className="font-semibold text-foreground">{timeDifference}</span>
              </div>
            )}
        </div>

        <div className="mt-4 pt-4 border-t border-border/40 space-y-4">
            <ClockActions
                clock={clock}
                updateClock={updateClock}
                deleteClock={deleteClock}
            />

            <EventUI clock={clock}/>
        </div>
    </div>
  )
}

export default memo(ClockLIstItem);
