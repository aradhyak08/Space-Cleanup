import React from 'react';
import { soundManager } from '../utils/audio';
import { GameState, LAUNCH_STATION } from '../types/gameEngine';
import { blastMine, registerPlayerImpact } from './gameExplosions';

export function updateGameCollisions(
  game: GameState,
  dt: number,
  suctionPower: number,
  wantsBoost: boolean,
  highScore: number,
  setHighScore: (score: number) => void,
  setHitChances: (chances: number) => void,
  setGems: React.Dispatch<React.SetStateAction<number>>,
  setStars: React.Dispatch<React.SetStateAction<number>>,
  setGemsCollectedCount: (count: number) => void,
  setStarsCollectedCount: (count: number) => void,
  setIsNewHighScore: (val: boolean) => void,
  setDeathCause: (cause: string) => void
): void {
  const distFromStation = Math.hypot(game.x - LAUNCH_STATION.x, game.y - LAUNCH_STATION.y);

  game.planets.forEach((p) => {
     p.orbitAngle += p.orbitSpeed * dt * 60;
     const px = Math.cos(p.orbitAngle) * p.distance;
     const py = Math.sin(p.orbitAngle) * p.distance;
     const pDist = Math.hypot(game.x - px, game.y - py);
     const discR = p.radius * 3.2;

     if (pDist < discR && !game.discoveredSet.has(p.id)) {
      game.discoveredSet.add(p.id);
      game.score += p.bonusPoints;
      game.nitro = 100;
      if (game.hitChances < game.maxHitChances) {
        game.hitChances = Math.min(game.maxHitChances, game.hitChances + 1);
        setHitChances(game.hitChances);
      }
      soundManager.playDiscovery();

      game.floatingScores.push({
        id: game.nextId++,
        x: px,
        y: py - p.radius - 20,
        text: `+${p.bonusPoints} ${p.name}! (RECHARGED & HULL REPAIRED)`,
        color: '#00f0ff',
        alpha: 1,
        life: 0,
      });
    }
  });

  const suctionDist = 115 * (1 + suctionPower * 0.25) * (wantsBoost ? 1.7 : 1);
  game.collectibles.forEach((c) => {
     const cDist = Math.hypot(game.x - c.x, game.y - c.y);

      if (cDist < suctionDist) {
      const pull = (1 - cDist / suctionDist) * 400 * dt;
      c.x += ((game.x - c.x) / cDist) * pull;
      c.y += ((game.y - c.y) / cDist) * pull;
     }

     if (cDist < 22) {
      c.x = 99999;
      game.score += c.value;

      if (c.type === 'gem') {
        soundManager.playCrystalPickup();
        setGems((g) => g + 1);
        game.gemsCollected = (game.gemsCollected || 0) + 1;
        setGemsCollectedCount(game.gemsCollected);

        if (game.gemsCollected % 15 === 0 && game.hitChances < game.maxHitChances) {
          game.hitChances = Math.min(game.maxHitChances, game.hitChances + 1)ame.maxHitChances, game.hitChances + 1);
          setHitChances(game.hitChances);
          soundManager.playShield();
          game.floatingScores.push({
            id: game.nextId++,
            x: game.x,
            y: game.y - 32,
            text: `🛡️ 15 GEMS: +1 HIT CHANCE (${game.hitChances}/3)`,
            color: '#39ff14',
            alpha: 1,
            life: 0,
          });
        }
        }  else {
         soundManager.playStarPickup();
         setStars((s) => s + 1);
         game.starsCollected = (game.starsCollected || 0) + 1;
         setStarsCollectedCount(game.starsCollected);
        }

      game.floatingScores.push({
        id: game.nextId++,
        x: game.x,
        y: game.y - 15,
        text: `+${c.value} ${c.type.toUpperCase()}`,
        color: c.type === 'gem' ? '#00f0ff' : '#ffea00',
        alpha: 1,
        life: 0,
      });
    }
  });

  for (let i = 0; i < game.asteroids.length; i++) {
    const ast = game.asteroids[i];
    ast.x += ast.vx * dt * 60;
    ast.y += ast.vy * dt * 60;
    ast.rotX += ast.rotSpeedX * dt * 60;

    const aDistFromCenter = Math.hypot(ast.x, ast.y);
    if (aDistFromCenter > 4200) {
      ast.x = (ast.x / aDistFromCenter) * 4150;
      ast.y = (ast.y / aDistFromCenter) * 4150;
      ast.vx *= -1;
      ast.vy *= -1;
    }

    const astDistFromStation = Math.hypot(ast.x - LAUNCH_STATION.x, ast.y - LAUNCH_STATION.y);
    if (astDistFromStation < 150) {
      const pushAng = Math.atan2(ast.y - LAUNCH_STATION.y, ast.x - LAUNCH_STATION.x);
      ast.vx = Math.cos(pushAng) * 0.9;
      ast.vy = Math.sin(pushAng) * 0.9;
    }

    const aDist = Math.hypot(game.x - ast.x, game.y - ast.y);
    const colDist = 16 + ast.radius;

    if (!game.isDying && !game.isGameOver && aDist < colDist && ast.hp > 0) {
      if (distFromStation < 180) {
        ast.hp = 0;
        ast.x = 99999;
      } else {
        registerPlayerImpact(
          game,
          'ASTEROID COLLISION',
          highScore,
          setHighScore,
          setHitChances,
          setIsNewHighScore,
          setDeathCause,
          ast.x,
          ast.y
        );
      }
    }
  }

  for (let dIdx = game.debris.length - 1; dIdx >= 0; dIdx--) {
    const deb = game.debris[dIdx];
    deb.x += deb.vx * dt;
    deb.y += deb.vy * dt;
    deb.rotation += deb.rotSpeed * dt;

    const distFromPlayer = Math.hypot(game.x - deb.x, game.y - deb.y);
    if (distFromPlayer > 2600) {
      game.debris.splice(dIdx, 1);
      continue;
    }

    const hitDist = 15 + deb.radius;
    if (!game.isDying && !game.isGameOver && distFromPlayer < hitDist) {
      if (distFromStation < 180) {
        game.debris.splice(dIdx, 1);
        continue;
      } else {
        registerPlayerImpact(
          game,
          'SPACE DEBRIS IMPACT',
          highScore,
          setHighScore,
          setHitChances,
          setIsNewHighScore,
          setDeathCause,
          deb.x,
          deb.y
        );
      
      }
    }
  }

  game.mines.forEach((mine) => {
    const mDist = Math.hypot(game.x - mine.x, game.y - mine.y);

    if (!mine.isTriggered && !mine.isExploding) {
      if (mDist < 135) {
        mine.isTriggered = true;
        mine.triggerTimer = 1800;
        soundManager.playMineBeep();
      }
    } else if (mine.isTriggered && !mine.isExploding) {
      mine.triggerTimer -= dt * 1000;
      mine.beepTimer += dt * 1000;

      if (mDist > 175) {
        mine.isTriggered = false;
        mine.triggerTimer = 1800;
      } else {
        if (mine.beepTimer > 240) {
          mine.beepTimer = 0;
          soundManager.playMineBeep();
        }

        if (mine.triggerTimer <= 0) {
          if (!game.isDying && !game.isGameOver && mDist < 145) {
            registerPlayerImpact(
              game,
              'PROXIMITY MINE BLAST',
              highScore,
              setHighScore,
              setHitChances,
              setIsNewHighScore,
              setDeathCause,
              mine.x,
              mine.y
            );
          }
          blastMine(game, mine, highScore, setHighScore, false);
        }
      }
    }
  });

  for (let cIdx = game.comets.length - 1; cIdx >= 0; cIdx--) {
    const cmt = game.comets[cIdx];
    cmt.life += dt;
    cmt.x += cmt.vx * dt;
    cmt.y += cmt.vy * dt;

    if (cmt.life >= cmt.maxLife) {
      game.comets.splice(cIdx, 1);
      continue;
    }

    const cDist = Math.hypot(game.x - cmt.x, game.y - cmt.y);
    if (!game.isDying && !game.isGameOver && cDist < 18 + cmt.radius) {
      registerPlayerImpact(
        game,
        'COMET STRIKE',
        highScore,
        setHighScore,
        setHitChances,
        setIsNewHighScore,
        setDeathCause,
        cmt.x,
        cmt.y
      );
    }
  }

  game.fireCooldown = Math.max(0, game.fireCooldown - dt);
  const wantsFire =
    (game.keys.space || game.keys.f || game.keys.j || game.keys.z || game.fireButtonHeld) &&
    !game.isDying &&
    !game.isGameOver;

  if (wantsFire && game.fireCooldown <= 0) {
    game.fireCooldown = 0.16;
    soundManager.playFire();

    const fwdX = Math.cos(game.angle);
    const fwdY = Math.sin(game.angle);
    const muzzleX = game.x + fwdX * 22;
    const muzzleY = game.y + fwdY * 22;
    const boltSpeed = 1150;

    game.projectiles.push({
      id: game.nextId++,
    x: muzzleX,
      y: muzzleY,
      vx: fwdX * boltSpeed + game.vx * 0.35,
      vy: fwdY * boltSpeed + game.vy * 0.35,
      angle: game.angle,
      life: 0,
      maxLife: 1.35,
      size: 6,
    });

    for (let mf = 0; mf < 4; mf++) {
      const mfAng = game.angle + (Math.random() - 0.5) * 0.45;
      const mfSpd = 120 + Math.random() * 80;
      game.particles.push({
        x: muzzleX,
        y: muzzleY,
        vx: Math.cos(mfAng) * mfSpd + game.vx * 0.2,
        vy: Math.sin(mfAng) * mfSpd + game.vy * 0.2,
        color: Math.random() < 0.6 ? '#ffee00' : '#ff4400',
        size: 2,
        life: 0,
        maxLife: 0.14,
      });
    }
  }

  for (let pIdx = game.projectiles.length - 1; pIdx >= 0; pIdx--) {
    const proj = game.projectiles[pIdx];
    proj.life += dt;
    proj.x += proj.vx * dt;
    proj.y += proj.vy * dt;

    if (Math.random() < 0.5) {
      game.particles.push({
        x: proj.x + (Math.random() - 0.5) * 4,
        y: proj.y + (Math.random() - 0.5) * 4,
        vx: (Math.random() - 0.5) * 35,
        vy: (Math.random() - 0.5) * 35,
        color: Math.random() < 0.6 ? '#ff5500' : '#ffea00',
        size: 1.5,
        life: 0,
        maxLife: 0.18,
      });
    }

    if (proj.life >= proj.maxLife) {
      game.projectiles.splice(pIdx, 1);
      continue;
    }

    let projConsumed = false;

    for (let mIdx = 0; mIdx < game.mines.length; mIdx++) {
      const mine = game.mines[mIdx];
      if (mine.isExploding) continue;
      const distMine = Math.hypot(proj.x - mine.x, proj.y - mine.y);
      if (distMine < mine.radius + 12) {
        blastMine(game, mine, highScore, setHighScore, true);
        projConsumed = true;
        break;
      }
    }

    if (!projConsumed) {
      for (let dIdx = game.debris.length - 1; dIdx >= 0; dIdx--) {
        const deb = game.debris[dIdx];
        const distDeb = Math.hypot(proj.x - deb.x, proj.y - deb.y);
        if (distDeb < deb.radius + 10) {
          soundManager.playDebrisSmash();
          for (let dp = 0; dp < 14; dp++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 70 + Math.random() * 140;
            game.particles.push({
              x: deb.x,
              y: deb.y,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd,
              color: deb.color,
              size: 2,
              life: 0,
              maxLife: 0.35 + Math.random() * 0.2,
            });
          }
          game.debris.splice(dIdx, 1);
          game.score += 60;
          if (game.score > highScore) setHighScore(game.score);
          game.floatingScores.push({
            id: game.nextId++,
            x: deb.x,
            y: deb.y - 15,
            text: '💥 DEBRIS SHATTERED! +60',
            color: '#38bdf8',
            alpha: 1,
            life: 0,
          });
          projConsumed = true;
          break;
        }
      }
    }

    if (!projConsumed) {
      for (let aIdx = 0; aIdx < game.asteroids.length; aIdx++) {
        const ast = game.asteroids[aIdx];
        if (ast.hp <= 0) continue;
        const distAst = Math.hypot(proj.x - ast.x, proj.y - ast.y);
        if (distAst < ast.radius + 8) {
          soundManager.playStoneRicochet();

          const deflectAng = Math.atan2(proj.y - ast.y, proj.x - ast.x);
          for (let sp = 0; sp < 9; sp++) {
            const spAng = deflectAng + (Math.random() - 0.5) * 1.3;
            const spSpeed = 80 + Math.random() * 160;
            game.particles.push({
              x: proj.x,
              y: proj.y,
              vx: Math.cos(spAng) * spSpeed,
              vy: Math.sin(spAng) * spSpeed,
              color: Math.random() < 0.5 ? '#ffe600' : Math.random() < 0.8 ? '#ff7700' : '#94a3b8',
              size: 2,
              life: 0,
              maxLife: 0.2 + Math.random() * 0.15,
            });
          }

          ast.vx += (Math.cos(deflectAng) * 20) / Math.max(1, ast.radius);
          ast.vy += (Math.sin(deflectAng) * 20) / Math.max(1, ast.radius);

          projConsumed = true;
          break;
        }
      }
    }

    if (projConsumed) {
      game.projectiles.splice(pIdx, 1);
    }
  }
}