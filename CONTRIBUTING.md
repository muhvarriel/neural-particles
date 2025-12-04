# Contributing to Neural Particles

Thank you for your interest in contributing to Neural Particles. We welcome contributions from the community and appreciate your effort to make this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Questions and Support](#questions-and-support)
- [License](#license)

## Code of Conduct

This project follows a Code of Conduct that all contributors are expected to adhere to. Please be respectful, inclusive, and considerate in all interactions. Harassment, discrimination, or inappropriate behavior will not be tolerated.

Key principles:

- Treat all contributors with respect regardless of background or experience level
- Welcome diverse perspectives and constructive feedback
- Focus on what is best for the project and community
- Show empathy towards other community members
- Accept responsibility and apologize when mistakes are made

Violations of the Code of Conduct may result in temporary or permanent exclusion from the project.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js version 18.0 or higher installed
- npm, yarn, pnpm, or bun package manager
- Git installed and properly configured
- A GitHub account
- Basic knowledge of React, TypeScript, and Three.js
- Familiarity with WebGL and computer graphics concepts (helpful but not required)

### Fork and Clone

1. Fork the repository on GitHub by clicking the "Fork" button
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/neural-particles.git
cd neural-particles
```

3. Add the upstream repository as a remote:

```bash
git remote add upstream https://github.com/muhvarriel/neural-particles.git
```

4. Install dependencies:

```bash
npm install
```

5. Verify the installation:

```bash
npm run dev
```

6. Create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:

- `feature/add-torus-shape`
- `fix/gesture-detection-lag`
- `docs/improve-readme`
- `perf/optimize-particle-rendering`

## Development Workflow

### Running Locally

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`. The development server supports hot module replacement, so changes will be reflected immediately.

### Code Quality Tools

Before submitting changes, run the following commands:

```bash
# Lint your code
npm run lint

# Type check with TypeScript
npx tsc --noEmit

# Build to check for production errors
npm run build
```

Address all errors and warnings before committing.

### Project Structure

```
neural-particles/
├── app/
│   ├── components/
│   │   └── ParticlePage.tsx        # Main interactive component
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout with fonts
│   └── page.tsx                    # Entry point
├── public/                         # Static assets
├── docs/                           # Documentation files
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── GESTURES.md
├── CONTRIBUTING.md                 # This file
├── README.md                       # Project overview
├── SECURITY.md                     # Security policy
└── package.json                    # Dependencies and scripts
```

Key files to understand:

- **ParticlePage.tsx**: Core application logic including hand tracking, particle system, and gesture detection
- **globals.css**: Tailwind CSS configuration and custom styles
- **layout.tsx**: Font loading and global HTML structure

## How to Contribute

### Types of Contributions

We welcome the following types of contributions:

#### 1. Bug Fixes

Fix issues reported in GitHub Issues. Always reference the issue number in your commit message.

#### 2. New Features

Add new functionality such as:

- New particle shapes (torus, cube, DNA helix, etc.)
- New gesture controls (rotation, zoom, color cycling)
- Visual effects (trails, glow, motion blur)
- Sound integration
- VR/AR support

#### 3. Performance Improvements

Optimize existing code:

- Reduce frame time for particle updates
- Improve MediaPipe initialization speed
- Optimize memory usage
- Implement shader-based particle animation

#### 4. Documentation

Improve existing documentation:

- Fix typos or unclear explanations
- Add code examples
- Create video tutorials
- Translate documentation to other languages

#### 5. Tests

Add automated tests:

- Unit tests for utility functions
- Component tests for UI elements
- Integration tests for gesture recognition
- Visual regression tests

#### 6. Design Improvements

Enhance the user interface:

- Improve button styling and layout
- Add animations and transitions
- Design new icons
- Improve responsive design for mobile

#### 7. Accessibility

Make the application more accessible:

- Add keyboard shortcuts
- Improve screen reader support
- Add high contrast mode
- Ensure WCAG 2.1 AA compliance

### Good First Issues

If you are new to the project, look for issues labeled:

- `good first issue`: Simple tasks suitable for beginners
- `help wanted`: Issues that need community assistance
- `documentation`: Documentation improvements

### Areas Needing Contribution

Current focus areas:

- Adding more particle shapes
- Improving gesture detection accuracy
- Mobile performance optimization
- Comprehensive testing suite
- Internationalization (i18n)

## Pull Request Process

### Before Submitting

Complete the following checklist before submitting a pull request:

- [ ] Code follows the project's style guidelines
- [ ] All linting and type checking passes
- [ ] Changes have been tested manually
- [ ] Documentation has been updated (if applicable)
- [ ] Commit messages follow conventional commit format
- [ ] Build succeeds without errors (`npm run build`)
- [ ] No console errors or warnings in browser
- [ ] Changes work in Chrome, Firefox, and Safari

### Submitting a Pull Request

1. Ensure your branch is up to date with upstream main:

```bash
git fetch upstream
git rebase upstream/main
```

2. Push your changes to your fork:

```bash
git push origin feature/your-feature-name
```

3. Go to the original repository on GitHub and create a Pull Request

4. Fill out the PR template with the following information:
   - Clear description of changes
   - Related issue number (e.g., "Closes #42")
   - Screenshots or GIFs for visual changes
   - Testing steps and environment details
   - Breaking changes (if any)

5. Request review from maintainers

6. Address feedback and requested changes promptly

### PR Review Process

- Maintainers will review your PR within 3-5 business days
- You may be asked to make changes or provide clarification
- Discussions should remain professional and focused on code quality
- Once approved, your PR will be merged into the main branch
- Your contribution will be acknowledged in release notes

### PR Best Practices

- Keep PRs focused and atomic (one feature or fix per PR)
- Avoid mixing formatting changes with functional changes
- Provide context and rationale for design decisions
- Be responsive to feedback and questions
- Update the PR description if scope changes

## Code Style Guidelines

### TypeScript

Follow these TypeScript conventions:

**Type Safety**:

```typescript
// Preferred: Explicit types
interface ParticleConfig {
  count: number;
  size: number;
  color: string;
}

const config: ParticleConfig = {
  count: 8000,
  size: 2.5,
  color: "#00f3ff",
};

// Avoid: Using 'any'
const config: any = { count: 8000 };
```

**Interfaces vs Types**:

```typescript
// Use interfaces for object shapes
interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Use type aliases for unions and complex types
type ShapeType = "heart" | "sphere" | "flower" | "spiral";
type HandLandmark = [number, number, number];
```

**Null Safety**:

```typescript
// Preferred: Optional chaining and nullish coalescing
const distance = landmarks?.[0]?.x ?? 0;

// Avoid: Non-null assertions without checks
const distance = landmarks![0].x;
```

### React Components

Follow React best practices:

**Functional Components**:

```typescript
// Preferred: Arrow function with explicit props type
interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button = ({ label, onClick }: ButtonProps) => (
  <button onClick={onClick}>{label}</button>
);

// Avoid: Default exports without types
export default function Button(props) {
  return <button>{props.label}</button>;
}
```

**Hooks Usage**:

```typescript
// Group related hooks
const [activeShape, setActiveShape] = useState<ShapeType>("sphere");
const [isTracking, setIsTracking] = useState(false);

// Use custom hooks for complex logic
const useHandTracking = (config: HandTrackingConfig) => {
  // Hook implementation
};
```

**Component Organization**:

```typescript
// Structure: imports, types, component, exports
import { useState } from 'react';

interface ComponentProps {
  // Props definition
}

const Component = ({ }: ComponentProps) => {
  // 1. Hooks
  // 2. Event handlers
  // 3. Render logic
  return <div>...</div>;
};

export default Component;
```

### Code Organization

**File Structure**:

- One component per file
- Co-locate related utilities with components
- Use index files for clean imports
- Group constants at the top of files

**Naming Conventions**:

```typescript
// Components: PascalCase
const ParticleSystem = () => {};

// Hooks: camelCase with 'use' prefix
const useGestures = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_PARTICLE_COUNT = 10000;

// Functions: camelCase
const calculateDistance = (a, b) => {};
```

**Comments**:

```typescript
// Use JSDoc for complex functions
/**
 * Generates particle positions for a given shape type
 * @param shape - The shape type to generate
 * @param count - Number of particles
 * @returns Float32Array of positions (x, y, z)
 */
const generatePositions = (shape: ShapeType, count: number): Float32Array => {
  // Implementation
};

// Use inline comments for complex logic
// Normalize distance and apply scaling factor
const normalized = (distance - 0.02) * 7;
```

### Styling

**Tailwind CSS**:

```typescript
// Preferred: Utility classes
<div className="flex items-center justify-center p-4 bg-gray-900">

// Avoid: Inline styles for static values
<div style={{ display: 'flex', padding: '16px' }}>
```

**Dynamic Styles**:

```typescript
// Acceptable: Inline styles for dynamic values
<div style={{ opacity: handDetected ? 1 : 0.5 }}>

// Use CSS variables for theme values
<div style={{ color: `hsl(${hue * 360}, 80%, 60%)` }}>
```

**Responsive Design**:

```typescript
// Use Tailwind responsive prefixes
<div className="text-sm md:text-base lg:text-lg">
```

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for clear and structured commit history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature for the user
- `fix`: Bug fix for the user
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc. (no code change)
- `refactor`: Code refactoring without behavior change
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: Changes to CI configuration
- `chore`: Maintenance tasks, version bumps, etc.

### Scopes

Use scopes to indicate the area of change:

- `particles`: Particle system logic
- `gestures`: Gesture detection and handling
- `ui`: User interface components
- `shapes`: Shape generation algorithms
- `docs`: Documentation files
- `config`: Configuration files

### Examples

```bash
feat(particles): add torus shape with customizable parameters

Implement torus shape generation using parametric equations.
The shape includes inner and outer radius controls.

Closes #42

fix(gestures): improve pinch detection accuracy

Adjust threshold and add smoothing to reduce false positives.
Fixes issue where pinch was triggered unintentionally.

Fixes #38

docs(readme): add troubleshooting section for camera issues

perf(rendering): optimize particle buffer updates

Reduce array allocations by reusing color buffer.
Improves frame time by approximately 15%.

refactor(shapes): extract shape generators to separate module

test(gestures): add unit tests for distance calculation

chore(deps): update three.js to v0.160.0
```

### Guidelines

- Use present tense: "add feature" not "added feature"
- Use imperative mood: "move cursor" not "moves cursor"
- Keep subject line under 72 characters
- Separate subject from body with blank line
- Wrap body at 72 characters
- Reference issues and PRs in footer
- Include "BREAKING CHANGE:" footer for breaking changes

### Commit Frequency

- Make atomic commits (one logical change per commit)
- Commit frequently during development
- Squash work-in-progress commits before submitting PR
- Each commit should pass linting and build

## Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test the following:

**Functionality**:

- [ ] All shapes render correctly
- [ ] Gestures work as expected (pinch, swipe, position)
- [ ] Hand detection activates reliably
- [ ] Color changes respond to hand position
- [ ] Manual controls (buttons) function correctly

**Browser Compatibility**:

- [ ] Chrome/Edge (Chromium-based)
- [ ] Firefox
- [ ] Safari (macOS and iOS)

**Performance**:

- [ ] 60 FPS on desktop
- [ ] 30+ FPS on mobile devices
- [ ] No memory leaks after extended use
- [ ] MediaPipe loads without errors

**Responsive Design**:

- [ ] Works on mobile phones
- [ ] Works on tablets
- [ ] Works on desktop monitors
- [ ] UI adapts to different screen sizes

**Accessibility**:

- [ ] Keyboard navigation works
- [ ] Color contrast meets standards
- [ ] Screen reader compatibility (basic)

**Edge Cases**:

- [ ] Hand not detected (graceful degradation)
- [ ] Multiple hands (should use first detected)
- [ ] Low light conditions
- [ ] Camera permission denied

### Automated Testing

Currently, the project uses:

**Static Analysis**:

- ESLint for code quality
- TypeScript for type checking
- Prettier for code formatting (optional)

**Build Verification**:

- Next.js build process
- Production bundle size check

**Future Testing Improvements**:

We welcome contributions to add:

1. **Unit Tests** (Jest):

```typescript
describe("generatePositions", () => {
  it("should generate correct number of particles", () => {
    const positions = generatePositions("sphere", 100);
    expect(positions.length).toBe(300); // 100 * 3
  });
});
```

2. **Component Tests** (React Testing Library):

```typescript
it('should render particle system', () => {
  render(<ParticleSystem activeShape="sphere" />);
  // Assertions
});
```

3. **E2E Tests** (Playwright):

```typescript
test("should detect hand and change colors", async ({ page }) => {
  await page.goto("/");
  // Simulate hand detection
  // Verify color change
});
```

### Performance Testing

Use browser DevTools to measure:

- Frame rate (target: 60 FPS)
- Memory usage (target: stable, no leaks)
- CPU usage (target: <50% on mid-range hardware)
- GPU usage
- Network requests (MediaPipe loading)

Profile with:

```typescript
// React DevTools Profiler
<Profiler id="ParticleSystem" onRender={onRenderCallback}>
  <ParticleSystem />
</Profiler>

// Browser Performance API
const start = performance.now();
// Code to measure
const duration = performance.now() - start;
console.log(`Execution time: ${duration}ms`);
```

## Reporting Bugs

### Before Reporting

1. Search existing issues to avoid duplicates
2. Test with the latest version from main branch
3. Verify it is not a browser-specific configuration issue
4. Try with different cameras or devices if applicable
5. Check browser console for error messages

### Bug Report Template

When creating a bug report, include:

**Title**: Clear, descriptive, and specific

**Description**:

- Summary of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior

**Environment**:

- Browser and version
- Operating system
- Device type (desktop, mobile, tablet)
- Camera model (if relevant)
- Node.js version (for build issues)

**Screenshots/Videos**:

- Visual evidence of the bug
- Console error messages
- Network tab (for loading issues)

**Additional Context**:

- When did the issue start occurring?
- Does it happen consistently or intermittently?
- Any error messages in browser console?

**Example**:

```markdown
**Bug**: Hand tracking stops working after shape change

**Steps to reproduce**:

1. Open application and allow camera access
2. Hand is detected successfully
3. Swipe to change shape
4. Hand tracking stops responding

**Expected**: Hand tracking should continue after shape change

**Actual**: Hand detection indicator disappears and gestures stop working

**Environment**:

- Browser: Chrome 120.0.6099.109
- OS: macOS 14.1
- Device: MacBook Pro 2023

**Console errors**:
```

TypeError: Cannot read property 'landmarks' of undefined
at processResults (ParticlePage.tsx:245)

```

**Additional context**:
Only happens with "flower" shape. Other shapes work fine.
```

### Security Vulnerabilities

**Important**: Do NOT open public issues for security vulnerabilities.

If you discover a security vulnerability:

1. Email the maintainer directly (contact info in package.json or SECURITY.md)
2. Provide detailed description of the vulnerability
3. Include steps to reproduce (if safe to share)
4. Allow reasonable time for patch before public disclosure
5. Coordinate disclosure timing with maintainer

See [SECURITY.md](./SECURITY.md) for full security policy.

## Suggesting Features

### Feature Request Guidelines

When suggesting new features:

1. **Check existing requests**: Search issues and discussions to avoid duplicates

2. **Explain the use case**:
   - What problem does this solve?
   - Who would benefit from this feature?
   - How often would it be used?

3. **Provide details**:
   - Describe the desired behavior
   - Include mockups or examples (if applicable)
   - Suggest potential implementation approach
   - Consider edge cases and limitations

4. **Consider alternatives**:
   - Are there existing workarounds?
   - Could this be achieved with configuration?
   - Are there simpler solutions?

5. **Be open to discussion**:
   - Feature may not align with project goals
   - Implementation may differ from proposal
   - Timeline may vary based on complexity

### Feature Request Template

```markdown
**Feature**: Add DNA helix particle shape

**Problem**: Current shapes are mostly geometric. Biological forms would add variety.

**Proposed solution**:
Implement double helix shape with:

- Two intertwined spirals
- Connecting "base pairs" between spirals
- Customizable helix radius and pitch

**Use cases**:

- Educational demonstrations
- Scientific visualizations
- Aesthetic variety

**Mockup**:
[Include sketch or reference image]

**Implementation notes**:
Could use parametric equations similar to spiral shape.
Would need approximately 4000 particles for good detail.

**Alternatives considered**:

- Single helix (less visually interesting)
- Static DNA model (less dynamic)
```

### Feature Priorities

We prioritize features that:

- Improve user experience and usability
- Enhance performance or reduce resource usage
- Add new creative possibilities (shapes, effects)
- Expand gesture controls and interactions
- Improve accessibility and inclusivity
- Have broad appeal and use cases

Lower priority:

- Highly specialized or niche features
- Features that significantly increase complexity
- Features that duplicate existing functionality

## Questions and Support

### Getting Help

**GitHub Discussions**: For general questions, ideas, and community interaction

- Q&A: Technical questions about the codebase
- Ideas: Feature proposals and brainstorming
- Show and Tell: Share your modifications or forks

**GitHub Issues**: For bug reports and feature requests only

- Use issue templates
- Provide detailed information
- Follow up on responses

**Documentation**: Always check these first

- [README.md](./README.md): Project overview and quick start
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md): Technical deep dive
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md): Deployment instructions
- [GESTURES.md](./docs/GESTURES.md): Gesture controls guide

