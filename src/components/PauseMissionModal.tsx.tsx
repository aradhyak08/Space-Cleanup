import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { soundManager } from '../utils/audio';

interface PauseMissionModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  isNewHighScore?: boolean;
  timeSurvived?: number;
  stars?: number;
  gems?: number;
  lives?: number;
  maxLives?: number;
  isBombDetonated?: boolean;
  onResume: () => void;
  onRestart?: () => void;
  onReturnHome: () => void;
  onClose?: () => void;
  onWholeReset?: () => void;
}

export const PauseMissionModal: React.FC<PauseMissionModalProps> = ({
  isOpen,
  score,
  highScore,
  onResume,
  onRestart,
  onReturnHome,
}) => {
  // Listen for Enter or Escape keys while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        soundManager.playClick();
        onResume();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        soundManager.playBoost();
        if (onRestart) onRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onResume, onRestart]);

  if (!isOpen) return null;

  return createPortal(
    <div      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 select-none animate-fade-in"
    >
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
       
        <h2 className="font-['Orbitron'] text-3xl sm:text-4xl font-black text-white uppercase tracking-[0.25em] drop-shadow-[0-0-20px-rgba(0,240,255,0.4)] mb-2">
          MISSION PAUSED
        </h2>
        <span className="font-['Chakra-Petch'] text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6">
          SYSTEM STANDBY // ORBITAL HOLD       
        </span>

        
        <div className="flex flex-col items-center mb-8">
          <span className="font-['Orbitron'] text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">
            CURRENT SCORE
          </span>
          <span className="font-['Orbitron'] text-4xl sm:text-5xl font-black text-white tracking-wider my-0.5 drop-shadow-[0-0-20px-rgba(255,255,255,0.3)]">
            {score.toLocaleString()}
          </span>          <span className="font-['Chakra-Petch'] text-[12px] font-bold text-[#ffcc00] tracking-[0.15em] mt-2">
            ALL-TIME BEST: {Math.max(score, highScore).toLocaleString()}
          </span>        
        </div>
        
        <div className="w-full flex flex-col gap-3">
          
          <button
            onClick={() => {
              soundManager.playClick();
              onResume();
            }}
            className="w-full py-3.5 bg-[#00f0ff] hover:bg-[#5ff6ff] active:scale-95 text-black font-['Orbitron'] text-[12px] uppercase tracking-[0.2em] rounded-lg transition-all cursor-pointer font-black shadow-[0-0-20px-rgba(0,240,255,0.4)]"
          >
            RESUME MISSION
          </button>
          
          {onRestart && (
            <button
              onClick={() => {
                soundManager.playBoost();
                onRestart();
              }}
            className="w-full py-3 bg-white/10 hover:bg-white/15 active:scale-95 text-white font-['Orbitron'] text-[11px] uppercase tracking-[0.2em] rounded-lg transition-all cursor-pointer border border-white/20 font-bold"
            >
              RESTART RUN
            </button>
          )}

          
          <button
              onClick={() => {
              soundManager.playClick();
              onReturnHome();
              }}
              className="w-full py-3 bg-white/10 hover:bg-white/15 active:scale-95 text-white font-['Orbitron'] text-[11px] uppercase tracking-[0.2em] rounded-lg transition-all cursor-pointer border border-white/20 font-bold"
            >
             ABORT TO MENU
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
        
};