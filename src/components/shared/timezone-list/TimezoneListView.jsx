import React, { useState, useMemo, useEffect, memo, useCallback } from "react";
import useClock from "../../../hooks/useClock";
import useTimer from "../../../hooks/useTimer";
import { TIMEZONE_OFFSET, ALL_TIMEZONE_OFFSET } from "../../../constants/timezone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  Search, 
  Globe, 
  Clock, 
  Plus, 
  Check, 
  Info,
  Layers,
  ArrowLeftRight
} from "lucide-react";

// Ticking row component to handle individual timezone times
const TimezoneRow = memo(({ timezoneName, offsetMinutes, isTracked, onTrack }) => {
  // If UTC/GMT, use null timezone to match local but we pass offset

  const { date } = useClock(timezoneName, offsetMinutes);
  const timer = useTimer(date);

  const formattedTime = useMemo(() => {
    if (!timer) return "--:--:--";
    return format(timer, "hh:mm:ss a");
  }, [timer]);

  const formattedDate = useMemo(() => {
    if (!timer) return "";
    return format(timer, "EEE, MMM d");
  }, [timer]);

  const offsetHr = offsetMinutes / 60;
  const offsetLabel = useMemo(() => {
    if (offsetMinutes === 0) return "UTC+0";
    return offsetHr > 0 ? `UTC+${offsetHr}` : `UTC${offsetHr}`;
  }, [offsetHr, offsetMinutes]);

  return (
    <tr className="border-b border-border/40 hover:bg-secondary/15 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground border border-border/40 font-bold text-xs">
            {timezoneName.slice(0, 2)}
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">{timezoneName}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">Abbreviation</div>
          </div>
        </div>
      </td>
      
      <td className="py-4 px-4">
        <span className="px-2 py-0.5 rounded bg-secondary/80 border border-border/40 text-xs font-semibold text-muted-foreground font-mono">
          {offsetLabel}
        </span>
      </td>

      <td className="py-4 px-4">
        <div className="space-y-0.5">
          <div className="text-sm font-semibold font-mono tracking-wide text-foreground">
            {formattedTime}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {formattedDate}
          </div>
        </div>
      </td>

      <td className="py-4 px-4 text-right">
        {isTracked ? (
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            <span>Tracked</span>
          </div>
        ) : (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onTrack(timezoneName, offsetMinutes)}
            className="h-8 text-xs font-semibold flex items-center space-x-1 hover:bg-primary hover:text-primary-foreground hover:border-primary transition duration-200"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Track Zone</span>
          </Button>
        )}
      </td>
    </tr>
  );
});

TimezoneRow.displayName = "TimezoneRow";

const TimezoneListView = ({ clocks, localClock, createClock }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const timezoneList = useMemo(() => {
    // Generate array of timezones with offsets
    return ALL_TIMEZONE_OFFSET.map(name => {
      // UTC/GMT offset is 0
      const offset = name === "UTC" || name === "GMT" ? 0 : (TIMEZONE_OFFSET[name] ?? 0);
      return { name, offset };
    });
  }, []);

  const filteredTimezones = useMemo(() => {
    return timezoneList.filter(tz => 
      tz.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [timezoneList, searchQuery]);

  const trackedZones = useMemo(() => {
    const tracked = new Set();
    if (localClock && localClock.timezone) {
      tracked.add(localClock.timezone);
    }
    clocks.forEach(c => {
      if (c.timezone) tracked.add(c.timezone);
    });
    return tracked;
  }, [clocks, localClock]);

  const handleTrackZone = useCallback((name, offsetMinutes) => {
    createClock({
      title: `${name} Tracking`,
      timezone: name,
      offset: offsetMinutes
    });
  }, [createClock]);

  // Statistics calculations
  const totalAvailable = timezoneList.length;
  const trackedCount = trackedZones.size;
  const rangeLabel = useMemo(() => {
    const offsets = Array.from(trackedZones).map(name => {
      return name === "UTC" || name === "GMT" ? 0 : (TIMEZONE_OFFSET[name] ?? 0);
    });
    if (offsets.length <= 1) return "0 hr";
    const min = Math.min(...offsets);
    const max = Math.max(...offsets);
    const diff = (max - min) / 60;
    return `${diff} hrs`;
  }, [trackedZones]);

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card/45 backdrop-blur-sm border border-border/55 rounded-xl p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{totalAvailable}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Timezones in Catalog</div>
          </div>
        </div>

        <div className="bg-card/45 backdrop-blur-sm border border-border/55 rounded-xl p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{trackedCount}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Tracked Locations</div>
          </div>
        </div>

        <div className="bg-card/45 backdrop-blur-sm border border-border/55 rounded-xl p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">{rangeLabel}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Tracked Spread Diff</div>
          </div>
        </div>
      </div>

      {/* Main Catalog Directory Table */}
      <div className="bg-card/45 backdrop-blur-md border border-border/55 rounded-xl p-6">
        
        {/* Table Toolbar Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-md font-bold text-foreground">Timezone Directory</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Inspect hours and pin locations to track differences on your main view.
            </p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/80" />
            <Input 
              type="text"
              placeholder="Search abbreviation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 w-full bg-background border-border/80"
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs font-bold uppercase tracking-wider bg-secondary/30">
                <th className="py-3 px-4 font-semibold">Timezone Code</th>
                <th className="py-3 px-4 font-semibold">Relative Offset</th>
                <th className="py-3 px-4 font-semibold">Active Current Time</th>
                <th className="py-3 px-4 text-right font-semibold">Workspace Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimezones.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-xs text-muted-foreground italic">
                    No timezone match found for "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredTimezones.map(tz => (
                  <TimezoneRow 
                    key={tz.name}
                    timezoneName={tz.name}
                    offsetMinutes={tz.offset}
                    isTracked={trackedZones.has(tz.name)}
                    onTrack={handleTrackZone}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Help Tip Footnote */}
        <div className="mt-4 flex items-start space-x-2 text-[10px] text-muted-foreground pt-3 border-t border-border/40">
          <Info className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-normal">
            Tracked timezones are pinned to the dashboard. To configure details (such as custom titles, scheduled clock events, or to delete tracking), return to the dashboard view.
          </p>
        </div>

      </div>

    </div>
  );
};

export default TimezoneListView;
