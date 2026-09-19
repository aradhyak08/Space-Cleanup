import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowLeft,
  Pause,
  Flame,
  Zap,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { GameOverModal } from '../components/GameOverModal.tsx';
import { PauseMissionModal } from '../components/PauseMissionModal';
import { GameState, ActiveControlsState } from '../types/gameEngine';
import { createInitialGameState, resetGameState } from '../game/gameInit';
import { updateGamePhysics } from '../game/gamePhysics';
import { updateGameCollisions } from '../game/gameCollisions';
import { renderGameScene } from '../game/gameRender';

interface PlayZoneViewProps {
  onReturnHome: () => void;
  boostSpeed?: number;
  suctionPower?: number;
  initialScore?: number;
}

export const PlayZoneView: React.FC<PlayZoneViewProps> = ({
  onReturnHome,
  boostSpeed = 1,
  suctionPower = 1,
  initialScore = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(initialScore);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('space_cleanup_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [hitChances, setHitChances] = useState(3);
  const [, setGems] = useState(0);
  const [, setStars] = useState(0);
  const [starsCollectedCount, setStarsCollectedCount] = useState(0);
  const [gemsCollectedCount, setGemsCollectedCount] = useState(0);

  const [isGameOver, setIsGameOver] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [deathCause, setDeathCause] = useState('COLLISION DETECTED');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundManager.getIsMuted());

  const [activeControls, setActiveControls] = useState<ActiveControlsState>({
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
    boost: false,
  });

  const gameRef = useRef<GameState>(createInitialGameState(initialScore));
  const lastScoreRef = useRef<number>(initialScore);

  const handleToggleSound = useCallback(() => {
    const nextMute = soundManager.toggleMute();
    setIsMuted(nextMute);
  }, []);

  const handleRestartMission = useCallback(() => {
    soundManager.playClick();
    resetGameState(gameRef.current);
    lastScoreRef.current = 0;
    setScore(0);
    setHitChances(3);
    setGems(0);
    setStars(0);
    setStarsCollectedCount(0);
    setGemsCollectedCount(0);
    setIsGameOver(false);
    setIsNewHighScore(false);
    setIsPaused(false);
  }, []);

  const handleDirectionPress = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right', isDown: boolean) => {
      setActiveControls((prev) => ({ ...prev, [dir]: isDown }));
      const keys = gameRef.current.keys;
      if (dir === 'up') keys.w = keys.arrowUp = isDown;
      if (dir === 'down') keys.s = keys.arrowDown = isDown;
      if (dir === 'left') keys.a = keys.arrowLeft = isDown;
      if (dir === 'right') keys.d = keys.arrowRight = isDown;
    },
    []
  );

  const handleFirePress = useCallback((isDown: boolean) => {
    setActiveControls((prev) => ({ ...prev, fire: isDown }));
    gameRef.current.fireButtonHeld = isDown;
    gameRef.current.keys.space = isDown;
  }, []);

  const handleBoostPress = useCallback((isDown: boolean) => {
    setActiveControls((prev) => ({ ...prev, boost: isDown }));
    gameRef.current.keys.shift = isDown;
  }, []);

  useEffect(() => {
    gameRef.current.isPaused = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setIsPaused((prev) => !prev);
        return;
      }

      const keys = gameRef.current.keys;
      const k = e.key.toLowerCase();

      if (k === 'w' || e.key === 'ArrowUp') {
        keys.w = keys.arrowUp = true;
        setActiveControls((prev) => ({ ...prev, up: true }));
      }
      if (k === 's' || e.key === 'ArrowDown') {
        keys.s = keys.arrowDown = true;
        setActiveControls((prev) => ({ ...prev, down: true }));
      }
      if (k === 'a' || e.key === 'ArrowLeft') {
        keys.a = keys.arrowLeft = true;
        setActiveControls((prev) => ({ ...prev, left: true }));
      
      }
    if (k === 'd' || e.key === 'ArrowRight') {
        keys.d = keys.arrowRight = true;
        setActiveControls((prev) => ({ ...prev, right: true }));
    }
      if (e.code === 'Space' || k === 'f' || k === 'j' || k === 'z') {
        keys.space = true;
        setActiveControls((prev) => ({ ...prev, fire: true }));
      }
      if (e.key === 'Shift') {
        keys.shift = true;
        setActiveControls((prev) => ({ ...prev, boost: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
    const keys = gameRef.current.keys;
      const k = e.key.toLowerCase();

      if (k === 'w' || e.key === 'ArrowUp') {
        keys.w = keys.arrowUp = false;
        setActiveControls((prev) => ({ ...prev, up: false }));
      }
      if (k === 's' || e.key === 'ArrowDown') {
        keys.s = keys.arrowDown = false;
        setActiveControls((prev) => ({ ...prev, down: false }));
      }
      if (k === 'a' || e.key === 'ArrowLeft') {
        keys.a = keys.arrowLeft = false;
        setActiveControls((prev) => ({ ...prev, left: false }));
      }
      if (k === 'd' || e.key === 'ArrowRight') {
        keys.d = keys.arrowRight = false;
        setActiveControls((prev) => ({ ...prev, right: false }));
      }
      if (e.code === 'Space' || k === 'f' || k === 'j' || k === 'z') {
        keys.space = false;
        setActiveControls((prev) => ({ ...prev, fire: false }));
      }
      if (e.key === 'Shift') {
        keys.shift = false;
        setActiveControls((prev) => ({ ...prev, boost: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    let animId: number;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.imageSmoothingEnabled = false;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (currentTime: number) => {
      animId = requestAnimationFrame(render);

      const game = gameRef.current;
      if (game.isPaused) {
        game.lastTime = currentTime;
        return;
      }

      const dt = Math.min((currentTime - game.lastTime) / 1000, 0.05);
      game.lastTime = currentTime;

      const width = canvas.width;
      const height = canvas.height;
      const timeSec = currentTime / 1000;

      const { wantsBoost } = updateGamePhysics(
        game,
        dt,
        width,
        height,
        boostSpeed,
        highScore,
        setHighScore,
        setHitChances,
        setIsNewHighScore,
        setDeathCause,
        setElapsedSeconds,
        setScore,
        setIsGameOver
      );

      updateGameCollisions(
        game,
        dt,
        suctionPower,
        wantsBoost,
        highScore,
        setHighScore,
        setHitChances,
        setGems,
        setStars,
        setGemsCollectedCount,
        setStarsCollectedCount,
        setIsNewHighScore,
        setDeathCause
      );

      renderGameScene(ctx, game, width, height, timeSec, dt, wantsBoost);

      if (lastScoreRef.current !== game.score) {
        lastScoreRef.current = game.score;
        setScore(game.score);
      }
    };

    gameRef.current.lastTime = performance.now();
    render(performance.now());

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [boostSpeed, suctionPower, highScore, setHighScore, setGems, setStars]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    gameRef.current.pointer.active = true;
    gameRef.current.pointer.screenX = e.clientX;
    gameRef.current.pointer.screenY = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameRef.current.pointer.active) {
      gameRef.current.pointer.screenX = e.clientX;
      gameRef.current.pointer.screenY = e.clientY;
    }
  };

  const handlePointerUp = () => {
    gameRef.current.pointer.active = false;
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#0a0319]">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full block cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />

      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 select-none pointer-events-auto">
       
           <button onClick={() => {
            soundManager.playClick();
            setIsPaused(true);
            }}
          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 backdrop-blur-md rounded-lg transition-colors cursor-pointer"
        title="Pause / Menu"
        >
          <ArrowLeft size={15} />
        </button>

        <button 
          onClick={handleToggleSound}
          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 backdrop-blur-md rounded-lg transition-colors cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        <button         
          onClick={() => setIsPaused(true)}
          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 backdrop-blur-md rounded-lg transition-colors cursor-pointer"
          title="Pause"
        >
          <Pause size={15} />
        </button>
      </div>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md select-none pointer-events-none text-[8px] font-mono tracking-widest text-slate-300/70">
        <span>NAV: [W/A/D]</span>        
        <span className="text-white/20">•</span>        
        <span>BRAKE: [S]</span>
        <span className="text-white/20">•</span>        <span>FIRE: [SPACE]</span>        <span className="text-white/20">•</span>        <span>BOOST: [SHIFT]</span>      </div>

      <div className="absolute top-3 right-4 z-30 flex items-center gap-4 select-none pointer-events-none">
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Heart
              key={idx}
              size={14}
              className={`transition-all duration-150 ${
                idx < hitChances
                  ? 'fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]'
                  : 'fill-transparent text-white/20 stroke-[1.5]'
              }`}
            />
          ))}
        </div>

        <div className="font-['Orbitron'] font-black text-sm sm:text-base text-[#ffcc00] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {score.toLocaleString()}
        </div>      
      </div>

      <div className="absolute bottom-5 left-5 z-30 flex items-center gap-3 pointer-events-auto select-none">
        <button          
          id="btn-fire-action"
          onPointerDown={(e) => {
            e.stopPropagation();
            handleFirePress(true);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            handleFirePress(false);
          }}
          onPointerLeave={() => handleFirePress(false)}
          onPointerCancel={() => handleFirePress(false)}
          className={`w-15 h-15 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center transition-all duration-75 select-none cursor-pointer backdrop-blur-sm border ${
            activeControls.fire 
              ? 'border-white/35 bg-white/20 text-white scale-95'
              : 'border-white/10 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/20 text-white/70 hover:text-white/90'
          }`}
          title="Fire Plasma Bolt (Space)"
        >
          <Flame            
            size={20}
            className={activeControls.fire ? 'text-white' : 'text-white/75'}
          />
          <span className="font-['Orbitron'] font-bold text-[9px] tracking-wider mt-0.5">
            FIRE
          </span>
          <span className="font-mono text-[7px] text-white/40 leading-none">
            SPACE
          </span>        
        </button>

        <button          
          id="btn-boost-action"
          onPointerDown={(e) => {
            e.stopPropagation();
            handleBoostPress(true);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            handleBoostPress(false);
          }}
          onPointerLeave={() => handleBoostPress(false)}
          onPointerCancel={() => handleBoostPress(false)
          }
          className={`w-15 h-15 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center transition-all duration-75 select-none cursor-pointer backdrop-blur-sm border ${
            activeControls.boost
              ? 'border-white/35 bg-white/20 text-white scale-95'
              : 'border-white/10 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/20 text-white/70 hover:text-white/90'
          }`}
        title="Nitro Boost (Shift)"
        >
          <Zap
            size={20}
            className={activeControls.boost ? 'text-white' : 'text-white/75'}
          />
          <span className="font-['Orbitron'] font-bold text-[9px] tracking-wider mt-0.5">
            BOOST
        </span>
          <span className="font-mono text-[7px] text-white/40 leading-none">
            SHIFT
          </span>
        </button>
      </div>

      <div className="absolute bottom-5 right-5 z-30 pointer-events-auto select-none">
        <div className="flex flex-col items-center gap-2">
          <button
            id="dpad-up"
            onPointerDown={(e) => {
              e.stopPropagation();
              handleDirectionPress('up', true);
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              handleDirectionPress('up', false);
            }}
            onPointerLeave={() => handleDirectionPress('up', false)}
            onPointerCancel={() => handleDirectionPress('up', false)}
            className={`w-13 h-13 rounded-full flex flex-col items-center justify-center transition-all duration-75 select-none cursor-pointer backdrop-blur-sm border ${
              activeControls.up
                ? 'border-white/35 bg-white/20 text-white scale-95'
                : 'border-white/10 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/20 text-white/70 hover:text-white/90'
            }`}
            title="Forward Thrust (W / ↑)"
          >
            <ChevronUp
              size={20}
            className={`stroke-[2.5] ${activeControls.up ? 'text-white' : 'text-white/75'}`}
            />
            <span className="text-[7.5px] font-['Orbitron'] font-bold tracking-wider -mt-0.5">
              FWD
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="dpad-left"
              onPointerDown={(e) => {
                e.stopPropagation();
                handleDirectionPress('left', true);
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                handleDirectionPress('left', false);
              }}
            onPointerLeave={() => handleDirectionPress('left', false)}
              onPointerCancel={() => handleDirectionPress('left', false)}
              className={`w-13 h-13 rounded-full flex flex-col items-center justify-center transition-all duration-75 select-none cursor-pointer backdrop-blur-sm border ${
                activeControls.left
                  ? 'border-white/35 bg-white/20 text-white scale-95'
                  : 'border-white/10 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/20 text-white/70 hover:text-white/90'
              }`}
              title="Turn Left (A / ←)"
            >
              <ChevronLeft
                size={20}
                className={`stroke-[2.5] ${activeControls.left ? 'text-white' : 'text-white/75'}`}
              />
              <span className="text-[7.5px] font-['Orbitron'] font-bold tracking-wider -mt-0.5">
                L
              </span>
            </button>

            <button
              id="dpad-down"
              onPointerDown={(e) => {
                e.stopPropagation();
                handleDirectionPress('down', true);
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                handleDirectionPress('down', false);
              }}
              onPointerLeave={() => handleDirectionPress('down', false)}
              onPointerCancel={() => handleDirectionPress('down', false)}
              className={`w-16 h-13 rounded-2xl flex flex-col items-center justify-center transition-all duration-75 select-none cursor-pointer backdrop-blur-sm border ${
                activeControls.down
                  ? 'border-white/35 bg-white/20 text-white scale-95'
                  : 'border-white/10 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/20 text-white/70 hover:text-white/90'
              }`}
              title="Brake / Slow Down (S / ↓)"
            >
              <div className={`w-2 h-2 rounded-full mb-0.5 ${activeControls.down ? 'bg-white' : 'bg-white/40'}`} />
              <span className="text-[8px] font-['Orbitron'] font-bold tracking-wider">
                BRAKE
              </span>
            </button>

            <button
              id="dpad-right"
              onPointerDown={(e) => {
                e.stopPropagation();
                handleDirectionPress('right', true);
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                handleDirectionPress('right', false);
              }}
              onPointerLeave={() => handleDirectionPress('right', false)}
              onPointerCancel={() => handleDirectionPress('right', false)}
              className={`w-13 h-13 rounded-full flex flex-col items-center justify-center transition-all duration-75 select-none cursor-pointer backdrop-blur-sm border ${
                activeControls.right
                  ? 'border-white/35 bg-white/20 text-white scale-95'
                  : 'border-white/10 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/20 text-white/70 hover:text-white/90'
              }`}
              title="Turn Right (D / →)"
            >
            <ChevronRight
                size={20
                }
                className={`stroke-[2.5] ${activeControls.right ? 'text-white' : 'text-white/75'}`}
              />
              <span className="text-[7.5px] font-['Orbitron'] font-bold tracking-wider -mt-0.5">
                R
              </span>
            </button>
          </div>
        </div>
      </div>

      <PauseMissionModal
        isOpen={isPaused}
        onClose={() => setIsPaused(false)}
        onResume={() => setIsPaused(false)}
        onRestart={handleRestartMission}
        onReturnHome={onReturnHome}
        score={score}
        highScore={highScore
        }
      />

      <GameOverModal
        isOpen={isGameOver}
        score={score}
        highScore={highScore}
        isNewHighScore={isNewHighScore}
        deathCause={deathCause}
        timeSurvived={elapsedSeconds}
        starsCollected={starsCollectedCount}
        gemsCollected={gemsCollectedCount}
        onRestart={handleRestartMission}
        onReturnHome={onReturnHome}
      />
    </div>
  );
};