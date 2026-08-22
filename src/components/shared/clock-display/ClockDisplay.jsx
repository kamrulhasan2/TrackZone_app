import { format } from 'date-fns';
import React, { memo, useMemo } from 'react'
import { Sun, Moon, Calendar, Globe } from "lucide-react";

const ClockDisplay = ({ date, title, timezone, offset }) => {
    const offsetHr = useMemo(() => offset / 60, [offset]);
    
    const formattedDate = useMemo(() => {
        if (!date) return '';
        return format(date, 'eeee, MMMM d, yyyy');
    }, [date]);
    
    const formattedTime = useMemo(() => {
        if (!date) return '';
        return format(date, 'hh:mm:ss a');
    }, [date]);
    
    const offsetDisplay = useMemo(() => {
        if (offsetHr === 0) return 'UTC';
        return offsetHr > 0 ? `UTC +${Math.abs(offsetHr)}` : `UTC -${Math.abs(offsetHr)}`;
    }, [offsetHr]);

    const isDay = useMemo(() => {
        if (!date) return true;
        const hour = date.getHours();
        return hour >= 6 && hour < 18;
    }, [date]);

    return (
        <div className="flex flex-col space-y-4 text-left p-2">
            
            {/* Header info / Title & Day-Night Badge */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Location / Title</span>
                    <h3 className="text-lg font-bold text-foreground tracking-tight">{title}</h3>
                </div>

                <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    isDay 
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' 
                      : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                }`}>
                    {isDay ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                    <span>{isDay ? 'Day' : 'Night'}</span>
                </div>
            </div>

            {/* Main Clock Face */}
            <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-wider text-foreground select-all bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {formattedTime}
                </div>
                
                <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formattedDate}</span>
                </div>
            </div>

            {/* Timezone badge details */}
            <div className="flex items-center space-x-2 pt-1">
                <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-secondary/80 border border-border/40 text-[10px] font-semibold tracking-wide text-secondary-foreground">
                    <Globe className="h-3 w-3 opacity-70" />
                    <span>{timezone}</span>
                </div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                    {offsetDisplay}
                </div>
            </div>
            
        </div>
    )
}

export default memo(ClockDisplay);
