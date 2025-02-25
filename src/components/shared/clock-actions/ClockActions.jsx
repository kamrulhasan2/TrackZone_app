import { useState } from "react";
import ClockForm from "../clock-form/ClockForm";
import ButtonLocal from "../../../ui/button/ButtonLocal";


const ClockActions = ({local=false, clock,updateClock,createClock, deleteClock}) => {
    const [isEdit,setIsEdit] = useState(false);
    const [isCreate,setIsCreate] = useState(false);

    const handleClock = (values)=>{
        createClock(values);
    }

   
  return (      
    <div>  
        <ButtonLocal
            text={'Edit'} 
            onClick={() => setIsEdit(!isEdit)} 
            color={'warning'}
            size={'small'}
         />

        {
            local ? (
                <ButtonLocal
                    text={'Create'} 
                    onClick={() => setIsCreate(!isCreate)} 
                    color={'info'}
                    size={'small'}
                />
            ) : (
                <ButtonLocal
                    text={'Delete'} 
                    onClick={() => deleteClock(clock.id)} 
                    color={'info'}
                    size={'small'}
                />
            )
        }

        {
            isEdit && (
                <>
                    <h3>Edit Clock</h3>
                    <ClockForm 
                        handleClock={updateClock}
                        edit={true}
                        title={!local}
                        values={clock}
                    />
                </>
            )
        }

        {
            isCreate && (
                <>
                    <h3>Create New Clock</h3>
                    <ClockForm 
                        handleClock={handleClock}
                    />
                </>
            )
        }
    </div>
  )
}

export default ClockActions;