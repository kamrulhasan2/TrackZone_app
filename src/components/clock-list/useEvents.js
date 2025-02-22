import React, { useState } from 'react'

const useEvents = () => {
    const [state,setState] = useState();

    const getEventsByClockId = (clockId) =>{
        return Object.keys(state).filter((item) => item.startsWith(clockId));
    }


  return {
    events: state,
    getEventsByClockId,
  }
}

export default useEvents;