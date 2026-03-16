import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";

const GLB_PATH = "/macintosh_classic_1991.glb";
useGLTF.preload(GLB_PATH);

function MacModel({ scale = 1 }: { scale?: number }) {
  const { scene } = useGLTF(GLB_PATH);
  return (
    <group scale={[scale, scale, scale]}>
      <primitive object={scene} />
    </group>
  );
}

function MacViewerContent({ desktop = false, mobile = false }: { desktop?: boolean; mobile?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <MacModel scale={desktop ? 1.8 : mobile ? 1.93 : 1} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.5}
        minDistance={desktop ? 2 : mobile ? 2.5 : 2}
        maxDistance={desktop ? 2 : mobile ? 2.5 : 6}
      />
      {!mobile && <AdaptiveDpr pixelated />}
      <AdaptiveEvents />
    </>
  );
}

export function MacViewer({ mobile = false, desktop = false }: { mobile?: boolean; desktop?: boolean }) {
  const cameraPos = desktop ? [0, 0.6, 2] : mobile ? [0, 0.8, 2.8] : [0, 1, 4];
  const fov = desktop ? 45 : mobile ? 50 : 45;

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
        dpr={mobile ? [1, 1] : [1, 1.5]}
        camera={{ position: cameraPos as [number, number, number], fov }}
        style={{ background: "transparent" }}
      >
        <MacViewerContent desktop={desktop} mobile={mobile} />
      </Canvas>
    </div>
  );
}

export function MacViewerSkeleton() {
  return (
    <div className="w-full aspect-square max-w-[320px] mx-auto flex flex-col items-center justify-center gap-3 bg-gray-50/50 rounded-2xl animate-pulse">
      <svg
        className="w-16 h-16 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <span className="text-sm text-gray-400 font-dm-sans">Loading...</span>
    </div>
  );
}
