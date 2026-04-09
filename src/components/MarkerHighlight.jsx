import React from 'react';
import { motion } from 'framer-motion';

const MarkerHighlight = ({ isActive }) => {
  if (!isActive) return null;

  // A more "hand-drawn" rough circle path
  const roughPath = "M 25 8 C 34.3 8 42 15.6 42 25 C 42 34.3 34.3 42 25 42 C 15.6 42 8 34.3 8 25 C 8 15.6 15.6 8 25 25";

  return (
    <div className="marker-container">
      <svg viewBox="0 0 50 50" className="marker-svg">
        <motion.path
          d={roughPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
          animate={{ pathLength: 1, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
};

export default MarkerHighlight;
