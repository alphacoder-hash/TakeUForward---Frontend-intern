import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote } from 'lucide-react';
import './StickerNotes.css';

const StickerNotes = ({ selection, notesData }) => {
  const { saveNote, getNote } = notesData;
  const [localText, setLocalText] = useState('');

  const getSelectionKey = () => {
    if (!selection.start) return 'general_month_note'; 
    if (selection.end) return `range_${format(selection.start, 'yyyy-MM-dd')}_${format(selection.end, 'yyyy-MM-dd')}`;
    return `date_${format(selection.start, 'yyyy-MM-dd')}`;
  };

  const currentKey = getSelectionKey();

  useEffect(() => {
    setLocalText(getNote(currentKey));
  }, [currentKey, getNote]);

  const handleBlur = () => {
    saveNote(currentKey, localText);
  };

  return (
    <div className="notes-wrapper-wall">
       <AnimatePresence mode="wait">
        <motion.div 
            className="sticker-note-container"
            initial={{ opacity: 0, y: 15, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 1 }}
            exit={{ opacity: 0, scale: 0.9, rotate: -5 }}
            key={currentKey}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="washi-tape"></div>
            <div className="sticker-content">
              <div className="sticker-header">
                <span className="sticker-date">
                  {!selection.start 
                    ? "Monthly Memo"
                    : selection.end 
                      ? `${format(selection.start, 'MMM d')} - ${format(selection.end, 'MMM d')}`
                      : format(selection.start, 'MMM do, yyyy')
                  }
                </span>
                <StickyNote size={14} className="sticker-icon" />
              </div>
              <textarea
                className="sticker-input"
                placeholder={!selection.start ? "General notes for the month..." : "Pen a reminder..."}
                value={localText}
                onChange={(e) => setLocalText(e.target.value)}
                onBlur={handleBlur}
              />
            </div>
            <div className="sticker-shadow"></div>
          </motion.div>
       </AnimatePresence>
    </div>
  );
};

export default StickerNotes;

