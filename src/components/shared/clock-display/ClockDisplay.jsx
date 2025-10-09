import { format } from 'date-fns';
import React, { memo, useMemo } from 'react'
import classes from './index.module.css'

const ClockDisplay = ({ date, title, timezone, offset}) => {
    const offsetHr = useMemo(() => offset / 60, [offset]);
    
    const formattedDate = useMemo(() => {
        if (!date) return '';
        return format(date, 'yyyy-MM-dd');
    }, [date]);
    
    const formattedTime = useMemo(() => {
        if (!date) return '';
        return format(date, ' hh:mm:ss aaa');
    }, [date]);
    
    const offsetDisplay = useMemo(() => {
        return offsetHr > 0 ? `+${Math.abs(offsetHr)}` : `-${Math.abs(offsetHr)}`;
    }, [offsetHr]);

    return (
        <div className={classes.card}>
            <h1>Title: {title}</h1>
            <h3><span>Date  : </span>{formattedDate}</h3>
            <h3><span>Time : </span>{formattedTime}</h3>

            <p>
                <span>Timezone: </span>
                {timezone}
                {offsetDisplay}
            </p>
        </div>
    )
}

export default memo(ClockDisplay);
