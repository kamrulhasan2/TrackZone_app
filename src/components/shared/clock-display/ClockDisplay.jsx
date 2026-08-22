import { format } from 'date-fns';
import React, { memo, useMemo } from 'react'


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
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Title: {title}</h1>
            <h3 className="text-lg text-gray-700 dark:text-gray-200"><span>Date : </span>{formattedDate}</h3>
            <h3 className="text-lg text-gray-700 dark:text-gray-200"><span>Time : </span>{formattedTime}</h3>

            <p className="text-sm text-gray-600 dark:text-gray-300">
                <span>Timezone: </span>
                {timezone}
                {offsetDisplay}
            </p>
        </div>
    )
}

export default memo(ClockDisplay);
