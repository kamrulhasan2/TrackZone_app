import React, { useState, useMemo, useCallback } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday 
} from "date-fns";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CalendarDays, 
  Clock, 
  Globe, 
  Info,
  Trash2,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { eventSchema } from "../../../utils/validation";

const CalendarView = ({ clocks, localClock, eventsManager }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterToSelectedDay, setFilterToSelectedDay] = useState(true);
  
  // Event Form State
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", time: "" });
  const [selectedClockId, setSelectedClockId] = useState("local");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const eventsList = useMemo(() => {
    return eventsManager.getEvents(true);
  }, [eventsManager]);

  const allClocks = useMemo(() => {
    return [
      { id: "local", title: localClock.title || "My Clock", timezone: localClock.timezone, offset: localClock.offset },
      ...clocks
    ];
  }, [clocks, localClock]);

  // Calendar calculations
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay(); // 0 = Sunday, 1 = Monday
  const paddingDays = Array(startDayOfWeek).fill(null);
  const gridDays = [...paddingDays, ...monthDays];

  // Month navigation
  const nextMonth = useCallback(() => setCurrentMonth(prev => addMonths(prev, 1)), []);
  const prevMonth = useCallback(() => setCurrentMonth(prev => subMonths(prev, 1)), []);

  // Time conversion helper
  const getConvertedTime = useCallback((eventDateStr, eventTimeStr, remoteOffset, localOffset) => {
    try {
      const [hours, minutes] = eventTimeStr.split(":").map(Number);
      const [year, month, day] = eventDateStr.split("-").map(Number);
      
      // Date in remote clock terms
      const remoteDate = new Date(year, month - 1, day, hours, minutes);
      
      // Shift calculation: local - remote (subtract remote to get UTC, add local to get target)
      const shiftMinutes = localOffset - remoteOffset;
      const localDate = new Date(remoteDate.getTime() + shiftMinutes * 60 * 1000);
      
      return format(localDate, "hh:mm a (eeee, MMM d)");
    } catch (e) {
      return eventTimeStr;
    }
  }, []);

  // Filtered Agenda events
  const agendaEvents = useMemo(() => {
    if (!filterToSelectedDay) return eventsList;
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
    return eventsList.filter(event => event.date === selectedDateStr);
  }, [eventsList, selectedDate, filterToSelectedDay]);

  const handleOpenCreateDialog = useCallback(() => {
    setNewEvent({
      title: "",
      description: "",
      date: format(selectedDate, "yyyy-MM-dd"),
      time: "10:00"
    });
    setSelectedClockId("local");
    setErrors({});
    setDialogOpen(true);
  }, [selectedDate]);

  const handleAddEvent = useCallback(() => {
    try {
      eventSchema.validateSync(newEvent, { abortEarly: false });
      eventsManager.addEvent({
        ...newEvent,
        clockId: selectedClockId
      });
      setDialogOpen(false);
      setNewEvent({ title: "", description: "", date: "", time: "" });
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
  }, [newEvent, selectedClockId, eventsManager]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Calendar Card Block */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-card/45 backdrop-blur-md border border-border/55 rounded-xl p-6">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-1">
              <Calendar className="h-5 w-5 text-muted-foreground mr-1" />
              <h3 className="text-lg font-bold text-foreground">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={prevMonth} 
                className="p-1.5 rounded-lg border border-border/40 hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date())} 
                className="text-xs px-2.5 py-1.5 rounded-lg border border-border/40 hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition"
              >
                Today
              </button>
              <button 
                onClick={nextMonth} 
                className="p-1.5 rounded-lg border border-border/40 hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-muted-foreground text-xs uppercase tracking-wider mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {gridDays.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="aspect-square bg-secondary/10 rounded-lg opacity-30" />;
              }

              const dateStr = format(day, "yyyy-MM-dd");
              const isSelected = isSameDay(day, selectedDate);
              const dayIsToday = isToday(day);
              const dayHasEvent = eventsList.some(event => event.date === dateStr);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-between p-1.5 relative border transition-all duration-200 ${
                    isSelected 
                      ? "bg-primary border-primary text-primary-foreground font-bold shadow-md shadow-primary/10" 
                      : dayIsToday 
                        ? "bg-amber-500/10 border-amber-500/35 text-amber-600 dark:text-amber-400 font-bold" 
                        : "bg-card/20 border-border/40 hover:border-primary/25 hover:bg-secondary/35 text-foreground"
                  }`}
                >
                  <span className="text-xs sm:text-sm self-start">{day.getDate()}</span>
                  
                  {/* Event indicator dot */}
                  {dayHasEvent && (
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-primary-foreground" : "bg-primary animate-pulse"
                    }`} />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Agenda sidebar block */}
      <div className="space-y-4">
        <div className="bg-card/45 backdrop-blur-md border border-border/55 rounded-xl p-5 flex flex-col justify-between min-h-[400px]">
          
          <div className="space-y-5">
            {/* Header agenda & trigger */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center space-x-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Agenda List</span>
                </h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {format(selectedDate, "eeee, MMMM d")}
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    onClick={handleOpenCreateDialog} 
                    className="h-8 px-2 text-xs font-semibold flex items-center space-x-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold tracking-tight">Schedule New Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    
                    {/* Clock Choice dropdown */}
                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="clockId" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Associate Timezone / Clock
                      </Label>
                      <Select value={selectedClockId} onValueChange={setSelectedClockId}>
                        <SelectTrigger className="w-full bg-background border border-border/80">
                          <SelectValue placeholder="Select clock location" />
                        </SelectTrigger>
                        <SelectContent>
                          {allClocks.map(c => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.title} ({c.timezone})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Event Title */}
                    <div className="space-y-1 text-left">
                      <Label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Event Title
                      </Label>
                      <Input 
                        id="title" 
                        placeholder="e.g. Sync Scrum, Production Deploy"
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
                        placeholder="Provide details"
                        value={newEvent.description} 
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
                        className="h-9 focus:ring-2 focus:ring-ring"
                      />
                      {errors.description && <p className="text-red-500 text-[11px] font-medium mt-0.5">{errors.description}</p>}
                    </div>

                    {/* Date / Time */}
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
                          className="h-9"
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
                          className="h-9"
                        />
                        {errors.time && <p className="text-red-500 text-[11px] font-medium mt-0.5">{errors.time}</p>}
                      </div>
                    </div>

                  </div>
                  <DialogFooter className="pt-2">
                    <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" onClick={handleAddEvent}>
                      Schedule
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between text-xs bg-secondary/30 border border-border/30 rounded-lg p-2">
              <span className="text-muted-foreground">Filter to selected date</span>
              <button 
                onClick={() => setFilterToSelectedDay(prev => !prev)}
                className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                  filterToSelectedDay 
                    ? "bg-primary text-primary-foreground shadow" 
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {filterToSelectedDay ? "Active" : "Inactive"}
              </button>
            </div>

            {/* Event rows */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {agendaEvents.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground italic">
                  No events scheduled for this view.
                </div>
              ) : (
                agendaEvents.map(event => {
                  const clockMatch = allClocks.find(c => c.id === event.clockId) || {
                    title: "Unknown Clock",
                    timezone: "UTC",
                    offset: 0
                  };

                  const localTimeConverted = getConvertedTime(
                    event.date,
                    event.time,
                    clockMatch.offset,
                    localClock.offset
                  );

                  return (
                    <div 
                      key={event.id || `${event.clockId}|${event.title}`} 
                      className="border border-border/40 hover:border-primary/20 rounded-xl p-3 bg-card/25 text-left relative group transition"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between">
                          <h5 className="text-xs font-bold text-foreground leading-tight truncate max-w-[130px]">
                            {event.title}
                          </h5>
                          
                          {/* Trash indicator */}
                          <button
                            onClick={() => eventsManager.deleteEvent(`${event.clockId}|${event.id}`)}
                            className="text-muted-foreground hover:text-destructive p-0.5 rounded opacity-0 group-hover:opacity-100 transition duration-150"
                            aria-label="Delete event"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="space-y-1 border-t border-border/30 pt-1.5 mt-1 text-[9px]">
                          {/* Remote Time */}
                          <div className="flex items-center space-x-1.5 text-muted-foreground">
                            <Clock className="h-3 w-3 opacity-70" />
                            <span>At Location:</span>
                            <span className="font-semibold text-foreground">{event.time}</span>
                            <span className="px-1 rounded bg-secondary/80 border border-border/30 font-semibold">
                              {clockMatch.title} ({clockMatch.timezone})
                            </span>
                          </div>
                          
                          {/* Local Time Converted */}
                          <div className="flex items-center space-x-1.5 text-muted-foreground">
                            <Globe className="h-3 w-3 opacity-70 text-indigo-400" />
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">In Local Time:</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {localTimeConverted}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Timezone Helper Footnote */}
          <div className="pt-3 border-t border-border/40 flex items-start space-x-2 text-[9px] text-muted-foreground">
            <Info className="h-3 w-3 shrink-0 text-amber-500" />
            <p className="leading-normal">
              Events are scheduled in the target clock's local time coordinates and automatically cross-calculated to your primary local time grid.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default CalendarView;
