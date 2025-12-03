# Deployment Guide

Complete guide for deploying Neural Particles to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure:

- Node.js 18.0 or higher installed
- Git repository initialized
- All dependencies installed (`npm install`)
- Build succeeds locally (`npm run build`)
- No TypeScript errors (`npx tsc --noEmit`)

## Vercel Deployment

### Method 1: Automatic Deployment (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Authorize Vercel to access the repository

2. **Configure Project**:

   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Get deployment URL: `https://your-project.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Vercel Configuration

Create `vercel.json` (optional):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(self)"
        }
      ]
    }
  ]
}
```

---

## Netlify Deployment

### Method 1: Git Integration

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select repository

2. **Build Settings**:

   ```
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: .next
   ```

3. **Deploy**:
   - Click "Deploy site"
   - Get URL: `https://your-project.netlify.app`

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(self)"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Self-Hosted Deployment

### Using PM2 (Process Manager)

1. **Build the Application**:

```bash
npm run build
```

2. **Install PM2**:

```bash
npm install -g pm2
```

3. **Start with PM2**:

```bash
pm2 start npm --name "neural-particles" -- start
pm2 save
pm2 startup
```

4. **Configure Reverse Proxy (Nginx)**:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

5. **Setup SSL with Let's Encrypt**:

```bash
sudo certbot --nginx -d yourdomain.com
```

### Using Standalone Build

```bash
# Build for production
npm run build

# Start server
npm start
```

---

## Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  neural-particles:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Build and Run

```bash
# Build image
docker build -t neural-particles .

# Run container
docker run -p 3000:3000 neural-particles

# Or use docker-compose
docker-compose up -d
```

---

## Environment Configuration

### Environment Variables

Create `.env.local` (if needed):

```bash
# Next.js
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Production Checklist

- [ ] HTTPS enabled (required for camera access)
- [ ] Security headers configured
- [ ] Compression enabled (gzip/brotli)
- [ ] CDN configured (optional)
- [ ] Error tracking setup (optional)
- [ ] Analytics configured (optional)

---

## Performance Optimization

### Next.js Configuration

Update `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Optimize images (if using next/image)
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
```

### Build Optimization

```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer

# Build with analysis
ANALYZE=true npm run build
```

### CDN Configuration

For static assets, configure CDN:

1. Upload static files to CDN
2. Update asset paths
3. Configure CORS headers
4. Enable caching

---

## Troubleshooting

### Camera Not Working in Production

**Cause**: HTTPS required for `getUserMedia` API

**Solution**:

- Deploy to HTTPS-enabled platform
- Configure SSL certificate
- Use `localhost` for local testing only

### Build Fails

**Possible causes**:

- TypeScript errors
- Missing dependencies
- Node version mismatch

**Solutions**:

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install

# Check for errors
npx tsc --noEmit
npm run lint
```

### Performance Issues

**Solutions**:

- Enable compression (gzip/brotli)
- Optimize MediaPipe loading
- Reduce particle count for mobile
- Enable CDN for static assets

### CORS Errors with MediaPipe

**Solution**: MediaPipe loaded from CDN should work, but if issues occur:

- Check network tab for failed requests
- Verify CDN is accessible
- Consider self-hosting MediaPipe files

---

## Post-Deployment

### Monitoring

Setup monitoring for:

- Uptime monitoring
- Error tracking (Sentry)
- Performance metrics (Web Vitals)
- Analytics (Google Analytics)

### Updates

Deploy updates:

```bash
# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild and deploy
npm run build
vercel --prod  # or your deployment method
```

### Rollback

If issues occur:

```bash
# Vercel
vercel rollback

# Docker
docker-compose down
docker-compose up -d --build [previous-image]
```

---

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Docker Documentation](https://docs.docker.com)

---

For support, open an issue on [GitHub](https://github.com/muhvarriel/neural-particles/issues).
