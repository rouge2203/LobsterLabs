import { useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";

const GLB_PATH = "/woman_brain.glb";
useGLTF.preload(GLB_PATH);

/**
 * Loads the brain GLB and normalizes it: re-centers it at the origin and
 * scales it so its largest dimension is 1 unit. This makes framing independent
 * of whatever native scale/offset the model was exported with — `scale` then
 * controls the final on-screen size directly.
 */
function BrainModel({ scale = 1 }: { scale?: number }) {
  const { scene } = useGLTF(GLB_PATH);

  const { offset, fitScale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return {
      offset: [-center.x, -center.y, -center.z] as [number, number, number],
      fitScale: 1 / maxDim,
    };
  }, [scene]);

  const s = scale * fitScale;

  return (
    <group scale={[s, s, s]}>
      <primitive object={scene} position={offset} />
    </group>
  );
}

function BrainScene({
  desktop = false,
  mobile = false,
}: {
  desktop?: boolean;
  mobile?: boolean;
}) {
  return (
    <>
      {/* Low ambient keeps the void dark; the model is sculpted by accent lights */}
      <ambientLight intensity={0.35} />
      {/* Cool key light from the front-left */}
      <directionalLight position={[-4, 5, 6]} intensity={1.1} color="#cfe3ff" />
      {/* Deep maroon rim from the right — the brand glow on the silhouette */}
      <pointLight position={[5, 1, -2]} intensity={26} color="#c0392b" distance={14} />
      {/* Subtle electric fill from below-left for that neural duotone */}
      <pointLight position={[-5, -3, 3]} intensity={10} color="#3a6ff0" distance={14} />
      {/* Soft top bounce */}
      <directionalLight position={[0, 6, -4]} intensity={0.5} color="#ffffff" />

      <BrainModel scale={desktop ? 2.05 : mobile ? 1.9 : 1.8} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.9}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={desktop ? 3 : mobile ? 3.4 : 3.2}
        maxDistance={desktop ? 3 : mobile ? 3.4 : 6}
      />
      {!mobile && <AdaptiveDpr pixelated />}
      <AdaptiveEvents />
    </>
  );
}

export function MacViewer({
  mobile = false,
  desktop = false,
}: {
  mobile?: boolean;
  desktop?: boolean;
}) {
  const cameraPos: [number, number, number] = desktop
    ? [0, 0.2, 3]
    : mobile
      ? [0, 0.2, 3.4]
      : [0, 0.4, 3.2];
  const fov = desktop ? 42 : mobile ? 48 : 45;

  return (
    <div
      className={`relative isolate ${
        mobile
          ? "w-full h-full"
          : desktop
            ? "w-full h-full min-h-[400px]"
            : "aspect-square w-full max-w-[400px]"
      }`}
      style={mobile ? undefined : { contain: "layout" }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        camera={{ position: cameraPos, fov }}
        style={{ background: "transparent" }}
      >
        <BrainScene desktop={desktop} mobile={mobile} />
      </Canvas>
    </div>
  );
}

export function MacViewerSkeleton() {
  return (
    <div className="w-full aspect-square max-w-[340px] mx-auto flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-40 h-40 rounded-full noir-glow animate-noir-pulse" />
        <svg
          className="w-16 h-16 text-white/30 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.4}
            d="M9.5 3.5A3 3 0 0 0 7 8a3 3 0 0 0-1.5 5.5A3 3 0 0 0 8 19a2.5 2.5 0 0 0 4 .5 2.5 2.5 0 0 0 4-.5 3 3 0 0 0 2.5-5.5A3 3 0 0 0 17 8a3 3 0 0 0-2.5-4.5 2.5 2.5 0 0 0-5 0ZM12 4v15"
          />
        </svg>
      </div>
      <span className="text-[11px] text-white/40 font-mono uppercase tracking-[3px]">
        Initializing
      </span>
    </div>
  );
}
