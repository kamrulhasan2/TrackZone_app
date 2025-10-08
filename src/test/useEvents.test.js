import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useEvents from '../hooks/useEvents';

describe('useEvents hook', () => {
  it('should add a new event', () => {
    const { result } = renderHook(() => useEvents());

    act(() => {
      result.current.addEvent({ clockId: 'clock1', title: 'Test Event' });
    });

    const events = result.current.getEvents(true);
    expect(events).toHaveLength(1);
    expect(events[0].title).toBe('Test Event');
  });

  it('should return events for a specific clock', () => {
    const { result } = renderHook(() => useEvents());

    act(() => {
      result.current.addEvent({ clockId: 'clock1', title: 'Event 1' });
      result.current.addEvent({ clockId: 'clock2', title: 'Event 2' });
    });

    const clock1Events = result.current.getEventsByClockId('clock1');
    expect(clock1Events).toHaveLength(1);
  });

  it('should update an event', () => {
    const { result } = renderHook(() => useEvents());
    let eventToAdd;

    act(() => {
      eventToAdd = result.current.addEvent({ clockId: 'clock1', title: 'Test Event' });
    });
    
    const eventId = `${eventToAdd.clockId}|${eventToAdd.id}`;

    act(() => {
      result.current.updateEvents({ title: 'Updated Event' }, eventId);
    });

    const events = result.current.getEvents(true);
    expect(events[0].title).toBe('Updated Event');
  });

  it('should delete a specific event', () => {
    const { result } = renderHook(() => useEvents());
    let eventToAdd;

    act(() => {
        eventToAdd = result.current.addEvent({ clockId: 'clock1', title: 'Test Event' });
    });

    const eventId = `${eventToAdd.clockId}|${eventToAdd.id}`;

    act(() => {
      result.current.deleteEvent(eventId);
    });

    const events = result.current.getEvents(true);
    expect(events).toHaveLength(0);
  });

  it('should delete all events for a clock', () => {
    const { result } = renderHook(() => useEvents());

    act(() => {
      result.current.addEvent({ clockId: 'clock1', title: 'Event 1' });
      result.current.addEvent({ clockId: 'clock1', title: 'Event 2' });
      result.current.addEvent({ clockId: 'clock2', title: 'Event 3' });
    });

    act(() => {
      result.current.deleteEventByClock('clock1');
    });

    const events = result.current.getEvents(true);
    expect(events).toHaveLength(1);
    expect(events[0].clockId).toBe('clock2');
  });
});
