import React from 'react';
import './SpiralBinder.css';

const SpiralBinder = ({ count = 12, orientation = 'horizontal' }) => {
  return (
    <div className={`spiral-binder ${orientation}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ring-container">
          <div className="punched-hole upper"></div>
          <div className="punched-hole lower"></div>
          <div className="metal-ring"></div>
        </div>
      ))}
    </div>
  );
};


export default SpiralBinder;
