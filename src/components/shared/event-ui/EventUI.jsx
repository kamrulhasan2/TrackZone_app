import { useState, memo, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useEvents from "../../../hooks/useEvents";
import { eventSchema } from "../../../utils/validation";
import { Trash2, Edit2, Plus, CalendarDays } from "lucide-react";

const EventUI = ({ clock }) => {
  const { events, addEvent, deleteEvent, updateEvents, getEventsByClockId } = useEvents();
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", time: "" });
  const [open, setOpen] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [errors, setErrors] = useState({});

  const handleAddOrUpdateEvent = useCallback(() => {
    try {
      eventSchema.validateSync(newEvent, { abortEarly: false });
      if (editEventId) {
        updateEvents(newEvent, editEventId);
      } else {
        addEvent({ ...newEvent, clockId: clock.id });
      }
      
      setNewEvent({ title: "", description: "", date: "", time: "" });
      setEditEventId(null);
      setOpen(false);
      setErrors({});
    } catch (e) {
      const newErrors = {};
      if (e.inner) {
        e.inner.forEach(err => {
            newErrors[err.path] = err.message;
        });
      }
      setErrors(newErrors);
    }
  }, [newEvent, editEventId, updateEvents, addEvent, clock.id]);
  
  const handleOpenModal = useCallback(() => {
    setOpen(true);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setOpen(false);
    setEditEventId(null);
    setErrors({});
  }, []);
  
  const eventIds = useMemo(() => {
    return getEventsByClockId(clock.id);
  }, [getEventsByClockId, clock.id]);

  return (
    <div className="w-full space-y-4 mt-2">
      
      {/* Header with Scheduled Events title and Add Event Trigger */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center space-x-1.5">
          <CalendarDays className="h-3 w-3" />
          <span>Scheduled Events ({eventIds.length})</span>
        </h4>

        {/* Dialog for adding/editing event */}
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) handleCloseModal();
        }}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-semibold text-primary hover:bg-secondary flex items-center space-x-1">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Event</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight">
                {editEventId ? "Edit Scheduled Event" : "Schedule New Event"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-3">
              {/* Event Title */}
              <div className="space-y-1 text-left">
                <Label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Event Title
                </Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Sync Meeting, Release Deployment"
                  value={newEvent.title} 
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
                  className="h-9 focus:ring-2 focus:ring-ring"
                />
                {errors.title && <p className="text-red-500 text-[11px] font-medium mt-0.5">{errors.title}</p>}
              </div>

              {/* Event Description */}
              <div className="space-y-1 text-left">
                <Label htmlFor="description" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </Label>
                <Input 
                  id="description" 
                  placeholder="Provide brief event details"
                  value={newEvent.description} 
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
                  className="h-9 focus:ring-2 focus:ring-ring"
                />
                {errors.description && <p className="text-red-500 text-[11px] font-medium mt-0.5">{errors.description}</p>}
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="space-y-1">
                  <Label htmlFor="date" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newEvent.date} 
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} 
                    className="h-9 focus:ring-2 focus:ring-ring"
                  />
                  {errors.date && <p className="text-red-500 text-[11px] font-medium mt-0.5">{errors.date}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="time" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Time
                  </Label>
                  <Input 
                    id="time" 
                    type="time" 
                    value={newEvent.time} 
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} 
                    className="h-9 focus:ring-2 focus:ring-ring"
                  />
                  {errors.time && <p className="text-red-500 text-[11px] font-medium mt-0.5">{errors.time}</p>}
                </div>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" size="sm" onClick={handleAddOrUpdateEvent}>
                {editEventId ? "Save Event" : "Schedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events timeline representation */}
      {eventIds.length === 0 ? (
        <div className="text-[11px] text-muted-foreground/80 italic pl-1">
          No events scheduled.
        </div>
      ) : (
        <div className="relative pl-4 space-y-4 border-l border-border/80 ml-2 py-1.5">
          {eventIds.map((eventId) => {
            const event = events[eventId];
            return (
              <div key={eventId} className="relative group text-left">
                {/* Timeline Bullet Node */}
                <span className="absolute -left-[20px] top-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-4 ring-background"></span>
                
                {/* Content block */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{event.title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{event.description}</p>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="px-1.5 py-0.5 rounded bg-secondary/80 border border-border/40 font-mono text-[9px] text-muted-foreground font-semibold">
                        {event.date}
                      </span>
                      <span className="font-mono text-[9px] font-semibold text-foreground/70">
                        {event.time}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition duration-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setNewEvent(event);
                        setEditEventId(eventId);
                        setOpen(true);
                      }}
                      className="h-6 w-6 text-muted-foreground hover:text-foreground rounded"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteEvent(eventId)}
                      className="h-6 w-6 text-destructive hover:text-destructive/95 hover:bg-destructive/10 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default memo(EventUI);
