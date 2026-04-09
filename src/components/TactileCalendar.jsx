import React, { useState } from 'react';
import { format } from 'date-fns';
import { enUS, ja, fr } from 'date-fns/locale';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, PenTool, Globe, Lightbulb } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar';
import { useTactileAudio } from '../hooks/useTactileAudio';
import { useNotes } from '../hooks/useNotes';
import CalendarGrid from './CalendarGrid';
import StickerNotes from './StickerNotes';
import SpiralBinder from './SpiralBinder';
import HangingWire from './HangingWire';
import CalendarKeeper from './CalendarKeeper';
import ParticleEngine from './ParticleEngine';
import './TactileCalendar.css';

const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const getSeasonalTheme = (monthIndex) => {
  if ([11, 0, 1].includes(monthIndex)) return { accent: '#4a6670', label: 'Winter' };
  if ([2, 3, 4].includes(monthIndex)) return { accent: '#7d8c6d', label: 'Spring' };
  if ([5, 6, 7].includes(monthIndex)) return { accent: '#c4a484', label: 'Summer' };
  return { accent: '#a66d4a', label: 'Autumn' }; 
};

// Locales Mapping
const LOCALES_MAP = {
  English: { obj: enUS, font: '"Outfit", "Ibarra Real Nova", serif' },
  日本語: { obj: ja, font: '"Noto Serif JP", "Outfit", serif' },
  Français: { obj: fr, font: '"Playfair Display", "Outfit", serif' }
};

