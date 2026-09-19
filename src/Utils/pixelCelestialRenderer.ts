export interface PixelStar {
  x: number;
  y: number;
  size: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: number;
  alpha: number;
}

export function createPixelStars(count: number = 420, worldRadius: number = 4200): PixelStar[] {
  const stars: PixelStar[] = [];
  const colors = [
    '#c8d6e5',
    '#95afc0',
    '#dff9fb',
    '#f6e58d',
    '#e0e7ff',
    '#a4b0be',
  ];

  for (let i = 0; i < count; i++) {
    const layer = Math.random() < 0.7 ? 0 : Math.random() < 0.9 ? 1 : 2;
    const size = layer === 0 ? 1 : layer === 1 ? 1.5 : 2;
    const alpha = layer === 0 ? 0.28 + Math.random() * 0.25 : layer === 1 ? 0.45 + Math.random() * 0.25 : 0.65 + Math.random() * 0.25;

    stars.push({
      x: (Math.random() - 0.5) * worldRadius * 2,
      y: (Math.random() - 0.5) * worldRadius * 2,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkleSpeed: 0.8 + Math.random() * 1.8,
      twinklePhase: Math.random() * Math.PI * 2,
      layer,
      alpha,
    });
  }
  return stars;
}

export function drawPixelSun(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  time: number
) {
  ctx.save();
  ctx.translate(Math.floor(cx), Math.floor(cy));

  const numFlares = 16;
  for (let i = 0; i < numFlares; i++) {
    const angle = (i / numFlares) * Math.PI * 2 + time * 0.4;
    const flareLen = radius + 12 + Math.sin(time * 6 + i * 2.5) * 8;
    const fx = Math.cos(angle) * flareLen;
    const fy = Math.sin(angle) * flareLen;

    ctx.fillStyle = i % 2 === 0 ? '#ff5500' : '#ffaa00';
    const px = Math.floor(fx);
    const py = Math.floor(fy);
    ctx.fillRect(px - 3, py - 3, 6, 6);
    ctx.fillRect(px - 1, py - 1, 3, 3);
  }

  const coronaR = radius + 8;
  ctx.fillStyle = 'rgba(255, 120, 0, 0.35)';
  ctx.beginPath();
  ctx.arc(0, 0, coronaR, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ff3700';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff480';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ff7700';
  const spots = [
    [-0.3, -0.2, 8],
    [0.4, -0.3, 10],
    [-0.2, 0.4, 7],
    [0.3, 0.3, 9],
  ];
  spots.forEach(([sx, sy, sr]) => {
    const x = Math.floor(sx * radius + Math.sin(time + sx) * 4);
    const y = Math.floor(sy * radius + Math.cos(time + sy) * 4);
    ctx.fillRect(x - sr / 2, y - sr / 2, sr, sr);
  });

  ctx.restore();
}

export function drawPixelPlanet(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  planet: {
    id: string;
    radius: number;
    color: string;
    glowColor: string;
    hasRing?: boolean;
    ringInner?: number;
    ringOuter?: number;
    ringColor?: string;
  },
  time: number
) {
  ctx.save();
  ctx.translate(Math.floor(cx), Math.floor(cy));

  const r = planet.radius;

  if (planet.hasRing) {
    const ringInner = planet.ringInner || r * 1.35;
    const ringOuter = planet.ringOuter || r * 2.1;
    ctx.save();
    ctx.scale(1, 0.34);
    ctx.beginPath();
    ctx.arc(0, 0, ringOuter, Math.PI, Math.PI * 2);
    ctx.arc(0, 0, ringInner, Math.PI * 2, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = planet.ringColor || 'rgba(230, 190, 120, 0.65)';
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = planet.glowColor || 'rgba(0, 240, 255, 0.2)';
  ctx.beginPath();
  ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#060114';
  ctx.beginPath();
  ctx.arc(0, 0, r + 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = planet.color;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.clip();

  if (planet.id === 'earth') {
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-r, -r, r * 2, r * 2);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-r * 0.6, -r * 0.4, r * 0.8, r * 0.5);
    ctx.fillRect(r * 0.1, -r * 0.6, r * 0.7, r * 0.6);
    ctx.fillRect(-r * 0.2, r * 0.1, r * 0.6, r * 0.6);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const cloudOffset = (time * 6) % (r * 2);
    ctx.fillRect(-r + cloudOffset, -r * 0.3, r * 0.7, 3);
    ctx.fillRect(-r + cloudOffset - r * 1.2, r * 0.2, r * 0.8, 3);
  } else if (planet.id === 'jupiter') {
    const bandColors = ['#e0a96d', '#c68b59', '#ecc59c', '#d39864', '#b87333'];
    const bandH = Math.max(3, Math.floor((r * 2) / bandColors.length));
    for (let i = 0; i < bandColors.length; i++) {
      ctx.fillStyle = bandColors[i];
      ctx.fillRect(-r, -r + i * bandH, r * 2, bandH);
    }
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.ellipse(r * 0.3, r * 0.25, r * 0.35, r * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (planet.id === 'mars') {
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-r * 0.4, -r * 0.3, r * 0.7, r * 0.4);
    ctx.fillRect(0, r * 0.1, r * 0.6, r * 0.5);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -r * 0.85, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }else if (planet.id === 'venus') {
    ctx.fillStyle = '#fef08a';
    for (let i = -r; i < r; i += 5) {
      if (Math.abs(i) % 10 === 0) {
        ctx.fillRect(-r, i, r * 2, 3);
      }
    }
  } else if (planet.id === 'mercury') {
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-r * 0.4, -r * 0.3, 4, 4);
    ctx.fillRect(r * 0.2, r * 0.1, 5, 5);
    ctx.fillRect(-r * 0.2, r * 0.4, 3, 3);
  } else if (planet.id === 'saturn') {
    ctx.fillStyle = '#e2c290';
    for (let i = -r; i < r; i += 4) {
      if (Math.abs(i) % 8 === 0) {
        ctx.fillRect(-r, i, r * 2, 2);
      }
    }
  } else if (planet.id === 'uranus' || planet.id === 'neptune') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(-r, -r * 0.2, r * 2, 3);
    ctx.fillRect(-r, r * 0.3, r * 2, 2);
  }

  const shadowGrad = ctx.createLinearGradient(-r, 0, r, 0);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.15)');  shadowGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.65)');
  shadowGrad.addColorStop(1, 'rgba(2, 1, 8, 0.9)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(-r, -r, r * 2, r * 2);

  ctx.restore();

  if (planet.hasRing) {
    const ringInner = planet.ringInner || r * 1.35;
    const ringOuter = planet.ringOuter || r * 2.1;
    ctx.save();
    ctx.scale(1, 0.34);
    ctx.beginPath();
    ctx.arc(0, 0, ringOuter, 0, Math.PI);
    ctx.arc(0, 0, ringInner, Math.PI, 0, true);
    ctx.closePath();
    ctx.fillStyle = planet.ringColor || 'rgba(230, 190, 120, 0.75)';
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

export function drawPixelLaunchStation(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number, 
  time:number
) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));

  const safeRadius = 140;
  ctx.save();
ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, safeRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const dockR = 44;
  ctx.save();

  ctx.fillStyle = '#0f172a';
  drawRegularPolygon(ctx, 0, 0, dockR + 4, 6);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  drawRegularPolygon(ctx, 0, 0, dockR, 6);
  ctx.fill();

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  drawRegularPolygon(ctx, 0, 0, dockR - 6, 6);
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(-2, -22, 4, 6);
  ctx.fillRect(-2, 16, 4, 6);
  ctx.fillRect(-22, -2, 6, 4);
  ctx.fillRect(16, -2, 6, 4);

  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const lx = Math.cos(ang) * (dockR - 2);
    const ly = Math.sin(ang) * (dockR - 2);

    const isBlink = Math.floor(time * 3 + i) % 2 === 0;
    ctx.fillStyle = isBlink ? '#00f0ff' : '#0369a1';
    ctx.fillRect(Math.floor(lx) - 2, Math.floor(ly) - 2, 4, 4);
  }

  ctx.restore();
  ctx.restore();
}

function drawRegularPolygon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  sides: number
) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const ang = (i / sides) * Math.PI * 2 - Math.PI / 2;
    const px = cx + Math.cos(ang) * r;
    const py = cy + Math.sin(ang) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}