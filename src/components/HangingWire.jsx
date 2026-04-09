import React from 'react';
import './HangingWire.css';

const HangingWire = () => {
  return (
    <div className="hanging-wire-container">
      <div className="nail"></div>
      <svg className="wire-svg" viewBox="0 0 100 60">
        <path 
          d="M 10 60 Q 50 0, 90 60" 
          fill="none" 
          stroke="#555" 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
        <path 
          d="M 10 60 Q 50 0, 90 60" 
          fill="none" 
          stroke="rgba(0,0,0,0.1)" 
          strokeWidth="4" 
          strokeLinecap="round"
          transform="translate(2, 2)"
        />
      </svg>
    </div>
  );
};

export default HangingWire;
