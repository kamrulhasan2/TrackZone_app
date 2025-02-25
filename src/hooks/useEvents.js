
import React, { useState } from 'react'
import { generate } from 'shortid';

const useEvents = () => {
    const [state,setState] = useState({});

    const getEventsByClockId = (clockId) =>{
        if(!state) return [];
        return Object.keys(state).filter((item) => item.startsWith(clockId));
    }

    const getEvents = ( isArray = false) =>{  //return Events as an Array
       if(!state) return isArray ? [] : {};
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

    const deleteEventByClock = (clockId)=>{
        const events = Object.keys(state).filter((item) => !item.startsWith(clockId));
        setState(events);
    }

    const updateEvents = (updatedEvent,id)=>{
        const events = {...state};

        events[id] = {
            ...events[id],
            updatedEvent
        };

        setState(events);
    }


  return {
    events: state,
    getEventsByClockId,
    getEvents,
    addEvent,
    deleteEvent,
    deleteEventByClock,
    updateEvents

  }
}

export default useEvents;