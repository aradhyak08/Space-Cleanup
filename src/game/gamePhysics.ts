import { soundManager } from '../utils/audio';
import { GameState, LAUNCH_STATION } from '../types/gameEngine';
import { registerPlayerImpact } from './gameExplosions';

export function updateGamePhysics(
  game: GameState,
  dt: number,
  width: number,
  height: number,
  boostSpeed: number,
  highScore: number,
  setHighScore: (score: number) => void,
  setHitChances: (chances: number) => void,
  setIsNewHighScore: (val: boolean) => void,
  setDeathCause: (cause: string) => void,
  setElapsedSeconds: (sec: number) => void,
  setScore: (score: number) => void,
  setIsGameOver: (val: boolean) => void
): { isHarborSafe: boolean; wantsBoost: boolean } {
  const distFromStation = Math.hypot(game.x - LAUNCH_STATION.x, game.y - LAUNCH_STATION.y);
  const isHarborSafe = distFromStation < 180;

  if (isHarborSafe) {
    game.nitro = Math.min(100, game.nitro + 35 * dt);
  }

  if (!game.isDying && !game.isGameOver && !isHarborSafe) {
    game.survivalTime += dt;
    game.scoreAccumulator += dt * 10;
    if (game.scoreAccumulator >= 1) {
      const ptsToAdd = Math.floor(game.scoreAccumulator);
      game.score += ptsToAdd;
      game.scoreAccumulator -= ptsToAdd;
    }
    if (game.score > highScore) {
      setHighScore(game.score);
    }
  }

  if (game.eventAlert) {
    game.eventAlert.timer -= dt;
    if (game.eventAlert.timer <= 0) {
      game.eventAlert = null;
    }
  }

  if (game.invulnerableTimer > 0) {
    game.invulnerableTimer = Math.max(0, game.invulnerableTimer - dt);
  }

  let turning = 0;
  let isThrusting = false;
  let wantsBoost = false;

  if (game.isDying) {
    game.deathTimer += dt;
    game.vx *= Math.pow(0.94, dt * 60);
    game.vy *= Math.pow(0.94, dt * 60);
    game.x += game.vx * dt;
    game.y += game.vy * dt;

    if (game.deathTimer >= 1.4 && !game.isGameOver) {
      game.isGameOver = true;
      setElapsedSeconds(Math.floor(game.survivalTime));
      setScore(game.score);
      setIsGameOver(true);
    }
  } else {
    if (game.keys.a || game.keys.arrowLeft) turning -= 1;
    if (game.keys.d || game.keys.arrowRight) turning += 1;

    const maxRotSpeed = 3.8;
    let targetRotVel = turning * maxRotSpeed;

    if (game.pointer.active) {
      const pCenterX = width / 2;
      const pCenterY = height / 2;
      const targetAng = Math.atan2(
        game.pointer.screenY - pCenterY,
        game.pointer.screenX - pCenterX
      );
      let diff = targetAng - game.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      targetRotVel = Math.sign(diff) * Math.min(Math.abs(diff) * 5.8, maxRotSpeed * 1.35);
    }

    const rotBlend = 1 - Math.exp(-12 * dt);
    game.angularVelocity += (targetRotVel - game.angularVelocity) * rotBlend;
    game.angle += game.angularVelocity * dt;

    const fwdX = Math.cos(game.angle);
    const fwdY = Math.sin(game.angle);

    const isHoldingBoost = game.keys.shift;
    wantsBoost = isHoldingBoost && game.nitro > 2;
    isThrusting = game.keys.w || game.keys.arrowUp || game.pointer.active || wantsBoost;
    const isHoldingBack = game.keys.s || game.keys.arrowDown;

    if (wantsBoost) {
      game.nitro = Math.max(0, game.nitro - 28 * dt);
      game.isBoosting = true;
    } else {
      game.nitro = Math.min(100, game.nitro + 12 * dt);
      game.isBoosting = false;
    }

    const baseAccel = 600;
    const boostAccel = baseAccel * (1.75 + boostSpeed * 0.25);
    const targetThrust = wantsBoost ? boostAccel : isThrusting ? baseAccel : 0;
    const thrustBlend = 1 - Math.exp(-11 * dt);
    game.currentThrust += (targetThrust - game.currentThrust) * thrustBlend;

    game.vx += fwdX * game.currentThrust * dt;
    game.vy += fwdY * game.currentThrust * dt;

    if (isHoldingBack) {
      const brakeDecel = Math.pow(0.78, dt * 60);
      game.vx *= brakeDecel;
      game.vy *= brakeDecel;

      const reverseThrust = 320;
      game.vx -= fwdX * reverseThrust * dt;
      game.vy -= fwdY * reverseThrust * dt;

      const forwardVelocity = game.vx * fwdX + game.vy * fwdY;
      if (forwardVelocity < -200) {
        const perpX = game.vx - forwardVelocity * fwdX;
        const perpY = game.vy - forwardVelocity * fwdY;
        game.vx = perpX - fwdX * 200;
        game.vy = perpY - fwdY * 200;
      }

      if (Math.random() < 0.65) {
        game.particles.push({
          x: game.x + fwdX * 12 + (Math.random() - 0.5) * 6,
          y: game.y + fwdY * 12 + (Math.random() - 0.5) * 6,
          vx: fwdX * (85 + Math.random() * 45) + game.vx * 0.25,
          vy: fwdY * (85 + Math.random() * 45) + game.vy * 0.25,
          color: Math.random() < 0.5 ? '#00f0ff' : '#ffffff',
          size: 2,
          life: 0,
          maxLife: 0.18,
        });
      }
    }

    const friction = wantsBoost ? 0.989 : 0.984;
    game.vx *= Math.pow(friction, dt * 60);
    game.vy *= Math.pow(friction, dt * 60);

    const curSpeed = Math.hypot(game.vx, game.vy);
    const maxSpd = wantsBoost ? 800 : 560;
    if (curSpeed > maxSpd) {
      const excess = curSpeed - maxSpd;
      const softSpeed = maxSpd + excess * Math.pow(0.92, dt * 60);
      game.vx = (game.vx / curSpeed) * softSpeed;
      game.vy = (game.vy / curSpeed) * softSpeed;
    }

    game.x += game.vx * dt;
    game.y += game.vy * dt;

    if (game.currentThrust > 30) {
      const exhaustCount = wantsBoost ? 3 : Math.random() < 0.7 ? 2 : 1;
      for (let ep = 0; ep < exhaustCount; ep++) {
        const spread = (Math.random() - 0.5) * 0.32;
        const exAng = game.angle + Math.PI + spread;
        const exSpd = (wantsBoost ? 220 : 130) + Math.random() * 50;
        game.particles.push({
          x: game.x - fwdX * 14,
          y: game.y - fwdY * 14,
          vx: Math.cos(exAng) * exSpd + game.vx * 0.25,
          vy: Math.sin(exAng) * exSpd + game.vy * 0.25,
          color: wantsBoost
            ? Math.random() < 0.5
              ? '#00f0ff'
              : '#39ff14'
            : Math.random() < 0.6
            ? '#ffaa00'
            : '#ff3300',
          size: wantsBoost ? 3 : 2,
          life: 0,
          maxLife: wantsBoost ? 0.3 : 0.22,
        });
      }
    }
  }

  const distFromCenter = Math.hypot(game.x, game.y);
  if (distFromCenter > 4200) {
    game.x = (game.x / distFromCenter) * 4200;
    game.y = (game.y / distFromCenter) * 4200;
    game.vx *= -0.6;
    game.vy *= -0.6;
    soundManager.playShield();
  }

  if (!game.isDying && !game.isGameOver && distFromCenter < 140) {
    registerPlayerImpact(
      game,
      'SOLAR CORE VAPORIZATION',
      highScore,
      setHighScore,
      setHitChances,
      setIsNewHighScore,
      setDeathCause,
      0,
      0
    );
  }

  if (game.shake > 0) {
    game.shake = Math.max(0, game.shake - 24 * dt);
  }

  const fwdX = Math.cos(game.angle);
  const fwdY = Math.sin(game.angle);
  const lookAheadDist = wantsBoost  ? 45 : 18;
  const targetCamX = game.x + fwdX * lookAheadDist;
  const targetCamY = game.y + fwdY * lookAheadDist;
  const camBlend = 1 - Math.exp(-9.5 * dt);
  game.camX += (targetCamX - game.camX) * camBlend;
  game.camY += (targetCamY - game.camY) * camBlend;
 
  if (game.asteroids.length < 200) {
    const spawnDist = 450 + Math.random() * 3200;
    let spawnAngle = Math.random() * Math.PI * 2;
    let candidateX = Math.cos(spawnAngle) * spawnDist;
    let candidateY = Math.sin(spawnAngle) * spawnDist;
    if (Math.hypot(candidateX - LAUNCH_STATION.x, candidateY - LAUNCH_STATION.y) < LAUNCH_STATION.safeRadius) {
      spawnAngle += 0.85;
      candidateX = Math.cos(spawnAngle) * spawnDist;
      candidateY = Math.sin(spawnAngle) * spawnDist;
    }
    const driftAng = Math.random() * Math.PI * 2;
    const speed = 0.35 + Math.random() * 0.45;
    const typeChoice: 'iron' | 'ice' | 'rock' =
      Math.random() < 0.35 ? 'iron' : Math.random() < 0.65 ? 'ice' : 'rock';
    game.asteroids.push({
      id: game.nextId++,
      x: candidateX,
      y: candidateY,
      z: 0,
      vx: Math.cos(driftAng) * speed,
      vy: Math.sin(driftAng) * speed,
      vz: 0,
      radius: 18 + Math.random() * 18,
      rotX: Math.random() * Math.PI,
      rotY: 0,
      rotZ: 0,
      rotSpeedX: (Math.random() - 0.5) * 0.05,
      rotSpeedY: 0,
      rotSpeedZ: 0,
      hp: 1,
      maxHp: 1,
      color: 0x7a6a58,
      asteroidType: typeChoice,
    });
  }

  let nearbyAsteroids = 0;
  for (let i = 0; i < game.asteroids.length; i++) {
    const a = game.asteroids[i];
    if (a.hp > 0 && Math.hypot(game.x - a.x, game.y - a.y) < 1250) {
      nearbyAsteroids++;
    }
  }
  if (distFromStation > LAUNCH_STATION.safeRadius && nearbyAsteroids < 16 && game.asteroids.length > 0) {
      for (let i = 0; i < game.asteroids.length; i++) {
          const a = game.asteroids[i];
          const distPl = Math.hypot(game.x - a.x, game.y - a.y);
          if (distPl > 1700 || a.hp <= 0) {
              const relAng = game.angle + (Math.random() - 0.5) * 1.6;
              const relDist = 650 + Math.random() * 450;
              const targetAx = game.x + Math.cos(relAng) * relDist;
              const targetAy = game.y + Math.sin(relAng) * relDist;
              if (Math.hypot(targetAx - LAUNCH_STATION.x, targetAy - LAUNCH_STATION.y) < LAUNCH_STATION.safeRadius) {
                  continue;
                }
                a.x = targetAx;
                a.y = targetAy;
                const driftToward = relAng + Math.PI + (Math.random() - 0.5) * 0.8;
                const astSpd = 0.35 + Math.random() * 0.45;
                a.vx = Math.cos(driftToward) * astSpd;
                a.vy = Math.sin(driftToward) * astSpd;
                a.hp = 1;
                nearbyAsteroids++;
               if (nearbyAsteroids >= 16) break;
           }
        }
    }

  game.debrisSpawnTimer -= dt;
  if (game.debrisSpawnTimer  <= 0 && distFromStation > LAUNCH_STATION.safeRadius) {
    game.debrisSpawnTimer = 2.4 + Math.random() * 1.6;
    const dAngle = game.angle + (Math.random() - 0.5) * 1.8;
    const dDist = 650 + Math.random() * 250;
    const dx = game.x + Math.cos(dAngle) * dDist;
    const dy = game.y + Math.sin(dAngle) * dDist;
    const dTargetAngle = dAngle + Math.PI + (Math.random() - 0.5) * 0.8;
    const dSpeed = 90 + Math.random() * 80;
    const types: ('metal' | 'crystal' | 'hull')[] = ['metal', 'crystal', 'hull'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const colors =
      selectedType === 'crystal'
        ? '#c084fc'
        : selectedType === 'hull'
        ? '#94a3b8'
        : '#38bdf8';

    game.debris.push({
      id: game.nextId++,
      x: dx,
    y: dy,
      vx: Math.cos(dTargetAngle) * dSpeed,
      vy: Math.sin(dTargetAngle) * dSpeed,
      radius: 8 + Math.random() * 5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 3.5,
      type: selectedType,
      color: colors,
      hp: 1,
      maxHp: 1,
    });
  }

  game.hazardEventTimer -= dt;
  if (game.hazardEventTimer <= 0) {
    game.hazardEventTimer = 35 + Math.random() * 20;
    const entryAngle = Math.random() * Math.PI * 2;
    const entryDist = 2800;
    const cx = Math.cos(entryAngle) * entryDist;
    const cy = Math.sin(entryAngle) * entryDist;
    const pathAngle = entryAngle + Math.PI + (Math.random() -0.5) * 0.6;
    const speed = 190 + Math.random() * 50;

    game.comets.push({
      id: game.nextId++,
      x: cx,
      y: cy,
    vx: Math.cos(pathAngle) * speed,
    vy: Math.sin(pathAngle) * speed,
      radius: 16,
      tailLength: 120,
      life: 0,
      maxLife: 32,
      color: '#ff4400',
    });
  }

  return { isHarborSafe, wantsBoost };
}