import React from 'react';

interface CadetProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  highScore: number;
  totalStars: number;
  totalGems: number;
  vacuumGrade: string;
}

export const CadetProfileModal: React.FC<CadetProfileModalProps> = ({
  isOpen,
  onClose,
  highScore,
  totalStars,
  totalGems,
  vacuumGrade,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#100532]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1d1440] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(5,3,15,0.95)] border border-[#3c325f]/50 flex flex-col items-center text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button          
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2c234f] text-[#d5c4ab] hover:text-white flex items-center justify-center"
        >
        </button>
        
        <div className="w-20 h-20 rounded-full bg-[#ffb800] p-1.5 shadow-[0_0_25px_rgba(255,184,0,0.6)] mb-3 relative">
           <div className="w-full h-full rounded-full bg-[#150a37] flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-[#ffdca1] text-[40px]">person</span>          
            </div>          
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#00eefc] border-2 border-[#150a37] flex items-center justify-center text-[#00686f] text-[12px] font-bold">
            
            </span>        
        </div>
        <div className="px-3 py-1 rounded-full bg-[#100532] text-[#00eefc] font-['Rubik'] font-bold text-[12px] uppercase tracking-wider mb-1">
          Chief Cosmic Sweeper
        </div>
        <h2 className="font-['Rubik'] font-black text-[24px] text-[#ffdca1] uppercase">
          CADET ASTRONAUT 01
        </h2>        
        <p className="font-['Rubik'] text-[13px] text-[#d5c4ab] mb-5">
          Licensed Intergalactic Debris Operative
        </p>
        
        <div className="w-full grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[#221844] rounded-xl p-3 border border-[#372e5b]">
                <span className="font-['Rubik'] text-[11px] text-[#d5c4ab] uppercase font-bold">ALL-TIME BEST</span>            
              <div className="font-['Rubik'] font-black text-[20px] text-[#ffb800] mt-0.5">
                  {highScore.toLocaleString()}
                </div>          
            </div>
            <div className="bg-[#221844] rounded-xl p-3 border border-[#372e5b]">
                <span className="font-['Rubik'] text-[11px] text-[#d5c4ab] uppercase font-bold">VACUUM GRADE</span>            
              <div className="font-['Rubik'] font-black text-[20px] text-[#00eefc] mt-0.5">
                  {vacuumGrade}
               </div>          
            </div>
          <div className="bg-[#221844] rounded-xl p-3 border border-[#372e5b]">
                 <span className="font-['Rubik'] text-[11px] text-[#d5c4ab] uppercase font-bold">TOTAL STARS</span>            
                <div className="font-['Rubik'] font-black text-[18px] text-[#ffdca1] mt-0.5">
                 {totalStars.toLocaleString()} ⭐
                </div>          
            </div>
            <div className="bg-[#221844] rounded-xl p-3 border border-[#372e5b]">
               <span className="font-['Rubik'] text-[11px] text-[#d5c4ab] uppercase font-bold">CYAN GEMS</span>            
               <div className="font-['Rubik'] font-black text-[18px] text-[#7df4ff] mt-0.5">
                  {totalGems.toLocaleString()} 💎
               </div>          
            </div>        
      </div>
        
        <div className="w-full bg-[#150a37] p-3 rounded-xl flex items-center justify-between mb-5 border border-[#2c234f]">
          <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb800] text-[20px]">rocket</span>            
                <div className="text-left">
                  <div className="font-['Rubik'] text-[12px] font-bold text-[#e7deff]">MK-01 BUMBLEBEE</div>             
                       <div className="font-['Rubik'] text-[11px] text-[#00eefc]">Dual Thruster Class Sweeper</div>
                </div>          
            </div>          
            <span className="px-2.5 py-1 rounded-full bg-[#00eefc]/20 text-[#00eefc] font-['Rubik'] text-[11px] font-bold uppercase">
                    
              Active
           </span>        
        </div>
            <button
              onClick={onClose}
                className="w-full py-3 rounded-full bg-[#ffb800] text-[#6b4c00] font-['Rubik'] font-bold text-[14px] uppercase tracking-wider shadow-[0-4px-0-#b37d00] active:translate-y-1"
            >
             Done        
            </button>
        </div>    
    </div>  
  );
};