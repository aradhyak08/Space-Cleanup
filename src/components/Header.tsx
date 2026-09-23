import React from 'react';
import { ActiveScreen } from '../types';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  activeScreen?: ActiveScreen;
  setActiveScreen?: (screen: ActiveScreen) => void;
  stars: number;
  gems: number;
highScore: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  onWholeReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen = 'home',
  setActiveScreen,
  stars,
  gems,
  highScore,
  soundEnabled,
  setSoundEnabled,
  onWholeReset,
}) => {
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundManager.setMuted(!next);
      if (next) soundManager.playClick();
      return next;
    });
  };

     const handleReturnHome = () => {
      soundManager.playClick();
      if (setActiveScreen) setActiveScreen('home');
    };

    return (
        <header className="fixed top-0 inset-x-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b-2 border-[#1e293b] px-3 sm:px-6 py-2 flex items-center justify-between shadow-[0-4px-20px-rgba(0,0,0,0.8)] select-none">
            <div className= "flex item-center gap-3">   
                <div className="flex items-center gap-2 pr-3 border-r border-[#1e293b]">
                   <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                    <div className="flex flex-col">
                        <span className="font-['Press-Start-2P'] text-[6px] sm:text-[7px] text-[#00f0ff] tracking-wider uppercase">
                            STARBASE ALPHA            
                        </span>
                        <span className="font-['Silkscreen'] text-[8px] text-[#94a3b8] uppercase tracking-widest hidden xs:inline">
                         OPERATIONS DOCK            
                        </span>          
                    </div>        
                </div>
        
                <div className="flex items-center gap-2 bg-[#111827] px-2.5 py-1 rounded border border-[#1e293b]">
          
                  <div className="flex items-center gap-1.5 pr-2 border-r border-[#1e293b]" title="Total Salvaged Stars">
                  <span className="text-[12px]">⭐</span>            
                    <span className="font-['Press-Start-2P'] text-[7px] sm:text-[8px] text-[#ffea00]">
                        {stars.toLocaleString()}
                     </span>          
                </div>
        
                <div className="flex items-center gap-1.5" title="Total Cosmic Gems">
                    <span className="text-[12px]">💎</span>            
                    <span className="font-['Press-Start-2P'] text-[7px] sm:text-[8px] text-[#00f0ff]">
                      {gems.toLocaleString()}
                    </span>          
                </div>
            </div>
        </div>

      
      <div className="hidden md:flex items-center gap-2 bg-[#111827] px-3 py-1 rounded border border-[#1e293b]">
        <span className="text-[#ffcc00] text-[12px]">👑</span>
        <span className="font-['Press-Start-2P'] text-[6px] text-[#94a3b8] uppercase">
          SECTOR RECORD:
        </span>        <span className="font-['Press-Start-2P'] text-[8px] text-[#ffcc00]">
          {highScore.toLocaleString()}
        </span>      </div>
      
      <div className="flex items-center gap-2">
        
        <button
          onClick={() => {
            soundManager.playClick();
            onWholeReset();
          }}
          aria-label="Reset Progress"
          title="Reset Pilot Records"
          className="h-8 px-2 bg-[#111827] hover:bg-[#1e293b] border border-[#334155] hover:border-red-500/60 text-[#94a3b8] hover:text-red-400 flex items-center gap-1.5 rounded transition-all cursor-pointer active:scale-95 shadow-sm group"
        >
          <span className="material-symbols-outlined text-[16px]">restart-alt</span>
          <span className="font-['Press-Start-2P'] text-[6px] uppercase hidden sm:inline">
              RESET         
           </span>
        </button>
        
        <button
          onClick={toggleSound}
          aria-label="Toggle Sound"
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          className={`h-8 px-2.5 rounded border flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm ${
            soundEnabled
              ? 'bg-[#111827] hover:bg-[#1e293b] border-[#00f0ff]/50 text-[#00f0ff]'
              : 'bg-[#111827] hover:bg-[#1e293b] border-[#334155] text-[#64748b]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {soundEnabled ? 'volume-up' : 'volume-off'}
          </span>          <span className="font-['Press-Start-2P'] text-[6px] uppercase hidden sm:inline">
            {soundEnabled ? 'SND:ON' : 'MUTED'}
          </span>        </button>
      </div>
    </header>
  );
};