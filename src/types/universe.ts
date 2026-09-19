export interface PlanetData {
  id: string;
  name: string;
  title: string;
  color: string;
  glowColor: string;
  radius: number;
  distance: number;
  orbitSpeed: number;
  orbitAngle: number;
  description: string;
  hasRing?: boolean;
  ringInner?: number;
  ringOuter?: number;
  ringColor?: string;
  hasMoon?: boolean;
  moonAngle?: number;
  moonDistance?: number;
  moonRadius?: number;
  moonColor?: string;
  bonusPoints: number;
}

export interface CollectibleItem {
  id: number;
  x: number;
  y: number;
  z: number;
  type: 'star' | 'gem' | 'fuel';
  radius: number;
  value: number;
  rot: number;
  rotSpeed: number;
  pulsePhase: number;
}

export interface AsteroidObstacle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  hp: number;
  maxHp: number;
  color: number;
  asteroidType?: 'iron' | 'ice' | 'rock';
}

export interface SpaceMineObstacle {
  id: number;
  x: number;
  y: number;
  z: number;
  radius: number;
  isTriggered: boolean;
  triggerTimer: number; 
  isExploding: boolean;
  explosionProgress: number; 
  beepTimer: number;
}

export interface CometObstacle {
  id: number;
  x: number;
y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  tailLength: number;
  life: number;
  maxLife: number;
}

export interface ParticleEffect {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface SpaceDebrisItem {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotSpeed: number;
  type: 'metal' | 'crystal' | 'hull';
  color: string;
  hp: number;
  maxHp: number;
}

export interface FireProjectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  life: number;
  maxLife: number;
  size: number;
}

export interface FloatingScoreItem {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  life: number;
}

export const SOLAR_PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'MERCURY',
    title: 'The Scorched Courier',
    color: '#bfa78a',
    glowColor: '#e0cbb2',
    radius: 16,
    distance: 280,
    orbitSpeed: 0.0006,
    orbitAngle: 0.4,
    description: 'Cratered, sun-baked innermost rocky world.',
    bonusPoints: 150,
  },
  {
    id: 'venus',
    name: 'VENUS',
    title: 'The Sulfuric Veil',
    color: '#e5ad52',
    glowColor: '#ffd175',
    radius: 24,
    distance: 470,
    orbitSpeed: 0.00045,
    orbitAngle: 1.8,
    description: 'Volcanic super-heated atmosphere with golden sulfuric clouds.',
    bonusPoints: 200,
  },
  {
    id: 'earth',
    name: 'EARTH',
    title: 'The Azure Oasis',
    color: '#2882e8',
    glowColor: '#63b4ff',
    radius: 28,
    distance: 690,
    orbitSpeed: 0.00035,
    orbitAngle: 3.2,
    description: 'Humanity’s sanctuary with azure oceans and vibrant continents.',
    hasMoon: true,
    moonAngle: 0,
    moonDistance: 48,
    moonRadius: 8,
    moonColor: '#d6d6d6',
    bonusPoints: 250,
  },
  {
    id: 'mars',
    name: 'MARS',
    title: 'The Crimson Frontier',
    color: '#d94b26',
    glowColor: '#ff7752',
    radius: 20,
    distance: 960,
    orbitSpeed: 0.00028,
    orbitAngle: 4.6,
    description: 'Rust-dusted red planet with towering volcanoes and polar ice caps.',
    bonusPoints: 300,
  },
  {
    id: 'jupiter',
    name: 'JUPITER',
    title: 'The Great Gas Titan',
    color: '#d69e6b',
    glowColor: '#f7c294',
    radius: 56,
    distance: 1650,
    orbitSpeed: 0.00018,
    orbitAngle: 0.9,
    description: 'Colossal gas giant with churning atmospheric bands & Great Red Spot.',
    bonusPoints: 400,
  },
  {
    id: 'saturn',
    name: 'SATURN',
    title: 'The Ringed Jewel',
    color: '#e2bf7d',
    glowColor: '#ffe4ab',
    radius: 46,
    distance: 2280,
    orbitSpeed: 0.00012,
    orbitAngle: 2.7,
    description: 'Golden sphere crowned with majestic 3D ice crystal rings.',
    hasRing: true,
    ringInner: 60,
    ringOuter: 105,
    ringColor: 'rgba(235, 198, 132, 0.75)',
    bonusPoints: 450,
  },
  {
    id: 'uranus',
    name: 'URANUS',
    title: 'The Cyan Tempest',
    color: '#6ee5e8',
    glowColor: '#a8f9fc',
    radius: 32,
    distance: 2880,
    orbitSpeed: 0.00008,
    orbitAngle: 5.1,
    description: 'Icy cyan-aquamarine giant tilted on its side in deep space.',
    hasRing: true,
    ringInner: 40,
    ringOuter: 58,
    ringColor: 'rgba(110, 229, 232, 0.65)',
    bonusPoints: 500,
  },
  {
    id: 'neptune',
    name: 'NEPTUNE',
    title: 'The Deep Cobalt Vortex',
    color: '#2b50d9',
    glowColor: '#5c80ff',
    radius: 32,
    distance: 3450,
    orbitSpeed: 0.00006,
    orbitAngle: 1.4,
    description: 'Supersonic winds whipping across a deep royal cobalt atmosphere.',
    bonusPoints: 550,
  },
  {
    id: 'pluto',
    name: 'PLUTO',
    title: 'The Frozen Outpost',
    color: '#9e8fc2',
    glowColor: '#c7bceb',
    radius: 14,
    distance: 3950,
    orbitSpeed: 0.00004,
    orbitAngle: 3.8,
    description: 'Crystalline dwarf world guarding the threshold of interstellar space.',
    bonusPoints: 600,
  },
];