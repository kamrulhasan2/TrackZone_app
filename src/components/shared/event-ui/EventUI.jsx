import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, IconButton, Modal, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useEvents from "../../../hooks/useEvents";

const EventUI = ({ clockId }) => {
  const { events, addEvent, deleteEvent, updateEvents, getEventsByClockId } = useEvents();
  const [newEvent, setNewEvent] = useState({ title: "",description:"", date: "", time: "" });
  const [open, setOpen] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  const handleAddOrUpdateEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.time) return;
    
    if (editEventId) {
      updateEvents(newEvent, editEventId);
    } else {
      addEvent({ ...newEvent, clockId });
    }
    
    setNewEvent({ title: "",description:"", date: "", time: "" });
    setEditEventId(null);
    setOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", padding: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Event Tracker</Typography>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>Add Event</Button>
      </CardContent>
      {getEventsByClockId(clockId).map((eventId) => (
        <Card key={eventId} sx={{ margin: 1, padding: 1, boxShadow: 1 }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Typography variant="h5">{events[eventId].title}</Typography>
              <Typography variant="p">{events[eventId].description}</Typography>
              <Typography variant="body2" color="textSecondary">{events[eventId].date} {events[eventId].time}</Typography>
            </div>
            <div>
              <IconButton onClick={() => {
                setNewEvent(events[eventId]);
                setEditEventId(eventId);
                setOpen(true);
              }} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteEvent(eventId)} color="error">
                <DeleteIcon />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      ))}
      <Modal open={open} onClose={() => {
        setOpen(false);
        setEditEventId(null);
      }}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h6">{editEventId ? "Edit Event" : "Create Event"}</Typography>
          <TextField label="Title" fullWidth margin="normal" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
          <TextField label="Description" fullWidth margin="normal" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
          <TextField type="date" fullWidth margin="normal" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
          <TextField type="time" fullWidth margin="normal" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
          <Button onClick={handleAddOrUpdateEvent} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>{editEventId ? "Update Event" : "Save Event"}</Button>
        </Box>
      </Modal>
    </Card>
  );
};

export default EventUI;
