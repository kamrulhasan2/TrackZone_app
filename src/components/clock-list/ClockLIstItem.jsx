import useClock from "../../hooks/useClock";
import ClockActions from "../shared/clock-Actions/ClockActions";
import ClockDisplay from "../shared/clock-display/ClockDisplay";


const ClockLIstItem = ({clock, updateClock, deleteClock}) => {
    const {date} = useClock(clock.timezone, clock.offset);

    if(!date) return null;
  return (
    <div>
        <ClockDisplay
            date={date}
            offset={clock.offset}
            timezone={clock.timezone}
            title={clock.title}
        />

        <ClockActions
            clock={clock}
            updateClock={updateClock}
            deleteClock={deleteClock}
        />
    </div>
  )
}

export default ClockLIstItem;