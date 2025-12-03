# Contributing to Neural Particles

Thank you for your interest in contributing to Neural Particles! We welcome contributions from the community and appreciate your effort to make this project better.

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

## Code of Conduct

This project follows a Code of Conduct that all contributors are expected to adhere to. Please be respectful, inclusive, and considerate in all interactions. Harassment, discrimination, or inappropriate behavior will not be tolerated.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun package manager
- Git installed and configured
- A GitHub account
- Basic knowledge of React, TypeScript, and Three.js

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/neural-particles.git
cd neural-particles
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/muhvarriel/neural-particles.git
```

4. Install dependencies:

```bash
npm install
```

5. Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Running Locally

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Code Quality Tools

Before submitting changes, run:

```bash
# Lint your code
npm run lint

# Format your code
npm run format

# Build to check for errors
npm run build
```

### Project Structure

```
app/
├── components/
│   └── ParticlePage.tsx    # Main component (modify with care)
├── globals.css             # Global styles
├── layout.tsx              # Root layout
└── page.tsx                # Entry point
```

## How to Contribute

### Types of Contributions

We welcome the following types of contributions:

1. **Bug Fixes**: Fix issues reported in GitHub Issues
2. **New Features**: Add new particle shapes, gestures, or visual effects
3. **Performance Improvements**: Optimize rendering or hand tracking
4. **Documentation**: Improve README, code comments, or guides
5. **Tests**: Add unit tests or integration tests
6. **Design**: Improve UI/UX or visual design
7. **Accessibility**: Enhance keyboard navigation or screen reader support

### Good First Issues

Look for issues labeled `good first issue` or `help wanted` to get started.

## Pull Request Process

### Before Submitting

1. Ensure your code follows the project's code style
2. Run linting and formatting tools
3. Test your changes thoroughly
4. Update documentation if needed
5. Verify the build passes: `npm run build`

### Submitting a Pull Request

1. Push your changes to your fork:

```bash
git push origin feature/your-feature-name
```

2. Go to the original repository and create a Pull Request

3. Fill out the PR template with:
   - Description of changes
   - Related issue number (if applicable)
   - Screenshots or GIFs (for visual changes)
   - Testing steps

4. Wait for review and address feedback

### PR Review Process

- Maintainers will review your PR within 3-5 business days
- Changes may be requested before merging
- Once approved, your PR will be merged into main
- Your contribution will be acknowledged in release notes

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type - use proper type definitions
- Use interfaces for object shapes
- Use type aliases for unions and complex types

```typescript
// Good
interface ParticleConfig {
  count: number;
  size: number;
}

// Avoid
const config: any = { count: 8000 };
```

### React Components

- Use functional components with hooks
- Use meaningful component and variable names
- Extract reusable logic into custom hooks
- Keep components focused and single-purpose

```typescript
// Good
const ParticleSystem = ({ shape, onGesture }: ParticleSystemProps) => {
  // Component logic
};

// Avoid deeply nested components
```

### Code Organization

- Group related functions together
- Use descriptive comments for complex logic
- Keep files under 1000 lines (refactor if needed)
- Use constants for magic numbers

```typescript
// Good
const PARTICLE_COUNT = 8000;
const LERP_SPEED = 4.0;

// Avoid
const positions = new Float32Array(8000 * 3); // What is 8000?
```

### Styling

- Use Tailwind CSS classes when possible
- Use inline styles only for dynamic values
- Follow the existing design system
- Ensure responsive design

## Commit Message Guidelines

Follow the Conventional Commits specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(particles): add new galaxy shape formation

fix(gestures): correct pinch distance calculation

docs(readme): update installation instructions

perf(rendering): optimize particle buffer updates
```

### Guidelines

- Use present tense: "add feature" not "added feature"
- Use imperative mood: "move cursor" not "moves cursor"
- Keep subject line under 72 characters
- Reference issues in footer: `Closes #123`

## Testing Guidelines

### Manual Testing

Before submitting PR:

1. Test in Chrome, Firefox, and Safari
2. Test with different lighting conditions
3. Test gesture recognition accuracy
4. Check for console errors
5. Verify performance (60 FPS target)

### Automated Testing

Currently, the project uses:

- ESLint for code quality
- TypeScript for type checking
- Build verification with Next.js

Future testing improvements welcome:

- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Playwright

## Reporting Bugs

### Before Reporting

1. Check existing issues to avoid duplicates
2. Test with the latest version
3. Verify it's not a browser-specific issue
4. Try with different cameras/devices if applicable

### Bug Report Template

Use the GitHub issue template and include:

- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or videos
- Browser and OS information
- Console error messages (if any)

### Security Vulnerabilities

Do NOT open public issues for security vulnerabilities. Instead, email the maintainer directly (check package.json for contact).

## Suggesting Features

### Feature Request Guidelines

When suggesting new features:

1. Check if the feature has been suggested before
2. Explain the use case and benefits
3. Consider implementation complexity
4. Provide mockups or examples if possible
5. Be open to discussion and alternative solutions

### Feature Priorities

We prioritize features that:

- Improve user experience
- Enhance performance
- Add new gesture controls
- Expand particle shape options
- Improve accessibility

## Questions and Support

### Getting Help

- GitHub Discussions: For general questions and discussions
- GitHub Issues: For bug reports and feature requests
- Documentation: Check README.md first
- Code Comments: Read inline comments in source code

### Communication Guidelines

- Be respectful and professional
- Provide context and details
- Be patient - maintainers are volunteers
- Help others when you can

## Recognition

Contributors will be recognized in:

- Release notes
- GitHub contributors page
- README acknowledgments (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Neural Particles! Your efforts help make this project better for everyone.
