"use client";

import { useEffect, useRef, useState, useMemo, Suspense, JSX } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import {
  Heart,
  Globe,
  Flower2,
  Command,
  Activity,
  ScanFace,
  Hand,
} from "lucide-react";

// ================== CONFIG & TYPES ==================

const PARTICLE_COUNT = 8000;
const PARTICLE_SIZE = 0.12;
const CAM_WIDTH = 640;
const CAM_HEIGHT = 480;

type ShapeType = "heart" | "sphere" | "flower" | "spiral";

// ---- MediaPipe Types (tanpa any) ----

interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
}

type NormalizedLandmarkList = NormalizedLandmark[];

interface HandsResults {
  multiHandLandmarks?: NormalizedLandmarkList[];
}

interface HandsOptions {
  maxNumHands?: number;
  modelComplexity?: number;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}

interface Hands {
  setOptions: (options: HandsOptions) => void;
  onResults: (callback: (results: HandsResults) => void) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void | Promise<void>;
}

declare global {
  interface Window {
    Hands: new (config: { locateFile: (file: string) => string }) => Hands;
  }
}

// ---- Shared mutable state (di luar React) ----

const sharedState = {
  handDetected: false,
  pinchDistance: 1.0, // 0 = closed, 1 = open
  handX: 0.5, // 0 (kiri) - 1 (kanan)
  handY: 0.5,
};

// ================== MATH UTILS ==================

const generatePositions = (type: ShapeType, count: number): Float32Array => {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = 0;
    let z = 0;
    const idx = i * 3;

    if (type === "heart") {
      const t = Math.random() * Math.PI * 2;
      const p = Math.random() * Math.PI * 2;
      x = 16 * Math.pow(Math.sin(t), 3);
      y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);
      z = 4 * Math.sin(p) * Math.sin(t);
      x *= 0.3;
      y *= 0.3;
      z *= 0.3;
      y += 1;
    } else if (type === "sphere") {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 6;
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.sin(phi) * Math.sin(theta);
      z = r * Math.cos(phi);
    } else if (type === "flower") {
      const u = Math.random() * Math.PI * 4;
      const v = Math.random() * Math.PI;
      const r = 5 * Math.sin(2 * u);
      x = r * Math.cos(u) * Math.sin(v);
      y = r * Math.sin(u) * Math.sin(v);
      z = 2 * Math.cos(v);
    } else if (type === "spiral") {
      const t = (i / count) * 20 * Math.PI;
      const r = (i / count) * 8;
      x = r * Math.cos(t);
      y = (i / count - 0.5) * 10;
      z = r * Math.sin(t);
    }

    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;
  }

  return positions;
};

// ================== PARTICLE SYSTEM ==================

