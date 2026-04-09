import React, { useState, useEffect, useRef } from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CloudRain, Snowflake, CloudLightning, CloudFog, Cloud } from 'lucide-react';
import MarkerHighlight from './MarkerHighlight';
import './CalendarGrid.css';

const CalendarGrid = ({ 
  days, 
  currentMonth, 
  handleDateClick, 
  isInRange, 
  isStart, 
  isEnd,
  locale,
  isDrawingMode,
  droppedTasks = {},
  onDropTask,
  notesData
}) => {
  const [weatherCode, setWeatherCode] = useState(null);
  
  // Canvas Doodling State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data && data.current_weather) setWeatherCode(data.current_weather.weathercode);
      })
      .catch(err => console.error("Weather fetch failed", err));
  }, []);

  // Resize canvas when toggled on
  useEffect(() => {
    if (isDrawingMode && canvasRef.current) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }
  }, [isDrawingMode]);

  const [reticlePos, setReticlePos] = useState({ x: 0, y: 0, show: false });

  // Handle ink drawing logic
  const startDrawing = (e) => {
    if (!isDrawingMode) return;
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawingMode) {
      // Manage Reticle instead
      const rect = canvasRef.current.parentElement.getBoundingClientRect();
      setReticlePos({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true });
      return;
    }
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#4a6670'; // Ink color
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const handleLeaveGrid = () => {
    setIsDrawing(false);
    setReticlePos(p => ({ ...p, show: false }));
  };

  const stopDrawing = () => setIsDrawing(false);

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault(); // allow dropping
  };

  const handleDrop = (e, dateStr) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData('text/plain');
    if (taskData && onDropTask) {
      onDropTask(dateStr, taskData);
    }
  };

  const handleDeletePin = (e, dateStr) => {
    e.stopPropagation();
    if (onDropTask) {
      onDropTask(dateStr, null); // Pass null to remove it
    }
  };

  const renderWeatherStamp = (code) => {
    if (code === null) return null;
    let Icon = Sun;
    if ([1,2,3].includes(code)) Icon = Cloud;
    else if (code >= 45 && code <= 48) Icon = CloudFog;
    else if (code >= 51 && code <= 67) Icon = CloudRain;
    else if (code >= 71 && code <= 77) Icon = Snowflake;
    else if (code >= 95 && code <= 99) Icon = CloudLightning;

    return (
      <motion.div 
        className="weather-stamp"
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 0.6, scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <Icon size={16} strokeWidth={1.5} color="var(--accent-color)" />
      </motion.div>
    );
  };

  // Generate localized weekday headers starting from Sunday
  const weekDays = [...Array(7)].map((_, i) => format(new Date(2024, 0, i + 7), 'EEEEEE', { locale }));

  return (
    <div className="calendar-grid-container">
      <div className="weekdays-row">
        {weekDays.map((day, idx) => (
          <div key={idx} className="weekday-label">{day}</div>
        ))}
      </div>

      <div className="grid-body" onMouseMove={draw} onMouseLeave={handleLeaveGrid}>
        
        <AnimatePresence>
          {reticlePos.show && (!isDrawingMode) && (
            <motion.div
              className="magnifying-reticle"
              style={{ left: reticlePos.x, top: reticlePos.y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            />
          )}
        </AnimatePresence>

        {/* Invisible Canvas Overlay for Doodling */}
        <canvas
          ref={canvasRef}
          className={`doodle-canvas ${isDrawingMode ? 'active' : ''}`}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: isDrawingMode ? 50 : 30, // Above reticle if drawing
            pointerEvents: isDrawingMode ? 'auto' : 'none',
            cursor: isDrawingMode ? 'crosshair' : 'none'
          }}
        />

        {days.map((date, i) => {
          const sameMonth = isSameMonth(date, currentMonth);
          const start = isStart(date);
          const end = isEnd(date);
          const inRange = isInRange(date);
          const isToday = isSameDay(date, new Date());
          const dateStr = format(date, 'yyyy-MM-dd');
          const dateKey = `date_${dateStr}`;
          const hasNote = notesData?.hasNote(dateKey);
          
          // Simple Holiday Logic (Example)
          const month = date.getMonth();
          const day = date.getDate();
          const isHoliday = (month === 11 && day === 25) || (month === 0 && day === 1); // Xmas, NY

          return (
            <motion.div 
              key={date.toString()} 
              className={`day-cell ${!sameMonth ? 'other-month' : ''} ${inRange ? 'in-range' : ''} ${start ? 'range-start' : ''} ${end ? 'range-end' : ''}`}
              onClick={() => {
                if (!isDrawingMode) handleDateClick(date);
              }}
              whileTap={!isDrawingMode ? { scale: 0.95 } : {}}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, dateStr)}
            >
              {/* Range Bridge Highlight */}
              {inRange && (
                <motion.div 
                  layoutId="range-bridge"
                  className="range-bridge" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}

              {/* Dropped Task Pins */}
              <AnimatePresence>
                {droppedTasks[dateStr] && (
                  <motion.div 
                    className="task-pin clickable-pin"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring' }}
                    onClick={(e) => handleDeletePin(e, dateStr)}
                    title="Click to remove pin"
                  >
                    📌 {droppedTasks[dateStr]}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Day Number */}
              <span className={`day-number ${isToday ? 'today' : ''}`}>
                {format(date, 'd', { locale })}
              </span>

              {/* Ink Marker for Start/End */}
              {(start || end) && (
                <MarkerHighlight isActive={true} />
              )}

              {/* Note Indicator */}
              {hasNote && !start && !end && (
                <div className="note-indicator-dot"></div>
              )}

              {/* Holiday Marker */}
              {isHoliday && sameMonth && (
                <div className="holiday-marker-icon" title="Holiday">✨</div>
              )}
              
              {/* Live Weather Stamp for Today */}
              {isToday && !start && !end && renderWeatherStamp(weatherCode)}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
