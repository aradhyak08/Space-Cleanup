export type ActiveScreen = 'home' | 'play-zone';

export interface CollectibleEntity {
  id: string;
  type: 'star' | 'crystal' | 'scrap';
  x: number;
  y: number;
  points: number;
  collected: boolean;
  size: number;
}

export interface AsteroidEntity {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export interface GameStats {
  stars: number;
  gems: number;
  highScore: number;
  currentScore: number;
  wave: number;
  waveProgress: number;
  lives: number;
  maxLives: number;
  multiplier: number;
  soundEnabled: boolean;
  selectedLevel: number;
  suctionPower: number;
  boostSpeed: number;
  shieldDuration:  number;
}