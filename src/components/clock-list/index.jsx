import ClockListItem from "./ClockLIstItem";

const ClockList = ({ clocks, updateClock, deleteClock, localClock }) => {
  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Other Clocks</h3>

      {clocks.length === 0 ? ( 
        <p>There is no clock, Please create a clock</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap", 
            gap: "10px",
            justifyContent: "flex-start",
            width: "100%", 
          }}
        >
          {clocks.map((clock) => (
            <div
              key={clock.id}
              style={{
                flex: "0 0 calc(33.33% - 10px)", 
                boxSizing: "border-box",
                textAlign: "center",
              }}
            >
              <ClockListItem
                clock={clock}
                updateClock={updateClock}
                deleteClock={deleteClock}
                localClock={localClock}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClockList;
