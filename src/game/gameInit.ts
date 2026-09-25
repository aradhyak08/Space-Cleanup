import {
  PlanetData,
  SOLAR_PLANETS,
  CollectibleItem,
  AsteroidObstacle,
  SpaceMineObstacle,
} from '../types/universe';
import { createPixelStars } from '../utils/pixelRenderer';
import { GameState, LAUNCH_STATION } from '../types/gameEngine';

export function populateAsteroids(): AsteroidObstacle[]  {
  const astList: AsteroidObstacle[] = [];
  let astId = 0;

  for (let i = 0; i < 60; i++) {
    const dist = 380 + Math.random() * 670;
    let angle = (i / 60) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
    let ax = Math.cos(angle) * dist;
    let ay = Math.sin(angle) * dist;

    if (Math.hypot(ax - LAUNCH_STATION.x, ay - LAUNCH_STATION.y) < LAUNCH_STATION.safeRadius) {
      angle += angle >= 0 ? 0.85 : -0.85;
      ax = Math.cos(angle) * dist;
      ay = Math.sin(angle) * dist;
    }

    const driftAng = Math.random() * Math.PI * 2;
    const speed = 0.35 + Math.random() * 0.45;
    const typeChoice: 'iron' | 'ice' | 'rock' =
      Math.random() < 0.35 ? 'iron' : Math.random() < 0.65 ? 'ice' : 'rock';
    astList.push({
      id: astId++,
      x: ax,
      y: ay,
      z: 0,
      vx: Math.cos(driftAng) * speed,
      vy: Math.sin(driftAng) * speed,
      vz: 0,
      radius: 17 + Math.random() * 18,
      rotX: Math.random() * Math.PI,
      rotY: 0,
      rotZ: 0,
      rotSpeedX: (Math.random() - 0.5) * 0.05,
      rotSpeedY: 0,
      rotSpeedZ: 0,
      hp: 1,
      maxHp: 1,
      color: 0x7f7f7fa6a58,
      asteroidType: typeChoice,
    });
  }

  for (let i = 0; i < 85; i++) {
    const dist = 1120 + Math.random() * 530;
    let angle = (i / 85) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
    let ax = Math.cos(angle) * dist;
    let ay = Math.sin(angle) * dist;

    if (Math.hypot(ax - LAUNCH_STATION.x, ay - LAUNCH_STATION.y) < LAUNCH_STATION.safeRadius) {
      angle += 0.85;
    ax = Math.cos(angle) * dist;
      ay = Math.sin(angle) * dist;
    }

    const driftAng = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.45;
    const speed = 0.3 + Math.random() * 0.4;
    const typeChoice: 'iron' | 'ice' | 'rock' =
      Math.random() < 0.35 ? 'iron' : Math.random() < 0.65 ? 'ice' : 'rock';
    astList.push({
      id: astId++,
      x: ax,
      y: ay,
      z: 0,
      vx: Math.cos(driftAng)  * speed,
      vy: Math.sin(driftAng) * speed,
      vz: 0,
      radius: 19 + Math.random() * 20,
      rotX: Math.random() * Math.PI,
      rotY: 0,
      rotZ: 0,
      rotSpeedX: (Math.random() - 0.5) * 0.04,
      rotSpeedY: 0,
      rotSpeedZ: 0,
      hp: 1,
      maxHp: 1,
      color: 0x7a6a58,
      asteroidType: typeChoice,
  });
}

  for (let i = 0; i < 65; i++) {
    const dist = 1700 + Math.random() * 2200;
    const angle = (i / 65) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const driftAng = Math.random() * Math.PI * 2;
    const speed = 0.35 + Math.random() * 0.45;
    const typeChoice: 'iron' | 'ice' | 'rock' =
      Math.random() < 0.35 ? 'iron' : Math.random() < 0.65 ? 'ice' : 'rock';
    astList.push({
      id: astId++,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
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

  return astList;
}

export function populateMines(): SpaceMineObstacle[] {
  const mineList: SpaceMineObstacle[] = [];
  for (let i = 0; i < 24; i++) {
    const dist = 650 + Math.random() * 2900;
    let angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    let mx = Math.cos(angle) * dist;
    let my = Math.sin(angle) * dist;
    if (Math.hypot(mx - LAUNCH_STATION.x, my - LAUNCH_STATION.y) < 480) {
      angle += 0.85;
      mx = Math.cos(angle) * dist;
      my = Math.sin(angle) * dist;
    }
    mineList.push({
      id: i,
      x: mx,
      y: my,
      z: 0,
      radius: 14,
      isTriggered: false,
      triggerTimer: 1800,
      isExploding: false,
      explosionProgress: 0,
      beepTimer: 0,
    });
  
  }
  return mineList;
}

export function populateCollectibles(planets: PlanetData[]): CollectibleItem[] {
  const cList: CollectibleItem[] = [];
  let cId = 0;

  planets.forEach((p) => {
    const px = Math.cos(p.orbitAngle) * p.distance;
    const py = Math.sin(p.orbitAngle) * p.distance;
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      const dist = p.radius + 24 + Math.random() * 45;
      const cx = px + Math.cos(ang) * dist;
      const cy = py + Math.sin(ang) * dist;
      if (Math.hypot(cx - LAUNCH_STATION.x, cy - LAUNCH_STATION.y) < 450) {
        continue;
      }
      const isGem = i % 3 === 0;
      cList.push({
        id: cId++,
        x: cx,
        y: cy,
        z: 0,
        type: isGem ? 'gem' : 'star',
        radius: isGem ? 7 : 6,
        value: isGem ? 100 : 25,
        rot: 0,
        rotSpeed: 0.05,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
  });

  for (let i = 0; i < 160; i++) {
    const dist = 520 + Math.random() * 3400;
    const angle = Math.random() * Math.PI * 2;
    const cx = Math.cos(angle) * dist;
    const cy = Math.sin(angle) * dist;
    if (Math.hypot(cx - LAUNCH_STATION.x, cy - LAUNCH_STATION.y) < 450) {
      continue;
    }
    const isGem = Math.random() < 0.28;
    cList.push({
      id: cId++,
      x: cx,
      y: cy,
      z: 0,
      type: isGem ? 'gem' : 'star',
      radius: isGem ? 7 : 6,
      value: isGem ? 100 : 25,
      rot: 0,
      rotSpeed: 0.05,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  return cList;
}

export function createInitialGameState(initialScore: number): GameState {
  const planets = SOLAR_PLANETS.map((p) => ({ ...p }));
  return {
    x: LAUNCH_STATION.x,
    y: LAUNCH_STATION.y,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    angularVelocity: 0,
    currentThrust: 0,
    camX: LAUNCH_STATION.x,
    camY: LAUNCH_STATION.y,
    hitChances: 3,
    maxHitChances: 3,
    invulnerableTimer: 3.5,
    hitsAbsorbed: 0,
    starsCollected: 0,
    gemsCollected: 0,
    nitro: 100,
    isBoosting: false,
    score: initialScore,
    scoreAccumulator: 0,
    shake: 0,

    survivalTime: 0,
    debrisSpawnTimer: 2.8,
    hazardEventTimer: 35,
    eventAlert: null,

    keys: {
      w: false,
      a: false,
      s: false,
      d: false,
      arrowUp: false,
      arrowLeft: false,
      arrowDown: false,
      arrowRight: false,
      space: false,
      shift: false,
    f: false,
      j: false,
      z: false,
    },
    fireButtonHeld: false,
    fireCooldown: 0,
    pointer: {
      active: false,
      screenX: 0,
      screenY: 0,
    },

    planets,
    discoveredSet: new Set<string>(),
    starsField: createPixelStars(220, 4200),
    collectibles: populateCollectibles(planets),
    asteroids: populateAsteroids(),
    mines: populateMines(),
    debris: [],
    comets: [],
    projectiles: [],
    particles: [],
    floatingScores: [],

    lastTime: performance.now(),
    isPaused: false,
    isGameOver: false,
    isDying: false,
    deathTimer: 0,
    wreckage: [],
    shockwaves: [],
    nextId: 1,
  };
}

export function resetGameState(game: GameState): void {
  game.x = LAUNCH_STATION.x;
  game.y = LAUNCH_STATION.y;
  game.vx = 0;
  game.vy = 0;
  game.angle = -Math.PI / 2;
  game.angularVelocity = 0;
  game.currentThrust = 0;
  game.camX = LAUNCH_STATION.x;
  game.camY = LAUNCH_STATION.y;
  game.hitChances = 3;
  game.invulnerableTimer = 3.5;
  game.hitsAbsorbed = 0;
  game.starsCollected = 0;
  game.gemsCollected = 0;
  game.nitro = 100;
  game.score = 0;
  game.scoreAccumulator = 0;
  game.isGameOver = false;
  game.isDying = false;
  game.deathTimer = 0;
  game.wreckage = [];
  game.shockwaves = [];
  game.survivalTime = 0;
  game.debrisSpawnTimer = 2.8;
  game.hazardEventTimer = 35;
  game.eventAlert = null;
  game.debris = [];
  game.comets = [];
  game.projectiles = [];
  game.particles = [];
  game.floatingScores = [];
  game.fireCooldown = 0;
  game.fireButtonHeld = false;
  game.discoveredSet.clear();
  game.asteroids = populateAsteroids();
  game.mines = populateMines();
  game.collectibles = populateCollectibles(game.planets);
}