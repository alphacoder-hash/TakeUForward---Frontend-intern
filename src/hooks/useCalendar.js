import { useState, useCallback } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth,
  addMonths, 
  subMonths,
  isBefore,
  isAfter,
  startOfWeek,
  endOfWeek
} from 'date-fns';



export const useCalendar = (initialDate = new Date()) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialDate));
  const [selection, setSelection] = useState({ start: null, end: null });

  const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
  const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const handleDateClick = useCallback((date) => {
    setSelection(prev => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: date, end: null };
      }
      
      if (isBefore(date, prev.start)) {
        return { start: date, end: null };
      }
      
      return { ...prev, end: date };
    });
  }, []);

  const isInRange = useCallback((date) => {
    if (!selection.start || !selection.end) return false;
    return (isAfter(date, selection.start) || isSameDay(date, selection.start)) && 
           (isBefore(date, selection.end) || isSameDay(date, selection.end));
  }, [selection]);

  const isStart = useCallback((date) => selection.start && isSameDay(date, selection.start), [selection]);
  const isEnd = useCallback((date) => selection.end && isSameDay(date, selection.end), [selection]);

  return {
    currentMonth,
    days,
    nextMonth,
    prevMonth,
    selection,
    handleDateClick,
    isInRange,
    isStart,
    isEnd
  };
};