const TactileCalendar = () => {
  const { currentMonth, days, nextMonth, prevMonth, selection, handleDateClick, isInRange, isStart, isEnd } = useCalendar();
  const notesData = useNotes();

  const [isFlipping, setIsFlipping] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [lightAngle, setLightAngle] = useState({ x: 0, y: 15 });
  const { playFlip, playScratch } = useTactileAudio();

  // God-Tier States
  const [currentLangKey, setCurrentLangKey] = useState('English');
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isLampMode, setIsLampMode] = useState(false);
  const [droppedTasks, setDroppedTasks] = useState({});
  const [flash, setFlash] = useState(false);
  
  // Custom pill states
  const [availablePills, setAvailablePills] = useState(['Meeting', 'Gym', 'Urgent']);
  const [customPillText, setCustomPillText] = useState('');

  const addCustomPill = (e) => {
    if (e.key === 'Enter' && customPillText.trim()) {
      setAvailablePills(prev => [...prev, customPillText.trim()]);
      setCustomPillText('');
    }
  };

  // Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 100 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

  React.useEffect(() => {
    const updateLighting = () => {
      const hour = new Date().getHours() + new Date().getMinutes() / 60;
      let xOffset = 0, yOffset = 15;
      if (hour >= 6 && hour <= 18) xOffset = ((hour - 12) / 6) * 30;
      else { xOffset = 0; yOffset = 5; }
      setLightAngle({ x: xOffset, y: yOffset });
    };
    updateLighting();
    const interval = setInterval(updateLighting, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleNav = (direction) => {
    if (isDrawingMode) return; // Disable turn while drawing
    setIsFlipping(true);
    playFlip(); 
    setTimeout(() => {
      if (direction === 'next') nextMonth();
      if (direction === 'prev') prevMonth();
    }, 200); 
    setTimeout(() => setIsFlipping(false), 800); 
  };

  const cycleLanguage = () => {
    const keys = Object.keys(LOCALES_MAP);
    const nextIdx = (keys.indexOf(currentLangKey) + 1) % keys.length;
    setCurrentLangKey(keys[nextIdx]);
  };

  const exportSnapshot = async () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
    
    try {
      if (!window.html2canvas) {
        alert("Snapshot engine loading, please try again in a second!");
        return;
      }
      const node = document.querySelector('.wall-calendar-frame');
      if (!node) return;
      
      const canvas = await window.html2canvas(node, { 
        backgroundColor: null,
        scale: 2 // High res
      });
      const link = document.createElement('a');
      link.download = `artisan-calendar-${format(currentMonth, 'MMMM')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch(err) {
      console.error("Failed to capture snapshot:", err);
    }
  };

  const handleDropTask = (dateStr, task) => {
    setDroppedTasks(prev => ({ ...prev, [dateStr]: task }));
  };

  const monthIdx = currentMonth.getMonth();
  const theme = getSeasonalTheme(monthIdx);
  const heroSrc = `/months/${monthNames[monthIdx]}.png`;
  const localeObj = LOCALES_MAP[currentLangKey].obj;
  const currentFont = LOCALES_MAP[currentLangKey].font;

  return (
    <div 
      className={`calendar-spread-wrapper ${immersiveMode ? 'immersive' : ''} ${isLampMode ? 'lamp-active' : ''}`} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        '--accent-color': theme.accent,
        '--shadow-x': `${lightAngle.x}px`,
        '--shadow-y': `${lightAngle.y}px`,
        '--font-serif': currentFont
      }}
    >
      
      {/* Real-time Screen Flash for Camera Export */}
      <AnimatePresence>
        {flash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'white', zIndex: 9999, pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLampMode && (
          <motion.div 
            className="desk-lamp-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {immersiveMode && (
          <motion.img
            key={`bg-${heroSrc}`}
            src={heroSrc}
            className="immersive-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            alt="background"
          />
        )}
      </AnimatePresence>

      {/* Extreme God-Tier Utility Bar */}
      <div className="utility-bar god-tier-tools">
        <button className="tool-btn" onClick={cycleLanguage} title="Switch Language">
          <Globe size={16} /> {currentLangKey}
        </button>
        <button className={`tool-btn ${isDrawingMode ? 'active' : ''}`} onClick={() => setIsDrawingMode(!isDrawingMode)} title="Canvas Doodling">
          <PenTool size={16} /> {isDrawingMode ? 'Stop Drawing' : 'Draw'}
        </button>
        <button className={`tool-btn ${isLampMode ? 'active' : ''}`} onClick={() => setIsLampMode(!isLampMode)} title="Studio Mood Lighting">
          <Lightbulb size={16} /> Lamp
        </button>
        <button className="tool-btn" onClick={exportSnapshot} title="Take Polaroid">
          <Camera size={16} /> Snapshot
        </button>
        <button className="tool-btn immersive-toggle" onClick={() => setImmersiveMode(!immersiveMode)}>
          {immersiveMode ? 'Hide Environment' : 'Show Environment'}
        </button>
      </div>

      <motion.div 
        className="studio-layout"
        style={{ rotateX, rotateY }}
      >
        <div className="wall-calendar-frame" id="export-target">
          <HangingWire />
          <div className="top-binder-shelf">
            <SpiralBinder count={22} />
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentMonth.toString()}
              className="calendar-page-content"
              initial={{ rotateX: -40, y: -30, opacity: 0 }}
              animate={{ rotateX: 0, y: 0, opacity: 1 }}
              exit={{ rotateZ: 12, rotateX: 70, y: 1200, opacity: 0, scale: 0.8, skewX: 10 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              style={{ transformOrigin: "top left" }}
            >
              <div className="wall-page hero-page">
                <div className="image-container">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={heroSrc}
                      src={heroSrc} 
                      alt={`${theme.label} Landscape`} 
                      className="hero-img"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </AnimatePresence>
                  
                  <div className="image-header-text" style={{ fontFamily: currentFont }}>
                    <motion.span className="year-display" key={`year-${format(currentMonth, 'yyyy')}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.7, y: 0 }}>
                      {format(currentMonth, 'yyyy', { locale: localeObj })}
                    </motion.span>
                    <motion.span className="month-display" key={`month-${format(currentMonth, 'MMMM')}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                      {format(currentMonth, 'MMMM', { locale: localeObj })}
                    </motion.span>
                  </div>
                  <div className="image-texture"></div>
                  <ParticleEngine season={theme.label} isLampActive={isLampMode} />
                </div>
              </div>

              <div className="bottom-shelf">
                <div className="notes-col">
                  <h3 className="section-label">{theme.label} Ledger</h3>
                  
                  {/* Persistent Sticker Note System */}
                  <StickerNotes selection={selection} notesData={notesData} />

                  {/* Draggable Task Pills for DnD mechanic */}
                  <div className="task-pill-tray" style={{ marginTop: 'auto', paddingTop: '20px' }}>
                    <p className="hint-text">Drag a task pin to the grid.</p>
                    <input 
                      type="text"
                      className="custom-pill-input"
                      value={customPillText}
                      onChange={(e) => setCustomPillText(e.target.value)}
                      onKeyDown={addCustomPill}
                      placeholder="New pin..."
                    />
                    <div className="pills-scroll">
                      {availablePills.map(taskText => (
                        <div 
                          key={taskText}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData('text/plain', taskText)}
                          className="draggable-task-pill"
                        >
                          {taskText}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid-col">
                  <div className="grid-nav">
                    <button onClick={() => handleNav('prev')} className="nav-arrow" aria-label="Previous Month">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => handleNav('next')} className="nav-arrow" aria-label="Next Month">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentMonth.toString()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <CalendarGrid 
                        days={days}
                        currentMonth={currentMonth}
                        handleDateClick={handleDateClick}
                        isInRange={isInRange}
                        isStart={isStart}
                        isEnd={isEnd}
                        locale={localeObj}
                        isDrawingMode={isDrawingMode}
                        droppedTasks={droppedTasks}
                        onDropTask={handleDropTask}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <CalendarKeeper isFlipping={isFlipping} theme={theme} />
      </motion.div>
    </div>
  );
};

export default TactileCalendar;
