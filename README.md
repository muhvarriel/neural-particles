# Neural Particles

An interactive 3D particle system controlled by hand gestures using MediaPipe and Three.js. Experience real-time particle manipulation through intuitive hand movements detected by your webcam.

![Neural Particles Demo](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![Three.js](https://img.shields.io/badge/Three.js-0.181-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Gesture Controls](#gesture-controls)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Browser Compatibility](#browser-compatibility)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- Real-time hand tracking using MediaPipe Hands API
- 8000+ particles with smooth animations and transitions
- 4 unique particle formations: Heart, Sphere, Flower, Spiral
- Intuitive gesture controls: pinch, swipe, and hand positioning
- Dynamic color system based on hand position
- Additive blending for glowing particle effects
- Responsive modern UI with glassmorphism design
- Auto-rotation and manual orbit controls
- Optimized performance with efficient rendering

## Demo

> **Live Demo**: Deploy this project to Vercel or Netlify to see it in action

<!-- Add your deployed URL here -->
<!-- **Live Demo**: [https://neural-particles.vercel.app](https://neural-particles.vercel.app) -->

### Screenshots

> Add screenshots here showing different particle formations and gesture interactions

## Technology Stack

### Core Technologies

- **Next.js 16.0** - React framework with App Router
- **React 19.2** - UI library
- **TypeScript 5.0** - Type-safe development
- **Three.js 0.181** - 3D graphics library

### 3D & Graphics

- **React Three Fiber 9.4** - React renderer for Three.js
- **React Three Drei 10.7** - Useful helpers for R3F
- **WebGL** - Hardware-accelerated 3D rendering

### Computer Vision

- **MediaPipe Hands** - Real-time hand tracking
- **WebRTC** - Camera access via getUserMedia API

### Styling & UI

- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Custom CSS** - Glassmorphism and animations

### Development Tools

- **ESLint 9** - Code linting
- **Prettier 3.7** - Code formatting
- **TypeScript** - Static type checking

## Prerequisites

Before running this project, ensure you have:

- **Node.js** 18.0 or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Modern browser** with WebRTC support (Chrome, Edge, Firefox, Safari)
- **Webcam** for hand tracking functionality
- **HTTPS or localhost** (required for camera access)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/muhvarriel/neural-particles.git
cd neural-particles
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Usage

1. **Allow Camera Access**: When prompted, grant camera permissions to enable hand tracking
2. **Position Your Hand**: Hold your hand in front of the camera (palm facing camera)
3. **Wait for Detection**: Look for "HAND TRACKED" status in the top-left corner
4. **Interact**: Use gestures to control the particle system

### Gesture Controls

| Gesture                    | Action             | Description                                                                    |
| -------------------------- | ------------------ | ------------------------------------------------------------------------------ |
| **Pinch** (Thumb + Index)  | Compress Particles | Bring thumb and index finger close together to compress the particle formation |
| **Open Hand**              | Expand/Explode     | Open your hand fully to expand particles outward                               |
| **Hand Position (X-axis)** | Change Colors      | Move hand left/right to shift particle color hue                               |
| **Swipe Right**            | Next Shape         | Swipe hand to the right to cycle to next formation                             |
| **Swipe Left**             | Previous Shape     | Swipe hand to the left to cycle to previous formation                          |

### Shape Formations

1. **Heart**: Parametric heart shape with 3D depth variation
2. **Sphere**: Uniform spherical distribution of particles
3. **Flower**: Rose curve with sinusoidal modulation
4. **Spiral**: Helix formation with expanding radius

### Manual Controls

- **Mouse Drag**: Rotate the particle system
- **Bottom Menu**: Click shape buttons to switch formations
- **Auto-Rotation**: Particles slowly rotate automatically

## Project Structure

```
neural-particles/
├── app/
│   ├── components/
│   │   └── ParticlePage.tsx      # Main particle system component
│   ├── favicon.ico
│   ├── globals.css               # Global styles and Tailwind config
│   ├── layout.tsx                # Root layout with fonts
│   └── page.tsx                  # Entry point
├── public/                       # Static assets
├── .eslintrc.json               # ESLint configuration
├── .gitignore
├── next.config.ts               # Next.js configuration
├── package.json
├── postcss.config.js            # PostCSS configuration
├── prettier.config.js           # Prettier configuration
├── README.md
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── LICENSE
```

### Key Files

- **`app/components/ParticlePage.tsx`**: Core component (800+ lines)
  - Particle system with 8000 vertices
  - MediaPipe hand tracking integration
  - Gesture recognition logic
  - UI components
  - Shape generation algorithms

## Configuration

### Particle System Constants

Located in `app/components/ParticlePage.tsx`:

```typescript
const PARTICLE_COUNT = 8000; // Number of particles
const PARTICLE_SIZE = 0.12; // Size of each particle
const CAM_WIDTH = 640; // Camera resolution width
const CAM_HEIGHT = 480; // Camera resolution height
```

### Gesture Detection Settings

```typescript
hands.setOptions({
  maxNumHands: 1, // Track one hand
  modelComplexity: 1, // 0 (lite) to 2 (full)
  minDetectionConfidence: 0.5, // Detection threshold
  minTrackingConfidence: 0.5, // Tracking threshold
});
```

### Performance Tuning

- **Reduce particle count**: Lower `PARTICLE_COUNT` for better performance on slower devices
- **Adjust model complexity**: Set `modelComplexity: 0` for faster hand detection
- **Modify lerp speed**: Adjust `lerpSpeed` in `useFrame` for smoother/faster transitions

## Browser Compatibility

| Browser | Version | Support      |
| ------- | ------- | ------------ |
| Chrome  | 90+     | Full Support |
| Edge    | 90+     | Full Support |
| Firefox | 88+     | Full Support |
| Safari  | 14+     | Full Support |
| Opera   | 76+     | Full Support |

### Requirements

- WebGL 2.0 support
- WebRTC (getUserMedia API)
- ES2020+ JavaScript support
- HTTPS or localhost (for camera access)

### Known Limitations

- Mobile devices: Performance may vary depending on device capabilities
- Safari: May require additional permissions prompts
- Firefox: Hardware acceleration recommended for smooth performance

## Performance

### Specifications

- **Particles**: 8000 simultaneous animated particles
- **Frame Rate**: 60 FPS on modern hardware
- **Hand Tracking**: ~30 FPS (MediaPipe default)
- **Memory**: ~200-300MB typical usage

### Optimizations Implemented

- Reusable Three.js Color objects (avoid allocation per frame)
- Memoized position and color arrays
- Efficient buffer attribute updates
- Conditional rendering with `needsUpdate` flags
- RequestAnimationFrame for hand detection loop
- Additive blending for reduced overdraw

### Performance Tips

- Close other browser tabs for better performance
- Ensure good lighting for hand detection
- Use Chrome or Edge for best WebGL performance
- Disable browser extensions that may interfere

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines (coming soon).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [MediaPipe](https://mediapipe.dev/) - Google's framework for real-time ML
- [Three.js](https://threejs.org/) - JavaScript 3D library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) - React renderer for Three.js
- [Next.js](https://nextjs.org/) - React framework
- [Vercel](https://vercel.com/) - Deployment platform
- Font: [Outfit](https://fonts.google.com/specimen/Outfit) by Google Fonts

---

**Built with passion by [muhvarriel](https://github.com/muhvarriel)**

If you find this project useful, please consider giving it a star!
