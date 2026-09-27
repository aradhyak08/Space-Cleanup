import * as THREE from 'three';

// Cache generated textures so they are created only once
const textureCache = new Map<string, THREE.CanvasTexture>();

export function getSunTexture(): THREE.CanvasTexture {
  if (textureCache.has('sun')) return textureCache.get('sun')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Fiery solar plasma gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 256);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.2, '#ffe042');
  grad.addColorStop(0.5, '#ff8800');
  grad.addColorStop(0.8, '#ff3300');
  grad.addColorStop(1, '#990000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Solar granules & flares
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = Math.random() * 30 + 10;
    const pGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    pGrad.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
    pGrad.addColorStop(0.5, 'rgba(255, 140, 0, 0.4)');
    pGrad.addColorStop(1, 'rgba(255, 50, 0, 0)');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set('sun', tex);
  return tex;
}

export function getEarthTexture(): THREE.CanvasTexture {
  if (textureCache.has('earth')) return textureCache.get('earth')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep Blue Oceans
  ctx.fillStyle = '#0f3882';
  ctx.fillRect(0, 0, 512, 256);

  // Continents (Green and Ochre Landmasses)
  ctx.fillStyle = '#2d7a36';
  const continents = [
    { x: 120, y: 70, rx: 70, ry: 45 },
    { x: 160, y: 160, rx: 50, ry: 60 },
    { x: 300, y: 65, rx: 80, ry: 40 },
    { x: 310, y: 140, rx: 60, ry: 50 },
    { x: 420, y: 170, rx: 45, ry: 35 },
  ];

  continents.forEach((c) => {
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.rx, c.ry, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Mountain highlands
    ctx.fillStyle = '#8f7734';
    ctx.beginPath();
    ctx.ellipse(c.x - 10, c.y + 5, c.rx * 0.4, c.ry * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2d7a36';
  });

  // Swirling Atmospheric White Clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  for (let i = 0; i < 35; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 256;
    const len = Math.random() * 80 + 30;
    ctx.beginPath();
    ctx.ellipse(cx, cy, len, len * 0.2, Math.random() * 0.4 - 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polar Ice Caps
  ctx.fillStyle = '#f0f8ff';
  ctx.fillRect(0, 0, 512, 20);
  ctx.fillRect(0, 236, 512, 20);

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set('earth', tex);
return tex;
}

export function getJupiterTexture(): THREE.CanvasTexture {
  if (textureCache.has('jupiter')) return textureCache.get('jupiter')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Churning Atmospheric Bands
  const bands = [
    '#d69b6b', '#c28556', '#ebd1b0', '#b57041', '#e8cc9e',
    '#9e5929', '#e0be8d', '#d49059', '#edd5b8', '#9e5929',
  ];

  const bandH = 256 / bands.length;
  bands.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, idx * bandH, 512, bandH + 2);
  });

  // Great Red Spot storm
  ctx.fillStyle = '#a83216';
  ctx.beginPath();
  ctx.ellipse(320, 150, 42, 24, 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#db4823';
  ctx.beginPath();
  ctx.ellipse(320, 150, 28, 15, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Swirl turbulence lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  for (let i = 0; i < 20; i++) {
    const y = Math.random() * 256;
    ctx.fillRect(0, y, 512, Math.random() * 3 + 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set('jupiter', tex);
  return tex;
}

export function getMarsTexture(): THREE.CanvasTexture {
  if (textureCache.has('mars')) return textureCache.get('mars')!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b84218';
  ctx.fillRect(0, 0, 512, 256);

  // Darker basalt volcanic basins
  ctx.fillStyle = '#7a280c';
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * 512,
      Math.random() * 256,
      Math.random() * 60 + 20,
      Math.random() * 30 + 10,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Polar Ice Caps
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 14);
  ctx.fillRect(0, 242, 512, 14);

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set('mars', tex);
  return tex;
}

export function getCraterTexture(baseColor: string, craterColor: string): THREE.CanvasTexture {
  const key = `crater-${baseColor}-${craterColor}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 128);

  // Craters
  ctx.fillStyle = craterColor;
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 128;
    const r = Math.random() * 12 + 3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Crater rim highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, Math.PI * 0.8, Math.PI * 1.8);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set(key, tex);
  return tex;
}