import { useState, memo, useCallback } from "react";
import ClockForm from "../clock-form/ClockForm";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-4 mt-4">
        <div className="flex justify-center space-x-4">
                <Button onClick={handleEdit}>Edit</Button>
                {
                    local ? (
                        <Button onClick={handleCreate}>Create</Button>
                    ) : (
                        <Button onClick={handleDelete} variant="destructive">Delete</Button>
                    )
                }
        </div>

        <div className="space-y-4">
                {
                    isEdit && (
                        <div className="p-4 border rounded-md">
                            <h3 className="text-lg font-semibold mb-2 text-center">Edit Clock</h3>
                            <ClockForm 
                                handleClock={updateClock}
                                edit={true}
                                title={!local}
                                values={clock}
                            />
                        </div>
                    )
                }

                {
                    isCreate && (
                        <div className="p-4 border rounded-md">
                            <h3 className="text-lg font-semibold mb-2 text-center">Create New Clock</h3>
                            <ClockForm 
                                handleClock={handleClock}
                            />
                        </div>
                    )
                }
        </div>
    </div>
  )
}

export default memo(ClockActions);
