import ClockLIstItem from "./ClockLIstItem"

const ClockList = ({clocks, updateClock, deleteClock, localClock}) => {  
  return (
    <div>
      <h3>Other Clocks</h3>
      <hr />

      {
        ClockList.length === 0? (
          <p>There is no clock, Please create a clock </p>
        ) : (
          <div>
            {
              clocks.map((clock)=>(
                <ClockLIstItem
                  key={clock.id}
                  clock={clock}
                  updateClock={updateClock}
                  deleteClock={deleteClock}
                  localClock={localClock}
                />
              ))
            }
          </div>
        )
      }

    </div>
  )
}

export default ClockList;