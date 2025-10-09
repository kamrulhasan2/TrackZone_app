import { useState, useCallback, useMemo } from "react"
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

  const upDateLocalClock = useCallback((data) =>{
    setLocalClock(prevClock => ({
      ...prevClock,
      ...data,
    }));
  }, []);

  const createClock = useCallback((clock)=>{
    const newClock = { ...clock, id: generate() };
    setClocks(prevClocks => [...prevClocks, newClock]);
  }, []);

  const updateClock = useCallback((updatedClock)=>{
    setClocks(prevClocks => 
      prevClocks.map((clock) => 
        clock.id === updatedClock.id ? updatedClock : clock
      )
    );
  }, []);

  const deleteClock = useCallback((id)=>{
    setClocks(prevClocks => prevClocks.filter((clock) => clock.id !== id));
  }, []);

  const UnderConstruction = useMemo(() => (
    <div style={{ display:"flex",justifyContent:"space-between", marginRight:"220px"}}>
      <img src="/Track2one.png" alt="TrackZone" height={'100px'} width={'200px'}/>
      <h4><strong> `[Beta Version]` </strong> 
        <br />This site is under construction...
        <br />Stable version will be released soon...
      </h4>
    </div>
  ), []);


  return (
    <div>
      {UnderConstruction}
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