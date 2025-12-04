# Neural Particles

An interactive 3D particle system controlled by hand gestures using MediaPipe and Three.js. Experience real-time particle manipulation through intuitive hand movements detected by your webcam.

![Status](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![Three.js](https://img.shields.io/badge/Three.js-0.181-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Gesture Controls](#gesture-controls)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Browser Compatibility](#browser-compatibility)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

### Core Functionality

- Real-time hand tracking using MediaPipe Hands API
- 4000-8000 responsive particles with smooth animations
- 4 unique 3D particle formations: Heart, Sphere, Flower, Spiral
- Intuitive gesture controls: pinch, swipe, and hand positioning
- Dynamic color system based on hand movement
- Additive blending for glowing particle effects

### User Experience

- Responsive design for desktop and mobile devices
- Modern glassmorphism UI with neon accents
- Auto-rotation and manual orbit controls
- Real-time hand tracking status indicator
- Gesture instructions panel
- Smooth shape morphing transitions

### Technical Highlights

- TypeScript for type-safe development
- Optimized WebGL rendering pipeline
- Client-side hydration for SSR compatibility
- Modular component architecture
- Custom React hooks for window responsiveness
- Efficient buffer attribute updates

## Demo

Live deployment coming soon. Deploy this project to Vercel or Netlify to see it in action.

### Key Interactions

1. **Pinch Gesture**: Compress particles by bringing thumb and index finger together
2. **Open Hand**: Expand particles outward for explosive effect
3. **Hand Movement**: Change particle colors by moving hand horizontally
4. **Swipe Gestures**: Navigate between different particle formations

## Technology Stack

### Frontend Framework

- **Next.js 16.0.7** - React framework with App Router and Turbopack
- **React 19.0.0-rc** - UI library with concurrent features
- **TypeScript 5.0** - Static type checking

### 3D Graphics

- **Three.js 0.181.0** - WebGL 3D library
- **React Three Fiber 9.4.1** - React renderer for Three.js
- **React Three Drei 10.7.2** - Utility helpers for R3F

### Computer Vision

- **MediaPipe Hands** - Google's hand tracking solution
- **WebRTC getUserMedia API** - Camera access

### Styling

- **Tailwind CSS 4.0.0-beta.7** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Custom CSS** - Glassmorphism effects and animations

### Icons & UI

- **Lucide React 0.468.0** - Modern icon library

### Development Tools

- **ESLint 9.x** - Linting with @eslint/plugin-react
- **TypeScript ESLint** - TypeScript-specific linting rules

## Architecture

### Component Hierarchy

```
App
├── Layout (Root)
│   └── ParticlePage (Main Container)
│       ├── GlobalStyles (CSS-in-JS)
│       ├── Header (Status Display)
│       │   └── GestureInstructions
│       ├── ParticleCanvas (Three.js Scene)
│       │   └── ParticleSystem (3D Particles)
│       ├── HandController (MediaPipe Integration)
│       └── ShapeDock (Shape Selection Menu)
```

### Data Flow

1. **Camera Input** → HandController → MediaPipe Processing
2. **Hand Landmarks** → Gesture Recognition → SharedState Update
3. **SharedState** → ParticleSystem → GPU Rendering
4. **User Input** → ShapeDock → Shape Change → Particle Morphing

### State Management

- **Shared State**: Global state object for hand tracking data
- **React State**: Component-local state for UI
- **Three.js State**: Frame-based animation loop state
- **URL State**: Shape selection via React state

## Prerequisites

### System Requirements

- **Node.js** 18.0 or higher
- **npm** 7.0+ / **yarn** 1.22+ / **pnpm** 8.0+ / **bun** 1.0+
- **Webcam** for hand tracking
- **Modern browser** with WebGL 2.0 support

### Browser Requirements

- WebRTC support (getUserMedia API)
- WebGL 2.0 support
- ES2020+ JavaScript support
- HTTPS or localhost for camera access

### Recommended

- Good lighting conditions for hand detection
- Chrome or Edge browser for optimal performance
- At least 4GB RAM
- Dedicated GPU for smooth rendering

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/muhvarriel/neural-particles.git
cd neural-particles
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

Using pnpm:

```bash
pnpm install
```

Using bun:

```bash
bun install
```

### 3. Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 4. Open Application

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Grant Camera Permissions

Allow camera access when prompted to enable hand tracking.

## Usage

### Getting Started

1. **Launch Application**: Open the app in a supported browser
2. **Allow Camera**: Grant camera permissions when prompted
3. **Position Hand**: Hold hand in front of camera (palm facing forward)
4. **Wait for Detection**: Check top-left corner for "HAND TRACKED" status
5. **Start Interacting**: Use gestures to control particles

### Basic Interactions

#### Pinch Control

- **Close Pinch**: Compress particles into tight formation
- **Open Pinch**: Expand particles outward
- **Full Open**: Trigger explosive expansion effect

#### Hand Position

- **Move Left**: Shift particle colors toward blue/cyan
- **Move Right**: Shift particle colors toward red/magenta
- **Center**: Neutral color palette

#### Shape Navigation

- **Swipe Right**: Next shape in sequence
- **Swipe Left**: Previous shape in sequence
- **Click Menu**: Direct shape selection

### Gesture Controls Reference

| Gesture               | Action                    | Threshold       | Cooldown |
| --------------------- | ------------------------- | --------------- | -------- |
| Pinch (Thumb + Index) | Compress/Expand Particles | Distance < 0.1  | N/A      |
| Open Hand             | Explosive Expansion       | Distance > 0.95 | N/A      |
| Hand X Position       | Change Color Hue          | Continuous      | N/A      |
| Swipe Right           | Next Shape                | Delta > 0.2     | 500ms    |
| Swipe Left            | Previous Shape            | Delta < -0.2    | 500ms    |

### Shape Formations

#### 1. Heart

Mathematical parametric heart curve with 3D depth variation:

- Formula: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
- Particles: ~4000-8000 depending on device
- Color: Dynamic based on hand position

#### 2. Sphere

Uniform spherical distribution using spherical coordinates:

- Formula: r = constant, θ ∈ [0, 2π], φ ∈ [0, π]
- Distribution: Even coverage across surface
- Radius: 6 units

#### 3. Flower

Rose curve with sinusoidal modulation:

- Formula: r = 5sin(2u), parametric coordinates
- Petals: 4 main petals
- Dimension: Full 3D with z-axis variation

#### 4. Spiral

Helix formation with expanding radius:

- Formula: r = t/2π × 8, θ = t, z = t/2π × 10
- Turns: ~3-4 complete rotations
- Direction: Clockwise when viewed from above

### Manual Controls

#### Mouse/Touch Controls

- **Click + Drag**: Rotate particle system
- **Scroll/Pinch**: Zoom in/out (orbit controls)
- **Double Click**: Reset camera position

#### Shape Selection Menu

- Located at bottom-center of screen
- Desktop: Icon + Label buttons
- Mobile: Icon-only grid layout
- Click/Tap to instantly switch shapes

## Project Structure

```
neural-particles/
├── .github/
│   └── workflows/              # CI/CD workflows
├── app/
│   ├── components/
│   │   ├── hand-tracking/
│   │   │   └── HandController.tsx    # MediaPipe integration
│   │   ├── particles/
│   │   │   ├── ParticleCanvas.tsx    # Three.js canvas wrapper
│   │   │   └── ParticleSystem.tsx    # Core particle renderer
│   │   └── ui/
│   │       ├── GlobalStyles.tsx      # Global CSS-in-JS
│   │       ├── GestureInstructions.tsx
│   │       ├── Header.tsx            # Status header
│   │       └── ShapeDock.tsx         # Shape selection menu
│   ├── hooks/
│   │   └── useWindowSize.ts          # Responsive window hook
│   ├── lib/
│   │   ├── constants.ts              # Configuration constants
│   │   ├── shapeGenerators.ts        # Shape generation algorithms
│   │   └── sharedState.ts            # Global state object
│   ├── favicon.ico
│   ├── globals.css                   # Tailwind & global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Entry point
├── docs/                             # Documentation files
├── public/                           # Static assets
├── CONTRIBUTING.md                   # Contribution guidelines
├── LICENSE                           # MIT License
├── README.md                         # This file
├── SECURITY.md                       # Security policy
├── eslint.config.mjs                 # ESLint configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies
├── postcss.config.mjs                # PostCSS configuration
├── tsconfig.json                     # TypeScript configuration
└── .gitignore                        # Git ignore rules
```

### Key Files Explained

#### Core Components

**`app/components/particles/ParticleSystem.tsx`**

- Core Three.js particle rendering logic
- 4000-8000 particles with BufferGeometry
- Real-time position and color updates
- Integration with shared state
- Efficient GPU-based rendering

**`app/components/hand-tracking/HandController.tsx`**

- MediaPipe Hands initialization
- Webcam access and stream management
- Hand landmark detection loop
- Gesture recognition algorithms
- Shared state updates

**`app/lib/shapeGenerators.ts`**

- Mathematical shape generation functions
- Parametric curve implementations
- Position array creation
- 3D coordinate calculations

#### Configuration Files

**`app/lib/constants.ts`**

- Particle system constants
- Animation parameters
- Gesture thresholds
- Color configuration
- MediaPipe CDN URLs

**`app/lib/sharedState.ts`**

- Global state object for hand tracking
- Properties: `handDetected`, `pinchDistance`, `handX`
- Accessed by ParticleSystem and HandController

#### Hooks

**`app/hooks/useWindowSize.ts`**

- Window dimension tracking
- Responsive breakpoint detection
- Device type identification (mobile/tablet/desktop)
- Optimized particle count based on device

## Configuration

### Particle System Configuration

Located in `app/lib/constants.ts`:

```typescript
// Particle counts (responsive)
export const PARTICLE_COUNT = {
  MOBILE: 4000,
  TABLET: 6000,
  DESKTOP: 8000,
};

// Particle appearance
export const PARTICLE_SIZE = {
  MOBILE: 0.08,
  TABLET: 0.1,
  DESKTOP: 0.12,
};

// Animation speeds
export const ANIMATION_CONSTANTS = {
  LERP_SPEED_MOBILE: 2.0,
  LERP_SPEED_DESKTOP: 3.5,
  ROTATION_SPEED_MOBILE: 0.0005,
  ROTATION_SPEED_DESKTOP: 0.001,
  NOISE_FREQUENCY: 2.0,
  NOISE_AMPLITUDE: 0.05,
};

// Color settings
export const COLOR_CONSTANTS = {
  ACTIVE_SATURATION: 0.8,
  ACTIVE_LIGHTNESS: 0.6,
  INACTIVE_HUE: 0.5,
  INACTIVE_SATURATION: 0.3,
  INACTIVE_LIGHTNESS: 0.5,
  HUE_SHIFT_RANGE: 0.1,
};
```

### MediaPipe Configuration

Located in `app/components/hand-tracking/HandController.tsx`:

```typescript
hands.setOptions({
  maxNumHands: 1, // Track single hand
  modelComplexity: 1, // 0=lite, 1=full, 2=heavy
  minDetectionConfidence: 0.5, // 0-1 detection threshold
  minTrackingConfidence: 0.5, // 0-1 tracking threshold
});
```

### Gesture Thresholds

Located in `app/lib/constants.ts`:

```typescript
export const GESTURE_CONSTANTS = {
  PINCH_MIN_DISTANCE: 0.02, // Minimum pinch distance
  PINCH_MAX_DISTANCE: 0.3, // Maximum pinch distance
  PINCH_SCALE_FACTOR: 1.43, // Scale multiplier
  PINCH_MAX_VALUE: 1.5, // Maximum normalized value
  SWIPE_THRESHOLD: 0.2, // Swipe detection sensitivity
  SWIPE_COOLDOWN: 500, // Cooldown in milliseconds
};
```

### Camera Settings

Located in `app/lib/constants.ts`:

```typescript
export const TRACKING_CONSTANTS = {
  CAM_WIDTH_MOBILE: 480,
  CAM_WIDTH_DESKTOP: 640,
  CAM_HEIGHT_MOBILE: 360,
  CAM_HEIGHT_DESKTOP: 480,
  PINCH_LERP_ACTIVE: 0.15,
  PINCH_LERP_INACTIVE: 0.05,
  HAND_X_LERP: 0.1,
  STATUS_UPDATE_INTERVAL: 100,
};
```

## API Reference

### Shared State Object

```typescript
interface SharedState {
  handDetected: boolean; // Hand presence status
  pinchDistance: number; // Normalized 0-1.5
  handX: number; // Horizontal position 0-1
}
```

### Shape Types

```typescript
type ShapeType = "heart" | "sphere" | "flower" | "spiral";
```

### Hook: useWindowSize

```typescript
interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const windowSize = useWindowSize();
```

### Component Props

#### ParticleSystem

```typescript
interface ParticleSystemProps {
  activeShape: ShapeType;
  initialShape?: ShapeType;
}
```

#### HandController

```typescript
interface HandControllerProps {
  onGesture: (direction: "next" | "prev") => void;
  showLoadingIndicator?: boolean;
  loadingMessage?: string;
  onError?: (error: Error) => void;
}
```

#### ShapeDock

```typescript
interface ShapeDockProps {
  activeShape: ShapeType;
  onShapeChange: (shape: ShapeType) => void;
  className?: string;
}
```

## Browser Compatibility

### Fully Supported

| Browser | Version | WebGL | WebRTC | Performance |
| ------- | ------- | ----- | ------ | ----------- |
| Chrome  | 90+     | Yes   | Yes    | Excellent   |
| Edge    | 90+     | Yes   | Yes    | Excellent   |
| Firefox | 88+     | Yes   | Yes    | Very Good   |
| Safari  | 14+     | Yes   | Yes    | Good        |
| Opera   | 76+     | Yes   | Yes    | Very Good   |

### Minimum Requirements

- **WebGL 2.0**: Required for Three.js rendering
- **WebRTC**: Required for camera access (getUserMedia)
- **ES2020**: Modern JavaScript features
- **HTTPS/Localhost**: Required for camera permissions
- **Hardware Acceleration**: Recommended for smooth performance

### Known Limitations

#### Mobile Devices

- Performance varies based on hardware
- Lower particle count (4000 vs 8000)
- Reduced camera resolution
- Touch controls instead of mouse
- Battery drain considerations

#### Safari

- May require additional permission prompts
- Slightly different WebGL performance characteristics
- Test on iOS Safari for mobile deployment

#### Firefox

- Hardware acceleration recommended
- WebGL performance slightly lower than Chrome
- Works well with GPU enabled

## Performance

### Specifications

| Metric        | Desktop   | Mobile     | Notes                      |
| ------------- | --------- | ---------- | -------------------------- |
| Particles     | 8000      | 4000       | Responsive based on device |
| Frame Rate    | 60 FPS    | 30-60 FPS  | Depends on hardware        |
| Hand Tracking | 30 FPS    | 30 FPS     | MediaPipe default          |
| Memory Usage  | 200-300MB | 150-250MB  | Typical usage              |
| GPU Usage     | Medium    | Low-Medium | WebGL rendering            |

### Optimization Techniques

#### Memory Management

- Reusable THREE.Color objects (no per-frame allocation)
- Memoized position and color Float32Arrays
- Efficient BufferGeometry with direct array updates
- Minimal object creation in animation loop

#### Rendering Optimization

- Conditional buffer updates with `needsUpdate` flags
- Additive blending reduces overdraw
- Single draw call for all particles
- Point primitive rendering (fastest)
- PointsMaterial with vertex colors

#### Hand Tracking Optimization

- RequestAnimationFrame for detection loop
- Smooth lerp for hand position updates
- Gesture cooldown prevents spam
- Conditional processing based on detection status

#### Code Optimization

- useSyncExternalStore for hydration
- useCallback for memoized functions
- React.memo for pure components
- Efficient dependency arrays in useEffect

### Performance Tips

#### For Users

1. Close unnecessary browser tabs
2. Ensure good lighting for hand detection
3. Use Chrome or Edge for best performance
4. Disable browser extensions temporarily
5. Enable hardware acceleration in browser settings

#### For Developers

1. Reduce `PARTICLE_COUNT` for slower devices
2. Set `modelComplexity: 0` for faster detection
3. Lower `LERP_SPEED` for smoother transitions
4. Adjust `STATUS_UPDATE_INTERVAL` as needed
5. Profile with Chrome DevTools Performance tab

### Monitoring Performance

Use built-in browser tools:

```javascript
// Chrome DevTools
// Performance tab: Record during interaction
// Memory tab: Take heap snapshot
// Rendering: Enable FPS meter

// React DevTools Profiler
// Profile component renders
// Identify unnecessary re-renders
```

## Troubleshooting

### Common Issues

#### Camera Not Working

**Symptoms**: "Camera access denied" or black screen

**Solutions**:

1. Check browser permissions (click lock icon in address bar)
2. Ensure HTTPS or localhost URL
3. Check if another app is using the camera
4. Try different browser
5. Restart browser

#### Hand Not Detected

**Symptoms**: "HAND SEARCHING..." never changes

**Solutions**:

1. Improve lighting conditions
2. Hold hand closer to camera (50-80cm distance)
3. Ensure palm faces camera
4. Check camera focus
5. Clear background behind hand
6. Lower `minDetectionConfidence` threshold

#### Low Frame Rate

**Symptoms**: Stuttering or choppy animation

**Solutions**:

1. Reduce particle count in constants
2. Close other applications
3. Enable hardware acceleration
4. Use desktop instead of mobile
5. Clear browser cache
6. Update graphics drivers

#### Particles Not Responding

**Symptoms**: Particles visible but don't react to gestures

**Solutions**:

1. Check hand tracking status (top-left)
2. Verify hand is detected
3. Check browser console for errors
4. Reload page
5. Clear browser cache

#### Build Errors

**Symptoms**: `npm run dev` fails

**Solutions**:

```bash
# Clear dependencies and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev

# Check Node.js version
node --version  # Should be 18.0+
```

#### TypeScript Errors

**Symptoms**: Type errors during build

**Solutions**:

```bash
# Run type check
npm run type-check

# Update TypeScript
npm install typescript@latest

# Regenerate types
rm -rf node_modules/.cache
npm run dev
```

### Getting Help

1. Check [existing issues](https://github.com/muhvarriel/neural-particles/issues)
2. Review [documentation](https://github.com/muhvarriel/neural-particles/tree/main/docs)
3. Search [discussions](https://github.com/muhvarriel/neural-particles/discussions)
4. Create [new issue](https://github.com/muhvarriel/neural-particles/issues/new) with:
   - Browser and version
   - Operating system
   - Error messages
   - Steps to reproduce
   - Screenshots/videos

## Contributing

Contributions are welcome! We appreciate your interest in improving Neural Particles.

### How to Contribute

1. **Fork the Repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/neural-particles.git
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow existing code style
   - Add comments for complex logic
   - Write TypeScript types
   - Test on multiple browsers

4. **Commit Changes**

   ```bash
   git commit -m "Add: amazing feature description"
   ```

5. **Push to Branch**

   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**
   - Describe changes clearly
   - Reference related issues
   - Add screenshots if UI changes

### Development Guidelines

- Use TypeScript for all new code
- Follow existing component structure
- Write JSDoc comments for functions
- Use Prettier for code formatting
- Run ESLint before committing
- Test on Chrome, Firefox, and Safari
- Ensure responsive design works

### Code Style

```typescript
// Use TypeScript interfaces
interface ComponentProps {
  activeShape: ShapeType;
  onShapeChange: (shape: ShapeType) => void;
}

// Use functional components
export const Component: React.FC<ComponentProps> = ({ ... }) => {
  // Component logic
};

// Use const for constants
const PARTICLE_COUNT = 8000;

// Use descriptive names
const calculatePinchDistance = (thumb, index) => { ... };
```

### Testing

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build test
npm run build

# Development server
npm run dev
```

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 muhvarriel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

## Acknowledgments

### Technologies

- [MediaPipe](https://mediapipe.dev/) - Google's cross-platform ML solutions
- [Three.js](https://threejs.org/) - JavaScript 3D library by Mr.doob
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer for Three.js
- [Next.js](https://nextjs.org/) - React framework by Vercel
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

### Resources

- [WebGL Fundamentals](https://webglfundamentals.org/) - WebGL learning resource
- [Three.js Journey](https://threejs-journey.com/) - Three.js course
- [MediaPipe Documentation](https://developers.google.com/mediapipe) - Official docs
- [React Documentation](https://react.dev/) - React learning

### Inspiration

- Interactive particle systems
- Computer vision applications
- Web-based 3D experiences
- Gesture-based interfaces

### Fonts

- [Outfit](https://fonts.google.com/specimen/Outfit) - Primary font by Google Fonts

### Community

Thanks to all contributors and users who have helped improve this project!

---

**Built with passion by [muhvarriel](https://github.com/muhvarriel)**

**Star this project** if you find it useful!

**Report issues** on [GitHub Issues](https://github.com/muhvarriel/neural-particles/issues)

**Follow for updates** on [GitHub](https://github.com/muhvarriel)
