import { useState, useEffect, useCallback } from 'react';

export const useNotes = () => {
  const [savedNotes, setSavedNotes] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('calendar_notes');
    if (stored) {
      try {
        setSavedNotes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse calendar notes", e);
      }
    }
  }, []);

  const saveNote = useCallback((key, text) => {
    setSavedNotes(prev => {
      const newNotes = { ...prev, [key]: text };
      localStorage.setItem('calendar_notes', JSON.stringify(newNotes));
      return newNotes;
    });
  }, []);

  const getNote = useCallback((key) => {
    return savedNotes[key] || '';
  }, [savedNotes]);

  const hasNote = useCallback((key) => {
    return !!savedNotes[key] && savedNotes[key].trim().length > 0;
  }, [savedNotes]);

  return {
    savedNotes,
    saveNote,
    getNote,
    hasNote
  };
};
