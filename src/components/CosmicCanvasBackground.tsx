import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { DisposableItem } from '../utils/cosmicTextures';
import { buildSolarSystem } from '../utils/cosmicCelestialBodies';

interface CosmicCanvasBackgroundProps {
  speedMultiplier?: number;
  isWarping?: boolean;
  interactive?: boolean;
}

export const CosmicCanvasBackground: React.FC<CosmicCanvasBackgroundProps> = ({
  speedMultiplier = 1,
  isWarping = false,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mouseRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    clientX: number;
    clientY: number;
  }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    clientX: window.innerWidth / 2,
    clientY: window.innerHeight / 2,
  });

  const zoomRef = useRef<{ current: number; target: number }>({
    current: 520,
    target: 520,
  });

  const focusRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
  }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const speedRef = useRef<number>(speedMultiplier);
  const warpingRef = useRef<boolean>(isWarping);
  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);
  useEffect(() => {
    warpingRef.current = isWarping;
  }, [isWarping]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    const BASE_ZOOM = 520;
    const MIN_ZOOM = 130;
    const MAX_ZOOM = 950;

    const camera = new THREE.PerspectiveCamera(46, width / height, 1, 5000);
    camera.position.set(0, 0, BASE_ZOOM);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020108, 1);
    container.appendChild(renderer.domElement);

    const disposables: DisposableItem[] = [];

    const solar = buildSolarSystem(scene, disposables, width, height);

    const raycaster = new THREE.Raycaster();
    const celestialFocalPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.clientX = e.clientX;
      mouseRef.current.clientY = e.clientY;
      if (!interactive) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const getTargetUnderCursor = (clientX: number, clientY: number): { x: number; y: number } => {
      const ndcX = (clientX / width) * 2 - 1;
      const ndcY = -(clientY / height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

      const allMeshes: THREE.Object3D[] = [];
      solar.celestialTargets.forEach((ct) => allMeshes.push(...ct.meshes));
      const intersects = raycaster.intersectObjects(allMeshes, false);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const target = solar.celestialTargets.find((ct) => ct.meshes.includes(hitMesh as any));
        if (target) {
          return { x: target.group.position.x, y: target.group.position.y };
        }
    }

      let closestPlanet: { x: number; y: number; distSq: number } | null = null;
      const tempVec = new THREE.Vector3();
      for (const ct of solar.celestialTargets) {
        tempVec.set(ct.group.position.x, ct.group.position.y, ct.group.position.z);
        tempVec.project(camera);
        const dx = tempVec.x - ndcX;
        const dy = tempVec.y - ndcY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 0.08) {
          if (!closestPlanet || distSq < closestPlanet.distSq) {
            closestPlanet = { x: ct.group.position.x, y: ct.group.position.y, distSq };
          }
        }
    }

      if (closestPlanet) {
        return { x: closestPlanet.x, y: closestPlanet.y };
    }

      const hitPoint = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(celestialFocalPlane, hitPoint)) {
        return { x: hitPoint.x, y: hitPoint.y };
    }

      return { x: ndcX * 350, y: ndcY * 220 };
    };

    const handleWheel = (e: WheelEvent) => {
      if (!interactive) return;
      const targetEl = e.target as HTMLElement | null;
      if (targetEl && targetEl.closest('.modal-scrollable, [data-scrollable="true"]')) {
        return;
      }
      e.preventDefault();

      const deltaY = e.deltaY;
      const step = Math.sign(deltaY) * Math.min(Math.abs(deltaY), 100) * 0.9;
      const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomRef.current.target + step));

      if (deltaY < 0) {
        const targetPoint = getTargetUnderCursor(e.clientX, e.clientY);
        focusRef.current.targetX = targetPoint.x;
        focusRef.current.targetY = targetPoint.y;
      } else if (nextZoom >= BASE_ZOOM) {
        focusRef.current.targetX = 0;
        focusRef.current.targetY = 0;
      }

      zoomRef.current.target = nextZoom;
    };
    window.addEventListener('wheel', handleWheel, { passive: false });

    let initialTouchDist = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialTouchDist > 0) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY        );
        const diff = (initialTouchDist - dist) * 1.8;
        const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomRef.current.target + diff));

        if (diff < 0) {
          const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          const targetPoint = getTargetUnderCursor(midX, midY);
          focusRef.current.targetX = targetPoint.x;
          focusRef.current.targetY = targetPoint.y;
        } else if (nextZoom >= BASE_ZOOM) {
          focusRef.current.targetX = 0;
        focusRef.current.targetY = 0;
        }

        zoomRef.current.target = nextZoom;
      }
    };
    const handleTouchEnd = () => {
      initialTouchDist = 0;
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      solar.updatePlanetLayout(width, height);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const delta = clock.getDelta();
      const currentSpeed = speedRef.current;
      const isWarp = warpingRef.current;
      const timeScale = (isWarp ? 4.5 : 1.0) * currentSpeed;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      zoomRef.current.current += (zoomRef.current.target - zoomRef.current.current) * 0.08;
      focusRef.current.x += (focusRef.current.targetX - focusRef.current.x) * 0.08;
      focusRef.current.y += (focusRef.current.targetY - focusRef.current.y) * 0.08;

      const zoomProgress = Math.max(
        0,
        Math.min(1, (BASE_ZOOM - zoomRef.current.current) / (BASE_ZOOM - MIN_ZOOM))
      );
      const focusWeight = Math.sin(zoomProgress * Math.PI * 0.5);

      const currentFocusX = focusRef.current.x * focusWeight;
      const currentFocusY = focusRef.current.y * focusWeight;

      const parallaxFactor = 1 - focusWeight * 0.75;

      camera.position.x = currentFocusX + mouseRef.current.x * 55 * parallaxFactor;
      camera.position.y = currentFocusY - mouseRef.current.y * 38 * parallaxFactor;
      camera.position.z = zoomRef.current.current;

      camera.lookAt(
        currentFocusX + mouseRef.current.x * 12 * (1 - focusWeight),
        currentFocusY - mouseRef.current.y * 8 * (1 - focusWeight),
        0
      );

      solar.sunMesh.rotation.y += 0.002 * timeScale;
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.035;
      solar.coronaSprite.scale.set(solar.sunRadius * 4.4 * pulse, solar.sunRadius * 4.4 * pulse, 1);

      solar.mercuryMesh.rotation.y += 0.004 * timeScale;
      solar.venusMesh.rotation.y -= 0.003 * timeScale;
      solar.earthMesh.rotation.y += 0.005 * timeScale;
      solar.marsMesh.rotation.y += 0.005 * timeScale;
    solar.jupiterMesh.rotation.y += 0.007 * timeScale;
      solar.saturnMesh.rotation.y += 0.004 * timeScale;
      solar.uranusMesh.rotation.y += 0.004 * timeScale;
      solar.neptuneMesh.rotation.y += 0.005 * timeScale;

      const mAngle = clock.getElapsedTime() * 0.45 * timeScale;
      solar.moonMesh.position.x = Math.cos(mAngle) * solar.moonOrbitRadius;
      solar.moonMesh.position.z = Math.sin(mAngle) * solar.moonOrbitRadius;
      solar.moonMesh.rotation.y += 0.004 * timeScale;

      solar.asteroids.forEach((ast) => {
        ast.mesh.rotation.x += ast.rotSpeedX * delta * timeScale;
        ast.mesh.rotation.y += ast.rotSpeedY * delta * timeScale;
        ast.mesh.rotation.z += ast.rotSpeedZ * delta * timeScale;

        ast.angle += ast.orbitSpeed * delta * timeScale * 0.2;
        ast.mesh.position.x = Math.cos(ast.angle) * ast.radius;
        ast.mesh.position.z = Math.sin(ast.angle) * ast.radius - 320;
      });

      solar.starField.rotation.y += 0.0002 * timeScale;
      solar.nebulaGroup.rotation.y += 0.0001 * timeScale;

      renderer.render(scene, camera);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('resize', handleResize);


      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();

      disposables.forEach((item) => {
        if ('dispose' in item && typeof item.dispose === 'function') {
          item.dispose();
        }
      });
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0  w-full  h-full  pointer-events-none z-0  overflow-hidden  select-none"
      style={{ touchAction: 'none' }}
    />
  );
};