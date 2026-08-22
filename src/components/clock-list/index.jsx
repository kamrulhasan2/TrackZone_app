import { memo } from "react";
import ClockListItem from "./ClockLIstItem";
import { Globe } from "lucide-react";

const ClockList = ({ clocks, updateClock, deleteClock, localClock, eventsManager }) => {
  return (
    <div className="space-y-4">
      {clocks.length === 0 ? ( 
        <div className="border border-dashed border-border/85 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 bg-card/15">
          <div className="w-12 h-12 rounded-full bg-secondary/85 border border-border/40 flex items-center justify-center text-muted-foreground shadow-sm">
            <Globe className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-semibold text-foreground">No secondary trackings</h4>
            <p className="text-xs text-muted-foreground max-w-sm">
              Coordinate across multiple timezones. Add a new secondary clock using the "Create" action inside your Primary Timezone card above.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clocks.map((clock) => (
            <div key={clock.id} className="h-full">
              <ClockListItem
                clock={clock}
                updateClock={updateClock}
                deleteClock={deleteClock}
                localClock={localClock}
                eventsManager={eventsManager}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(ClockList);
