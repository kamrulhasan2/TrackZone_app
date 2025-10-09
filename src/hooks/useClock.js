import { addMinutes } from "date-fns";
import { useEffect, useState, useMemo } from "react";
import { TIMEZONE_OFFSET } from "../constants/timezone";

const useClock = (timezone, offset) => {
    const [localDate, setLocalDate] = useState(null);
    const [localTimezone, setLocalTimezone] = useState(null);
    const [localOffset, setLocalOffset] = useState(0);
    const [utc, setUtc] = useState(null);

    // Initialize UTC time only once
    useEffect(() => {
        const d = new Date();
        const lo = d.getTimezoneOffset();  // find local offset
        const utcTime = addMinutes(d, lo); // convert local time to UTC
        setUtc(utcTime);
        setLocalOffset(lo);
    }, []);

    // Memoize the effective offset calculation
    const effectiveOffset = useMemo(() => {
        return timezone ? (TIMEZONE_OFFSET[timezone] ?? offset) : -localOffset;
    }, [timezone, offset, localOffset]);

    // Update local date when UTC or timezone changes
    useEffect(() => {
        if (utc !== null) {
            if (timezone) {
                const newUtc = addMinutes(utc, effectiveOffset);
                setLocalDate(newUtc);
            } else {
                const newUtc = addMinutes(utc, -localOffset);
                const dateStrArr = newUtc.toUTCString().split(' ');
                setLocalDate(newUtc);
                setLocalTimezone(dateStrArr.pop());
            }
        }
    }, [utc, timezone, effectiveOffset, localOffset]);

    // Memoize the return object to prevent unnecessary re-renders
    return useMemo(() => ({
        date: localDate,
        dateUtc: utc,
        offset: effectiveOffset,
        timezone: timezone || localTimezone,
    }), [localDate, utc, effectiveOffset, timezone, localTimezone]);
};

export default useClock;