const Particles = ({ activeShape }: { activeShape: ShapeType }) => {
  const pointsRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  // posisi awal
  const [currentPositions] = useState<Float32Array>(() =>
    generatePositions("sphere", PARTICLE_COUNT),
  );

  // posisi target tergantung bentuk
  const targetPositions = useMemo(
    () => generatePositions(activeShape, PARTICLE_COUNT),
    [activeShape],
  );

  // buffer warna
  const colorArray = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  // reusable color object (hindari new tiap frame)
  const colorObj = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !geometryRef.current) return;

    const positionAttr = geometryRef.current.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const colorAttr = geometryRef.current.getAttribute(
      "color",
    ) as THREE.BufferAttribute;

    const positions = positionAttr.array as Float32Array;
    const colors = colorAttr.array as Float32Array;

    const { pinchDistance, handX, handDetected } = sharedState;

    const lerpSpeed = 4.0 * delta;
    const baseHue = handX;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      let tx = targetPositions[idx];
      let ty = targetPositions[idx + 1];
      let tz = targetPositions[idx + 2];

      let expansion = 0.2 + pinchDistance * 0.8;
      if (pinchDistance > 0.95) {
        expansion = 1.0 + (pinchDistance - 0.95) * 5.0;
      }

      tx *= expansion;
      ty *= expansion;
      tz *= expansion;

      const noise = Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;

      positions[idx] += (tx - positions[idx] + noise) * lerpSpeed;
      positions[idx + 1] += (ty - positions[idx + 1] + noise) * lerpSpeed;
      positions[idx + 2] += (tz - positions[idx + 2] + noise) * lerpSpeed;

      const hueShift = (i / PARTICLE_COUNT) * 0.2;

      if (handDetected) {
        colorObj.setHSL((baseHue + hueShift) % 1, 0.8, 0.6);
      } else {
        colorObj.setHSL(0.6, 0.1, 0.2);
      }

      colors[idx] = colorObj.r;
      colors[idx + 1] = colorObj.g;
      colors[idx + 2] = colorObj.b;
    }

    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    pointsRef.current.rotation.y += 0.001;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={currentPositions}
          itemSize={3}
          args={[currentPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colorArray}
          itemSize={3}
          args={[colorArray, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={PARTICLE_SIZE}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
        opacity={0.8}
      />
    </points>
  );
};

// ================== HAND CONTROLLER (MEDIAPIPE) ==================

const HandController = ({
  onGesture,
}: {
  onGesture: (direction: "next" | "prev") => void;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const lastXRef = useRef<number | null>(null);
  const lastSwipeTimeRef = useRef<number>(0);
  const SWIPE_THRESHOLD = 0.06;
  const SWIPE_COOLDOWN = 800;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    let hands: Hands | null = null;
    let isRunning = true;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
          `script[src="${src}"]`,
        );
        if (existing) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.crossOrigin = "anonymous";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });
    };

    const setupCamera = async (): Promise<void> => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Browser API navigator.mediaDevices.getUserMedia not available",
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: CAM_WIDTH,
          height: CAM_HEIGHT,
          facingMode: "user",
        },
        audio: false,
      });

      videoElement.srcObject = stream;

      await new Promise<void>((resolve) => {
        videoElement.onloadedmetadata = () => {
          void videoElement.play();
          resolve();
        };
      });
    };

    const detectFrame = async (): Promise<void> => {
      if (!isRunning || !hands || !videoElement) return;

      try {
        if (videoElement.readyState >= 2) {
          await hands.send({ image: videoElement });
        }
      } catch {
        // ignore during cleanup
      }

      if (isRunning) {
        requestRef.current = requestAnimationFrame(() => {
          void detectFrame();
        });
      }
    };

    const init = async (): Promise<void> => {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
        );

        await setupCamera();

        const HandsConstructor = window.Hands;
        hands = new HandsConstructor({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: HandsResults) => {
          if (!isRunning) return;

          const landmarksList = results.multiHandLandmarks;
          if (landmarksList && landmarksList.length > 0) {
            sharedState.handDetected = true;
            const landmarks = landmarksList[0];

            const wrist = landmarks[0];
            const now = Date.now();
            const currentX = 1 - wrist.x;

            if (lastXRef.current !== null) {
              const deltaX = currentX - lastXRef.current;
              if (now - lastSwipeTimeRef.current > SWIPE_COOLDOWN) {
                if (deltaX > SWIPE_THRESHOLD) {
                  onGesture("next");
                  lastSwipeTimeRef.current = now;
                } else if (deltaX < -SWIPE_THRESHOLD) {
                  onGesture("prev");
                  lastSwipeTimeRef.current = now;
                }
              }
            }
            lastXRef.current = currentX;

            const thumb = landmarks[4];
            const index = landmarks[8];
            const dist = Math.sqrt(
              (thumb.x - index.x) * (thumb.x - index.x) +
                (thumb.y - index.y) * (thumb.y - index.y),
            );

            let dNorm = (dist - 0.02) * 7;
            dNorm = Math.max(0, Math.min(1.5, dNorm));
            sharedState.pinchDistance +=
              (dNorm - sharedState.pinchDistance) * 0.2;
            sharedState.handX += (currentX - sharedState.handX) * 0.1;
          } else {
            sharedState.handDetected = false;
            sharedState.pinchDistance +=
              (1.0 - sharedState.pinchDistance) * 0.05;
            lastXRef.current = null;
          }
        });

        setIsLoaded(true);
        void detectFrame();
      } catch (err) {
        console.error("Init failed:", err);
      }
    };

    void init();

    return () => {
      isRunning = false;

      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }

      if (videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      if (hands) {
        setTimeout(() => {
          try {
            hands?.close();
          } catch {
            // ignore
          }
        }, 100);
      }
    };
  }, [onGesture]);

  return (
    <>
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            color: "#00ffcc",
            fontFamily: "'Outfit', sans-serif",
            zIndex: 5,
            fontSize: "0.9rem",
            letterSpacing: "1px",
          }}
        >
          Initializing Vision Models...
        </div>
      )}
      <video ref={videoRef} style={{ display: "none" }} playsInline muted />
    </>
  );
};

// ================== UI COMPONENT ==================

