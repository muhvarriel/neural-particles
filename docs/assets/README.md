# Visual Assets

This directory contains visual assets for the Neural Particles project.

## Files

### logo.svg

- **Type**: Logo
- **Dimensions**: 200x200px
- **Format**: SVG (vector)
- **Usage**: GitHub profile, documentation, social media
- **Description**: Neural Particles logo featuring interconnected particle nodes with a hand gesture indicator

### banner.svg

- **Type**: Header banner
- **Dimensions**: 1200x400px
- **Format**: SVG (vector)
- **Usage**: README header, social media, presentations
- **Description**: Project banner with title, subtitle, and tech stack badges

## Usage Guidelines

### In README.md

```markdown
![Neural Particles Banner](docs/assets/banner.svg)
```

### As Repository Social Preview

1. Go to repository Settings
2. Scroll to "Social preview"
3. Upload a PNG version of banner.svg (1200x630px recommended)

### Converting SVG to PNG

For platforms that require PNG format:

```bash
# Using ImageMagick
convert -density 300 banner.svg banner.png

# Using Inkscape
inkscape banner.svg --export-png=banner.png --export-width=1200
```

## Design Specifications

### Color Palette

- Primary Blue: #00f3ff (Cyan)
- Secondary Blue: #0099ff
- Background Dark: #050505
- Background Lighter: #0a0a0a
- Text White: #ffffff

### Typography

- Font Family: Arial, sans-serif
- Title Weight: Bold (700)
- Body Weight: Regular (400)

### Effects

- Glow: Gaussian blur with 3-4px radius
- Opacity: 0.3-0.9 for layered effects
- Gradients: Linear from cyan to blue

## License

These visual assets are part of the Neural Particles project and are subject to the same MIT License as the code.

You are free to:

- Use in presentations about the project
- Modify for derivative works
- Share with proper attribution

## Attribution

When using these assets outside the project context, please credit:

```
Neural Particles by muhvarriel
https://github.com/muhvarriel/neural-particles
```
