import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CalendarKeeper.css';

const CalendarKeeper = ({ isFlipping, theme }) => {
  const [isWaving, setIsWaving] = useState(false);
  const [message, setMessage] = useState('');


  const [clickCount, setClickCount] = useState(0);
  const [isSparkling, setIsSparkling] = useState(false);

  const randomMessages = [
    "Hello there!",
    `Beautiful ${theme?.label || 'day'}!`,
    "Time flies!",
    "Keep planning!",
    "Nice to see you!",
    "Ready for a productive month?",
    "Don't forget to take breaks!",
    "I love being your calendar keeper!",
    "Is it time for a coffee yet?"
  ];

  const handleInteraction = () => {
    if (isWaving || isFlipping) return;
    
    const newCount = clickCount + 1;
    setClickCount(newCount);

    setIsWaving(true);
    
    if (newCount % 7 === 0) {
      setMessage("✨ You found a secret! ✨");
      setIsSparkling(true);
      setTimeout(() => setIsSparkling(false), 3000);
    } else {
      setMessage(randomMessages[Math.floor(Math.random() * randomMessages.length)]);
    }
    
    setTimeout(() => {
      setIsWaving(false);
      setTimeout(() => setMessage(''), 400); // Wait for fade out
    }, 2500);
  };

  let armAnimation = { rotate: 0, x: 0, y: 0 };
  let bodyAnimation = { rotate: 0, x: 0 };

  if (isFlipping) {
    armAnimation = { 
      rotate: [0, -35, 10, 0], 
      x: [0, 45, -10, 0], 
      y: [0, -40, 10, 0],
      scale: [1, 1.2, 0.9, 1]
    };
    bodyAnimation = {
      rotate: [0, -10, 5, 0],
      x: [0, 15, -5, 0]
    };
  } else if (isWaving) {
    // Wave multi-keyframe
    armAnimation = { 
      rotate: [-20, 30, -10, 30, 0],
      x: [0, -5, 0, -5, 0],
      y: [-10, -25, -10, -25, 0],
    };
  }

  return (
    <motion.div 
      className="keeper-container"
      animate={bodyAnimation}
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {message && (
          <motion.div 
            className="keeper-bubble"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <svg 
        viewBox="0 0 100 250" 
        className="keeper-svg" 
        onClick={handleInteraction}
        style={{ 
          cursor: 'pointer',
          filter: isSparkling ? 'drop-shadow(0 0 10px gold)' : 'drop-shadow(0 10px 15px rgba(0,0,0,0.05))',
          transition: 'filter 0.5s ease'
        }}
      >
        {/* Soft, textured shadow underneath */}
        <ellipse cx="50" cy="245" rx="30" ry="5" fill="rgba(0,0,0,0.05)" />

        {/* Minimalist Body - Abstract curves */}
        <path 
          d="M 30,240 C 30,150 40,80 50,60 C 60,80 70,150 70,240" 
          fill="none" 
          stroke="var(--ink-secondary)" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          strokeDasharray="4 8"
          opacity="0.3"
        />

        {/* Solid inner garment */}
        <motion.path 
          d="M 35,240 C 35,160 42,90 50,70 C 58,90 65,160 65,240 Z" 
          fill="var(--paper-color)" 
          stroke="var(--ink-primary)" 
          strokeWidth="1" 
          animate={isWaving ? { scaleY: [1, 1.02, 1] } : {}}
          transition={{ duration: 1, repeat: 2 }}
        />

        {/* Head - Simple organic circle */}
        <motion.circle 
          cx="50" 
          cy="45" 
          r="15" 
          fill="var(--paper-color)" 
          stroke="var(--ink-primary)" 
          strokeWidth="1"
          animate={isWaving ? { y: [-2, 2, -2] } : {}}
          transition={{ duration: 1, repeat: 2 }}
        />
        
        {/* Abstract feature/hat suggestion */}
        <motion.path 
          d="M 35,40 C 50,30 65,40 65,40" 
          fill="none" 
          stroke="var(--accent-color)" 
          strokeWidth="2" 
          strokeLinecap="round"
          style={{ transition: 'stroke 0.8s ease' }}
          animate={isWaving ? { y: [-2, 2, -2] } : {}}
          transition={{ duration: 1, repeat: 2 }}
        />

        {/* The Reaching Arm Group */}
        <motion.g 
          className="keeper-arm"
          initial={false}
          animate={armAnimation}
          transition={{ duration: isWaving ? 1.8 : 0.5, ease: "easeInOut" }}
        >
          {/* Arm curve */}
          <path 
            d="M 50,80 Q 70,100 90,85" 
            fill="none" 
            stroke="var(--ink-primary)" 
            strokeWidth="1" 
            strokeLinecap="round"
          />
          {/* Hand/Fingers abstract */}
          <path 
            d="M 88,86 C 92,84 95,82 93,78" 
            fill="none" 
            stroke="var(--accent-color)" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            style={{ transition: 'stroke 0.8s ease' }}
          />
        </motion.g>

      </svg>
    </motion.div>
  );
};

export default CalendarKeeper;

