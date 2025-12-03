# Gesture Controls Guide

Visual guide for hand gestures used in Neural Particles.

## Supported Gestures

### 1. Pinch Gesture

**Action**: Compress particles together

**How to perform**:

1. Show your hand to the camera (palm facing camera)
2. Bring your thumb and index finger close together
3. The closer they are, the more compressed the particles become

**Visual indicator**: Particles contract toward the center

```
     /\
    /  \     <- Index Finger
   |    |
   |    |
    \  /      <- Thumb
     \/
   [PINCH]
```

**Effect**:

- Pinch distance 0.0-0.2: Maximum compression
- Pinch distance 0.2-0.8: Normal state
- Pinch distance 0.8-1.0: Expanding

---

### 2. Open Hand

**Action**: Explode particles outward

**How to perform**:

1. Show your hand to the camera
2. Spread all fingers wide apart
3. Keep hand flat and open

**Visual indicator**: Particles expand dramatically

```
  |  |  |  |  |
  |  |  |  |  |   <- All fingers spread
 ---------------
    [  HAND  ]
```

**Effect**:

- Hand fully open: Explosive expansion (1.5x normal size)
- Creates dramatic visual effect with additive blending

---

### 3. Horizontal Swipe

**Action**: Switch between particle shapes

**How to perform**:

1. Show your hand to the camera
2. Move hand quickly from left to right (or right to left)
3. Movement must exceed threshold distance

**Visual indicator**: Shape morphs to next/previous formation

```
    <----  Swipe Left   (Previous shape)

    ---->  Swipe Right  (Next shape)
```

**Shape cycle**:

1. Heart
2. Sphere
3. Flower
4. Spiral
   (repeats)

**Cooldown**: 800ms between swipes to prevent accidental triggers

---

### 4. Hand Position (X-axis)

**Action**: Change particle colors

**How to perform**:

1. Show your hand to the camera
2. Move hand left and right
3. Color hue changes based on horizontal position

**Visual indicator**: Particles shift through color spectrum

```
Left Side         Center         Right Side
(Blue hues)    (Cyan/Green)    (Magenta/Red)
    |              |              |
    v              v              v
   [============================]
```

**Effect**:

- Left side: Cool colors (blue, cyan)
- Center: Balanced colors (green, cyan)
- Right side: Warm colors (yellow, magenta)

---

## Hand Detection Requirements

### Camera Setup

- Resolution: 640x480px minimum
- Frame rate: 30 FPS
- Lighting: Moderate to bright (avoid backlighting)
- Distance: 30-60cm from camera

### Hand Positioning

- Palm facing camera
- Hand clearly visible (not partially obscured)
- Avoid extreme angles
- Keep hand within camera frame

### Best Practices

**DO**:

- Use good lighting conditions
- Keep background simple and contrasting
- Position hand at comfortable distance
- Make deliberate gestures
- Wait for "HAND TRACKED" status indicator

**DON'T**:

- Move too quickly (except for swipes)
- Partially hide hand
- Use in very dark environments
- Position hand too close or too far
- Wear gloves or hand accessories that obscure fingers

---

## Technical Details

### MediaPipe Hand Landmarks

The system tracks 21 hand landmarks:

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

**Key landmarks used**:

- Landmark 0: Wrist (position tracking)
- Landmark 4: Thumb tip (pinch detection)
- Landmark 8: Index finger tip (pinch detection)

### Gesture Recognition Parameters

**Pinch Distance Calculation**:

```typescript
const distance = Math.sqrt((thumb.x - index.x) ** 2 + (thumb.y - index.y) ** 2);
const normalized = (distance - 0.02) * 7;
const pinchDistance = Math.max(0, Math.min(1.5, normalized));
```

**Swipe Detection**:

- Threshold: 0.06 (6% of screen width)
- Cooldown: 800ms
- Direction: Based on deltaX (current - previous)

**Color Mapping**:

```typescript
const hue = handX; // 0.0 to 1.0
const color = HSL(hue, 0.8, 0.6);
```

---

## Troubleshooting

### Hand Not Detected

**Possible causes**:

1. Insufficient lighting
2. Camera blocked or not working
3. Browser denied camera permission
4. Hand outside camera view

**Solutions**:

- Check camera permissions in browser
- Improve lighting conditions
- Ensure hand is visible and in frame
- Try refreshing the page

### Gestures Not Responding

**Possible causes**:

1. Hand detection confidence too low
2. Fingers not clearly separated
3. Movement too subtle or too fast
4. Cooldown period active

**Solutions**:

- Make gestures more deliberate
- Ensure fingers are clearly visible
- Wait for previous gesture to complete
- Check for "HAND TRACKED" status

### Color Not Changing

**Possible causes**:

1. Hand position interpolation smoothing
2. Minimal hand movement
3. Lighting affecting landmark detection

**Solutions**:

- Move hand more significantly left/right
- Ensure hand is parallel to camera
- Improve lighting contrast

---

## Keyboard Alternative

For accessibility or when camera is unavailable:

**Manual controls available**:

- Bottom menu buttons: Click to switch shapes
- Mouse drag: Rotate particle system
- Manual shape selection bypasses gesture requirements

**Note**: Pinch and expansion effects require hand tracking
