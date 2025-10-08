import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import useClock from '../hooks/useClock';

describe('useClock hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with current time in UTC', () => {
    const mockDate = new Date('2024-01-01T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    const { result } = renderHook(() => useClock());

    expect(result.current.dateUtc.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('should return correct time for a given timezone', () => {
    const mockDate = new Date('2024-01-01T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    const { result } = renderHook(() => useClock('PST'));
    
    //PST is UTC-7, so 2024-01-01T00:00:00.000Z is 2023-12-31T17:00:00.000 in PST
    const expectedDate = new Date(mockDate.getTime() - 7 * 60 * 60 * 1000);
    const expectedDateinISO = expectedDate.toISOString().slice(0, -5);
    const resultDateInISO = result.current.date.toISOString().slice(0,-5);

    expect(resultDateInISO).toBe(expectedDateinISO);
  });

  it('should update time when timezone changes', () => {
    const mockDate = new Date('2024-01-01T00:00:00.000Z');
    vi.setSystemTime(mockDate);

    const { result, rerender } = renderHook(({ timezone }) => useClock(timezone), {
      initialProps: { timezone: 'PST' },
    });

    //PST is UTC-7
    const expectedDatePST = new Date(mockDate.getTime() - 7 * 60 * 60 * 1000);
    const expectedDateinISO = expectedDatePST.toISOString().slice(0, -5);
    const resultDateInISO = result.current.date.toISOString().slice(0,-5);

    expect(resultDateInISO).toBe(expectedDateinISO);

    rerender({ timezone: 'EST' });

    //EST is UTC-4
    const expectedDateEST = new Date(mockDate.getTime() - 4 * 60 * 60 * 1000);
    const expectedDateESTinISO = expectedDateEST.toISOString().slice(0, -5);
    const resultDateESTInISO = result.current.date.toISOString().slice(0,-5);

    expect(resultDateESTInISO).toBe(expectedDateESTinISO);
  });
});
