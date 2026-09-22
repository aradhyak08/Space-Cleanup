import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { soundManager } from '../utils/audio';
import { CosmicCanvasBackground } from './CosmicCanvasBackground';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  deathCause: string;
  timeSurvived: number;
  starsCollected: number;
  gemsCollected: number;
  onRestart: () => void;
  onReturnHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  highScore,
  isNewHighScore,
  onRestart,
  onReturnHome,
}) => {
  
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        soundManager.playBoost();
        onRestart();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        soundManager.playClick();
        onReturnHome();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onRestart, onReturnHome];

  if (!isOpen) return null;

  return createPortal(
    <Divide      
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none bg-black/30 backdrop-blur-[2px] animate-fade-in"
    >
      
      <CosmicCanvasBackground speedMultiplier={0.6} interactive={true} />

      
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        
        <h1 className="font-['Orbitron'] text-4xl sm:text-6xl font-black uppercase tracking-[0.2em] text-white drop-shadow-[0-0-30px-rgba(255,255,255,0.45)] leading-none mb-3">
          GAME OVER
        </h1>
        
        <div className="flex flex-col items-center my-3">
          <span className="font-['Orbitron'] text-6xl sm:text-8xl font-black tracking-wider text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.4)] leading-none">
            {score.toLocaleString()}
          </span>
          
          <div className="mt-3 px-4 py-1.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <span className="font-['Chakra-Petch'] text-[12px] sm:text-[13px] font-bold tracking-[0.18em] text-[#ffcc00] uppercase">
              {isNewHighScore
                ?'★ NEW ALL-TIME RECORD!'
                : `ALL-TIME BEST: ${Math.max(score, highScore).toLocaleString()}`}
            </span>          
          </div>        
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-xs sm:max-w-sm mt-5 justify-center">
          <button            
              onClick={() => {
              soundManager.playBoost();
              onRestart();
            }}
            className="w-full sm:w-auto flex-1 py-3 px-6 bg-[#ffcc00] hover:bg-[#ffe53b] active:scale-95 text-black font-['Orbitron'] font-black text-[12px] sm:text-[13px] uppercase tracking-[0.2em] rounded-lg transition-all cursor-pointer shadow-[0-0-25px-rgba(255,204,0,0.45)] hover:shadow-[0-0-35px-rgba(255,204,0,0.7)]"
          >
            PLAY AGAIN
          </button>

          <button           
            onClick={() => {
              soundManager.playClick();
              onReturnHome();
            }}
            className="w-full sm:w-auto flex-1 py-3 px-6 bg-black/40 hover:bg-black/60 active:scale-95 text-slate-200 hover:text-white font-['Orbitron'] font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.2em] rounded-lg transition-all cursor-pointer border border-white/20 hover:border-white/40 backdrop-blur-md"
          >
            MAIN MENU
          </button>        
        </div>      
      </div>    
    </div>,
    document.body  
  );
};