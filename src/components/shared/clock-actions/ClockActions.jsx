import { useState, memo, useCallback } from "react";
import ClockForm from "../clock-form/ClockForm";
import ButtonLocal from "../../../ui/button/ButtonLocal";



const ClockActions = ({local=false, clock,updateClock,createClock, deleteClock}) => {
    const [isEdit,setIsEdit] = useState(false);
    const [isCreate,setIsCreate] = useState(false);

    const handleClock = useCallback((values) => {
        createClock(values);
    }, [createClock]);
    
    const handleEdit = useCallback(() => {
        setIsEdit(prev => !prev);
    }, []);
    
    const handleCreate = useCallback(() => {
        setIsCreate(prev => !prev);
    }, []);
    
    const handleDelete = useCallback(() => {
        deleteClock(clock.id);
    }, [deleteClock, clock.id]);

   
  return (      
    <div >  
        <div style={{display:'flex',justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
                <ButtonLocal
                    text={'Edit'} 
                    onClick={handleEdit} 
                    color={'warning'}
                    size={'small'}
                />

                {
                    local ? (
                        <ButtonLocal
                            text={'Create'} 
                            onClick={handleCreate} 
                            color={'info'}
                            size={'small'}
                        />
                    ) : (
                        <ButtonLocal
                            text={'Delete'} 
                            onClick={handleDelete} 
                            color={'info'}
                            size={'small'}
                        />
                    )
                }

        </div>

        <div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
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

    </div>
  )
}

export default memo(ClockActions);
