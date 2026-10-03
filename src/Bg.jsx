import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function generateAirwayAndLungPoints(isMobile) {
  const airwayPoints = [];
  const lungPoints = [];

  const tracheaCount = isMobile ? 120 : 250;
  for (let i = 0; i < tracheaCount; i++) {
    const t = Math.random();
    const y = 0.9 + t * 1.5;
    const r = 0.07 + Math.random() * 0.03;
    const theta = Math.random() * Math.PI * 2;
    airwayPoints.push(r * Math.cos(theta), y, r * Math.sin(theta));
  }

  const branches = [
    { start: [0, 0.9, 0], dir: [1.1, -0.45, 0.15], len: 1.1, count: isMobile ? 80 : 160 },
    { start: [0.9, 0.45, 0.1], dir: [0.75, 0.75, -0.2], len: 0.9, count: isMobile ? 70 : 130 },
    { start: [0.9, 0.45, 0.1], dir: [1.0, -0.25, 0.25], len: 1.0, count: isMobile ? 70 : 130 },
    { start: [0.9, 0.45, 0.1], dir: [0.85, -1.1, -0.1], len: 1.2, count: isMobile ? 90 : 180 },
    { start: [0, 0.9, 0], dir: [-1.2, -0.4, 0.1], len: 1.2, count: isMobile ? 80 : 160 },
    { start: [-1.0, 0.5, 0.1], dir: [-0.85, 0.75, -0.18], len: 1.0, count: isMobile ? 70 : 140 },
    { start: [-1.0, 0.5, 0.1], dir: [-0.95, -1.05, 0.12], len: 1.3, count: isMobile ? 90 : 180 },
  ];

  branches.forEach((b) => {
    for (let i = 0; i < b.count; i++) {
      const t = Math.random();
      const spread = (Math.random() - 0.5) * 0.22 * (1 + t * 1.2);
      const px = b.start[0] + b.dir[0] * t + spread;
      const py = b.start[1] + b.dir[1] * t + (Math.random() - 0.5) * 0.16;
      const pz = b.start[2] + b.dir[2] * t + (Math.random() - 0.5) * 0.22;
      airwayPoints.push(px, py, pz);
    }
  });

  const parenchymaCount = isMobile ? 350 : 850;
  for (let i = 0; i < parenchymaCount; i++) {
    const side = Math.random() > 0.48 ? 1 : -1;
    const u = Math.random();
    const v = Math.random() * Math.PI * 2;
    const w = (Math.random() - 0.5) * 2;
    const rad = Math.cbrt(u);

    const cardiacIndent = side < 0 && Math.cos(v) > -0.2 && Math.sin(v) < 0.2 ? 0.35 : 0;
    const px = side * (1.65 + rad * 1.05 * Math.cos(v)) + (side < 0 ? -cardiacIndent : 0);
    const py = 0.2 + rad * 1.65 * Math.sin(v);
    const pz = rad * 0.9 * w;

    lungPoints.push(px, py, pz);
  }

  const ambientCount = isMobile ? 80 : 200;
  const ambientPoints = [];
  for (let i = 0; i < ambientCount; i++) {
    ambientPoints.push(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 8
    );
  }

  return {
    airwayPos: Float32Array.from(airwayPoints),
    lungPos: Float32Array.from(lungPoints),
    ambientPos: Float32Array.from(ambientPoints),
  };
}

function BreathingLungs({ dark }) {
  const groupRef = useRef();
  const airwayRef = useRef();
  const lungRef = useRef();
  const ambientRef = useRef();

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const { airwayPos, lungPos, ambientPos } = useMemo(() => generateAirwayAndLungPoints(isMobile), [isMobile]);

  useFrame(({ pointer, clock }) => {
    const time = clock.elapsedTime;
    const g = groupRef.current;
    if (!g) return;

    g.rotation.y += (pointer.x * 0.45 - g.rotation.y) * 0.04;
    g.rotation.x += (-pointer.y * 0.3 - g.rotation.x) * 0.04;

    const breath = Math.sin(time * 1.4);
    const scaleX = 1 + breath * 0.045;
    const scaleY = 1 + breath * 0.025;
    const scaleZ = 1 + breath * 0.055;

    if (lungRef.current) {
      lungRef.current.scale.set(scaleX, scaleY, scaleZ);
    }
    if (airwayRef.current) {
      airwayRef.current.scale.set(1 + breath * 0.02, 1 + breath * 0.015, 1 + breath * 0.02);
    }
    if (ambientRef.current) {
      ambientRef.current.rotation.y = time * 0.02;
    }

    g.position.z = Math.sin(time * 0.6) * 0.2;
  });

  const airwayColor = dark ? '#60a5fa' : '#0f766e';
  const lungColor = dark ? '#38bdf8' : '#2dd4bf';
  const ambientColor = dark ? '#1e40af' : '#99f6e4';

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Airway Tree Points (denser, crisp) */}
      <points ref={airwayRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[airwayPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.065 : 0.05}
          color={airwayColor}
          transparent
          opacity={dark ? 0.85 : 0.75}
          sizeAttenuation
        />
      </points>

      {/* Pulmonary Parenchyma Points (softer, tidal breathing) */}
      <points ref={lungRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lungPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.075 : 0.06}
          color={lungColor}
          transparent
          opacity={dark ? 0.55 : 0.45}
          sizeAttenuation
        />
      </points>

      {/* Floating ambient particles */}
      <points ref={ambientRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ambientPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color={ambientColor}
          transparent
          opacity={dark ? 0.35 : 0.25}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default function Bg({ dark }) {
  return (
    <div className="bg" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.4, 5.8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'low-power', antialias: false }}
      >
        <BreathingLungs dark={dark} />
      </Canvas>
    </div>
  );
}
