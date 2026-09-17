import * as THREE from 'three';
import {
  DisposableItem,
  createHudLabel,
  createSunTexture,
  createSunCoronaTexture,
  createMercuryTexture,
  createVenusTexture,
  createEarthTexture,
  createMoonTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingTexture,
  createUranusTexture,
  createNeptuneTexture,
  createNebulaCloud,
} from './cosmicTextures';

export interface CelestialTarget {
  name: string;
  group: THREE.Group;
  meshes: THREE.Object3D[];
}

export interface AsteroidItem {
  mesh: THREE.Mesh;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  orbitSpeed: number;
  radius: number;
  angle: number;
}

export interface SolarSystemBuildResult {
  celestialTargets: CelestialTarget[];
  asteroids: AsteroidItem[];
  starField: THREE.Points;
  nebulaGroup: THREE.Group;
  sunMesh: THREE.Mesh;
  coronaSprite: THREE.Sprite;
  sunRadius: number;
  mercuryMesh: THREE.Mesh;
  venusMesh: THREE.Mesh;
  earthMesh: THREE.Mesh;
  moonMesh: THREE.Mesh;
  moonOrbitRadius: number;
  marsMesh: THREE.Mesh;
  jupiterMesh: THREE.Mesh;
  saturnMesh: THREE.Mesh;
  uranusMesh: THREE.Mesh;
  neptuneMesh: THREE.Mesh;
  updatePlanetLayout: (w: number, h: number) => void;
}

export function buildSolarSystem(
  scene: THREE.Scene,
  disposables: DisposableItem[],
  width: number,
  height: number
): SolarSystemBuildResult {
  const cyanCloud = createNebulaCloud(0, 220, 255, disposables);
  const purpleCloud = createNebulaCloud(160, 60, 255, disposables);
  const magentaCloud = createNebulaCloud(255, 60, 160, disposables);

  const nebulaGroup = new THREE.Group();
  const cloudMaterials = [
    new THREE.SpriteMaterial({ map: cyanCloud, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }),
    new THREE.SpriteMaterial({ map: purpleCloud, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false }),
    new THREE.SpriteMaterial({ map: magentaCloud, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }),
  ];
  cloudMaterials.forEach((m) => disposables.push(m));

  for (let i = 0; i < 22; i++) {
    const mat = cloudMaterials[i % cloudMaterials.length];
    const sprite = new THREE.Sprite(mat);
    const s = Math.random() * 900 + 500;
    sprite.scale.set(s, s, 1);
    sprite.position.set(
      (Math.random() - 0.5) * 4500,
      (Math.random() - 0.5) * 2600,
      (Math.random() - 0.5) * 3000 - 400
    );
    nebulaGroup.add(sprite);
  }
  scene.add(nebulaGroup);

  const starCount = 2800;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starCol = new Float32Array(starCount * 3);
  disposables.push(starGeo);

  const starColors = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xa6f0ff),
    new THREE.Color(0xffe899),
    new THREE.Color(0xffaacc),
    new THREE.Color(0x75f4f8),
  ];

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPos[i3] = (Math.random() - 0.5) * 5500;
    starPos[i3 + 1] = (Math.random() - 0.5) * 3800;
    starPos[i3 + 2] = (Math.random() - 0.5) * 4000 - 300;

    const c = starColors[Math.floor(Math.random() * starColors.length)];
    starCol[i3] = c.r;
    starCol[i3 + 1] = c.g;
    starCol[i3 + 2] = c.b;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));

  const starCv = document.createElement('canvas');
  starCv.width = 16;
  starCv.height = 16;
  const sctx = starCv.getContext('2d')!;
  const sgrad = sctx.createRadialGradient(8, 8, 1, 8, 8, 8);
  sgrad.addColorStop(0, '#ffffff');
  sgrad.addColorStop(0.5, 'rgba(255,255,255,0.75)');
  sgrad.addColorStop(1, 'rgba(255,255,255,0)');
  sctx.fillStyle = sgrad;
  sctx.fillRect(0, 0, 16, 16);
  const starTex = new THREE.CanvasTexture(starCv);
  disposables.push(starTex);

  const starMat = new THREE.PointsMaterial({
    size: 11,
    map: starTex,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.95,
  });
  disposables.push(starMat);
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.7);
  keyLight.position.set(0, 200, 600);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xdde8ff, 1.5);
  fillLight.position.set(-350, -100, 450);
  scene.add(fillLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x445577, 0.9);
  scene.add(hemiLight);

  const sunRadius = 72;
  const sunGroup = new THREE.Group();
  const sunGeo = new THREE.SphereGeometry(sunRadius, 32, 32);
  disposables.push(sunGeo);
  const sunMat = new THREE.MeshBasicMaterial({ map: createSunTexture(disposables) });
  disposables.push(sunMat);
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunGroup.add(sunMesh);

  const coronaMat = new THREE.SpriteMaterial({
    map: createSunCoronaTexture(disposables),
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.95,
    depthWrite: false,
  });
  disposables.push(coronaMat);
  const coronaSprite = new THREE.Sprite(coronaMat);
  coronaSprite.scale.set(sunRadius * 4.4, sunRadius * 4.4, 1);
  sunGroup.add(coronaSprite);

  const sunLabel = createHudLabel('SUN', '☉', '#ffaa00', 1.3, disposables);
  sunLabel.position.set(0, sunRadius + 28, 0);
  sunGroup.add(sunLabel);
  scene.add(sunGroup);

  const mercuryRadius = 17;
  const mercuryGroup = new THREE.Group();
  const mercuryGeo = new THREE.SphereGeometry(mercuryRadius, 28, 28);
  disposables.push(mercuryGeo);
  const mercuryMat = new THREE.MeshLambertMaterial({
    map: createMercuryTexture(disposables),
    emissive: new THREE.Color(0x353535),
  });
  disposables.push(mercuryMat);
