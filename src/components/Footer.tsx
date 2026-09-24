import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full bg-[#100532]/90 backdrop-blur-xl py-6 border-t border-[#372e5b]/40">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#ffb800] flex items-center justify-center shadow-[0-2px-0-#b37d00]">
              <span className="material-symbols-outlined text-[#6b4c00] text-[16px]">
                  rocket
                </span>          
            </div>          
            <span className="font-['Rubik'] font-bold text-[15px] text-[#ffdca1] tracking-wide uppercase">
                SPACE CLEANUP ARCADE CORP
            </span>        
        </div>
        <p className="font-['Rubik'] text-[13px] text-[#d5c4ab]">
          © 3042 Intergalactic Debris Operations. Certified Galactic Cleaner System.
        </p>
        <div className="flex items-center gap-2 text-[#d5c4ab] font-['Rubik'] font-bold text-[12px]">
           <span className="px-3 py-1 bg-[#221844] rounded-full border border-[#372e5b]/50">
                SECTOR 04
            </span>          
            <span className="px-3 py-1 bg-[#221844] rounded-full border border-[#372e5b]/50 text-[#00eefc]">
               ORBIT ENGINE v2.4        
            </span>
        </div>      
     </div>    
    </footer>  );
};