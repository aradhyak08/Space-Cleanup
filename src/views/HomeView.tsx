import React, { useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { MascotShipSvg } from '../components/MascotShipSvg';
import { soundManager } from '../Utils/audio';

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
            <div className="fixed top-5 right-5 flex items-center gap-2.5 z-20">
                {highScore > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#17122d] border-2 border-[#342b52] shadow-[3px_3px_0_#05030d]">
                  <span className="text-[#ffcc00] text-[11px]">★</span>
                        <span className="font-['Chakra_Petch'] text-[11px] sm:text-[12px] font-bold text-[#ffcc00] tracking-[0.18em] uppercase">
                           RECORD: {highScore.toLocaleString()}
                        </span>          
                    </div>        
                )}

                <button          
                  onClick={toggleSound}
                  className="w-10 h-10 flex items-center justify-center text-[#f3e8c8] hover:text-white bg-[#17122d] hover:bg-[#261d43] border-2 border-[#342b52] shadow-[3px_3px_0_#05030d] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#05030d] transition-all cursor-pointer"
                  title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
                >
                      {soundEnabled ? <Volume2 size={18} strokeWidth={2.5} /> : <VolumeX size={18} strokeWidth={2.5} />}
                </button>
            </div>
      
            <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        
               <h1 className="font-['Press_Start_2P'] text-[24px] sm:text-[42px] font-black uppercase tracking-[0.08em] text-[#f3e8c8] drop-shadow-[4px_4px_0_#05030d] leading-tight mb-3">
                   SPACE CLEANUP
                </h1>
       
                <div         
                  onClick={handlePlayClick}
                  className="w-28 h-28 sm:w-36 sm:h-36 my-3 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  title="Click to Launch Spacecraft"
                >
                   <MascotShipSvg isBoosting={true} />
                </div>
        
                <button          
                    onClick={handlePlayClick}
                    className="w-full sm:w-auto px-10 py-3 mt-2 bg-[#ffcc00] hover:bg-[#ffe36b] active:scale-[0.98] text-[#17100a] font-['Press_Start_2P'] font-black text-[10px] sm:text-[12px] tracking-[0.08em] uppercase cursor-pointer border-2 border-[#5b3d00] transition-transform"
                >
                   LAUNCH MISSION
                </button>      
            </div>    
        </div>
    );
};