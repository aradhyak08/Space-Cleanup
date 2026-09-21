import React, { useRef, useEffect } from 'react';
import {
  PlanetData,
  AsteroidObstacle,
  SpaceMineObstacle,
  CollectibleItem,
  CometObstacle,
  SpaceDebrisItem,
} from '../types/universe';

interface CosmicRadarProps {
  playerX: number;
  playerY: number;
  playerAngle: number;
  planets: PlanetData[];
  asteroids: AsteroidObstacle[];
  mines: SpaceMineObstacle[];
  collectibles: CollectibleItem[];
  comets?: CometObstacle[];
  debris?: SpaceDebrisItem[];
  warpGate?: { x: number; y: number; active: boolean };
  discoveredPlanets: Set<string>;
  nearestPlanet: PlanetData | null;
  distanceToNearest: number;
  onRadarClick?: (targetX: number, targetY: number) => void;
}

export const CosmicRadar: React.FC<CosmicRadarProps> = ({
  playerX,
  playerY,
  playerAngle,
  planets,
  asteroids,
  mines,
  collectibles,
  comets = [],
  debris = [],
  warpGate,
  discoveredPlanets,
  nearestPlanet,
  distanceToNearest,
 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const maxWorldRadius = 4200;
    const scale = (center - 12) / maxWorldRadius;
  ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, center - 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(10, 4, 30, 0.88)';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(0, 238, 252, 0.4)';
    ctx.stroke();
    ctx.clip();

    ctx.strokeStyle = 'rgba(0, 238, 252, 0.12)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1.0].forEach((ratio) => {
      ctx.beginPath();
      ctx.arc(center, center, (center - 12) * ratio, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.moveTo(center, 4);
    ctx.lineTo(center, size - 4);
    ctx.moveTo(4, center);
    ctx.lineTo(size - 4, center);
    ctx.strokeStyle = 'rgba(0, 238, 252, 0.15)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffb800';
    ctx.shadowColor = '#ff8800';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    planets.forEach((planet) => {
      const orbitR = planet.distance * scale;
      ctx.beginPath();
    ctx.arc(center, center, orbitR, 0, Math.PI * 2);
      ctx.strokeStyle = discoveredPlanets.has(planet.id)
        ? 'rgba(0, 238, 252, 0.25)'
        : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const px = center + Math.cos(planet.orbitAngle) * orbitR;
      const py = center + Math.sin(planet.orbitAngle) * orbitR;

      ctx.beginPath();
      const dotRadius = Math.max(2, Math.min(5, planet.radius * scale * 1.5));
      ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = planet.color;
      ctx.shadowColor = planet.glowColor;
      ctx.shadowBlur = discoveredPlanets.has(planet.id) / 6 : 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.fillStyle = 'rgba(255, 30, 60, 0.95)';
    mines.forEach((mine) => {
      const distSq = (mine.x - playerX) ** 2 + (mine.y - playerY) ** 2;
      if (distSq < 3200 ** 2) {
        const mx = center + mine.x * scale;
        const my = center + mine.y * scale;
        ctx.fillRect(mx - 1.5, my - 1.5, 3, 3);
      }
    });

    ctx.fillStyle = 'rgba(255, 185, 0, 0.9)';
    asteroids.forEach((ast) => {
      const distSq = (ast.x - playerX) ** 2 + (ast.y - playerY) ** 2;
      if (distSq < 2800 ** 2 && ast.hp > 0) {
        const ax = center + ast.x * scale;
        const ay = center + ast.y * scale;
        ctx.fillRect(ax - 1.5, ay - 1.5, 3, 3);
      }
    });

    ctx.fillStyle = '#ffaa00';
    comets.forEach((cmt) => {
      const cx = center + cmt.x * scale;
      const cy = center + cmt.y * scale;
      ctx.fillRect(cx - 2, cy - 2, 4, 4);
    });

    ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
    debris.forEach((deb) => {
      const distSq = (deb.x - playerX) ** 2 + (deb.y - playerY) ** 2;
      if (distSq < 2500 ** 2) {
        const dx = center + deb.x * scale;
        const dy = center + deb.y * scale;
        ctx.fillRect(dx - 1, dy - 1, 2.5, 2.5);
      }
    });

    ctx.fillStyle = 'rgba(255, 220, 100, 0.8)';
    collectibles.forEach((c) => {
      const distSq = (c.x - playerX) ** 2 + (c.y - playerY) ** 2;
      if (distSq < 2000 ** 2) {
        const cx = center + c.x * scale;
        const cy = center + c.y * scale;
        ctx.fillRect(cx - 0.75, cy - 0.75, 1.5, 1.5);
      }
    });

    if (warpGate) {
      const gx = center + warpGate.x * scale;
      const gy = center + warpGate.y * scale;

     
      
      ctx.beginPath();
      ctx.arc(gx, gy, warpGate.active ? 6 : 4.5, 0, Math.PI * 2);
      ctx.strokeStyle = warpGate.active ? '#00f0ff' : '#ffaa00';
      ctx.lineWidth = warpGate.active  ? 1.5 : 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = warpGate.active ? '#39ff14' : '#ff5500';
      ctx.shadowColor = warpGate.active ? '#00f0ff' : '#ffaa00';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }

    const stX = center + 720 * scale;
    const stY = center + 0 * scale;
    ctx.save();
    ctx.beginPath();
    ctx.arc(stX, stY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(stX, stY, 7, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    const plX = center + playerX * scale;
    const plY = center + playerY * scale;

    ctx.save();
    ctx.translate(plX, plY);
    ctx.rotate(playerAngle);

    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(4, 4);
    ctx.lineTo(0, 2);
    ctx.lineTo(-4, 4);
    ctx.closePath();
    ctx.fillStyle = '#00eefc';
    ctx.shadowColor = '#00eefc';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(plX, plY, 7, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 238, 252, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }, [playerX, playerY, playerAngle, planets, asteroids, mines, collectibles, discoveredPlanets]);

  return (
        <div className="relative flex flex-col items-center select-none pointer-events-auto">
      
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-[#090d16] border-2 border-[#1e293b] shadow-[inset-0-2px-8px-rgba(0,0,0,0.9),0-4px-12px-rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
        
               <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#00f0ff]/5 via-transparent to-[#00f0ff]/10 pointer-events-none z-10" />
        
                  <Canvas          
                  ref={canvasRef}
                  width={128}
                  height={128}
                  className="w-full h-full rounded-full"
                  style={{ imageRendering: 'pixelated' }}
                />

                <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[6px] font-['Press_Start_2P'] text-[#00f0ff] opacity-80 z-20">
                  N
                </span>        
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[5px] font-['Press_Start_2P'] text-[#38bdf8] opacity-50 z-20">
                  S
                </span>        
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[5px] font-['Press_Start_2P'] text-[#38bdf8] opacity-50 z-20">
                  E
                </span>        
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[5px] font-['Press_Start_2P'] text-[#38bdf8] opacity-50 z-20">
                  W
                </span>     
            </div> 
            {nearestPlanet && (
                <div className="mt-1 flex items-center gap-1.5 bg-[#090d16]/90 px-2 py-0.5 rounded border border-[#1e293b] shadow-sm">
                   <Span           
                     className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                     style={{ backgroundColor: nearestPlanet.color }}
                    />
                    <span className="font-['Press_Start_2P'] text-[6px] text-[#38bdf8] uppercase">
                      {nearestPlanet.name}
                    </span>          
                    <span className="font-['Press_Start_2P'] text-[6px] text-[#ffcc00]">
                       {Math.round(distanceToNearest)}
                    </span>        
                </div>      
           )}
        </div>  
    );
};