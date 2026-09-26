export function drawPixelAsteroid(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  angle: number,
  asteroidType: 'iron' | 'ice' | 'rock' = 'rock'
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(angle);

  const r = Math.max(14, Math.floor(radius));

  ctx.fillStyle = asteroidType === 'ice'
    ? 'rgba(0, 240, 255, 0.15)'
    : asteroidType === 'iron'
    ? 'rgba(255, 170, 0, 0.14)'
    : 'rgba(255, 255, 255, 0.1)';
  drawRoughPoly(ctx, r + 5);
  ctx.fill();

  ctx.fillStyle = '#04010e';
  drawRoughPoly(ctx, r + 2);
  ctx.fill();

  if (asteroidType === 'iron') {
    ctx.fillStyle = '#8392a5';
  } else if (asteroidType === 'ice') {
    ctx.fillStyle = '#7dd3fc';
  } else {
    ctx.fillStyle = '#b3a290';
  }
  drawRoughPoly(ctx, r);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.rect(-r, 0, r * 2, r);
  ctx.clip();
  if (asteroidType === 'iron') {
    ctx.fillStyle = '#475569';
  } else if (asteroidType === 'ice') {
    ctx.fillStyle = '#0284c7';
  } else {
    ctx.fillStyle = '#655342';
  }
  drawRoughPoly(ctx, r);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = asteroidType === 'ice' ? '#ffffff' : asteroidType === 'iron' ? '#e2e8f0' : '#fff5eb';
  ctx.fillRect(-Math.floor(r * 0.6), -Math.floor(r * 0.85), Math.floor(r * 1.2), 3);
ctx.fillRect(-Math.floor(r * 0.4), -Math.floor(r * 0.65), Math.floor(r * 0.8), 3);

  if (asteroidType === 'iron') {
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(-Math.floor(r * 0.3), -Math.floor(r * 0.2), 4, 3);
    ctx.fillRect(Math.floor(r * 0.15), Math.floor(r * 0.2), 5, 3);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(Math.floor(r * 0.2), -Math.floor(r * 0.3), 3, 2);
  } else if (asteroidType === 'ice') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-Math.floor(r * 0.3), -Math.floor(r * 0.1), 4, 4);
    ctx.fillRect(Math.floor(r * 0.2), Math.floor(r * 0.15), 4, 4);
  } else {
    ctx.fillStyle = '#3c2f24';
    ctx.fillRect(-Math.floor(r * 0.3), -Math.floor(r * 0.2), 6, 6);
    ctx.fillRect(Math.floor(r * 0.2), Math.floor(r * 0.1), 7, 7);

    ctx.fillStyle = '#ded1c3';
    ctx.fillRect(-Math.floor(r * 0.3), -Math.floor(r * 0.2) + 6, 6, 2);
    ctx.fillRect(Math.floor(r * 0.2), Math.floor(r * 0.1) + 7, 7, 2);
  }

  ctx.restore();
}

function drawRoughPoly(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  const numPts = 7;
  for (let i = 0; i < numPts; i++) {
    const ang = (i / numPts) * Math.PI * 2;
    const jit = 0.82 + ((i * 17) % 5) * 0.08;
    const px = Math.cos(ang) * r * jit;
    const py = Math.sin(ang) * r * jit;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  
  }
  ctx.closePath();
}

export function drawPixelMine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  isTriggered: boolean,
  time: number
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  const r = Math.floor(radius);

  ctx.fillStyle = '#ff2a4b';
  const numSpikes = 8;
  for (let i = 0; i < numSpikes; i++) {
    const ang = (i / numSpikes) * Math.PI * 2 + time * 0.5;
    const sx = Math.cos(ang) * (r + 5);
    const sy = Math.sin(ang) * (r + 5);
    ctx.fillRect(Math.floor(sx) - 2, Math.floor(sy) - 2, 4, 4);
  }

  ctx.fillStyle = '#060114';
  ctx.beginPath();
  ctx.arc(0, 0, r + 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#261b38';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#4c3b6b';
  ctx.fillRect(-r * 0.5, -r * 0.6, r, 3);

  const blinkSpeed = isTriggered ? 25 : 6;
  const isLedOn = Math.sin(time * blinkSpeed) > 0;

  ctx.fillStyle = isLedOn ? '#ff0033' : '#660011';
  ctx.fillRect(-3, -3, 6, 6);

  if (isLedOn) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-1, -1, 2, 2);

    if (isTriggered) {
      ctx.strokeStyle = 'rgba(255, 0, 50, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, r + 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

export function drawPixelStarItem(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  ctx.fillStyle = '#060216';
  ctx.fillRect(-6, -6, 12, 12);

  ctx.fillStyle = '#ffb800';
  ctx.fillRect(-5, -5, 10, 10);
  ctx.fillRect(-8, -2, 16, 4);
  ctx.fillRect(-2, -8, 4, 16);

  ctx.fillStyle = '#ffe600';
  ctx.fillRect(-3, -3, 6, 6);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-1, -1, 2, 2);

  ctx.restore();
}

