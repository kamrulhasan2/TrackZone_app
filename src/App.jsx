import { useState } from "react"
import ClockList from "./components/clock-list"
import LocalClock from "./components/local-clock"
import { generate } from "shortid";



const  LOCAL_CLOCK_INIT = {
  title: 'My Clock',
  timezone: '',
  offset: 0,
  date: null,
};

const App = () => {
  const [localClock,setLocalClock] = useState({...LOCAL_CLOCK_INIT});
  const [clocks,setClocks] = useState([]);

  const upDateLocalClock = (data) =>{
    setLocalClock({
      ...localClock,
      ...data,
    });
  };

  const createClock = (clock)=>{
    clock.id = generate();

    console.log(clock);

    setClocks([
      ...clocks,
      clock
    ]);
  }

  const updateClock = (updatedClock)=>{
    const updatedColocks = clocks.map((clock)=>{
      if( clock.id === updatedClock.id ){
        return updatedClock;
      }
      return clock;
    });

    setClocks(updatedColocks);
  }


  const deleteClock = (id)=>{
    const updatedColocks = clocks.filter((clock)=> clock.id !== id);

    setClocks(updatedColocks);
  }

  return (
    <div>
       <LocalClock 
          clock={localClock}
          updateClock={upDateLocalClock} 
          createClock={createClock}
       />
       <ClockList />

    </div>
   
  )
}

export default App;