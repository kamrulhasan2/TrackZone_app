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

  const UnderConstruction = () => {
    return (
      <div style={{ display:"flex",justifyContent:"space-between", marginRight:"220px"}}>
        <img src="/Track2one.png" alt="TrackZone" height={'100px'} width={'200px'}/>
        <h4><strong> `[Beta Version]` </strong> 
          <br />This site is under construction...
          <br />Stable version will be released soon...
        </h4>
      </div>
    );
  };


  return (
    <div>
      <UnderConstruction />
       <LocalClock 
          clock={localClock}
          updateClock={upDateLocalClock} 
          createClock={createClock}
          deleteClock={deleteClock}
       />
       <ClockList 
          clocks={clocks}
          updateClock={updateClock}
          deleteClock={deleteClock}
          localClock={localClock.date}
       />

    </div>
   
  )
}

export default App;