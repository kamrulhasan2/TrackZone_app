import { useState } from "react"
import ClockList from "./components/clock-list"
import LocalClock from "./components/local-clock"
import useClock from "./hooks/useClock"


const  LOCAL_CLOCK_INIT = {
  title: 'My Clock',
  timezone: '',
  offset: 0,
  date: null,
};

const App = () => {
  const [localClock,setLocalClock] = useState({...LOCAL_CLOCK_INIT});

  const upDateLocalClock = (data) =>{
    setLocalClock({
      ...localClock,
      data,
    });
  };

   const {} = useClock();
  return (
    <div>
       <LocalClock clock={localClock} updateClock={upDateLocalClock} />
       <ClockList />

    </div>
   
  )
}

export default App