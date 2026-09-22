import React from 'react';
import { createPortal } from 'react-dom';
import { soundManager } from '../utils/audio';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a031e]/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-[280px] bg-[#1a0f35] rounded-2xl p-5 border border-[#ff4d4d]/40 shadow-2xl text-center flex flex-col items-center">
        
                <div className="w-10 h-10 rounded-full bg-[#3d1222] border border-[#ff4d4d]/50 flex items-center justify-center mb-3 text-[#ff6b6b]">
                   <span className="material-symbols-outlined text-[22px]">warning</span>        
                </div>        
                <p className="font-['Russo-One'] text-[16px] text-white mb-1 uppercase tracking-wide">
                   RESET PROGRESS ?        
                </p>        
                <p className="font-['Chakra-Petch'] text-[12px] text-[#ffdca1]/70 mb-5 leading-snug">
                    This will wipe your scores, stars, and collected diamonds.
                </p>
        
                <div className="flex items-center gap-3 w-full">
                    <button            
                      onClick={() => {
                      soundManager.playClick();
                      onClose();
                      }
                      }
                      className="flex-1 py-2.5 rounded-xl bg-[#2a1d4a] hover:bg-[#382863] text-[#d5c4ab] font-['Chakra-Petch'] font-bold text-[12px] uppercase tracking-wider transition-all cursor-pointer border border-[#443275]/50"
                    >
                      Cancel
                    </button>
                  <button            
                       onClick={() => {
                       soundManager.playExplosion();
                        onConfirm();
                       onClose();
                    }}
                       className="flex-1 py-2.5 rounded-xl bg-gradient-to-b from-[#ff5252] to-[#d32f2f] hover:from-[#ff6b6b] hover:to-[#b71c1c] text-white font-['Russo-One'] text-[12px] uppercase tracking-wider transition-all cursor-pointer shadow-[0-2px-0-#7f0000]"
                    >
                        Reset
                    </button>        
                </div>      
            </div>    
        </div>,
        document.body  
    );
};  