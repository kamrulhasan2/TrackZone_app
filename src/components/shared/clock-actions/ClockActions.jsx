import { useState, memo, useCallback } from "react";
import ClockForm from "../clock-form/ClockForm";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";

const ClockActions = ({local=false, clock, updateClock, createClock, deleteClock}) => {
    const [isEdit, setIsEdit] = useState(false);
    const [isCreate, setIsCreate] = useState(false);

    const handleClockCreate = useCallback((values) => {
        createClock(values);
        setIsCreate(false);
    }, [createClock]);

    const handleClockUpdate = useCallback((values) => {
        updateClock(values);
        setIsEdit(false);
    }, [updateClock]);
    
    const handleDelete = useCallback(() => {
        deleteClock(clock.id);
    }, [deleteClock, clock.id]);

  return (      
    <div className="flex items-center gap-2 mt-2">
        
        {/* Edit Dialog Modal */}
        <Dialog open={isEdit} onOpenChange={setIsEdit}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center space-x-1.5 text-xs font-semibold h-9">
              <Edit2 className="h-3.5 w-3.5 opacity-80" />
              <span>Edit</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight">Edit Clock Configuration</DialogTitle>
            </DialogHeader>
            <div className="pt-2">
              <ClockForm 
                  handleClock={handleClockUpdate}
                  edit={true}
                  title={!local}
                  values={clock}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Action button - Create (Primary) or Delete (Destructive) */}
        {local ? (
          <Dialog open={isCreate} onOpenChange={setIsCreate}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1 flex items-center justify-center space-x-1.5 text-xs font-semibold h-9">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create Clock</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">Create Secondary Clock</DialogTitle>
              </DialogHeader>
              <div className="pt-2">
                <ClockForm 
                    handleClock={handleClockCreate}
                />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button 
            onClick={handleDelete} 
            variant="destructive" 
            size="sm" 
            className="flex-1 flex items-center justify-center space-x-1.5 text-xs font-semibold h-9"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>
        )}

    </div>
  )
}

export default memo(ClockActions);
