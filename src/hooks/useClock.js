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

const useClock = () => {
    const [state,setState] = useState({...init});
    const [utc, setUtc] = useState(null);

  return {
    clock: state,
  }
}

export default useClock;