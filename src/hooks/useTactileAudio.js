import { useRef } from 'react';

export const useTactileAudio = () => {
  const flipAudioRef = useRef(null);
  const scratchAudioRef = useRef(null);

  if (typeof Audio !== 'undefined' && !flipAudioRef.current) {
    // High-quality free CDN sound effects for prototype
    flipAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2120/2120-preview.mp3');
    flipAudioRef.current.volume = 0.6;
    
    scratchAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3');
    scratchAudioRef.current.volume = 0.2;
  }

  const playFlip = () => {
    if (flipAudioRef.current) {
      flipAudioRef.current.currentTime = 0;
      flipAudioRef.current.play().catch(() => {});
    }
  };

  const playScratch = () => {
    if (scratchAudioRef.current) {
      // Throttle the pencil scratching sound to avoid extreme overlap
      if (scratchAudioRef.current.paused) {
        scratchAudioRef.current.currentTime = 0;
        scratchAudioRef.current.play().catch(() => {});
        setTimeout(() => {
          scratchAudioRef.current.pause();
        }, 300);
      }
    }
  };

  return { playFlip, playScratch };
};
