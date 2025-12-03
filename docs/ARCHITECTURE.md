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

1. Presentation Layer: React components (UI, layout, status indicators)
2. Interaction Layer: Gesture detection and shared state updates
3. Simulation Layer: Particle system engine and shape generation
4. Rendering Layer: Three.js scene rendered via React Three Fiber

```
User Hand  ->  Camera  ->  MediaPipe Hands  ->  Shared State
                                            ->  React Three Fiber  ->  GPU (WebGL)
UI Events  ->  React Components  -----------^
```

## Core Modules

### 1. Next.js App Structure

- app/layout.tsx: Root layout and font configuration
- app/page.tsx: Routes to ParticlePage
- app/components/ParticlePage.tsx: Core interactive experience

The application uses the App Router with a single top-level route that hosts the entire experience.

### 2. ParticlePage Component

ParticlePage.tsx is the central module and includes:

- Configuration constants: Particle counts, camera resolution
- Type definitions: Strongly typed MediaPipe interfaces
- Shared state: Hand tracking data outside React
- Math utilities: Shape generation functions
- Particles component: Particle system engine
- HandController component: MediaPipe integration and gesture detection
- UI component: On-screen controls and status
- Main exported component: Layout and scene composition

## Data Flow

At runtime, data flows through the system in a continuous loop:

1. Camera Capture:
   - Browser captures video frames via getUserMedia
   - Video element in HandController receives the stream

2. Hand Tracking:
   - MediaPipe Hands processes each frame
   - Landmarks are computed for detected hands

3. Gesture Extraction:
   - Wrist position used for swipe detection
   - Thumb and index finger distance used for pinch detection
   - Horizontal hand position mapped to color hue

4. Shared State Update:
   - sharedState object updated with:
     - handDetected
     - pinchDistance
     - handX
     - handY

5. Particle Simulation:
   - React Three Fiber useFrame callback reads sharedState
   - Particle positions and colors updated each frame

6. Rendering:
   - Three.js scene rendered to WebGL canvas
   - Orbit controls and fog applied

This loop runs at the display frame rate, while MediaPipe runs at a lower but sufficient frequency.

## Hand Tracking Pipeline

The hand tracking pipeline is implemented in HandController.

### Initialization Steps

1. Script Loading:
   - MediaPipe Hands script is loaded dynamically from CDN

2. Camera Setup:
   - navigator.mediaDevices.getUserMedia called with:
     - Resolution: 640x480
     - facingMode: user

3. MediaPipe Hands Configuration:

```typescript
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
```

4. Results Callback:
   - hands.onResults registered to receive HandsResults

### Gesture Extraction

From each HandsResults instance:

- Landmark Access:
  - wrist = landmarks[0]
  - thumb = landmarks[4]
  - index = landmarks[8]

- Swipe Detection:
  - Delta X of wrist between frames
  - Threshold and cooldown logic

- Pinch Detection:
  - Euclidean distance between thumb and index
  - Normalized and clamped

- Position Smoothing:
  - First-order low-pass filter for handX and pinchDistance

The result is a small set of continuous control signals stored in sharedState.

## Particle System Engine

The particle system engine is implemented in the Particles component.

### Geometry Representation

- Uses THREE.Points with THREE.BufferGeometry
- Attributes:
  - position: Float32Array of length PARTICLE_COUNT \* 3
  - color: Float32Array of length PARTICLE_COUNT \* 3

### Initialization

1. Initial Positions:
   - Generated using generatePositions("sphere", PARTICLE_COUNT)

2. Target Positions:
   - Memoized based on current activeShape
   - Regenerated when shape changes

3. Color Buffer:
   - Pre-allocated Float32Array
   - Single THREE.Color instance reused per frame

### Simulation Loop

Executed on each frame via useFrame:

1. Read sharedState values
2. Compute expansion factor from pinchDistance
3. For each particle:
   - Target position = shape position \* expansion
   - Add procedural noise
   - Interpolate current position toward target
   - Compute color based on handX and particle index
4. Mark attributes as needing update
5. Apply slow rotation to the whole point cloud

This separates static shape definition from dynamic simulation state.

## Shape Generation Algorithms

The generatePositions function encapsulates all shape generation logic.

### Heart Shape

Parametric 2D heart curve extended to 3D:

- Base equations:
  - x = 16 \* sin(t) ^ 3
  - y = 13 _ cos(t) - 5 _ cos(2t) - 2 \* cos(3t) - cos(4t)
- Z dimension:
  - Random sinusoidal modulation based on parameter p
- Scaling and translation applied for visual framing

### Sphere Shape

Uniform distribution on sphere surface:

- Random angles:
  - theta in [0, 2 * pi]
  - phi = arccos(2u - 1), where u in [0, 1]
- Radius r constant
- Cartesian conversion for (x, y, z)

### Flower Shape

