import React from 'react';
import { soundManager } from '../Utils/audio';

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
  isOpen, onClose, stars, suctionPower, boostSpeed, shieldDuration, onUpgrade,
}) => {
  if (!isOpen) return null;
  const items = [
    ['suction', 'Suction Power', suctionPower, 200],
    ['boost', 'Thruster Overdrive', boostSpeed, 250],
    ['shield', 'Plasma Shield', shieldDuration, 300],
  ] as const;

  const buy = (type: 'suction' | 'boost' | 'shield', cost: number) => {
    if (stars >= cost) {
      soundManager.playCrystalPickup();
      onUpgrade(type, cost);
    } else {
      soundManager.playDamage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#100532]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#1d1440] rounded-2xl p-6 border border-[#3c325f]/50">
        <div className="flex justify-between items-center border-b border-[#372e5b] pb-4 mb-4">
          <div>
            <h2 className="font-black text-[22px] text-[#ffdca1]">HANGAR TECH UPGRADE</h2>
            <p className="text-[12px] text-[#00eefc]">BUMBLEBEE MK-01 CUSTOMIZATION</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#2c234f] text-white">✕</button>
        </div>
        <div className="flex justify-between bg-[#100532] px-4 py-2 rounded-xl mb-4 text-[#ffb800]">
          <span>Available Stardust</span><b>★ {stars.toLocaleString()}</b>
        </div>
        <div className="flex flex-col gap-3">
          {items.map(([type, label, level, baseCost]) => {
            const cost = level * baseCost;
            return (
              <div key={type} className="bg-[#221844] rounded-xl p-4 flex items-center justify-between border border-[#372e5b]">
                <div><b className="text-[#e7deff]">{label}</b><div className="text-xs text-[#d5c4ab]">Level {level} / 5</div></div>
                <button disabled={level >= 5 || stars < cost} onClick={() => buy(type, cost)} className="px-4 py-2 rounded-full bg-[#2c234f] text-white font-bold">
                  {level >= 5 ? 'MAX' : `${cost} ⭐`}
                </button>
              </div>
            );
          })}
        </div>
        <button onClick={onClose} className="mt-6 w-full py-3 rounded-full bg-[#2c234f] text-white font-bold">RETURN TO DECK</button>
      </div>
    </div>
  );
};
