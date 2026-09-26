import {
  drawn,
  drawPixelPlanet,
  drawPixelLaunchStation,
  drawPixelStarItem,
  drawPixelGemItem,
  drawPixelAsteroid,
  drawPixelDebris,
drawPixelMine,
  drawPixelComet,
  drawPixelFireBolt,
  drawPixelRocket,
} from '../utils/pixelRenderer';
import { GameState, LAUNCH_STATION } from '../types/gameEngine';

export function renderGameScene(
  ctx: CanvasRenderingContext2D,
  game: GameState,
  width: number,
  height: number,
  timeSec: number,
  dt: number,
  wantsBoost: boolean
): void {
  const shakeOffsetX = (Math.random() - 0.5) * game.shake;
  const shakeOffsetY = (Math.random() - 0.5) * game.shake;
  const camX = game.camX + shakeOffsetX;
  const camY = game.camY + shakeOffsetY;

  const worldToScreenX = (wx: number) => Math.floor(wx - camX + width / 2);
  const worldToScreenY = (wy: number) => Math.floor(wy - camY + height / 2);

  ctx.fillStyle = '#0a0319';
  ctx.fillRect(0, 0, width, height);

  for (let si = 0; si < game.starsField.length; si++) {
    const s = game.starsField[si];
    const parallaxFactor = s.layer === 0 ? 0.25 : s.layer === 1 ? 0.5 : 0.85;
    const sx =
      (((s.x - camX * parallaxFactor) % (width * 2)) + width * 2) % (width * 2) -
      width * 0.5;
    const sy =
      (((s.y - camY * parallaxFactor) % (height * 2)) + height * 2) % (height * 2) -
      height * 0.5;

    if (sx >= -4 && sx <= width + 4 && sy >= -4 && sy <= height + 4) {
      const twinkle = Math.sin(timeSec * s.twinkleSpeed + s.twinklePhase);
      if (twinkle > -0.6) {
        const starAlpha = Math.max(0.12, (twinkle * 0.22 + 0.62) * (s.alpha || 0.35));
        ctx.globalAlpha = starAlpha;
        ctx.fillStyle = s.color;
        ctx.fillRect(Math.floor(sx), Math.floor(sy), s.size, s.size);
      }
    }
  }
  ctx.globalAlpha = 1.0;

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
  game.planets.forEach((p) => {
    const scx = worldToScreenX(0);
    const scy = worldToScreenY(0);
    ctx.beginPath();
    ctx.arc(scx, scy, p.distance, 0, Math.PI * 2);
    ctx.stroke();
  });

  const sunScreenX = worldToScreenX(0);
  const sunScreenY = worldToScreenY(0);
  if (
    sunScreenX > -150 &&
    sunScreenX < width + 150 &&
    sunScreenY > -150 &&
    sunScreenY < height + 150
  ) {
     drawPixelSun(ctx, sunScreenX, sunScreenY, 60, timeSec);
   
  }

  game.planets.forEach((p) => {
    const px = Math.cos(p.orbitAngle) * p.distance;
    const py = Math.sin(p.orbitAngle) * p.distance;
    const psx = worldToScreenX(px);
    const psy = worldToScreenY(py);
    if (psx > -120 && psx < width + 120 && psy > -120 && psy < height + 120) {
      drawPixelPlanet(ctx, psx, psy, p, timeSec);
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.name, psx, psy + p.radius + 16);
    }
  });

  const stationScreenX = worldToScreenX(LAUNCH_STATION.x);
  const stationScreenY = worldToScreenY(LAUNCH_STATION.y);
  if (
    stationScreenX > -250 &&
    stationScreenX < width + 250 &&
    stationScreenY > -250 &&
    stationScreenY < height + 250
  ) {
    drawPixelLaunchStation(ctx, stationScreenX, stationScreenY, timeSec);
  }

  game.collectibles.forEach((c) => {
    const csx = worldToScreenX(c.x);
    const csy = worldToScreenY(c.y);
    if (csx > -30 && csx < width + 30 && csy > -30 && csy < height + 30) {
      if (c.type === 'gem') {
        drawPixelGemItem(ctx, csx, csy, timeSec + c.pulsePhase);
      } else {
        drawPixelStarItem(ctx, csx, csy, timeSec + c.pulsePhase);
      }
    }
  });

  for (let i = 0; i < game.asteroids.length; i++) {
    const ast = game.asteroids[i];
    const asx = worldToScreenX(ast.x);
    const asy = worldToScreenY(ast.y);
    if (asx > -50 && asx < width + 50 && asy > -50 && asy < height + 50 && ast.hp > 0) {
      drawPixelAsteroid(ctx, asx, asy, ast.radius, ast.rotX);
    
    }
  }

  for (let dIdx = 0; dIdx < game.debris.length; dIdx++) {
    const deb = game.debris[dIdx];
    const dsx = worldToScreenX(deb.x);
    const dsy = worldToScreenY(deb.y);
    if (dsx > -40 && dsx < width + 40 && dsy > -40 && dsy < height + 40) {
      drawPixelDebris(ctx, dsx, dsy, deb.radius, deb.rotation, deb.type, deb.color, timeSec);
    }
  }

  game.mines.forEach((mine) => {
    const msx = worldToScreenX(mine.x);
    const msy = worldToScreenY(mine.y);
    if (msx > -40 && msx < width + 40 && msy > -40 && msy < height + 40 && !mine.isExploding) {
      drawPixelMine(ctx, msx, msy, mine.radius, mine.isTriggered, timeSec);
    }
  });

  for (let cIdx = 0; cIdx < game.comets.length; cIdx++) {
    const cmt = game.comets[cIdx];
    const csx = worldToScreenX(cmt.x);
    const csy = worldToScreenY(cmt.y);
    if (csx > -140 && csx < width + 140 && csy > -140 && csy < height + 140) {
      drawPixelComet(ctx, csx, csy, cmt.vx, cmt.vy, cmt.radius, timeSec);
    }
  }

  if (game.particles.length > 140) {
    game.particles.splice(0, game.particles.length - 140);
  }
  for (let pIdx = game.particles.length - 1; pIdx >= 0; pIdx--) {
    const pt = game.particles[pIdx];
    pt.life += dt;
    if (pt.life >= pt.maxLife) {
      game.particles.splice(pIdx, 1);
      continue;
    }
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;

    const psx = worldToScreenX(pt.x);
    const psy = worldToScreenY(pt.y);
    if (psx >= -10 && psx <= width + 10 && psy >= -10 && psy <= height + 10) {
      ctx.fillStyle = pt.color;
      ctx.fillRect(psx, psy, pt.size, pt.size);
    }
  }

  for (let pIdx = 0; pIdx < game.projectiles.length; pIdx++) {
    const proj = game.projectiles[pIdx];
    const psx = worldToScreenX(proj.x);
    const psy = worldToScreenY(proj.y);
    if (psx > -30 && psx < width + 30 && psy > -30 && psy < height + 30) {
      drawPixelFireBolt(ctx, psx, psy, proj.angle, timeSec);
    }
  }

  if (!game.isDying) {
    const playerScreenX = worldToScreenX(game.x);
    const playerScreenY = worldToScreenY(game.y);

    if (game.invulnerableTimer > 0) {
      const shieldRadius = 24;
      const shieldPulse = Math.sin(timeSec * 16) * 2;
    const shieldAlpha = Math.min(1, game.invulnerableTimer / 0.5);

      ctx.save();
      ctx.translate(playerScreenX, playerScreenY);

      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const hAng = (h / 6) * Math.PI * 2 + timeSec * 2.5;
        const hx = Math.cos(hAng) * (shieldRadius + shieldPulse);
        const hy = Math.sin(hAng) * (shieldRadius + shieldPulse);
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.8 * shieldAlpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = `rgba(0, 240, 255, ${0.2 * shieldAlpha})`;
    ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, shieldRadius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 204, 0, ${0.5 * shieldAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

    ctx.restore();
    }

    const isFlickering = game.invulnerableTimer > 0 && Math.floor(timeSec * 20) % 2 === 0;
    if (!isFlickering) {
      drawPixelRocket(
        ctx,
        playerScreenX,
        playerScreenY,
        game.angle,
        wantsBoost,
        0,
        timeSec
      );
    }
  } else {
    for (let sIdx = game.shockwaves.length - 1; sIdx >= 0; sIdx--) {
      const sw = game.shockwaves[sIdx];
      sw.radius += 170 * dt;
      sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        game.shockwaves.splice(sIdx, 1);
        continue;
      }
      const ssx = worldToScreenX(sw.x);
      const ssy = worldToScreenY(sw.y);
    ctx.save();
      ctx.beginPath();
      ctx.arc(ssx, ssy, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.alpha;
      ctx.lineWidth = sw.lineWidth;
      ctx.stroke();
      ctx.restore();
    }

    for (let wIdx = 0; wIdx < game.wreckage.length; wIdx++) {
      const frag = game.wreckage[wIdx];
      frag.x += frag.vx * dt;
      frag.y += frag.vy * dt;
      frag.angle += frag.rotSpeed * dt;
      frag.vx *= Math.pow(0.96, dt * 60);
      frag.vy *= Math.pow(0.96, dt * 60);

      if (Math.random() < 0.45) {
        game.particles.push({
          x: frag.x + (Math.random() - 0.5) * 4,
          y: frag.y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 45,
          vy: (Math.random() - 0.5) * 45,
          color: Math.random() < 0.6 ? '#ff3b00' : '#ffa200',
          size: 2,
          life: 0,
          maxLife: 0.35 + Math.random() * 0.25,
        });
      }

      const fsx = worldToScreenX(frag.x);
      const fsy = worldToScreenY(frag.y);
      ctx.save();
      ctx.translate(fsx, fsy);
      ctx.rotate(frag.angle);

      ctx.fillStyle = '#060114';
      ctx.fillRect(
        -Math.floor(frag.width / 2) - 1,
        -Math.floor(frag.height / 2) - 1,
        frag.width + 2,
        frag.height + 2
      );

      ctx.fillStyle = frag.color;
      ctx.fillRect(
        -Math.floor(frag.width / 2),
        -Math.floor(frag.height / 2),
        frag.width,
        frag.height
      );

      if (frag.detailColor) {
        ctx.fillStyle = frag.detailColor;
        ctx.fillRect(
          -Math.floor(frag.width / 4),
          -Math.floor(frag.height / 4),
          Math.max(2, Math.floor(frag.width / 2)),
          Math.max(2, Math.floor(frag.height / 2))
        );
      }
    ctx.restore();
    }

    if (game.deathTimer < 0.28) {
      const flashProgress = game.deathTimer / 0.28;
      const flashAlpha = 1 - flashProgress;
      const fsx = worldToScreenX(game.x);
      const fsy = worldToScreenY(game.y);
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.85})`;
      ctx.beginPath();
      ctx.arc(fsx, fsy, 38 * (1 + flashProgress), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.font = '10px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  for (let fIdx = game.floatingScores.length - 1; fIdx >= 0; fIdx--) game.floatingScores.length - 1; fIdx >= 0; fIdx--) {
    const item = game.floatingScores[fIdx];
    item.life += dt;
    item.y -= 30 * dt;
    item.alpha = Math.max(0, 1 - item.life / 1.2);

    if (item.life >= 1.2) {
      game.floatingScores.splice(fIdx, 1);
      continue;
    }

    const fsx = worldToScreenX(item.x);
    const fsy = worldToScreenY(item.y);
    ctx.fillStyle = item.color;
    ctx.globalAlpha = item.alpha;
    ctx.fillText(item.text, fsx, fsy);
    ctx.globalAlpha = 1.0;
  }
}