export function drawPixelGemItem(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  ctx.fillStyle = '#060216';
  ctx.fillRect(-7, -7, 14, 14);

  ctx.fillStyle = '#00f0ff';
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(8, 0);
  ctx.lineTo(0, 9);
  ctx.lineTo(-8, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#b3f8ff';
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(7, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  if (Math.sin(time * 6) > 0.3) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(1, -5, 3, 3);
  }

  ctx.restore();
}

export function drawPixelComet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  vx: number,
  vy: number,
  radius: number,
  time: number
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  const angle = Math.atan2(vy, vx);
  ctx.rotate(angle);

  const r = Math.floor(radius);
  const tailLength = 40 + (Math.sin(time * 25) + 1) * 10;

  ctx.fillStyle = '#ff2200';
  ctx.beginPath();
  ctx.moveTo(0, -r * 1.2);
  ctx.lineTo(-tailLength, 0);
  ctx.lineTo(0, r * 1.2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.8);
  ctx.lineTo(-tailLength * 0.7, 0);
  ctx.lineTo(0, r * 0.8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#00f0ff';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.45);
  ctx.lineTo(-tailLength * 0.4, 0);
  ctx.lineTo(0, r * 0.45);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffdd55';
  ctx.fillRect(-tailLength - 6, -2, 4, 4);
  ctx.fillRect(-tailLength - 14, 1, 3, 3);

  ctx.fillStyle = '#060114';
  ctx.beginPath();
  ctx.arc(0, 0, r + 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffeedd';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, -r * 0.4, r * 0.8, r * 0.8);

  ctx.restore();
}

export function drawPixelDebris(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  type: 'metal' | 'crystal' | 'hull',
  color: string,
  time: number
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(rotation);

  const r = Math.max(10, Math.floor(radius));

  ctx.fillStyle = type === 'crystal' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(0, 240, 255, 0.2)';
  ctx.fillRect(-r - 3, -r - 3, (r + 3) * 2, (r + 3) * 2);

  if (type === 'metal') {
    ctx.fillStyle = '#060114';
    ctx.fillRect(-r - 1, -r - 1, (r + 1) * 2, (r + 1) * 2);

    ctx.fillStyle = color || '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(-r, -r * 0.5);
    ctx.lineTo(r * 0.7, -r);
    ctx.lineTo(r, r * 0.4);
    ctx.lineTo(-r * 0.3, r);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(-r * 0.2, -r * 0.2, r * 0.6, 3);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-r * 0.4, -r * 0.6, 4, 3);
  } else if (type === 'crystal') {
    ctx.fillStyle = '#060114';
    ctx.fillRect(-r - 1, -r - 1, (r + 1) * 2, (r + 1) * 2);

    ctx.fillStyle = color || '#c084fc';
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -2, 5, 5);
  } else {
    ctx.fillStyle = '#0a0518';
    ctx.fillRect(-r - 1, -r - 1, (r + 1) * 2, (r + 1) * 2);

    ctx.fillStyle = color || '#cbd5e1';
    ctx.fillRect(-r, -r * 0.7, r * 2, r * 1.4);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-r * 0.4, -r * 0.6, 5, r * 1.2);
    ctx.fillRect(r * 0.1, -r * 0.6, 5, r * 1.2);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-r + 2, -r * 0.5, 3, 3);
    ctx.fillRect(r - 5, -r * 0.5, 3, 3);
    ctx.fillRect(-r + 2, r * 0.3, 3, 3);
    ctx.fillRect(r - 5, r * 0.3, 3, 3);
  }

  if (Math.sin(time * 10 + x) > 0.4) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.floor(r * 0.4), -3, 3, 3);
  }

  ctx.restore();
}