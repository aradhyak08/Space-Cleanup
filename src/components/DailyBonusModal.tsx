import React from 'react';
import { soundManager } from '../utils/audio';

interface DailyBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (starsAwarded: number, gemsAwarded: number) => void;
}

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({ isOpen, onClose, onClaim }) => {
  if (!isOpen) return null;

  const handleClaim = () => {
    soundManager.playCrystalPickup();
    onClaim(500, 15);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#100532]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1d1440] rounded-2xl p-6 sm:p-8 shadow-[0-20px-50px-rgba(5,3,15,0.95)] border border-[#3c325f]/50 flex flex-col items-center text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="absolute -top-16 inset-x-0 h-32 bg-[#ffb800]/25 blur-2xl pointer-events-none" />

        <div className="px-4 py-1 rounded-full bg-[#100532] text-[#ffb800] font-['Rubik'] font-bold text-[13px] uppercase tracking-widest mb-3 flex items-center gap-1.5 shadow-[inset-0-2px-4px-rgba(0,0,0,0.6)]">
          <span className="material-symbols-outlined text-[18px]">redeem</span>          DAILY CADET REWARD
        </div>
        <h2 className="font-['Rubik'] font-black text-[28px] sm:text-[32px] text-[#e7deff] uppercase tracking-wide drop-shadow-[0-4px-10px-rgba(0,0,0,0.8)]">
          COSMIC CRATE READY!
        </h2>
        <p className="font-['Rubik'] text-[14px] text-[#d5c4ab] mt-1 mb-6">
          Thank you for clearing interplanetary space lanes. Open today&apos;s loot!
        </p>
        
        <div className="w-full grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#221844] rounded-xl p-4 flex flex-col items-center border border-[#372e5b]">
            <div className="w-12 h-12 rounded-full bg-[#ffb800] flex items-center justify-center shadow-[0-3px-0-#b37d00] mb-2">
            <span className="material-symbols-outlined text-[#6b4c00] text-[24px]">star</span>            </div>            <span className="font-['Rubik'] font-black text-[22px] text-[#ffdca1]">+500</span>            <span className="font-['Rubik'] text-[12px] text-[#d5c4ab] uppercase font-bold">Stardust</span>          </div>
          <div className="bg-[#221844] rounded-xl p-4 flex flex-col items-center border border-[#372e5b]">
            <div className="w-12 h-12 rounded-full bg-[#00eefc] flex items-center justify-center shadow-[0-3px-0-#0077b3] mb-2">
              <span className="material-symbols-outlined text-[#00686f] text-[24px]">diamond</span>            </div>            <span className="font-['Rubik'] font-black text-[22px] text-[#7df4ff]">+15</span>
            <span className="font-['Rubik'] text-[12px] text-[#d5c4ab] uppercase font-bold">Cyan Gems</span>          </div>        </div>
     
        <button          onClick={handleClaim}
        className="w-full py-4 rounded-full bg-gradient-to-b from-[#ffdea8] via-[#ffb800] to-[#ffba20] text-[#6b4c00] font-['Rubik'] font-black text-[18px] uppercase tracking-wider shadow-[0-6px-0-#8f6200] active:translate-y-1.5 active:shadow-[0-1px-0-#8f6200] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">verified</span>          CLAIM DAILY BONUS
        </button>

        <button
          onClick={onClose}
          className="mt-3 text-[#d5c4ab] hover:text-white font-['Rubik'] text-[13px] font-bold uppercase transition-colors"
        >
          Close
        </button>
</div>
</div>
);
};