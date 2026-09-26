export function drawPixelRocket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  isBoosting: boolean,
  shield: number,
  time: number
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.rotate(angle);

  const flameFrame = Math.floor(time * 18) % 3;
  const flameLen = isBoosting ? 26 + flameFrame * 5 : 12 + flameFrame * 3;
  const flameWidth = isBoosting ? 10 : 6;

  ctx.fillStyle = isBoosting ? '#00eefc' : '#ff3300';
  ctx.beginPath();
  ctx.moveTo(-16, -flameWidth);
  ctx.lineTo(-16 - flameLen, 0);
  ctx.lineTo(-16, flameWidth);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = isBoosting ? '#ffffff' : '#ffea00';
  ctx.beginPath();
  ctx.moveTo(-16, -flameWidth * 0.5);
  ctx.lineTo(-16 - flameLen * 0.65, 0);
  ctx.lineTo(-16, flameWidth * 0.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#060216';
  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.lineTo(6, -7);
  ctx.lineTo(-8, -16);
  ctx.lineTo(-15, -16);
  ctx.lineTo(-12, -7);
  ctx.lineTo(-17, -5);
  ctx.lineTo(-17, 5);
  ctx.lineTo(-12, 7);
  ctx.lineTo(-15, 16);
  ctx.lineTo(-8, 16);
  ctx.lineTo(6, 7);
  ctx.closePath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#060216';
  ctx.stroke();

  ctx.fillStyle = '#e6194b';
  ctx.beginPath();
  ctx.moveTo(4, -6);
  ctx.lineTo(-6, -14);
  ctx.lineTo(-13, -14);
  ctx.lineTo(-10, -6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ff6b8b';
  ctx.fillRect(-10, -13, 4, 3);

  ctx.fillStyle = '#e6194b';
  ctx.beginPath();
  ctx.moveTo(4, 6);
  ctx.lineTo(-6, 14);
  ctx.lineTo(-13, 14);
  ctx.lineTo(-10, 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ff6b8b';
  ctx.fillRect(-10, 10, 4, 3);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(4, -6);
  ctx.lineTo(-15, -6);
  ctx.lineTo(-15, 6);
  ctx.lineTo(4, 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#b0b8c4';
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(4, 6);
  ctx.lineTo(-15, 6);
  ctx.lineTo(-15, 1);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#e6194b';
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(14, -4);
  ctx.lineTo(14, 4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(4, -3, 8, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(7, -2, 3, 2);

  ctx.fillStyle = '#3a3f58';
  ctx.fillRect(-17, -4, 3, 8);

  if (shield > 0) {
    const shieldPhase = Math.sin(time * 8);
    ctx.strokeStyle = isBoosting ? '#00f0ff' : '#00eefc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 22 + shieldPhase, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2 + time * 3;
      const px = Math.cos(ang) * 22;
      const py = Math.sin(ang) * 22;
      ctx.fillRect(Math.floor(px) - 2, Math.floor(py) - 2, 4, 4);
    }
  }

  ctx.restore();
}

export function drawPixelFireBolt(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  angle: number,
  time: number
) {
  ctx.save();
  ctx.translate(Math.floor(cx), Math.floor(cy));
  ctx.rotate(angle);

  const flicker = Math.sin(time * 35) * 2;
  const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, 14 + flicker);
  gradient.addColorStop(0, 'rgba(255, 200, 50, 0.85)');
  gradient.addColorStop(0.35, 'rgba(255, 68, 0, 0.55)');
  gradient.addColorStop(1, 'rgba(255, 30, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, 14 + flicker, 0, Math.PI * 2);
  ctx.fill();

  const sparkPhase = Math.floor(time * 40) % 3;
  ctx.fillStyle = '#ff2200';
  ctx.fillRect(-12, -2 + (sparkPhase === 0 ? 1 : -1), 4, 3);
  ctx.fillStyle = '#ff6600';
  ctx.fillRect(-9, -3, 5, 5);

  ctx.fillStyle = '#ff3c00';
  ctx.fillRect(-7, -3, 14, 6);

  ctx.fillStyle = '#ffaa00';
  ctx.fillRect(-4, -2, 13, 4);

  ctx.fillStyle = '#ffff66';
  ctx.fillRect(1, -1.5, 9, 3);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(4, -1, 6, 2);

  ctx.restore();
}