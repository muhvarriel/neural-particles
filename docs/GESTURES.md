# Gesture Controls Guide

Technical and visual guide for hand gestures used in Neural Particles.

## Table of Contents

- [Supported Gestures](#supported-gestures)
- [Hand Detection Requirements](#hand-detection-requirements)
- [Gesture Recognition Details](#gesture-recognition-details)
- [Troubleshooting](#troubleshooting)
- [Keyboard and Mouse Alternatives](#keyboard-and-mouse-alternatives)

## Supported Gestures

### 1. Pinch Gesture

**Action**: Compress or expand the particle system

#### How to perform

1. Show your hand to the camera with the palm facing the camera
2. Slowly bring your thumb and index finger closer together
3. Hold the pinch at the desired distance

#### Visual indicator

Particles move closer to the center as the pinch becomes tighter.

```
     /    /  \     <- Index finger
   |    |
   |    |
    \  /      <- Thumb
     \/
   [PINCH]
```

#### Effect on particles

- Pinch distance in range `0.0 - 0.2`: Maximum compression
- Pinch distance in range `0.2 - 0.8`: Normal state
- Pinch distance in range `0.8 - 1.0+`: Expansion

The pinch distance is a continuous value used as a scaling factor for the particle shapes.

---

### 2. Open Hand

**Action**: Explode particles outward

#### How to perform

1. Show your hand to the camera
2. Spread all fingers as wide as possible
3. Keep your hand flat and fully open

#### Visual indicator

Particles expand significantly, creating an explosive effect.

```
  |  |  |  |  |
  |  |  |  |  |   <- All fingers spread
 ---------------
    [  HAND  ]
```

#### Effect on particles

- Fully open hand triggers stronger expansion multipliers
- Combines with pinch logic for gradual control
- Works best when hand is centered in camera view

---

### 3. Horizontal Swipe

**Action**: Switch between particle shapes

#### How to perform

1. Show your hand to the camera
2. Move your hand quickly from left to right or right to left
3. Make sure the movement is clear and crosses a visible distance

#### Visual indicator

Active shape morphs into the next or previous formation.

```
    <----  Swipe Left   (Previous shape)

    ---->  Swipe Right  (Next shape)
```

#### Shape cycle order

1. Heart
2. Sphere
3. Flower
4. Spiral
5. Back to Heart

#### Swipe parameters

- Movement threshold: Approximately 6 percent of screen width
- Cooldown: 800 milliseconds between consecutive swipes
- Direction: Based on change in wrist `x` coordinate

The cooldown prevents accidental multiple shape changes from a single motion.

---

### 4. Hand Position (X-axis)

**Action**: Control global color palette

#### How to perform

1. Keep your hand visible to the camera
2. Move your hand horizontally from left to right
3. Observe the color change as your hand moves

#### Visual indicator

Particle colors shift smoothly through the hue spectrum.

```
Left Side         Center         Right Side
(Blue hues)    (Cyan/Green)    (Magenta/Red)
    |              |              |
    v              v              v
   [============================]
```

#### Effect on colors

- Hand on left side: Cooler colors (blue, cyan)
- Hand near center: Neutral colors (green, teal)
- Hand on right side: Warmer colors (yellow, magenta, red)

The horizontal hand position `handX` is normalized between `0.0` and `1.0` and mapped directly to color hue.

---

## Hand Detection Requirements

### Camera Setup

To achieve consistent hand tracking, the camera configuration should meet these requirements:

- Resolution: At least 640 x 480 pixels
- Frame rate: 30 frames per second or higher
- Lighting: Moderate to bright, avoid strong backlighting
- Distance: Hand approximately 30 to 60 centimeters from the camera
- Device: Built-in webcam or external USB camera

### Hand Positioning

- Palm facing the camera directly
- Entire hand should be visible within the frame
- Avoid extreme rotations or angles
- Keep background relatively clean and non-reflective
- Remove objects that may occlude the hand

### Best Practices

**Recommended**

- Use even front lighting (for example, a monitor or desk lamp)
- Sit at a distance where your arm can move comfortably
- Make deliberate, clear gestures rather than subtle ones
- Wait for the "HAND TRACKED" status indicator before performing gestures

**Not recommended**

- Using the app in very dark environments
- Standing too close or too far from the camera
- Wearing gloves or accessories that cover fingers
- Moving the hand extremely fast in random directions

---

## Gesture Recognition Details

### MediaPipe Hand Landmarks

The system uses 21 landmarks provided by MediaPipe Hands.

```
        8   12  16  20    <- Finger tips
        |   |   |   |
        7   11  15  19
        |   |   |   |
        6   10  14  18
        |   |   |   |
        5   9   13  17
         \ | | /
          \|||/
           \|/
            4  <- Thumb tip
            |
            3
            |
            2
            |
            1
            |
            0  <- Wrist
```

### Key Landmarks Used

- Landmark 0 (wrist): Position tracking and swipe detection
- Landmark 4 (thumb tip): Pinch calculation
- Landmark 8 (index finger tip): Pinch calculation

### Pinch Distance Calculation

Pinch distance is calculated using the Euclidean distance between thumb and index landmarks.

```typescript
const distance = Math.sqrt((thumb.x - index.x) ** 2 + (thumb.y - index.y) ** 2);

const normalized = (distance - 0.02) * 7;
const pinchDistance = Math.max(0, Math.min(1.5, normalized));
```

This value is written to the shared state as `sharedState.pinchDistance` and consumed by the particle system.

### Swipe Detection

Swipe detection uses changes in wrist `x` coordinate between frames.

```typescript
const currentX = 1 - wrist.x; // Invert for natural movement
const deltaX = currentX - lastXRef.current;
const now = performance.now();
const timeSinceLastSwipe = now - lastSwipeTimeRef.current;

if (timeSinceLastSwipe > SWIPE_COOLDOWN_MS) {
  if (deltaX > SWIPE_THRESHOLD) {
    onSwipe("next");
    lastSwipeTimeRef.current = now;
  } else if (deltaX < -SWIPE_THRESHOLD) {
    onSwipe("prev");
    lastSwipeTimeRef.current = now;
  }
}
```

- `SWIPE_THRESHOLD`: Approximately 0.06 units in normalized coordinates
- `SWIPE_COOLDOWN_MS`: 800 milliseconds by default

### Color Mapping

Horizontal hand position is mapped to a hue value.

```typescript
const hue = handX; // 0.0 to 1.0
const color = HSL(hue, 0.8, 0.6);
```

Where:

- `handX = 0.0` produces deep blue hues
- `handX = 0.5` produces green and cyan tones
- `handX = 1.0` produces magenta and red tones

### Shared State Fields

The gesture recognition layer writes into a shared state object:

```typescript
const sharedState = {
  handDetected: false,
  pinchDistance: 1.0,
  handX: 0.5,
};
```

These values are read on every frame in the particle simulation loop to drive animation and color changes.

---

## Troubleshooting

### Hand Not Detected

**Possible causes**

1. Insufficient lighting
2. Camera blocked or not working
3. Browser denied camera permission
4. Hand outside of camera view
5. Very low frame rate

**Solutions**

- Check that the camera is working in another application
- Ensure the browser has permission to use the camera
- Improve lighting and reduce strong backlight
- Move your hand slowly into the center of the frame
- Refresh the page and re-accept camera permissions

### Gestures Not Responding

**Possible causes**

1. Hand detection confidence too low
2. Fingers not clearly separated
3. Movements too subtle or too fast
4. Swipe cooldown still active

**Solutions**

- Make gestures more deliberate and clear
- Ensure fingers are fully visible and not occluded
- Move hand at a moderate speed
- Wait at least one second between swipe gestures
- Check that "HAND TRACKED" is visible before gesturing

### Color Not Changing

**Possible causes**

1. Minimal horizontal movement
2. Hand position smoothing
3. Landmarks unstable due to low light

**Solutions**

- Move hand further left and right
- Keep hand parallel to the camera plane
- Improve lighting and contrast with the background

### Performance Issues During Gestures

**Possible causes**

1. Low-power device or integrated GPU
2. High particle count on mobile
3. Heavy background applications

**Solutions**

- Close other applications consuming CPU or GPU
- Use the app on a desktop or laptop with a dedicated GPU
- Reduce browser zoom level
- Test in a Chromium-based browser for better WebGL performance

---

## Keyboard and Mouse Alternatives

For accessibility or when a camera is unavailable, keyboard and mouse controls are available.

### Manual Shape Controls

- Use the shape buttons in the bottom menu to select a specific shape
- Click on each shape icon to switch immediately without swiping
- This bypasses swipe gesture recognition

### Mouse and Touch Controls

- Click and drag on the canvas to rotate the particle system
- On touch devices, drag with a single finger to rotate
- Scroll wheel (if enabled) can be used for zooming in future versions

### When to Use Alternatives

- Camera is blocked by another application
- Running in a virtual machine without webcam support
- Using a device without any camera hardware
- Gestures are not reliable due to low lighting or camera quality

Manual controls ensure that the experience remains usable even without hand tracking.

---

For additional information about the technical implementation of gestures and state management, refer to:

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [README.md](../README.md)
