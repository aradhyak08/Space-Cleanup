import {
  PlanetData,
  CollectibleItem,
  AsteroidObstacle,
  SpaceMineObstacle,
  CometObstacle,
  FloatingScoreItem,
  SpaceDebrisItem,
  FireProjectile,
} from './universe';
import { PixelStar } from '../utils/pixelRenderer';

export const LAUNCH_STATION = {
  x: 720,
  y: 0,
  radius: 60,
  safeRadius: 440,
};

export interface PixelDebrisParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface RocketWreckageFragment {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  rotSpeed: number;
  width: number;
  height: number;
  color: string;
  detailColor?: string;
  type: 'nose' | 'wing_l' | 'wing_r' | 'cockpit' | 'body' | 'engine';
}

export interface BlastShockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  lineWidth: number;
  alpha: number;
}

export interface ActiveControlsState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  fire: boolean;
  boost: boolean;
}

export interface GameState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  currentThrust: number;
  camX: number;
  camY: number;
  hitChances: number;
  maxHitChances: number;
  invulnerableTimer: number;
  hitsAbsorbed: number;
  starsCollected: number;
  gemsCollected: number;
  nitro: number;
  isBoosting: false | boolean;
  score: number;
  scoreAccumulator: number;
  shake: number;

  survivalTime: number;
  debrisSpawnTimer: number;
  hazardEventTimer: number;
  eventAlert: {
    title: string;
    subtitle: string;
    color: string;
    timer: number;
  } | null;

  keys: {
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
    arrowUp: boolean;
    arrowLeft: boolean;
    arrowDown: boolean;
    arrowRight: boolean;
    space: boolean;
    shift: boolean;
    f: boolean;
    j: boolean;
    z: boolean;
  };
  fireButtonHeld: boolean;
  fireCooldown: number;
  pointer: {
    active: boolean;
    screenX: number;
    screenY: number;
  };

  planets: PlanetData[];
  discoveredSet: Set<string>;
  starsField: PixelStar[];
  collectibles: CollectibleItem[];
  asteroids: AsteroidObstacle[];
  mines: SpaceMineObstacle[];
  debris: SpaceDebrisItem[];
  comets: CometObstacle[];
  projectiles: FireProjectile[];
  particles: PixelDebrisParticle[];
  floatingScores: FloatingScoreItem[];

  lastTime: number;
  isPaused: boolean;
  isGameOver: boolean;
  isDying: boolean;
  deathTimer: number;
  wreckage: RocketWreckageFragment[];
  shockwaves: BlastShockwave[];
nextId: number;
}