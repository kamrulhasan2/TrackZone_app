import { memo } from "react";
import ClockListItem from "./ClockLIstItem";

const ClockList = ({ clocks, updateClock, deleteClock, localClock }) => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">Other Clocks</h3>

      {clocks.length === 0 ? ( 
        <p>There is no clock, Please create a clock</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {clocks.map((clock) => (
            <div key={clock.id}>
              <ClockListItem
                clock={clock}
                updateClock={updateClock}
                deleteClock={deleteClock}
                localClock={localClock}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(ClockList);
