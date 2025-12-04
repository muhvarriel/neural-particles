# Architecture Overview

Deep technical overview of the Neural Particles application architecture for advanced users and contributors.

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Core Modules](#core-modules)
- [Data Flow](#data-flow)
- [Hand Tracking Pipeline](#hand-tracking-pipeline)
- [Particle System Engine](#particle-system-engine)
- [Shape Generation Algorithms](#shape-generation-algorithms)
- [State Management](#state-management)
- [Rendering Pipeline](#rendering-pipeline)
- [Performance Considerations](#performance-considerations)
- [Extensibility](#extensibility)
- [Error Handling and Resilience](#error-handling-and-resilience)
- [Security Considerations](#security-considerations)
- [Future Architecture Improvements](#future-architecture-improvements)

## High-Level Architecture

Neural Particles is a purely client-side web application built on top of:

- Next.js App Router for application structure
- React 19 for UI composition
- React Three Fiber for declarative Three.js integration
- MediaPipe Hands for real-time hand tracking
- Shared mutable state for low-latency gesture-driven animation

From an architectural perspective, the system can be divided into four main layers:

1. **Presentation Layer**: React components (UI, layout, status indicators)
2. **Interaction Layer**: Gesture detection and shared state updates
3. **Simulation Layer**: Particle system engine and shape generation
4. **Rendering Layer**: Three.js scene rendered via React Three Fiber

### System Flow

```
User Hand  ->  Camera  ->  MediaPipe Hands  ->  Shared State
                                            ->  React Three Fiber  ->  GPU (WebGL)
UI Events  ->  React Components  -----------^
```

## Core Modules

### Module Structure

```
app/
├── components/
│   ├── hand-tracking/
│   │   └── HandController.tsx       # MediaPipe integration
│   ├── particles/
│   │   ├── ParticleCanvas.tsx       # Three.js canvas wrapper
│   │   └── ParticleSystem.tsx       # Particle engine
│   └── ui/
│       ├── GlobalStyles.tsx         # Global CSS
│       ├── Header.tsx               # Status display
│       ├── ShapeDock.tsx            # Shape selector
│       └── GestureInstructions.tsx  # Help panel
├── hooks/
│   └── useWindowSize.ts             # Responsive hook
├── lib/
│   ├── constants.ts                 # Configuration
│   ├── shapeGenerators.ts           # Math functions
│   └── sharedState.ts               # Global state
├── layout.tsx                       # Root layout
└── page.tsx                         # Entry point
```

### 1. Next.js App Structure

- **app/layout.tsx**: Root layout with font configuration and metadata
- **app/page.tsx**: Single route that renders ParticlePage
- **App Router**: Leverages Next.js 16.0 App Router architecture

The application uses a single top-level route that hosts the entire experience, optimized for client-side rendering with SSR support for initial HTML delivery.

### 2. Component Architecture

**ParticleCanvas.tsx** - Main container component:

- Three.js Canvas setup with responsive camera
- Scene composition with fog and lighting
- OrbitControls for manual interaction
- Suspense boundary for lazy loading

**ParticleSystem.tsx** - Core particle engine:

- BufferGeometry with 4000-8000 particles
- Real-time position and color updates
- Shape morphing with smooth interpolation
- Integration with shared state

**HandController.tsx** - Computer vision integration:

- MediaPipe Hands initialization and lifecycle
- Webcam stream management
- Hand landmark processing
- Gesture recognition and state updates

**Header.tsx** - Status display:

- Real-time hand tracking indicator
- Responsive design for mobile/desktop
- Gesture instructions panel
- Glassmorphism styling

**ShapeDock.tsx** - Shape selection UI:

- Four shape buttons with icons
- Active state visualization
- Responsive grid/flex layout
- Keyboard accessible

## Data Flow

At runtime, data flows through the system in a continuous loop:

### 1. Camera Capture

- Browser captures video frames via `getUserMedia`
- Video element in HandController receives the stream
- Resolution: 640x480 (desktop) or 480x360 (mobile)
- Frame rate: 30 FPS from camera

### 2. Hand Tracking

- MediaPipe Hands processes each frame asynchronously
- Hand landmarks computed for detected hands (21 points)
- Confidence scores evaluated against thresholds
- Results delivered via callback function

### 3. Gesture Extraction

HandController processes landmarks to extract:

- **Wrist position** (landmark 0): Swipe detection
- **Thumb tip** (landmark 4): Pinch calculation
- **Index finger tip** (landmark 8): Pinch calculation
- **Horizontal position**: Color hue mapping

### 4. Shared State Update

Global state object updated with:

```typescript
sharedState.handDetected = true / false;
sharedState.pinchDistance = 0.0 - 1.5;
sharedState.handX = 0.0 - 1.0;
```

### 5. Particle Simulation

- React Three Fiber `useFrame` callback reads sharedState
- Particle positions interpolated toward target shape
- Colors calculated based on hand position
- Expansion applied based on pinch distance

### 6. Rendering

- Three.js scene rendered to WebGL canvas at display frame rate
- Additive blending for glow effects
- OrbitControls for user camera manipulation
- Post-processing with fog

This loop runs at the display refresh rate (typically 60 FPS), while MediaPipe runs at a lower but sufficient frequency (~30 FPS).

## Hand Tracking Pipeline

The hand tracking pipeline is implemented in **HandController.tsx**.

### Initialization Steps

1. **Script Loading**

```typescript
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
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
```

2. **Camera Setup**

```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: config.cameraWidth,
    height: config.cameraHeight,
    facingMode: "user",
  },
  audio: false,
});
videoElement.srcObject = stream;
```

3. **MediaPipe Hands Configuration**

```typescript
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1, // 0=lite, 1=full
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
```

4. **Results Callback**

```typescript
hands.onResults((results: HandsResults) => {
  processResults(results, isRunning.current);
});
```

### Gesture Extraction Algorithm

From each `HandsResults` instance:

**Landmark Access**:

```typescript
const wrist = landmarks[0];
const thumb = landmarks[4];
const index = landmarks[8];
```

**Pinch Detection**:

```typescript
const distance = calculateDistance(thumb, index);
const normalized = (distance - PINCH_MIN_DISTANCE) * PINCH_SCALE_FACTOR;
const pinchDistance = Math.max(0, Math.min(PINCH_MAX_VALUE, normalized));
```

**Swipe Detection**:

```typescript
const currentX = 1 - wrist.x; // Invert for natural movement
const deltaX = currentX - lastXRef.current;
const timeSinceLastSwipe = now - lastSwipeTimeRef.current;

if (timeSinceLastSwipe > SWIPE_COOLDOWN) {
  if (deltaX > SWIPE_THRESHOLD) {
    onGesture("next");
    lastSwipeTimeRef.current = now;
  } else if (deltaX < -SWIPE_THRESHOLD) {
    onGesture("prev");
    lastSwipeTimeRef.current = now;
  }
}
```

**Position Smoothing**:

```typescript
// First-order low-pass filter
sharedState.pinchDistance +=
  (normalizedDistance - sharedState.pinchDistance) * PINCH_LERP_ACTIVE;
sharedState.handX += (currentX - sharedState.handX) * HAND_X_LERP;
```

The result is a small set of continuous control signals stored in sharedState with minimal latency.

## Particle System Engine

The particle system engine is implemented in **ParticleSystem.tsx**.

### Geometry Representation

Uses `THREE.Points` with `THREE.BufferGeometry`:

**Attributes**:

- **position**: Float32Array of length `PARTICLE_COUNT * 3`
- **color**: Float32Array of length `PARTICLE_COUNT * 3`

**Material**:

```typescript
<pointsMaterial
  size={config.particleSize}
  vertexColors
  blending={THREE.AdditiveBlending}
  depthWrite={false}
  transparent
  opacity={0.8}
  sizeAttenuation
/>
```

### Initialization

1. **Initial Positions**:

```typescript
const [currentPositions] = useState<Float32Array>(() =>
  generatePositions(initialShape, config.particleCount),
);
```

2. **Target Positions** (memoized):

```typescript
const targetPositions = useMemo(
  () => generatePositions(activeShape, config.particleCount),
  [activeShape, config.particleCount],
);
```

3. **Color Buffer**:

```typescript
const colorArray = useMemo(
  () => new Float32Array(config.particleCount * 3),
  [config.particleCount],
);
const colorObj = useMemo(() => new THREE.Color(), []);
```

### Simulation Loop

Executed on each frame via `useFrame`:

```typescript
useFrame((state, delta) => {
  if (!pointsRef.current || !geometryRef.current) return;

  const positionAttr = geometryRef.current.getAttribute("position");
  const colorAttr = geometryRef.current.getAttribute("color");
  const positions = positionAttr.array as Float32Array;
  const colors = colorAttr.array as Float32Array;

  const { pinchDistance, handX, handDetected } = sharedState;
  const lerpSpeed = windowSize.isMobile
    ? LERP_SPEED_MOBILE * delta
    : LERP_SPEED_DESKTOP * delta;

  const baseHue = handX;
  const expansion = calculateExpansion(pinchDistance);

  for (let i = 0; i < config.particleCount; i++) {
    const idx = i * 3;

    // Get target position with expansion
    const tx = targetPositions[idx] * expansion;
    const ty = targetPositions[idx + 1] * expansion;
    const tz = targetPositions[idx + 2] * expansion;

    // Add procedural noise
    const noise =
      Math.sin(state.clock.elapsedTime * NOISE_FREQUENCY + i) * NOISE_AMPLITUDE;

    // Smooth lerp to target
    positions[idx] += (tx - positions[idx] + noise) * lerpSpeed;
    positions[idx + 1] += (ty - positions[idx + 1] + noise) * lerpSpeed;
    positions[idx + 2] += (tz - positions[idx + 2] + noise) * lerpSpeed;

    // Calculate color
    const hueShift = (i / config.particleCount) * HUE_SHIFT_RANGE;
    calculateParticleColor(handDetected, baseHue, hueShift, colorObj);

    colors[idx] = colorObj.r;
    colors[idx + 1] = colorObj.g;
    colors[idx + 2] = colorObj.b;
  }

  positionAttr.needsUpdate = true;
  colorAttr.needsUpdate = true;

  // Auto-rotation
  pointsRef.current.rotation.y += windowSize.isMobile
    ? ROTATION_SPEED_MOBILE
    : ROTATION_SPEED_DESKTOP;
});
```

This architecture separates static shape definition from dynamic simulation state for maximum performance.

## Shape Generation Algorithms

The `generatePositions` function in **shapeGenerators.ts** encapsulates all shape generation logic.

### Heart Shape

Parametric 2D heart curve extended to 3D:

**Equations**:

```typescript
const t = Math.random() * Math.PI * 2;
const p = Math.random() * Math.PI * 2;
x = 16 * Math.pow(Math.sin(t), 3);
y =
  13 * Math.cos(t) -
  5 * Math.cos(2 * t) -
  2 * Math.cos(3 * t) -
  Math.cos(4 * t);
z = 4 * Math.sin(p) * Math.sin(t);

// Scale for visual framing
x *= 0.3;
y *= 0.3;
z *= 0.3;
y += 1; // Translate up
```

### Sphere Shape

Uniform distribution on sphere surface:

**Equations**:

```typescript
const theta = Math.random() * Math.PI * 2;
const phi = Math.acos(2 * Math.random() - 1);
const r = 6;

x = r * Math.sin(phi) * Math.cos(theta);
y = r * Math.sin(phi) * Math.sin(theta);
z = r * Math.cos(phi);
```

### Flower Shape

Rose-like 3D structure:

**Equations**:

```typescript
const u = Math.random() * Math.PI * 4;
const v = Math.random() * Math.PI;
const r = 5 * Math.sin(2 * u);

x = r * Math.cos(u) * Math.sin(v);
y = r * Math.sin(u) * Math.sin(v);
z = 2 * Math.cos(v);
```

### Spiral Shape

3D helix with radial expansion:

**Equations**:

```typescript
const t = (i / count) * 20 * Math.PI;
const r = (i / count) * 8;

x = r * Math.cos(t);
y = (i / count - 0.5) * 10;
z = r * Math.sin(t);
```

The shape generation is stateless and deterministic, producing consistent formations across renders.

## State Management

The system uses a hybrid approach for optimal performance:

### 1. React State (Component-Local)

```typescript
const [activeShape, setActiveShape] = useState<ShapeType>("sphere");
const [handDetected, setHandDetected] = useState<boolean>(false);
```

**Used for**:

- UI rendering and updates
- Shape selection
- Component-specific flags

### 2. Shared Mutable State (Global)

```typescript
// app/lib/sharedState.ts
export const sharedState = {
  handDetected: false,
  pinchDistance: 1.0,
  handX: 0.5,
};
```

**Used for**:

- Low-latency gesture signals
- Frame-by-frame particle updates
- MediaPipe to ParticleSystem communication

### Rationale for Shared State

**Benefits**:

- Low latency: Avoids React state update overhead in animation loops
- Independence: Decouples MediaPipe callback from React render cycle
- Simplicity: Single source of truth for gesture-derived signals
- Performance: Direct float operations without serialization

**Trade-offs**:

- Requires careful handling to avoid race conditions
- Not serializable by React DevTools
- Not suitable for complex application-wide state
- Manual synchronization needed

In this architecture, the trade-offs are acceptable because:

- Only a small set of numeric values is shared
- Updates are monotonic and unidirectional
- No concurrent modification from multiple sources
- Performance is critical for 60 FPS rendering

## Rendering Pipeline

The rendering pipeline is orchestrated by React Three Fiber in **ParticleCanvas.tsx**:

### 1. Canvas Setup

```typescript
<Canvas
  camera={{ position: [0, 0, 25], fov: 60 }}
  style={{ width: '100vw', height: '100vh' }}
>
```

### 2. Scene Composition

```typescript
<fog attach="fog" args={['#000814', 10, 50]} />
<ambientLight intensity={0.5} />
<ParticleSystem activeShape={activeShape} initialShape="sphere" />
<OrbitControls
  enableZoom={false}
  enablePan={false}
  autoRotate={false}
/>
```

### 3. Suspense Boundary

```typescript
<Suspense fallback={<LoadingText />}>
  <ParticleSystem activeShape={activeShape} />
</Suspense>
```

### WebGL Rendering

**PointsMaterial configuration**:

- Additive blending for glow effects
- Vertex colors for per-particle coloring
- Depth write disabled to avoid sorting artifacts
- Size attenuation for perspective
- Transparency with 0.8 opacity

**Performance characteristics**:

- Single draw call for all particles
- Point primitive rendering (fastest)
- GPU-accelerated blending
- Minimal CPU overhead after initial setup

## Performance Considerations

Key performance strategies implemented:

### 1. Fixed Particle Count

**Responsive allocation**:

```typescript
const PARTICLE_COUNT = {
  MOBILE: 4000,
  TABLET: 6000,
  DESKTOP: 8000,
};
```

Chosen as balance between visual quality and frame rate across devices.

### 2. Buffer Reuse

```typescript
// Allocated once, mutated in place
const currentPositions = new Float32Array(count * 3);
const colorArray = new Float32Array(count * 3);
```

Avoids garbage collection pressure by reusing arrays.

### 3. Minimal Object Allocation

```typescript
// Single instance reused every frame
const colorObj = useMemo(() => new THREE.Color(), []);

// Reused in loop
colorObj.setHSL(hue, saturation, lightness);
colors[idx] = colorObj.r;
```

Prevents per-particle object creation (8000 objects per frame avoided).

### 4. Shared State

```typescript
// Direct access without React overhead
const { pinchDistance, handX, handDetected } = sharedState;
```

Eliminates React state update latency in render loop.

### 5. Conditional Updates

```typescript
positionAttr.needsUpdate = true; // Only when changed
colorAttr.needsUpdate = true;
```

GPU uploads only when necessary.

### 6. MediaPipe Isolation

```typescript
const detectFrame = async () => {
  if (!running.current) return;
  try {
    if (video.readyState >= 2) {
      await hands.send({ image: video });
    }
  } catch (error) {
    // Ignore errors during cleanup
  }
  if (running.current) {
    requestRef.current = requestAnimationFrame(() => detectFrame());
  }
};
```

Hand tracking runs in separate loop with error handling.

### Potential Bottlenecks

**GPU**:

- Older GPUs may struggle with 8000 points and additive blending
- Mobile GPUs have lower fill rate
- Overdraw from additive blending is expensive

**CPU**:

- MediaPipe processing is CPU-intensive (offloaded to Web Workers internally)
- Particle position updates in JS (could be moved to vertex shader)

**Memory**:

- BufferGeometry allocations (~300KB for 8000 particles)
- MediaPipe model loading (~10MB)
- Video stream buffering

### Optimization Opportunities

1. **Vertex Shader Animation**: Move particle lerp to GPU
2. **Instancing**: Use THREE.InstancedMesh for better performance
3. **Level of Detail**: Reduce particle count based on distance
4. **Web Workers**: Offload shape generation to background thread
5. **WASM**: Compile critical paths to WebAssembly

## Extensibility

The architecture is designed to be extensible in several dimensions:

### 1. New Shapes

**Steps to add**:

1. Add new type to `ShapeType` union in constants.ts
2. Implement generation function in shapeGenerators.ts:

```typescript
case 'torus':
  {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    const R = 6;
    const r = 2;
    x = (R + r * Math.cos(v)) * Math.cos(u);
    y = (R + r * Math.cos(v)) * Math.sin(u);
    z = r * Math.sin(v);
  }
  break;
```

3. Add UI button in ShapeDock.tsx
4. Add icon from lucide-react

### 2. New Gestures

**Steps to add**:

1. Extend gesture detection in HandController.tsx:

```typescript
// Detect closed fist
const fingersClosed =
  landmarks[8].y > landmarks[5].y && landmarks[12].y > landmarks[9].y;
```

2. Add field to sharedState:

```typescript
export const sharedState = {
  // ... existing
  fistClosed: false,
};
```

3. Consume in ParticleSystem.tsx:

```typescript
if (sharedState.fistClosed) {
  // Trigger special effect
}
```

### 3. Multiple Scenes or Modes

**Architecture**:

```typescript
// app/page.tsx
const [mode, setMode] = useState<'particles' | 'waves'>('particles');

return (
  <>
    {mode === 'particles' && <ParticlePage />}
    {mode === 'waves' && <WavePage />}
    <ModeSelector onChange={setMode} />
  </>
);
```

### 4. Plugin System

**Proposed architecture**:

```typescript
interface ParticleEffect {
  name: string;
  apply: (particle: Particle, time: number) => void;
}

const effects: ParticleEffect[] = [];

effects.forEach((effect) => {
  effect.apply(particle, time);
});
```

### 5. External Integration

**Analytics**:

```typescript
useEffect(() => {
  if (handDetected) {
    analytics.track("hand_detected");
  }
}, [handDetected]);
```

**Remote Control**:

```typescript
webSocket.on("gesture", (gesture) => {
  sharedState.pinchDistance = gesture.pinch;
  sharedState.handX = gesture.x;
});
```

## Error Handling and Resilience

The system includes several resilience mechanisms:

### 1. MediaPipe Loading Errors

```typescript
try {
  await loadScript(MEDIAPIPE_CDN.HANDS_JS);
} catch (error) {
  console.error("MediaPipe load failed:", error);
  if (onError) onError(error as Error);
}
```

Application degrades gracefully - particles render without hand tracking.

### 2. Camera Access Failures

```typescript
if (!navigator.mediaDevices?.getUserMedia) {
  throw new Error("getUserMedia not available");
}

const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    /* config */
  },
});
```

Clear error messages guide user to grant permissions.

### 3. Cleanup on Unmount

```typescript
return () => {
  isRunning.current = false;

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
        // Ignore cleanup errors
      }
    }, 100);
  }
};
```

Prevents memory leaks and resource contention.

### 4. Shared State Defaults

```typescript
export const sharedState = {
  handDetected: false,
  pinchDistance: 1.0, // Safe default
  handX: 0.5, // Centered
};
```

Safe defaults ensure stable behavior without hand input.

### 5. Hydration Error Handling

```typescript
const hydrated = useHydrated();  // useSyncExternalStore

if (!hydrated) {
  return <SSRPlaceholder />;
}
```

Prevents hydration mismatches with client-only features.

## Security Considerations

Architectural security aspects:

### 1. Client-Side Processing

- All processing occurs in browser
- No data transmitted to servers
- Camera frames processed locally via MediaPipe
- No persistent storage of hand data

### 2. Camera Access

- Controlled by browser permissions API
- User must explicitly grant access
- Access revocable at any time
- Stream stopped on component unmount

### 3. MediaPipe CDN

```typescript
export const MEDIAPIPE_CDN = {
  BASE_URL: "https://cdn.jsdelivr.net/npm/@mediapipe/hands/",
  HANDS_JS: "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
};
```

Loaded from trusted CDN with SRI (Subresource Integrity) recommended.

### 4. Content Security Policy

Recommended headers:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  worker-src 'self' blob:;
  connect-src 'self';
  img-src 'self' data:;
```

### 5. Permissions Policy

```
Permissions-Policy: camera=(self)
```

Restricts camera access to same-origin only.

Refer to [SECURITY.md](../SECURITY.md) for full security policy.

## Future Architecture Improvements

Potential improvements for future versions:

### 1. Modularization

Split monolithic components into focused modules:

```
app/
├── features/
│   ├── hand-tracking/
│   │   ├── useHandTracking.ts
│   │   ├── HandController.tsx
│   │   └── gestures.ts
│   ├── particles/
│   │   ├── useParticles.ts
│   │   ├── ParticleEngine.ts
│   │   └── shapes/
│   │       ├── heart.ts
│   │       ├── sphere.ts
│   │       └── index.ts
│   └── ui/
│       ├── Header.tsx
│       └── ShapeDock.tsx
```

### 2. Custom Hooks

```typescript
// useHandTracking.ts
export const useHandTracking = (config: HandTrackingConfig) => {
  const [hands, setHands] = useState<HandsResults | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize MediaPipe
  }, [config]);

  return { hands, error };
};

// useParticles.ts
export const useParticles = (shape: ShapeType, gestures: GestureState) => {
  const positions = useMemo(() => generatePositions(shape), [shape]);
  const ref = useRef<THREE.Points>(null);

  useFrame(() => {
    // Update particles
  });

  return ref;
};
```

### 3. State Management Library

```typescript
// store/particles.ts
import create from "zustand";

interface ParticleStore {
  activeShape: ShapeType;
  handDetected: boolean;
  pinchDistance: number;
  setShape: (shape: ShapeType) => void;
}

export const useParticleStore = create<ParticleStore>((set) => ({
  activeShape: "sphere",
  handDetected: false,
  pinchDistance: 1.0,
  setShape: (shape) => set({ activeShape: shape }),
}));
```

### 4. Testing Strategy

```typescript
// __tests__/shapes.test.ts
import { generatePositions } from "@/app/lib/shapeGenerators";

describe("Shape Generation", () => {
  it("generates correct number of particles", () => {
    const positions = generatePositions("sphere", 100);
    expect(positions.length).toBe(300); // 100 * 3
  });

  it("keeps particles within sphere bounds", () => {
    const positions = generatePositions("sphere", 1000);
    for (let i = 0; i < 1000; i++) {
      const idx = i * 3;
      const x = positions[idx];
      const y = positions[idx + 1];
      const z = positions[idx + 2];
      const distance = Math.sqrt(x * x + y * y + z * z);
      expect(distance).toBeLessThanOrEqual(6.1); // radius + tolerance
    }
  });
});
```

### 5. Performance Profiling

```typescript
// utils/profiler.ts
export class FrameProfiler {
  private frameTimes: number[] = [];

  start() {
    this.startTime = performance.now();
  }

  end() {
    const duration = performance.now() - this.startTime;
    this.frameTimes.push(duration);

    if (this.frameTimes.length > 60) {
      const avg =
        this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length;
      console.log(`Avg frame time: ${avg.toFixed(2)}ms`);
      this.frameTimes = [];
    }
  }
}
```

### 6. WebGL Shader Optimization

Move particle animation to vertex shader:

```glsl
// vertex shader
uniform float time;
uniform vec3 targetPositions[8000];
attribute float particleIndex;

void main() {
  vec3 target = targetPositions[int(particleIndex)];
  vec3 current = position;

  // Lerp on GPU
  vec3 newPosition = mix(current, target, 0.1);

  // Noise
  float noise = sin(time * 2.0 + particleIndex) * 0.05;
  newPosition += noise;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  gl_PointSize = 3.0;
}
```

This would eliminate JavaScript position updates entirely.

### 7. Progressive Web App

```json
// manifest.json
{
  "name": "Neural Particles",
  "short_name": "NeuralPx",
  "start_url": "/",
  "display": "fullscreen",
  "background_color": "#000814",
  "theme_color": "#00f3ff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

Enable installation and offline capability.

---

This architecture document provides a comprehensive mental model of how Neural Particles is built, and serves as a guide for contributors looking to understand, extend, or optimize the system.

For hands-on development, refer to:

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [README.md](../README.md) - Project overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