const mercuryMesh = new THREE.Mesh(mercuryGeo, mercuryMat);
  mercuryGroup.add(mercuryMesh);

  const mercuryLabel = createHudLabel('MERCURY', '☿', '#c4c8d2', 0.85, disposables);
  mercuryLabel.position.set(0, mercuryRadius + 16, 0);
  mercuryGroup.add(mercuryLabel);
  scene.add(mercuryGroup);

  const venusRadius = 25;
  const venusGroup = new THREE.Group();
  const venusGeo = new THREE.SphereGeometry(venusRadius, 28, 28);
  disposables.push(venusGeo);
  const venusMat = new THREE.MeshLambertMaterial({
    map: createVenusTexture(disposables),
    emissive: new THREE.Color(0x553810),
  });
  disposables.push(venusMat);
  const venusMesh = new THREE.Mesh(venusGeo, venusMat);
  venusGroup.add(venusMesh);

  const venusLabel = createHudLabel('VENUS', '♀', '#ffc860', 0.9, disposables);
  venusLabel.position.set(0, venusRadius + 18, 0);
  venusGroup.add(venusLabel);
  scene.add(venusGroup);

  const jupiterRadius = 78;
  const jupiterGroup = new THREE.Group();
  const jupiterGeo = new THREE.SphereGeometry(jupiterRadius, 36, 36);
  disposables.push(jupiterGeo);
  const jupiterMat = new THREE.MeshLambertMaterial({
    map: createJupiterTexture(disposables),
    emissive: new THREE.Color(0x452a12),
  });
  disposables.push(jupiterMat);
  const jupiterMesh = new THREE.Mesh(jupiterGeo, jupiterMat);
  jupiterMesh.rotation.z = 0.05;
  jupiterGroup.add(jupiterMesh);

  const jupiterLabel = createHudLabel('JUPITER', '♃', '#ffb070', 1.35, disposables);
  jupiterLabel.position.set(0, jupiterRadius + 28, 0);
  jupiterGroup.add(jupiterLabel);
  scene.add(jupiterGroup);

  const marsRadius = 23;
  const marsGroup = new THREE.Group();
  const marsGeo = new THREE.SphereGeometry(marsRadius, 28, 28);
  disposables.push(marsGeo);
  const marsMat = new THREE.MeshLambertMaterial({
    map: createMarsTexture(disposables),
    emissive: new THREE.Color(0x5a1808),
  });
  disposables.push(marsMat);
  const marsMesh = new THREE.Mesh(marsGeo, marsMat);
  marsMesh.rotation.z = 0.44;
  marsGroup.add(marsMesh);

  const marsLabel = createHudLabel('MARS', '♂', '#ff6230', 0.9, disposables);
  marsLabel.position.set(0, marsRadius + 18, 0);
  marsGroup.add(marsLabel);
  scene.add(marsGroup);

  const saturnRadius = 58;
  const saturnGroup = new THREE.Group();
  const saturnGeo = new THREE.SphereGeometry(saturnRadius, 36, 36);
  disposables.push(saturnGeo);
  const saturnMat = new THREE.MeshLambertMaterial({
    map: createSaturnTexture(disposables),
    emissive: new THREE.Color(0x4a3a18),
  });
  disposables.push(saturnMat);
  const saturnMesh = new THREE.Mesh(saturnGeo, saturnMat);
  saturnMesh.rotation.z = 0.47;
  saturnGroup.add(saturnMesh);

  const satRingGeo = new THREE.RingGeometry(70, 142, 64);
  disposables.push(satRingGeo);
  const satRingMat = new THREE.MeshBasicMaterial({
    map: createSaturnRingTexture(disposables),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.98,
    blending: THREE.AdditiveBlending,
  });
  disposables.push(satRingMat);
  const satRingMesh = new THREE.Mesh(satRingGeo, satRingMat);
  satRingMesh.rotation.x = Math.PI * 0.42;
  satRingMesh.rotation.y = 0.22;
  saturnGroup.add(satRingMesh);

  const saturnLabel = createHudLabel('SATURN', '♄', '#ffd780', 1.25, disposables);
  saturnLabel.position.set(0, saturnRadius + 32, 0);
  saturnGroup.add(saturnLabel);
  scene.add(saturnGroup);

  const uranusRadius = 27;
  const uranusGroup = new THREE.Group();
  const uranusGeo = new THREE.SphereGeometry(uranusRadius, 28, 28);
  disposables.push(uranusGeo);
  const uranusMat = new THREE.MeshLambertMaterial({
    map: createUranusTexture(disposables),
    emissive: new THREE.Color(0x184852),
  });
  disposables.push(uranusMat);
  const uranusMesh = new THREE.Mesh(uranusGeo, uranusMat);
  uranusMesh.rotation.x = Math.PI * 0.48;
  uranusGroup.add(uranusMesh);

  const uranusLabel = createHudLabel('URANUS', '♅', '#60f0f5', 0.95, disposables);
  uranusLabel.position.set(0, uranusRadius + 20, 0);
  uranusGroup.add(uranusLabel);
  scene.add(uranusGroup);

  const earthRadius = 58;
  const earthGroup = new THREE.Group();
  const earthGeo = new THREE.SphereGeometry(earthRadius, 36, 36);
  disposables.push(earthGeo);
  const earthMat = new THREE.MeshLambertMaterial({
    map: createEarthTexture(disposables),
    emissive: new THREE.Color(0x103468),
  });
  disposables.push(earthMat);
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthMesh.rotation.z = 0.41;
  earthGroup.add(earthMesh);

  const atmoGeo = new THREE.SphereGeometry(earthRadius * 1.045, 32, 32);
  disposables.push(atmoGeo);
  const atmoMat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.24,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  });
  disposables.push(atmoMat);
  earthGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

  const moonRadius = 14;
  const moonGeo = new THREE.SphereGeometry(moonRadius, 24, 24);
  disposables.push(moonGeo);
  const moonMat = new THREE.MeshLambertMaterial({
    map: createMoonTexture(disposables),
    emissive: new THREE.Color(0x353535),
  });
  disposables.push(moonMat);
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  const moonOrbitRadius = 95;
  moonMesh.position.set(moonOrbitRadius, 15, 0);
  earthGroup.add(moonMesh);

  const earthLabel = createHudLabel('EARTH', '♁', '#00d4ff', 1.25, disposables);
  earthLabel.position.set(0, earthRadius + 26, 0);
  earthGroup.add(earthLabel);
  scene.add(earthGroup);

  const neptuneRadius = 30;
  const neptuneGroup = new THREE.Group();
  const neptuneGeo = new THREE.SphereGeometry(neptuneRadius, 28, 28);
  disposables.push(neptuneGeo);
  const neptuneMat = new THREE.MeshLambertMaterial({
    map: createNeptuneTexture(disposables),
    emissive: new THREE.Color(0x0e2060),
  });
  disposables.push(neptuneMat);
  const neptuneMesh = new THREE.Mesh(neptuneGeo, neptuneMat);
  neptuneGroup.add(neptuneMesh);

  const neptuneLabel = createHudLabel('NEPTUNE', '♆', '#4d80ff', 0.95, disposables);
  neptuneLabel.position.set(0, neptuneRadius + 22, 0);
  neptuneGroup.add(neptuneLabel);
  scene.add(neptuneGroup);

  const celestialTargets: CelestialTarget[] = [
    { name: 'SUN', group: sunGroup, meshes: [sunMesh] },
    { name: 'MERCURY', group: mercuryGroup, meshes: [mercuryMesh] },
    { name: 'VENUS', group: venusGroup, meshes: [venusMesh] },
    { name: 'EARTH', group: earthGroup, meshes: [earthMesh, moonMesh] },
    { name: 'MARS', group: marsGroup, meshes: [marsMesh] },
    { name: 'JUPITER', group: jupiterGroup, meshes: [jupiterMesh] },
    { name: 'SATURN', group: saturnGroup, meshes: [saturnMesh, satRingMesh] },
    { name: 'URANUS', group: uranusGroup, meshes: [uranusMesh] },
    { name: 'NEPTUNE', group: neptuneGroup, meshes: [neptuneMesh] },
  ];

  const updatePlanetLayout = (w: number, h: number) => {
    const aspect = w / h;
    const spreadX = Math.max(0.82, Math.min(1.35, aspect / 1.55));
    const spreadY = Math.max(0.8, Math.min(1.25, 1.55 / Math.max(aspect, 0.75)));

    sunGroup.position.set(-460 * spreadX, 195 * spreadY, -200);
    mercuryGroup.position.set(-325 * spreadX, 125 * spreadY, -150);
    venusGroup.position.set(-185 * spreadX, 235 * spreadY, -180);

    jupiterGroup.position.set(-440 * spreadX, -150 * spreadY, -230);
    marsGroup.position.set(-240 * spreadX, -190 * spreadY, -100);

    uranusGroup.position.set(190 * spreadX, 235 * spreadY, -220);
    saturnGroup.position.set(420 * spreadX, 180 * spreadY, -200);

    earthGroup.position.set(380 * spreadX, -55 * spreadY, 20);
    neptuneGroup.position.set(510 * spreadX, -165 * spreadY, -240);
  };

  updatePlanetLayout(width, height);

  const asteroidCount = 30;
  const asteroidGroup = new THREE.Group();
  const astMat = new THREE.MeshLambertMaterial({
    color: 0x8a847e,
    emissive: new THREE.Color(0x201c18),
  });
  disposables.push(astMat);

  const asteroids: AsteroidItem[] = [];

  for (let i = 0; i < asteroidCount; i++) {
    const rad = Math.random() * 3.5 + 1.8;
    const astGeo = new THREE.DodecahedronGeometry(rad, 1);
    disposables.push(astGeo);

    const pos = astGeo.attributes.position;
    for (let j = 0; j < pos.count; j++) {
      const vx = pos.getX(j);
      const vy = pos.getY(j);
      const vz = pos.getZ(j);
      const factor = 1 + (Math.random() - 0.5) * 0.25;
      pos.setXYZ(j, vx * factor, vy * factor, vz * factor);
    }
    astGeo.computeVertexNormals();

    const mesh = new THREE.Mesh(astGeo, astMat);
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 550 + 350;
    const x = Math.cos(angle) * r;
    const y = (Math.random() - 0.5) * 320;
    const z = Math.sin(angle) * r - 320;
    mesh.position.set(x, y, z);
    asteroidGroup.add(mesh);

    asteroids.push({
      mesh,
      rotSpeedX: (Math.random() - 0.5) * 0.6,
      rotSpeedY: (Math.random() - 0.5) * 0.6,
      rotSpeedZ: (Math.random() - 0.5) * 0.6,
      orbitSpeed: (Math.random() * 0.03 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
      radius: r,
      angle,
    });
  }
  scene.add(asteroidGroup);

  return {
    celestialTargets,
    asteroids,
    starField,
    nebulaGroup,
    sunMesh,
    coronaSprite,
    sunRadius,
    mercuryMesh,
    venusMesh,
    earthMesh,
    moonMesh,
    moonOrbitRadius,
    marsMesh,
    jupiterMesh,
    saturnMesh,
    uranusMesh,
    neptuneMesh,
    updatePlanetLayout,
  };
}