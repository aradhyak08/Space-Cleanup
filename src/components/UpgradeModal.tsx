import React from 'react';
import { soundManager } from '../utils/audio';
import { ValueButton } from 'three/examples/jsm/inspector/ui/Values.js';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stars: number;
  suctionPower: number;
  boostSpeed: number;
  shieldDuration: number;
  onUpgrade: (type: 'suction' | 'boost' | 'shield', cost: number) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  stars,
  suctionPower,
  boostSpeed,
  shieldDuration,
  onUpgrade,
}) => {
  if (!isOpen) return null;

const suctionCost = suctionPower * 200;
  const boostCost = boostSpeed * 250;
  const shieldCost = shieldDuration * 300;

  const handleBuy = (type: 'suction' | 'boost' | 'shield', cost: number) => {
    if (stars >= cost) {
      soundManager.playCrystalPickup();
      onUpgrade(type, cost);
    } else {
      soundManager.playDamage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#100532]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#1d1440] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(5,3,15,0.95)] border border-[#3c325f]/50 flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#372e5b] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#ffb800] flex items-center justify-center shadow-[0-3px-0-#b37d00]">
              <span className="material-symbols-outlined text-[#6b4c00] text-[20px]">build</span>
            </div>
          <div>
            <h2 className="font-['Rubik'] font-black text-[22px] text-[#ffdca1] uppercase">
                HANGAR TECH UPGRADE
            </h2>              
            <p className="font-['Rubik'] text-[12px] text-[#00eefc]">BUMBLEBEE MK-01 CUSTOMIZATION</p>            
          </div>          
        </div>          
        <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2c234f] text-[#d5c4ab] hover:text-white flex items-center justify-center"
          >
            
        </button>        
      </div>
        
      <div className="flex items-center justify-between bg-[#100532] px-4 py-2 rounded-xl mb-4">
        <span className="font-['Rubik'] text-[13px] text-[#d5c4ab] uppercase font-bold">Available Stardust</span>          
        <div className="flex items-center gap-1 font-['Rubik'] font-black text-[18px] text-[#ffb800]">
          <span className="material-symbols-outlined text-[18px]">star</span>
          {stars.toLocaleString()}
        </div>        
      </div>

        
      <div className="flex flex-col gap-3">
         
        <div className="bg-[#221844] rounded-xl p-4 flex items-center justify-between gap-3 border border-[#372e5b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00eefc] flex items-center justify-center text-[#00686f] font-bold">
              <span className="material-symbols-outlined text-[20px]">filter-center-focus</span>
            </div>
            <div>
            <div className="flex items-center gap-2">
              <span className="font-['Rubik'] font-bold text-[15px] text-[#e7deff]">Suction Power</span>                  
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00eefc]/20 text-[#00eefc]">
                 <Lv className={suctionPower}>                  
              </span>
            </div>                
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((level) => (
              <span
                key={level}
                className={`w-4 h-1.5 rounded-full ${
                level <= suctionPower ? 'bg-[#00eefc]' : 'bg-[#150a37]'
                }`}
              />
              ))}
            </div>
          </div>            
        </div>
        <button
          disabled={suctionPower >= 5 || stars < suctionCost}
          onClick={() => handleBuy('suction', suctionCost)}
          className={`px-4 py-2 rounded-full font-['Rubik'] font-bold text-[13px] uppercase tracking-wider transition-all ${
          suctionPower >= 5
          ? 'bg-[#372e5b] text-[#9e8f78] cursor-not-allowed'
          : stars >= suctionCost
          ? 'bg-[#00eefc] text-[#00686f] hover:bg-[#7df4ff] shadow-[0-4px-0-#00686f] active:translate-y-1'
          : 'bg-[#2c234f] text-[#d5c4ab] opacity-60 cursor-not-allowed'
          }`}
        >
        {suctionPower >= 5 ? 'MAX' : `${suctionCost} ⭐`}
        </button>
        </div>
          
          <div className="bg-[#221844] rounded-xl p-4 flex items-center justify-between gap-3 border border-[#372e5b]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffb800] flex items-center justify-center text-[#6b4c00] font-bold">
                <span className="material-symbols-outlined text-[20px]">rocket-launch</span>              
              </div>              
                <div className="flex items-center gap-2">
                  <span className="font-['Rubik'] font-bold text-[15px] text-[#e7deff]">Thruster Overdrive</span>                  
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ffb800]/20 text-[#ffb800]">
                    <Lv className={boostSpeed}>                  
                  </span>
                </div>                
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <span
                      key={level}
                    className={`w-4 h-1.5 rounded-full ${
                        level <= boostSpeed ? 'bg-[#ffb800]' : 'bg-[#150a37]'
                    }`}
                    />
                  ))}
                </div>              
             </div>            
            </div>
            <button
              disabled={boostSpeed >= 5 || stars < boostCost}
              onClick={() => handleBuy('boost', boostCost)}
              className={`px-4 py-2 rounded-full font-['Rubik'] font-bold text-[13px] uppercase tracking-wider transition-all ${
                boostSpeed >= 5
                  ? 'bg-[#372e5b] text-[#9e8f78] cursor-not-allowed'
                  : stars >= boostCost
                  ? 'bg-[#ffb800] text-[#6b4c00] hover:bg-[#ffdca1] shadow-[0-4px-0-#b37d00] active:translate-y-1'
                : 'bg-[#2c234f] text-[#d5c4ab] opacity-60 cursor-not-allowed'
              }`}
            >
              {boostSpeed >= 5 ? 'MAX' : `${boostCost} ⭐`}
            </button>
          </div>
          {}
          <div className="bg-[#221844] rounded-xl p-4 flex items-center justify-between gap-3 border border-[#372e5b]">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffaec6] flex items-center justify-center text-[#8e004a] font-bold">
                <span className="material-symbols-outlined text-[20px]">shield</span>              
              </div>              
                <div className="flex items-center gap-2">
                  <span className="font-['Rubik'] font-bold text-[15px] text-[#e7deff]">Plasm  a Shield</span>                  
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ffaec6]/20 text-[#ffaec6]">
                    <Lv className={shieldDuration}>                  
                  </span>
                </div>                
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <span
                      key={level}
                      className={`w-4 h-1.5 rounded-full ${
                        level <= shieldDuration ? 'bg-[#ffaec6]' : 'bg-[#150a37]'
                      }`}
                    />
                  ))}
                </div>              
              </div>            
            </div>
            <button
              disabled={shieldDuration >= 5 || stars < shieldCost}
              onClick={() => handleBuy('shield', shieldCost)}
              className={`px-4 py-2 rounded-full font-['Rubik'] font-bold text-[13px] uppercase tracking-wider transition-all ${
                shieldDuration >= 5
                  ? 'bg-[#372e5b] text-[#9e8f78] cursor-not-allowed'
                  : stars >= shieldCost
                  ? 'bg-[#ffaec6] text-[#650033] hover:bg-[#ffd9e2] shadow-[0_4px_0_#a10055] active:translate-y-1'
                : 'bg-[#2c234f] text-[#d5c4ab] opacity-60 cursor-not-allowed'
              }`}
            >
              {shieldDuration >= 5 ? 'MAX' : `${shieldCost} ⭐`}
            </button>
          </div>        
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-full bg-[#2c234f] hover:bg-[#3c325f] text-[#e7deff] font-['Rubik'] font-bold text-[14px] uppercase tracking-wider transition-colors shadow-[0-4px-0-#100532]"
        >
          Return to Deck
        </button>       
      </div>
    </div>
  );
};