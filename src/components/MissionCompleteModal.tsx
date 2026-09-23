import React from 'react';
import { DifficultyConfig } from '../types/difficulty';

interface MissionCompleteModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  difficulty: DifficultyConfig;
  elapsedSeconds: number;
  planetsDiscovered: number;
  totalPlanets: number;
  gemsCollected: number;
  hullPlatesRemaining: number;
  maxHullPlates: number;
  onPlayAgain: () => void;
  onNextDifficulty?: () => void;
  onReturnHome: () => void;
}

export const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({
  isOpen,
  score,
  highScore,
  isNewHighScore,
  difficulty,
  elapsedSeconds,
  planetsDiscovered,
  totalPlanets,
  gemsCollected,
  hullPlatesRemaining,
  maxHullPlates,
  onPlayAgain,
  onNextDifficulty,
  onReturnHome,
}) => {
    if (!isOpen) return null;

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

 
    let rank = 'B';
    let rankColor = '#ffcc00';
    let rankQuote = 'Solid spaceflight execution and survival!';

    if (hullPlatesRemaining === maxHullPlates && elapsedSeconds < 180) {
       rank = 'S';
       rankColor = '#ffd700';
       rankQuote = 'Flawless Master Aviator! Zero hull damage sustained!';
    } else if (hullPlatesRemaining >= maxHullPlates - 1) {
      rank = 'A';
      rankColor = '#00f0ff';
      rankQuote = 'Exceptional precision piloting under cosmic fire!';
    } else if (hullPlatesRemaining === 1) {
      rank = 'C';
      rankColor = '#ff5555';
      rankQuote = 'Narrow escape! Emergency deflector held the line!';
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
            <div className="relative w-full max-w-md bg-[#0a0319] border-4 border-[#00f0ff] shadow-[8px-8px-0px-#000] p-5 sm:p-6 flex flex-col items-center text-center">
        
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-2xl animate-pulse">✨</span>
                   <span className="text-3xl">🚀</span>
                   <span className="text-2xl animate-pulse">✨</span>
                </div>
                <h2 className="font-['Press-Start-2P'] text-[16px] sm:text-[18px] text-[#00f0ff] uppercase tracking-wider leading-relaxed">
                    MISSION COMPLETE!
                </h2>        
                <p className="font-['Press-Start-2P'] text-[7.5px] sm:text-[8.5px] text-[#ffdca1] uppercase tracking-wider mt-1.5">
                   HYPERSPACE JUMP <SUCCESSFUL>        
                </p>

        {/* Rank & Difficulty Cleared */}
        <div className="w-full flex items-center justify-between bg-[#05010d] border-2 border-[#2b184f] p-2.5 my-3">
          <div className="flex flex-col items-start">
            <span className="text-[7px] font-['Press-Start-2P'] text-slate-400">DIFFICULTY:</span>            <span
            className="text-[9px] font-['Press-Start-2P'] font-bold mt-1 px-1.5 py-0.5"
              style={{
                color: difficulty.badgeColor,
                backgroundColor: difficulty.badgeBg,
                border: `1px solid ${difficulty.badgeColor}`,
              }}
            >
              {difficulty.name}
            </span>          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-['Press-Start-2P'] text-slate-400">RANK:</span>            <div
              className="w-9 h-9 border-2 flex items-center justify-center font-['Press-Start-2P'] text-[16px] font-black shadow-[2px-2px-0px-#000]"
              style={{ borderColor: rankColor, color: rankColor, backgroundColor: '#110526' }}
            >
              {rank}
            </div>
          </div>        </div>
        <p className="text-[8px] font-['Silkscreen'] text-[#39ff14] mb-2.5 italic">
        "{rankQuote}"
        </p>
        {/* Debrief Metrics Grid */}
        <div className="w-full grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center">
            <span className="text-[7px] font-['Press-Start-2P'] text-slate-400">HULL PLATES</span>
            <span className="text-[9px] font-['Press-Start-2P'] font-bold mt-1">
              {hullPlatesRemaining} / {maxHullPlates}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[7px] font-['Press-Start-2P'] text-slate-400">ENEMIES DESTROYED</span>
            <span className="text-[9px] font-['Press-Start-2P'] font-bold mt-1">
              {enemiesDestroyed}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
assName="w-full bg-[#05010d] border-2 border-[#2b184f] p-3 flex flex-col gap-2 mb-4 text-left">
          <div className="flex justify-between items-center text-[9px] font-['Press-Start-2P']">
            <span className="text-[#ffdca1]">FINAL SCORE:</span>            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold">{score.toLocaleString()}</span>
              {isNewHighScore && (
                <span className="text-[7px] bg-[#ffcc00] text-black px-1 font-bold">
                  NEW RECORD!
                </span>
              )}
            </div>          </div>
          <div className="flex justify-between items-center text-[8.5px] font-['Press-Start-2P']">
            <span className="text-slate-400">MISSION TIME:</span>            <span className="text-[#00f0ff]">{timeFormatted}</span>          </div>
          <div className="flex justify-between items-center text-[8.5px] font-['Press-Start-2P']">
            <span className="text-slate-400">PLANETS SURVEYED:</span>            <span className="text-[#39ff14]">
              {planetsDiscovered} / {totalPlanets}
            </span>          </div>
          <div className="flex justify-between items-center text-[8.5px] font-['Press-Start-2P']">
            <span className="text-slate-400">COSMIC GEMS:</span>            <span className="text-[#ffaa00]">+{gemsCollected}</span>          </div>
          <div className="flex justify-between items-center text-[8.5px] font-['Press-Start-2P']">
            <span className="text-slate-400">HULL ARMOR:</span>            <span className="text-[#39ff14]">
              {hullPlatesRemaining}/{maxHullPlates} INTACT
            </span>          </div>        </div>

        {/* Interactive Action Buttons */}
        <div className="w-full flex flex-col gap-2">
        {onNextDifficulty && (
            <button              onClick={onNextDifficulty}
              className="w-full py-2.5 bg-[#00f0ff] border-2 border-black font-['Press-Start-2P'] text-[9.5px] text-black uppercase tracking-wider shadow-[3px-3px-0px-#000] hover:bg-[#6ef5ff] active:translate-x-1 active:translate-y-1 cursor-pointer flex items-center justify-center gap-2"
            >
            <span>⚡</span>              <span>NEXT DIFFICULTY</span>
            </button>          )}

          <button
            onClick={onPlayAgain}
            className="w-full py-2.5 bg-[#ffcc00] border-2 border-black font-['Press-Start-2P'] text-[9.5px] text-black uppercase tracking-wider shadow-[3px-3px-0px-#000] hover:bg-[#ffe600] active:translate-x-1 active:translate-y-1 cursor-pointer"
          >
            PLAY AGAIN
          </button>
          <button            
              onClick={onReturnHome}
              className="w-full py-2 bg-[#1f1240] border-2 border-[#00f0ff] text-[#00f0ff] font-['Press-Start-2P'] text-[8.5px] uppercase tracking-wider hover:bg-[#2d1b5c] cursor-pointer shadow-[2px-2px-0px-#000]"
            >
                 RETURN TO BASE
            </button>        
         </div>
      </div>
    </div>
  );
};