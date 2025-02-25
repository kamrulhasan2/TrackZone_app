import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, IconButton, Modal, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useEvents from "../../../hooks/useEvents";



const EventUI = ({ clockId }) => {
  const { events, addEvent, deleteEvent, getEventsByClockId } = useEvents();
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "" });
  const [open, setOpen] = useState(false);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    addEvent({ ...newEvent, clockId });
    setNewEvent({ title: "", date: "", time: "" });
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
              <Typography variant="h6">{events[eventId].title}</Typography>
              <Typography variant="body2" color="textSecondary">{events[eventId].date} {events[eventId].time}</Typography>
            </div>
            <IconButton onClick={() => deleteEvent(eventId)} color="error">
              <DeleteIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h6">Create Event</Typography>
          <TextField label="Title" fullWidth margin="normal" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
          <TextField type="date" fullWidth margin="normal" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
          <TextField type="time" fullWidth margin="normal" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
          <Button onClick={handleAddEvent} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Save Event</Button>
        </Box>
      </Modal>
    </Card>
  );
};

export default EventUI;