**Code Comments**: Read inline documentation in source files

- Type definitions explain data structures
- Comments explain non-obvious logic
- Examples demonstrate usage patterns

### Communication Guidelines

**Be respectful**:

- Assume good intentions
- Critique ideas, not people
- Use inclusive language
- Welcome newcomers

**Be clear**:

- Provide context and background
- Use code examples when relevant
- Share relevant error messages or logs
- Specify your environment

**Be patient**:

- Maintainers are volunteers with limited time
- Responses may take several days
- Complex issues require investigation
- Priorities may differ from yours

**Be helpful**:

- Answer questions from other contributors
- Share your knowledge and experience
- Improve documentation when you learn something
- Thank people for their contributions

## Recognition

Contributors will be recognized through:

- GitHub contributors page (automatic)
- Release notes for significant contributions
- README acknowledgments section
- Special mentions in project announcements

Types of recognition:

**Code Contributors**:

- Features, bug fixes, and improvements
- Listed in GitHub insights

**Documentation Contributors**:

- Guides, tutorials, and translations
- Acknowledged in relevant documents

**Community Contributors**:

- Helping others in discussions
- Triaging issues
- Code reviews

**Design Contributors**:

- UI/UX improvements
- Icons and visual assets
- Design system contributions

## License

By contributing to Neural Particles, you agree that your contributions will be licensed under the same MIT License that covers the project.

Key points:

- You retain copyright to your contributions
- You grant the project a perpetual, worldwide license to use your contributions
- Your contributions must be your original work or properly licensed
- You have the right to submit the contributions under the MIT License

See [LICENSE](./LICENSE) file for full license text.

---

## Summary

Contributing to Neural Particles:

1. Fork and clone the repository
2. Create a feature branch
3. Make your changes following code style guidelines
4. Test thoroughly across browsers
5. Commit with conventional commit messages
6. Submit a pull request with detailed description
7. Respond to feedback and reviews
8. Celebrate when your contribution is merged

Thank you for contributing to Neural Particles. Your efforts help make this project better for everyone who uses it.

For additional questions, open a GitHub Discussion or reach out to the maintainers.
