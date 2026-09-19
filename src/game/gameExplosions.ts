import { soundManager } from '../utils/audio';
import { SpaceMineObstacle } from '../types/universe';
import { GameState, LAUNCH_STATION } from '../types/gameEngine';

export function triggerFatalBlast(
  game: GameState,
  reason: string,
  highScore: number,
  setHighScore: (score: number) => void,
  setIsNewHighScore: (val: boolean) => void,
  setDeathCause: (cause: string) => void
): void {
  if (game.isGameOver || game.isDying) return;
  game.isDying = true;
  game.deathTimer = 0;
  soundManager.playExplosion();
  game.shake = 38;

  const blastX = game.x;
  const blastY = game.y;
  const shipAng = game.angle;
  const fwdX = Math.cos(shipAng);
  const fwdY = Math.sin(shipAng);
  const rightX = -fwdY;
  const rightY = fwdX;

  game.wreckage = [
    {
      x: blastX + fwdX * 14,
      y: blastY + fwdY * 14,
      vx: fwdX * 190 + (Math.random() - 0.5) * 60,
      vy: fwdY * 190 + (Math.random() - 0.5) * 60,
      angle: shipAng,
      rotSpeed: 5.5,
      width: 8,
      height: 10,
      color: '#ff2a4b',
      detailColor: '#ffffff',
      type: 'nose',
    },
    {
      x: blastX - rightX * 10 - fwdX * 4,
      y: blastY - rightY * 10 - fwdY * 4,
      vx: -rightX * 170 + (Math.random() - 0.5) * 50,
      vy: -rightY * 170 + (Math.random() - 0.5) * 50,
      angle: shipAng - 0.5,
      rotSpeed: -5.8,
      width: 9,
      height: 12,
      color: '#ff2a4b',
      detailColor: '#801026',
      type: 'wing_l',
    },
    {
      x: blastX + rightX * 10 - fwdX * 4,
      y: blastY + rightY * 10 - fwdY * 4,
      vx: rightX * 170 + (Math.random() - 0.5) * 50,
      vy: rightY * 170 + (Math.random() - 0.5) * 50,
      angle: shipAng + 0.5,
      rotSpeed: 6.2,
      width: 9,
      height: 12,
      color: '#ff2a4b',
      detailColor: '#801026',
      type: 'wing_r',
    },
    {
      x: blastX + fwdX * 4,
      y: blastY + fwdY * 4,
      vx: fwdX * 130 + rightX * 80,
      vy: fwdY * 130 + rightY * 80,
      angle: Math.random() * Math.PI,
      rotSpeed: 9.0,
      width: 5,
      height: 5,
      color: '#00f0ff',
      detailColor: '#ffffff',
      type: 'cockpit',
    },
    {
      x: blastX + fwdX * 4,
      y: blastY + fwdY * 4,
      vx: fwdX * 130 - rightX * 80,
      vy: fwdY * 130 - rightY * 80,
      angle: Math.random() * Math.PI,
      rotSpeed: -8.5,
      width: 5,
      height: 5,
      color: '#00f0ff',
    detailColor: '#ffffff',
      type: 'cockpit',
    },
    {
      x: blastX - fwdX * 2,
      y: blastY - fwdY * 2,
      vx: (Math.random() - 0.5) * 120,
      vy: (Math.random() - 0.5) * 120,
      angle: shipAng,
      rotSpeed: 3.8,
      width: 10,
      height: 8,
      color: '#f0f0f5',
      detailColor: '#7a7a99',
      type: 'body',
    },
    {
      x: blastX - fwdX * 8,
    y: blastY - fwdY * 8,
      vx: (Math.random() - 0.5) * 100,
      vy: (Math.random() - 0.5) * 100,
      angle: shipAng + 1.2,
      rotSpeed: -4.2,
    width: 8,
      height: 7,
      color: '#e2e2ec',
      detailColor: '#5c5c7a',
      type: 'body',
    },
    {
      x: blastX - fwdX * 14,
      y: blastY - fwdY * 14,
      vx: -fwdX * 180 + (Math.random() - 0.5) * 40,
      vy: -fwdY * 180 + (Math.random() - 0.5) * 40,
      angle: shipAng + Math.PI,
      rotSpeed: -4.5,
      width: 8,
      height: 6,
      color: '#33264d',
      detailColor: '#ffaa00',
      type: 'engine',
    },
  ];

  game.shockwaves = [
    {
      x: blastX,
      y: blastY,
      radius: 8,
      maxRadius: 95,
      color: '#ffffff',
      lineWidth: 4,
      alpha: 1,
    },
    {
      x: blastX,
      y: blastY,
      radius: 4,
      maxRadius: 145,
      color: '#ff3b00',
      lineWidth: 3,
      alpha: 1,
    },
    {
      x: blastX,
      y: blastY,
      radius: 2,
      maxRadius: 190,
      color: '#ffcc00',
      lineWidth: 2,
      alpha: 1,
    },
  ];

  for (let p = 0; p < 70; p++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = 50 + Math.random() * 450;
    const colRand = Math.random();
    const pColor =
      colRand < 0.25
        ? '#ffffff'
        : colRand < 0.5
        ? '#ffe600'
        : colRand < 0.75
        ? '#ff3b00'
        : colRand < 0.9
        ? '#ff0055'
        : '#888899';
    game.particles.push({
      x: blastX + (Math.random() - 0.5) * 16,
      y: blastY + (Math.random() - 0.5) * 16,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      color: pColor,
      size: 2 + Math.floor(Math.random() * 4),
      life: 0,
      maxLife: 0.7 + Math.random() * 0.9,
    });
  }

  const finalScore = game.score;
  if (finalScore > highScore) {
    setHighScore(finalScore);
    setIsNewHighScore(true);
    try {
      localStorage.setItem('space-cleanup-high-score', finalScore.toString());
    } catch {
      // ignore
    }
  }

  setDeathCause(reason);
}

