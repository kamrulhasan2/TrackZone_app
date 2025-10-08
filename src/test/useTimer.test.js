
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useTimer from '../hooks/useTimer';

describe('useTimer hook', () => {
  vi.useFakeTimers();

  it('should initialize with the given date', () => {
    const initialDate = new Date();
    const { result } = renderHook(() => useTimer(initialDate));

    expect(result.current).toBe(initialDate);
  });

  it('should update the time every second', () => {
    const initialDate = new Date();
    const { result } = renderHook(() => useTimer(initialDate));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.getTime()).toBe(initialDate.getTime() + 1000);

    act(() => {
        vi.advanceTimersByTime(5000);
    });

    expect(result.current.getTime()).toBe(initialDate.getTime() + 6000);

  });

  it('should clear the interval on unmount', () => {
    const initialDate = new Date();
    const { unmount } = renderHook(() => useTimer(initialDate));

    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledOnce();
  });

  it('should update the timer when the date prop changes', () => {
    const initialDate = new Date();
    const { result, rerender } = renderHook(({ date }) => useTimer(date), {
      initialProps: { date: initialDate },
    });

    const newDate = new Date(initialDate.getTime() + 10000);

    rerender({ date: newDate });

    expect(result.current).toBe(newDate);
  });
});
