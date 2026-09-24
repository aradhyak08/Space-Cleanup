import React from 'react';
import { DifficultyId, DIFFICULTY_CONFIGS, DifficultyConfig } from '../types/difficulty';

interface DifficultySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDifficulty: DifficultyConfig;
  onSelectDifficulty: (difficultyId: DifficultyId) => void;
}

export const DifficultySelectModal: React.FC<DifficultySelectModalProps> = ({
  isOpen,
  onClose,
  currentDifficulty,
  onSelectDifficulty,
}) => {
  if (!isOpen) return null;

  const difficulties = Object.values(DIFFICULTY_CONFIGS);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
           <div className="relative w-full max-w-lg bg-[#0a0319] border-4 border-[#ffcc00] shadow-[8px-8px-0px-#000] p-5 sm:p-6 flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-3 border-b-2 border-[#2b184f] mb-4">
                  <div className="flex items-center gap-2">
                       <span className="text-xl">⚙️</span>            
                        <h2 className="font-['Press-Start-2P'] text-[12px] sm:text-[14px] text-[#ffcc00] uppercase tracking-wider">
                          MISSION DIFFICULTY
                        </h2>         
                    </div>          
                    <button           
                       onClick={onClose}
                        className="w-8 h-8 bg-[#1f1240] border border-[#00f0ff] text-[#00f0ff] font-['Press-Start-2P'] text-[10px] hover:bg-[#2d1b5c] cursor-pointer flex items-center justify-center"
                    >
                        ✕
                    </button>        
                </div>
                <p className="font-['Press-Start-2P'] text-[7.5px] text-slate-300 mb-4 text-left w-full leading-relaxed">
                   SELECT YOUR FLIGHT INTENSITY. HIGHER DIFFICULTY MULTIPLIES SCORE AND UNLOCKS PRESTIGE RANKS:
                </p>
        
                <div className="w-full flex flex-col gap-2.5 mb-5 max-h-[55vh] overflow-y-auto pr-1">
                   {difficulties.map((diff) => {
                    const isSelected = currentDifficulty.id === diff.id;
                    return (
                        <div               
                           key={diff.id}
                           onClick={() => onSelectDifficulty(diff.id)}
                           className={`p-3 border-2 transition-all cursor-pointer text-left flex flex-col gap-1.5 ${
                              isSelected
                                 ? 'bg-[#150730] shadow-[3px-3px-0px-#000]'
                                 : 'bg-[#060111] border-[#29174a] hover:border-slate-400 opacity-80 hover:opacity-100'
                            }`}
                            style={{
                              borderColor: isSelected ? diff.badgeColor : undefined,
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                   <span
                                      className="font-['Press-Start-2P'] text-[9px] sm:text-[10px] font-bold px-2 py-0.5"
                                        style={{
                                          color: diff.badgeColor,
                                          backgroundColor: diff.badgeBg,
                                          border: `1px solid ${diff.badgeColor}`,
                                        }}
                                    >
                                        {diff.name}
                                    </span>
                                    <span className="text-[7.5px] font-['Silkscreen'] text-slate-300">
                                       {diff.tagline}
                                    </span>                  
                                </div>

                                <div className="flex items-center gap-1.5 text-[8px] font-['Press-Start-2P'] text-[#ffcc00]">
                                    <span>x{diff.scoreMultiplier.toFixed(1)} PTS</span>
                                    {isSelected && <span className="text-[#39ff14]">✓</span>}
                                </div>                
                            </div>
                            <p className="text-[7.5px] font-['Press-Start-2P'] text-slate-300 leading-normal pl-1">
                                {diff.description}
                            </p>
                
                            <div className="flex flex-wrap gap-2 text-[6.5px] font-['Press-Start-2P'] mt-1 pl-1 text-slate-400">
                               <span className="text-[#39ff14]">HULL: {diff.hullPlates} PLATES</span>
                               <span className="text-[#00f0ff]">HAZARD SPD: {diff.hazardSpeedMult.toFixed(2)}x</span>
                               <span className="text-[#ffaa00]">
                                    WIN: {diff.minPlanetsRequired} PLANETS {diff.minGemsRequired > 0 ? `+ ${diff.minGemsRequired} GEMS` : ''} ➔ GATE
                                </span>                
                            </div>              
                        </div>
                    );
                })}
            </div>
            <button          
                onClick={onClose}
                className="w-full py-2.5 bg-[#ffcc00] border-2 border-black font-['Press-Start-2P'] text-[9px] text-black uppercase tracking-wider shadow-[3px-3px-0px-#000] hover:bg-[#ffe600] active:translate-x-1 active:translate-y-1 cursor-pointer"
            >
                CONFIRM SETTINGS
            </button>      
        </div>    
        
     </div>
  );
};