export function registerPlayerImpact(
  game: GameState,
reason: string,
  highScore: number,
  setHighScore: (score: number) => void,
  setHitChances: (chances: number) => void,
  setIsNewHighScore: (val: boolean) => void,
  setDeathCause: (cause: string) => void,
  hitSourceX?: number,
  hitSourceY?: number
): void {
  if (game.isGameOver || game.isDying) return;
  if (game.invulnerableTimer > 0) return;
  if (Math.hypot(game.x - LAUNCH_STATION.x, game.y - LAUNCH_STATION.y) < 180) return;

  game.hitsAbsorbed = (game.hitsAbsorbed || 0) + 1;

  if (game.hitChances > 1) {
    game.hitChances -= 1;
    setHitChances(game.hitChances);
    game.invulnerableTimer = 1.9;
    game.shake = 16;
    soundManager.playShield();

    if (hitSourceX !== undefined && hitSourceY !== undefined) {
      const pushAng = Math.atan2(game.y - hitSourceY, game.x - hitSourceX);
      game.vx = Math.cos(pushAng) * 240 + game.vx * 0.2;
      game.vy = Math.sin(pushAng) * 240 + game.vy * 0.2;
    } else {
      game.vx *= -0.5;
      game.vy *= -0.5;
    }

    for (let sp = 0; sp < 25; sp++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 70 + Math.random() * 200;
      game.particles.push({
        x: game.x + (Math.random() - 0.5) * 12,
        y: game.y + (Math.random() - 0.5) * 12,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        color: Math.random() < 0.65 ? '#00f0ff' : '#ffea00',
        size: 2 + Math.floor(Math.random() * 3),
        life: 0,
        maxLife: 0.35 + Math.random() * 0.3,
      });
    }

    game.floatingScores.push({
      id: game.nextId++,
      x: game.x,
      y: game.y - 25,
      text: ` SHIELD HIT! ${game.hitChances} CHANCE${game.hitChances > 1 ? 'S' : ''} LEFT!`,
      color: game.hitChances === 2 ? '#ffcc00' : '#ff0044',
      alpha: 1,
      life: 0,
    });
  } else {
    game.hitChances = 0;
    setHitChances(0);
    triggerFatalBlast(game, reason, highScore, setHighScore, setIsNewHighScore, setDeathCause);
  }
}

export function blastMine(
  game: GameState,
  mine: SpaceMineObstacle,
  highScore: number,
  setHighScore: (score: number) => void,
  awardedPoints: boolean = true
): void {
  if (mine.isExploding) return;
  mine.isExploding = true;
  const mx = mine.x;
  const my = mine.y;
  mine.x = 99999;

  soundManager.playBombBlast();
  game.shake = Math.max(game.shake, 18);

  game.shockwaves.push(
    {
      x: mx,
      y: my,
      radius: 6,
      maxRadius: 90,
      color: '#ffffff',
      lineWidth: 3,
      alpha: 1,
    },
    {
      x: mx,
      y: my,
      radius: 4,
      maxRadius: 135,
      color: '#ff3b00',
      lineWidth: 3,
    alpha: 1,
    },
    {
      x: mx,
      y: my,
      radius: 2,
      maxRadius: 180,
      color: '#ffcc00',
      lineWidth: 2,
      alpha: 1,
    }
  );

  for (let p = 0; p < 45; p++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = 60 + Math.random() * 320;
    const colRand = Math.random();
    const pColor =
      colRand < 0.25
        ? '#ffffff'
        : colRand < 0.5
        ? '#ffee00'
        : colRand < 0.75
        ? '#ff4400'
        : colRand < 0.9
        ? '#ff0055'
        : '#64748b';
    game.particles.push({
      x: mx + (Math.random() - 0.5) * 10,
      y: my + (Math.random() - 0.5) * 10,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      color: pColor,
      size: 2 + Math.floor(Math.random() * 3),
      life: 0,
      maxLife: 0.45 + Math.random() * 0.45,
    });
  }

  if (awardedPoints) {
    game.score += 150;
    if (game.score > highScore) {
      setHighScore(game.score);
    }
    game.floatingScores.push({
      id: game.nextId++,
      x: mx,
      y: my - 22,
      text: '💥 BOMB BLASTED! +150',
      color: '#ffaa00',
      alpha: 1,
      life: 0,
    });
  }

  game.mines.forEach((otherMine) => {
    if (!otherMine.isExploding && Math.hypot(otherMine.x - mx, otherMine.y - my) < 160) {
      setTimeout(() => blastMine(game, otherMine, highScore, setHighScore, true), 120);
    }
  });
}