Rose-like 3D structure:

- Radial function:
  - r = 5 \* sin(2u)
- Additional randomization in polar coordinates
- Vertical modulation via angle v

### Spiral Shape

3D helix with radial expansion:

- Parameter t proportional to particle index
- Radius increases linearly with index
- Vertical position spans a fixed range

The shape generation is stateless and deterministic given random seeds at call time.

## State Management

The system uses a hybrid approach:

1. React State (inside components):
   - activeShape: Currently selected shape
   - UI-related flags (hand status display)

2. Shared Mutable State (outside React):

```typescript
const sharedState = {
  handDetected: false,
  pinchDistance: 1.0,
  handX: 0.5,
  handY: 0.5,
};
```

### Rationale for Shared State

- Low latency: Avoids React state update overhead in per-frame loops
- Independence: Decouples MediaPipe callback from React render cycle
- Simplicity: Single source of truth for gesture-derived signals

### Trade-offs

- Requires careful handling to avoid race conditions
- Not serializable by default
- Not suitable for complex application-wide state

In this architecture, the trade-offs are acceptable because:

- Only a small set of numeric values is shared
- Updates are monotonic and unidirectional
- There is no concurrent modification from multiple sources

## Rendering Pipeline

The rendering pipeline is orchestrated by React Three Fiber in ParticlePage:

1. Canvas Setup:
   - Camera positioned at [0, 0, 25]
   - Field of view: 60 degrees

2. Scene Composition:
   - Background color and fog
   - Particles component as main visual element
   - OrbitControls for user interaction

3. Suspense Boundary:
   - Wraps Particles to allow for lazy loading
   - Fallback text displayed while loading

4. Controls:
   - Zoom and pan disabled
   - Auto-rotation enabled for ambient motion

### WebGL Considerations

- Points material uses additive blending and transparency
- Depth writing disabled to avoid artifacts
- Color attribute used for per-particle coloring

## Performance Considerations

Key performance strategies:

1. Fixed Particle Count:
   - 8000 particles chosen as balance between quality and performance

2. Buffer Reuse:
   - Arrays allocated once and mutated in place
   - Avoids garbage collection pressure

3. Minimal Object Allocation:
   - Single THREE.Color instance reused every frame

4. Shared State:
   - Avoid frequent React state updates
   - Direct float operations in render loop

5. Conditional Updates:
   - Updates only geometry attributes that changed

6. MediaPipe Isolation:
   - Hand tracking handled in separate loop via requestAnimationFrame
   - Errors caught and ignored during cleanup

### Potential Bottlenecks

- Older GPUs may struggle with 8000 points and heavy blending
- MediaPipe processing can be CPU-intensive on low-end devices
- Dynamic lighting or post-processing would increase cost further

## Extensibility

The architecture is designed to be extensible in several axes:

### 1. New Shapes

- Add new case to ShapeType union
- Implement shape generation in generatePositions
- Add UI button and icon
- Update shape cycle array

### 2. New Gestures

- Extend HandController gesture extraction logic
- Add new fields to sharedState
- Consume new signals in Particles or UI

### 3. Multiple Scenes or Modes

- Wrap ParticlePage in higher-level router
- Introduce mode state
- Swap out different Particles implementations

### 4. Integration with External Systems

- Analytics: Track usage patterns with consent
- Remote control: Map external device input to sharedState

## Error Handling and Resilience

The system includes several resilience mechanisms:

1. MediaPipe Loading Errors:
   - Caught and logged to console
   - Application degrades gracefully

2. Camera Access Failures:
   - Errors thrown if getUserMedia unavailable
   - Hand tracking disabled, but particles still render

3. Cleanup on Unmount:
   - cancelAnimationFrame called
   - MediaStream tracks stopped
   - MediaPipe close method invoked with try-catch

4. Shared State Defaults:
   - Safe defaults ensure stable behavior even without hand input

## Security Considerations

Architectural security aspects:

- All processing is client-side
- No persistent storage of hand data
- Camera access controlled by browser
- MediaPipe loaded from trusted CDN
- Recommended use of HTTPS and security headers

Refer to SECURITY.md for full security policy.

## Future Architecture Improvements

Potential improvements for future versions:

1. Modularization:
   - Split ParticlePage.tsx into smaller modules:
     - hand-controller.ts
     - particle-engine.ts
     - shapes.ts
     - ui.tsx

2. Custom Hooks:
   - useHandTracking
   - useParticles
   - useGestures

3. State Management Library:
   - Use lightweight store for gesture state

4. Testing Strategy:
   - Unit tests for shape generation
   - Integration tests for gesture handling
   - Visual regression tests for particle rendering

5. Performance Profiling:
   - Use browser dev tools to profile frame time
   - Experiment with reduced particle counts on mobile

This architecture document provides a detailed mental model of how Neural Particles is built and where to extend or optimize it.
