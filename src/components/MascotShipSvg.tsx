import React from 'react';

interface MascotShipSvgProps {
  className?: string;
  isBoosting?: boolean;
}

export const MascotShipSvg: React.FC<MascotShipSvgProps> = ({ className, isBoosting }) => assName = 'w-full h-full', isBoosting = false }) => {
  return (
        <svg 
           className={`${className} overflow-visible`}
           viewBox="0 0 400 400"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
        >
         <defs>
        
          <linearGradient id="enginePlasmaGrad" x1="200" y1="280" x2="200" y2="380" gradientUnits="userSpaceOnUse">
             <stop offset="0%" stopColor="#FFFFFF" />
             <stop offset="25%" stopColor="#00EEFC" />
             <stop offset="65%" stopColor="#0080FF" stopOpacity="0.7" />
             <stop offset="100%" stopColor="#6E00FF" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="engineGlowCone" cx="200" cy="285" r="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00EEFC" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#005BFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>       
            <linearGradient id="yellowHullHero" x1="200" y1="90" x2="200" y2="310" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFDEA8" />
              <stop offset="25%" stopColor="#FFB800" />
              <stop offset="85%" stopColor="#E59400" />
              <stop offset="100%" stopColor="#996300" />
            </linearGradient>
        
            <linearGradient id="glassDomeHero" x1="160" y1="110" x2="240" y2="210" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D3FBFF" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#7DF4FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00686F" stopOpacity="0.8" />
            </linearGradient>
        
            <linearGradient id="cyanWingHero" x1="100" y1="210" x2="100" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7DF4FF" />
              <stop offset="60%" stopColor="#00A3FF" />
              <stop offset="100%" stopColor="#005B8E" />
            </linearGradient>      
          </defs>
      
          <ellipse cx="200" cy="288" rx="20" ry="6" fill="#1b1238" stroke="#00eefc" strokeWidth="1.5" />

     
          <ellipse cx="200" cy="305" rx="34" ry="22" fill="url(#engineGlowCone)" />

      
            <g className={isBoosting ? "animate-pulse" : ""}>
        
               <path          
                    d={
                      isBoosting
                      ? "M184 288 C182 320, 190 365, 200 380 C210 365, 218 320, 216 288 Z"
                       : "M186 288 C185 315, 192 342, 200 355 C208 342, 215 315, 214 288 Z"
                    }
                    fill="url(#enginePlasmaGrad)"
                    opacity="0.95"
               />

        
               <ellipse cx="200" cy="305" rx="9" ry="2.5" fill="#D3FBFF" opacity="0.85" />
        
               <ellipse cx="200" cy="324" rx="5" ry="1.5" fill="#7DF4FF" opacity="0.7" />
            </g>

      
            <ellipse cx="140" cy="292" rx="8" ry="14" fill="#00EEFC" opacity="0.5" />
            <ellipse cx="260" cy="292" rx="8" ry="14" fill="#00EEFC" opacity="0.5" />

      
          <path d="M140 210 L50 255 C42 259, 40 270, 48 276 L130 300 Z" fill="url(#cyanWingHero)" />
          <path d="M52 260 L130 220 L130 230 L60 268 Z" fill="#D3FBFF" opacity="0.7" />
          <circle cx="75" cy="265" r="4" fill="#FFDEA8" />

      
          <rect x="52" y="270" width="16" height="34" rx="8" fill="#372E5B" transform="rotate(-15 52 270)" />
          <ellipse cx="56" cy="303" rx="8" ry="4" fill="#00EEFC" transform="rotate(-15 56 303)" />

     
          <path d="M260 210 L350 255 C358 259, 360 270, 352 276 L270 300 Z" fill="url(#cyanWingHero)" />
          <path d="M348 260 L270 220 L270 230 L340 268 Z" fill="#D3FBFF" opacity="0.7" />
          <circle cx="325" cy="265" r="4" fill="#FFDEA8" />

      
           <rect x="332" y="266" width="16" height="34" rx="8" fill="#372E5B" transform="rotate(15 332 266)" />
           <ellipse cx="344" cy="299" rx="8" ry="4" fill="#00EEFC" transform="rotate(15 344 299)" />

    
            <ellipse cx="200" cy="240" rx="102" ry="68" fill="url(#yellowHullHero)" />

      
           <path d="M102 248 C120 295, 280 295, 298 248 C280 306, 120 306, 102 248 Z" fill="#6B4C00" />

      
            <ellipse cx="200" cy="275" rx="42" ry="18" fill="#221844" />
            <ellipse cx="200" cy="275" rx="36" ry="12" fill="#00EEFC" />
            <ellipse cx="200" cy="275" rx="26" ry="7" fill="#150A37" />
            <ellipse cx="200" cy="275" rx="14" ry="4" fill="#7DF4FF" />

      
            <path d="M125 210 C155 190, 245 190, 275 210 C240 198, 160 198, 125 210 Z" fill="#FFFFFF" opacity="0.6" />

      
            <ellipse cx="200" cy="188" rx="66" ry="48" fill="#2C234F" />
            <ellipse cx="200" cy="186" rx="62" ry="44" fill="#00EEFC" />

    
            <ellipse cx="200" cy="170" rx="58" ry="58" fill="url(#glassDomeHero)" />

      
            <ellipse cx="200" cy="190" rx="28" ry="24" fill="#FFFFFF" />
      
            <path d="M200 182 L202 187 L207 187 L203 190 L205 195 L200 192 L195 195 L197 190 L193 187 L198 187 Z" fill="#FFB800" />
      
            <circle cx="200" cy="155" r="25" fill="#FFFFFF" />
      
           <ellipse cx="200" cy="155" rx="18" ry="14" fill="#150A37" />
           <ellipse cx="200" cy="155" rx="16" ry="12" fill="#221844" />
      
           <circle cx="194" cy="153" r="3.5" fill="#FFDEA8" />
            <circle cx="195" cy="152" r="1.2" fill="#FFFFFF" />
            <circle cx="206" cy="153" r="3.5" fill="#FFDEA8" />
            <circle cx="207" cy="152" r="1.2" fill="#FFFFFF" />    <path d="M196 160 Q200 165 204 160" fill="none" stroke="#FFDEA8" strokeWidth="2" strokeLinecap="round" />

      
            <ellipse cx="174" cy="170" rx="7" ry="11" fill="#FFFFFF" transform="rotate(-35 174 170)" />
            <circle cx="170" cy="162" r="6" fill="#FFDEA8" />

      
            <path d="M165 140 C170 125, 185 118, 200 118 C190 122, 175 130, 168 145 Z" fill="#FFFFFF" opacity="0.85" />
           <circle cx="230" cy="138" r="5" fill="#FFFFFF" opacity="0.75" />

      
            <rect x="198" y="104" width="4" height="12" rx="2" fill="#9E8F78" />
           <circle cx="200" cy="102" r="6" fill="#FFAEC6" />
           <circle cx="199" cy="100" r="2" fill="#FFFFFF" />
        </svg>
    );
};