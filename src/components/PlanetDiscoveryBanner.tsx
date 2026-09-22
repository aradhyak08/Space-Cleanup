import React from 'react';
import { PlanetData } from '../types/universe';

interface PlanetDiscoveryBannerProps {
  planet: PlanetData | null;
  onClose?: () => void;
}

export const PlanetDiscoveryBanner: React.FC<PlanetDiscoveryBannerProps> = ({ planet }) => {
  if (!planet) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center animate-pulse">
            <div className="relative flex items-center gap-3 px-4 py-2.5 bg-[#12082b] border-2 border-[#00f0ff] shadow-[4px-4px-0px-#000]">
        
               <div className="w-8 h-8 rounded-none border border-white flex items-center justify-center flex-shrink-0 shadow-[2px-2px-0px-#000]"
                    style={{
                      backgroundColor: planet.color,
                    }}
                >
                 <span className="text-xs">🪐</span>
                </div>
                <div className="flex flex-col text-left">
                   <div className="flex items-center gap-2">
                       <span className="font-['Press-Start-2P'] text-[8px] text-[#00f0ff] uppercase tracking-wider">
                         ORBIT ACHIEVED
                        </span>            
                        <span className="font-['Press-Start-2P'] text-[9px] text-[#ffcc00]">
                           +{planet.bonusPoints}
                        </span>          
                    </div>          
                    <span className="font-['Press-Start-2P'] text-[12px] sm:text-[14px] text-white tracking-wider uppercase mt-1">
                     {planet.name}
                    </span>          
                    <span className="font-['Silkscreen'] text-[10px] text-[#ffdca1] mt-0.5">
                      {planet.title} • {planet.description}
                    </span>        
                </div>      
            </div>    
        </div>  
    );
};