import React, { useEffect } from 'react';
import { MascotShipSvg } from '../components/MascotShipSvg';
import { soundManager } from '../utils/audio';
import { ValueButton } from 'three/examples/jsm/inspector/ui/Values.js';
import { Divide } from 'lucide-react';

interface HomeViewProps {
  onPlay: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  highScore: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onPlay,
  soundEnabled,
  setSoundEnabled,
  highScore,
}) => {
  // Keyboard shortcut: Space or Enter to launch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        soundManager.playBoost();
        onPlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlay]);

  const handlePlayClick = () => {
    soundManager.playBoost();
    onPlay();
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundManager.setMuted(!next);
      if (next) soundManager.playClick();
      return next;
    });
  };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 select-none">
            <div className="absolute top-5 right-5 flex items-center gap-2.5 z-20">
                {highScore > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <span className="text-[#ffcc00] text-[11px] drop-shadow-[0_0_6px_rgba(255,204,0,0.6)]">★</span>
                        <span className="font-['Chakra_Petch'] text-[11px] sm:text-[12px] font-bold text-[#ffcc00] tracking-[0.18em] uppercase">
                           RECORD: {highScore.toLocaleString()}
                        </span>          
                    </div>        
                )}

                <button          
                  onClick={toggleSound}
                  className="w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white bg-black/40 hover:bg-black/60 border border-white/15 rounded-lg backdrop-blur-md transition-colors cursor-pointer"
                  title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
                >
                    <span className="material-symbols-outlined text-[20px]">
                       {soundEnabled ? 'volume-up' : 'volume-off'}
                    </span>        
                </button>
            </div>
      
            <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        
               <h1 className="font-['Orbitron'] text-[38px] sm:text-[56px] font-black uppercase tracking-[0.18em] text-white drop-shadow-[0_0_30px_rgba(0,240,255,0.45)] leading-none mb-3">
                   SPACE CLEANUP
                </h1>
       
                <div         
                  onClick={handlePlayClick}
                  className="w-28 h-28 sm:w-36 sm:h-36 my-3 cursor-pointer hover:scale-105 active:scale-95 transition-transform drop-shadow-[0_0_35px_rgba(0,240,255,0.35)]"
                  title="Click to Launch Spacecraft"
                >
                   <MascotShipSvg isBoosting={true} />
                </div>
        
                <button          
                    onClick={handlePlayClick}
                    className="w-full sm:w-auto px-12 py-3.5 mt-2 bg-[#ffcc00] hover:bg-[#ffe53b] active:scale-95 text-black font-['Orbitron'] font-black text-[13px] sm:text-[14px] tracking-[0.22em] uppercase cursor-pointer rounded-lg transition-all shadow-[0-0-25px-rgba(255,204,0,0.45)] hover:shadow-[0-0-40px-rgba(255,204,0,0.7)]"
                >
                   LAUNCH MISSION
                </button>      
            </div>    
        </div>
    );
};