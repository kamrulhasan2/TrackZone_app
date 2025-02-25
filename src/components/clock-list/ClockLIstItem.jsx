import { formatDistance } from "date-fns";
import useClock from "../../hooks/useClock";
import ClockActions from "../shared/clock-Actions/ClockActions";
import ClockDisplay from "../shared/clock-display/ClockDisplay";
import useTimer from "../../hooks/useTimer";
import EventUI from "../shared/event-ui/EventUI";



const ClockLIstItem = ({clock, updateClock, deleteClock,localClock}) => {
    const {date} = useClock(clock.timezone, clock.offset);

    const timer = useTimer(date);

    if(!date || !timer) return null;
  return (
    <div>
        <ClockDisplay
            date={timer}
            offset={clock.offset}
            timezone={clock.timezone}
            title={clock.title}
        />
        
        <h3>Time Difference: {formatDistance(localClock, timer)}</h3>

        <ClockActions
            clock={clock}
            updateClock={updateClock}
            deleteClock={deleteClock}
        />

       <EventUI clockId={clock.id}/>
    </div>
  )
}

export default ClockLIstItem;