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

  


  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen"> 
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <img src="/Track2one.png" alt="TrackZone" className="h-12 w-auto" />
          <div className="text-right">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">[Beta Version]</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">This site is under construction...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Stable version will be released soon...</p>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">TrackZone</h1>
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
    </div>
   
  )
}

export default App;