const UI = ({
  activeShape,
  setShape,
}: {
  activeShape: ShapeType;
  setShape: (s: ShapeType) => void;
}) => {
  const [handStatus, setHandStatus] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sharedState.handDetected !== handStatus) {
        setHandStatus(sharedState.handDetected);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [handStatus]);

  const menuItems: Array<{
    id: ShapeType;
    label: string;
    icon: JSX.Element;
  }> = [
    { id: "heart", label: "Heart", icon: <Heart size={18} /> },
    { id: "sphere", label: "Sphere", icon: <Globe size={18} /> },
    { id: "flower", label: "Flower", icon: <Flower2 size={18} /> },
    { id: "spiral", label: "Spiral", icon: <Command size={18} /> },
  ];

  return (
    <>
      {/* TOP LEFT: HEADER & STATUS */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "rgba(5, 20, 25, 0.7)",
            backdropFilter: "blur(10px)",
            borderLeft: "4px solid #00f3ff",
            padding: "15px 25px",
            borderRadius: "0 12px 12px 0",
            boxShadow: "0 10px 30px -10px rgba(0, 243, 255, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "1.8rem",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "white",
              fontFamily: "'Outfit', sans-serif",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            Neural{" "}
            <span
              style={{
                color: "#00f3ff",
                fontWeight: 300,
              }}
            >
              Particles
            </span>
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: handStatus ? "#00f3ff" : "#ff4d4d",
              fontFamily: "'Outfit', sans-serif",
              marginTop: "5px",
              letterSpacing: "0.5px",
            }}
          >
            <Activity size={14} />
            <span>
              SYSTEM STATUS: {handStatus ? "HAND TRACKED" : "SEARCHING..."}
            </span>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: handStatus ? "#00f3ff" : "#ff4d4d",
                boxShadow: `0 0 10px ${handStatus ? "#00f3ff" : "#ff4d4d"}`,
                animation: "pulse 1.5s infinite",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(5px)",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#ccc",
            fontSize: "0.85rem",
            fontFamily: "'Outfit', sans-serif",
            maxWidth: "250px",
            lineHeight: "1.8",
            fontWeight: 300,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <ScanFace size={18} color="#00f3ff" strokeWidth={1.5} />
            <span>
              <b>Pinch</b> to Compress
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <Hand size={18} color="#00f3ff" strokeWidth={1.5} />
            <span>
              <b>Open Hand</b> to Explode
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Activity size={18} color="#00f3ff" strokeWidth={1.5} />
            <span>
              <b>Swipe</b> to Switch Shape
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM CENTER: DOCK MENU */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "flex",
          gap: "12px",
          background: "rgba(15, 15, 15, 0.6)",
          backdropFilter: "blur(16px)",
          padding: "10px 15px",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        {menuItems.map((item) => {
          const isActive = activeShape === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setShape(item.id)}
              style={{
                background: isActive
                  ? "linear-gradient(135deg, #00f3ff 0%, #0099ff 100%)"
                  : "transparent",
                color: isActive ? "#000" : "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: isActive ? 600 : 400,
                fontSize: "0.95rem",
                transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive
                  ? "0 8px 20px -5px rgba(0, 243, 255, 0.5)"
                  : "none",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* GLOBAL STYLES & FONT IMPORT */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap");

        body {
          font-family: "Outfit", sans-serif;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(0, 243, 255, 0.7);
          }
          70% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 10px rgba(0, 243, 255, 0);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(0, 243, 255, 0);
          }
        }
      `}</style>
    </>
  );
};

// ================== MAIN PAGE ==================

export default function ParticlePage() {
  const [activeShape, setActiveShape] = useState<ShapeType>("sphere");

  const SHAPES: ShapeType[] = ["heart", "sphere", "flower", "spiral"];

  const handleGesture = (direction: "next" | "prev") => {
    setActiveShape((current) => {
      const currentIndex = SHAPES.indexOf(current);
      let newIndex = 0;

      if (direction === "next") {
        newIndex = (currentIndex + 1) % SHAPES.length;
      } else {
        newIndex = (currentIndex - 1 + SHAPES.length) % SHAPES.length;
      }

      return SHAPES[newIndex];
    });
  };

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background: "#050505",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <UI activeShape={activeShape} setShape={setActiveShape} />
      <HandController onGesture={handleGesture} />
      <Canvas camera={{ position: [0, 0, 25], fov: 60 }}>
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 10, 60]} />
        <Suspense fallback={<Text color="white">Loading 3D...</Text>}>
          <Particles activeShape={activeShape} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </main>
  );
}
