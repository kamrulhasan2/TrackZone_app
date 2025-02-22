import React, { useState } from 'react'

const useEvents = () => {
    const [state,setState] = useState();

    const getEventsByClockId = (clockId) =>{
        return Object.keys(state).filter((item) => item.startsWith(clockId));
    }

    const getEvents = ( isArray = false){  //return Events as an Array
        if(!isArray){
            return state;
        }

        return Object.values(state);
    }


  return {
    events: state,
    getEventsByClockId,
  }
}

export default useEvents;