import React, { Suspense, useEffect, useState, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const SIZES = {
  mobile:  { scale: 0.50, position: [0, -2.6, -2.0] },
  tablet:  { scale: 0.60, position: [0, -3.0, -1.5] },
  desktop: { scale: 0.65, position: [0, -3.5, -1.5] },
};

const Computers = memo(({ size }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");
  const { scale, position } = SIZES[size];

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={512}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={scale}
        position={position}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
});

Computers.displayName = "Computers";

const ComputersCanvas = () => {
  const [size, setSize] = useState("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 500) setSize("mobile");
      else if (w <= 850) setSize("tablet");
      else setSize("desktop");
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = size === "mobile";

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={isMobile ? 1 : [1, 1.5]}
      camera={{ position: [20, 3, 5], fov: size === "mobile" ? 30 : 25 }}
      gl={{
        preserveDrawingBuffer: false,
        antialias: !isMobile,
        powerPreference: "high-performance",
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          enablePan={false}
        />
        <Computers size={size} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
