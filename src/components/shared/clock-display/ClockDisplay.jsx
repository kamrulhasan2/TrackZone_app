import { format } from 'date-fns';
import React from 'react'
import classes from './index.module.css'

const ClockDisplay = ({ date, title, timezone, offset}) => {
    let offsetHr = offset / 60 ;
   

    return (
    <div className={classes.card}>
        <h1>Title: {title}</h1>
        <h3><span>Date  : </span>{format(date, 'yyyy-MM-dd')}</h3>
        <h3><span>Time : </span>{format(date, ' hh:mm:ss aaa')}</h3>

        <p>
            <span>Timezone: </span>
            {timezone}
            {offsetHr > 0 ? `+${Math.abs(offsetHr)}` : `-${Math.abs(offsetHr)}` }
        </p>
    </div>
  )
}

export default ClockDisplay;