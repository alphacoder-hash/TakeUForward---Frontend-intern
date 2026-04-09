import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ParticleEngine.css';

const ParticleEngine = ({ season, isLampActive }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth) - 0.5, 
        y: (e.clientY / window.innerHeight) - 0.5 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const count = season === 'Winter' ? 40 : season === 'Spring' ? 25 : season === 'Autumn' ? 20 : 15;
  const particles = Array.from({ length: count });

  const getStyleForSeason = (season) => {
    switch(season) {
      case 'Winter':
        return { borderRadius: '50%', background: 'white', width: '4px', height: '4px' };
      case 'Spring':
        return { borderRadius: '50% 0 50% 0', background: '#ffb7c5', width: '8px', height: '8px' };
      case 'Autumn':
        return { borderRadius: '2px', background: '#e07a5f', width: '6px', height: '6px' };
      case 'Summer':
      default:
        return { 
          borderRadius: '50%', 
          background: isLampActive ? 'rgba(255, 200, 100, 0.8)' : 'rgba(255, 255, 255, 0.5)', 
          width: '3px', 
          height: '3px', 
          boxShadow: isLampActive 
            ? '0 0 12px 3px rgba(255, 180, 50, 0.9)' 
            : '0 0 10px 2px rgba(255, 255, 255, 0.8)' 
        };
    }
  };

  return (
    <div className="particle-container">
      {particles.map((_, i) => {
        const startX = Math.random() * 100;
        const duration = Math.random() * 5 + 5;
        const delay = Math.random() * -10;
        const drift = (Math.random() - 0.5) * 40;

        return (
          <motion.div
            key={i}
            className="particle"
            style={{
              ...getStyleForSeason(season),
              left: `${startX}%`,
              top: '-5%',
              x: mousePos.x * 20, 
              y: mousePos.y * 20
            }}
            animate={
              season === 'Summer' 
              ? {
                  y: ["0vh", "-100vh"],
                  x: [0, drift, 0, drift],
                  opacity: [0, 0.8, 1, 0],
                } 
              : {
                  y: ["0vh", "110vh"],
                  x: [0, drift, 0, drift],
                  rotate: season === 'Winter' ? 0 : [0, 360],
                  opacity: [0, 0.8, 0.8, 0],
                }
            }
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: delay
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticleEngine;
