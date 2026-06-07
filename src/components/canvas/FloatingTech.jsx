import React, { memo, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Preload } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";

/* ── Rotating mesh wrapper ─────────────────────────────── */
const RotatingMesh = memo(({ children, speed = 0.25, secondary = false }) => {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * speed * (secondary ? 0.7 : 0.5);
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.z += delta * speed * (secondary ? 0.4 : 0.2);
  });
  return <mesh ref={ref}>{children}</mesh>;
});
RotatingMesh.displayName = "RotatingMesh";

/* ── Main focal piece — Torus Knot (right side) ─────────── */
const MainShape = memo(() => (
  <Float speed={1.4} floatIntensity={1.0} rotationIntensity={0} position={[2.6, 0, -0.5]}>
    <RotatingMesh speed={0.22}>
      <torusKnotGeometry args={[1.15, 0.32, 160, 24]} />
      <meshStandardMaterial
        color="#7a4dd4"
        emissive="#4a1fa8"
        emissiveIntensity={0.55}
        roughness={0.15}
        metalness={0.65}
        wireframe={false}
      />
    </RotatingMesh>
  </Float>
));
MainShape.displayName = "MainShape";

/* ── Wireframe overlay on the same shape ────────────────── */
const MainWireframe = memo(() => (
  <Float speed={1.4} floatIntensity={1.0} rotationIntensity={0} position={[2.6, 0, -0.5]}>
    <RotatingMesh speed={0.22}>
      <torusKnotGeometry args={[1.15, 0.32, 160, 24]} />
      <meshBasicMaterial color="#b89eff" wireframe opacity={0.12} transparent />
    </RotatingMesh>
  </Float>
));
MainWireframe.displayName = "MainWireframe";

/* ── Icosahedron — upper left accent ────────────────────── */
const IcoShape = memo(() => (
  <Float speed={2.2} floatIntensity={1.4} rotationIntensity={0.5} position={[-2.4, 1.8, -2.5]}>
    <RotatingMesh speed={0.35} secondary>
      <icosahedronGeometry args={[0.75, 1]} />
      <meshStandardMaterial
        color="#8ec5ff"
        emissive="#2255bb"
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.7}
      />
    </RotatingMesh>
  </Float>
));
IcoShape.displayName = "IcoShape";

/* ── Octahedron — lower right accent ────────────────────── */
const OctaShape = memo(() => (
  <Float speed={1.8} floatIntensity={1.2} rotationIntensity={0.8} position={[4.2, -2, -1]}>
    <RotatingMesh speed={0.45} secondary>
      <octahedronGeometry args={[0.48]} />
      <meshBasicMaterial color="#c4b5fd" wireframe />
    </RotatingMesh>
  </Float>
));
OctaShape.displayName = "OctaShape";

/* ── Small glowing spheres ──────────────────────────────── */
const GlowSpheres = memo(() => (
  <>
    <Float speed={3.5} floatIntensity={2} rotationIntensity={0} position={[-0.8, -1.2, 0.5]}>
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#8ec5ff" emissive="#4488ff" emissiveIntensity={1.2} roughness={0} metalness={0} />
      </mesh>
    </Float>
    <Float speed={2.8} floatIntensity={1.8} rotationIntensity={0} position={[0.6, 2.0, -1.5]}>
      <mesh>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#c4b5fd" emissive="#915EFF" emissiveIntensity={1.4} roughness={0} metalness={0} />
      </mesh>
    </Float>
    <Float speed={4} floatIntensity={2.2} rotationIntensity={0} position={[1.8, 2.5, -2]}>
      <mesh>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial color="#8ec5ff" emissive="#3399ff" emissiveIntensity={1.6} roughness={0} metalness={0} />
      </mesh>
    </Float>
  </>
));
GlowSpheres.displayName = "GlowSpheres";

/* ── Particle field ─────────────────────────────────────── */
const ParticleField = memo(({ count = 700 }) => {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 8;
      const theta  = Math.random() * Math.PI * 2;
      const phi    = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.018;
      ref.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#8ec5ff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
});
ParticleField.displayName = "ParticleField";

/* ── Scene ──────────────────────────────────────────────── */
const Scene = memo(() => (
  <>
    {/* Lighting */}
    <ambientLight intensity={0.18} />
    <pointLight position={[6, 6, 4]}  intensity={3.5} color="#915EFF" />
    <pointLight position={[-6, -4, 2]} intensity={2.0} color="#8ec5ff" />
    <pointLight position={[0, 8, -4]}  intensity={1.0} color="#c4b5fd" />

    <ParticleField />
    <MainShape />
    <MainWireframe />
    <IcoShape />
    <OctaShape />
    <GlowSpheres />
  </>
));
Scene.displayName = "Scene";

/* ── Canvas export ──────────────────────────────────────── */
const FloatingTechCanvas = () => (
  <Canvas
    frameloop="always"
    dpr={[1, 1.5]}
    camera={{ position: [0, 0, 9], fov: 42 }}
    gl={{
      preserveDrawingBuffer: false,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    }}
    style={{ background: "transparent" }}
  >
    <Suspense fallback={<CanvasLoader />}>
      <Scene />
      <Preload all />
    </Suspense>
  </Canvas>
);

export default FloatingTechCanvas;
