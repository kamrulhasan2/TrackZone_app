import { addMinutes } from "date-fns";
import { useEffect } from "react";
import { useState } from "react";

const init = {
    id: '',
    title: '',
    timezone: {
        type: '',
        offset: '',
    },
    date_utc: null,
    date: null
};

const TIMEZONE_OFFSET = {
    PST: -7 * 60,
    EST: -4 * 60,
    EDT: -4 * 60,
    BST: 1 * 60,
    MST: -6 * 60
};


const useClock = () => {
    const [state,setState] = useState({...init});
    const [utc, setUtc] = useState(null);

    useEffect(()=>{
        let d = new Date();
        const localOffset = d.getTimezoneOffset();
        d = addMinutes(d, localOffset);
        setUtc(d);

    },[]);

  return {
    clock: state,
  }
}

export default useClock;