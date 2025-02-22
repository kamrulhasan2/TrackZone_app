import { de } from 'date-fns/locale';
import React, { useState } from 'react'
import { generate } from 'shortid';

const useEvents = () => {
    const [state,setState] = useState();

    const getEventsByClockId = (clockId) =>{
        return Object.keys(state).filter((item) => item.startsWith(clockId));
    }

    const getEvents = ( isArray = false) =>{  //return Events as an Array
        if(!isArray){
            return state;
        }

        return Object.values(state);
    }

    const addEvent = (event)=>{
        event.id = generate();

        const {id, clockId} = event;

        setState((prev)=>({
            ...prev,
            [`${clockId}|${id}`]: event
        }));

        return event;

    }

    const deleteEvent = (id)=>{
        const events = {...state};
        delete events[id];
        setState(events);
    }


  return {
    events: state,
    getEventsByClockId,
    getEvents,
    addEvent,
    deleteEvent,

  }
}

export default useEvents;