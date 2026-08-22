import { useState, memo, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useEvents from "../../../hooks/useEvents";
import { eventSchema } from "../../../utils/validation";
import { Trash2, Edit } from "lucide-react";

const EventUI = ({ clock }) => {
  const { events, addEvent, deleteEvent, updateEvents, getEventsByClockId } = useEvents();
  const [newEvent, setNewEvent] = useState({ title: "",description:"", date: "", time: "" });
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
      
      setNewEvent({ title: "",description:"", date: "", time: "" });
      setEditEventId(null);
      setOpen(false);
      setErrors({});
    } catch (e) {
      const newErrors = {};
      e.inner.forEach(err => {
          newErrors[err.path] = err.message;
      });
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
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Event Tracker for {clock.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4">Add Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editEventId ? "Edit Event" : "Create Event"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={newEvent.title} 
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={newEvent.description} 
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={newEvent.date} 
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} 
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={newEvent.time} 
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} 
                />
                {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddOrUpdateEvent}>
                {editEventId ? "Update Event" : "Save Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
      {eventIds.map((eventId) => (
        <Card key={eventId} className="mt-2">
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{events[eventId].title}</p>
              <p className="text-sm text-gray-600">{events[eventId].description}</p>
              <p className="text-xs text-gray-500">{events[eventId].date} {events[eventId].time}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setNewEvent(events[eventId]);
                  setEditEventId(eventId);
                  setOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteEvent(eventId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </Card>
  );
};

export default memo(EventUI);
