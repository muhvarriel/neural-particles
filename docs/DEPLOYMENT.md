# Deployment Guide

Complete guide for deploying Neural Particles to various platforms and hosting providers.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Security Configuration](#security-configuration)
- [Troubleshooting](#troubleshooting)
- [Post-Deployment Checklist](#post-deployment-checklist)

## Prerequisites

Before deploying, ensure you have completed the following:

### Local Development Setup

- Node.js 18.0 or higher installed
- Git repository initialized and pushed to GitHub
- All dependencies installed (`npm install`)
- Build succeeds locally (`npm run build`)
- No TypeScript errors (`npx tsc --noEmit`)
- No ESLint warnings (`npm run lint`)

### Account Requirements

- GitHub account (for repository hosting)
- Deployment platform account:
  - Vercel account (recommended)
  - OR Netlify account
  - OR hosting provider (VPS, cloud server)

### Domain Setup (Optional)

- Custom domain purchased
- DNS management access
- SSL certificate (auto-provided by most platforms)

## Vercel Deployment

Vercel is the recommended platform for deploying Next.js applications, created by the Next.js team.

### Method 1: Automatic Deployment (Recommended)

#### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **New Project**
3. Import your GitHub repository:
   - Click **Import Git Repository**
   - Select `muhvarriel/neural-particles`
   - Authorize Vercel to access your GitHub account

#### Step 2: Configure Project

Vercel auto-detects Next.js projects, but verify settings:

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 20.x
```

#### Step 3: Deploy

1. Click **Deploy** button
2. Wait for build to complete (typically 2-5 minutes)
3. Access deployment URL: `https://your-project.vercel.app`

#### Step 4: Configure Custom Domain (Optional)

1. Go to project **Settings** > **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning (automatic)

### Method 2: Vercel CLI

For command-line deployment:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Initialize project (first time only)
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration File

Create `vercel.json` in project root for advanced configuration:

```json
{
  "version": 2,
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
          "value": "camera=(self), microphone=(), geolocation=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

### Environment Variables (Vercel)

If using environment variables:

1. Go to project **Settings** > **Environment Variables**
2. Add variables:
   ```
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX (optional)
   ```
3. Redeploy for changes to take effect

---

## Netlify Deployment

Netlify is another excellent platform for static site deployment with CI/CD.

### Method 1: Git Integration

#### Step 1: Connect Repository

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **New site from Git**
3. Choose **GitHub** and authorize access
4. Select `muhvarriel/neural-particles` repository

#### Step 2: Build Settings

Configure build settings:

```
Base directory: (leave empty)
Build command: npm run build
Publish directory: .next
Production branch: main
```

#### Step 3: Deploy

1. Click **Deploy site**
2. Wait for build completion
3. Get deployment URL: `https://random-name.netlify.app`
4. Optionally change site name in **Site settings**

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site (first time)
netlify init

# Deploy to production
netlify deploy --prod
```

### Netlify Configuration File

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(self), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Environment Variables (Netlify)

1. Go to **Site settings** > **Build & deploy** > **Environment**
2. Add variables
3. Trigger new deploy

---

## Self-Hosted Deployment

For deployment on your own server (VPS, dedicated server, or cloud instance).

### Prerequisites

- Ubuntu 22.04 LTS or similar Linux distribution
- Root or sudo access
- Domain pointed to server IP
- Ports 80 and 443 open

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v20.x
npm --version   # Should be 10.x

# Install build essentials
sudo apt install -y build-essential
```

### Step 2: Install Application

```bash
# Create application directory
sudo mkdir -p /var/www/neural-particles
cd /var/www/neural-particles

# Clone repository
sudo git clone https://github.com/muhvarriel/neural-particles.git .

# Install dependencies
sudo npm install

# Build application
sudo npm run build
```

### Step 3: Install PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start npm --name "neural-particles" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Follow the command output instructions
```

### Step 4: Configure Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/neural-particles
```

Add configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(self)" always;
}
```

Enable site and restart Nginx:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/neural-particles /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

### Step 6: Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Docker Deployment

Containerize the application for consistent deployment across environments.

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

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
version: "3.9"

services:
  neural-particles:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: neural-particles
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://yourdomain.com
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Build and Deploy

```bash
# Build Docker image
docker build -t neural-particles:latest .

# Run container
docker run -d \
  --name neural-particles \
  -p 3000:3000 \
  --restart unless-stopped \
  neural-particles:latest

# Or use Docker Compose
docker-compose up -d

# View logs
docker logs -f neural-particles

# Stop container
docker-compose down
```

### Docker Hub Deployment

```bash
# Tag image
docker tag neural-particles:latest yourusername/neural-particles:latest

# Push to Docker Hub
docker login
docker push yourusername/neural-particles:latest

# Pull and run on any server
docker pull yourusername/neural-particles:latest
docker run -d -p 3000:3000 yourusername/neural-particles:latest
```

---

## Environment Configuration

### Environment Variables

Create `.env.local` (not committed to Git):

```bash
# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME="Neural Particles"

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS=true

# Error Tracking (optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### Next.js Configuration

Update `next.config.ts` for production optimization:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Optimize production build
  swcMinify: true,

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Experimental features
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@react-three/fiber",
      "@react-three/drei",
    ],
  },
};

export default nextConfig;
```

---

## Performance Optimization

### 1. Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Update next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Analyze bundle
ANALYZE=true npm run build
```

### 2. Enable Compression

Most platforms enable compression by default. For self-hosted:

```nginx
# In Nginx config
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1000;
gzip_comp_level 6;
```

### 3. CDN Configuration

For static assets on CDN:

1. Upload `/public` and `/.next/static` to CDN
2. Configure CDN URL in Next.js:

```typescript
// next.config.ts
const nextConfig = {
  assetPrefix:
    process.env.NODE_ENV === "production" ? "https://cdn.yourdomain.com" : "",
};
```

### 4. Caching Strategy

```nginx
# Nginx cache configuration
location /_next/static/ {
    alias /var/www/neural-particles/.next/static/;
    expires 1y;
    access_log off;
    add_header Cache-Control "public, immutable";
}

location /public/ {
    alias /var/www/neural-particles/public/;
    expires 1y;
    access_log off;
    add_header Cache-Control "public, immutable";
}
```

---

## Security Configuration

### 1. Security Headers

Already configured in Nginx/Vercel config above. Verify with:

```bash
curl -I https://yourdomain.com
```

### 2. HTTPS Enforcement

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. Rate Limiting (Optional)

```nginx
# In Nginx config
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

location / {
    limit_req zone=one burst=20 nodelay;
    # ... rest of config
}
```

### 4. Content Security Policy (Advanced)

Add to `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "media-src 'self'",
            "worker-src 'self' blob:",
            "child-src 'self' blob:",
          ].join("; "),
        },
      ],
    },
  ];
}
```

---

## Troubleshooting

### Camera Not Working in Production

**Problem**: Camera access denied or not working

**Cause**: HTTPS required for `getUserMedia` API

**Solution**:

1. Ensure deployment uses HTTPS
2. Check browser permissions
3. Verify Permissions-Policy header allows camera
4. Test on `localhost` first

### Build Fails

**Problem**: Build process fails with errors

**Solutions**:

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint errors
npm run lint

# Verify Node version
node --version  # Should be 18.0+
```

### Performance Issues

**Problem**: Slow load times or poor performance

**Solutions**:

1. **Enable compression**:

   ```bash
   # Check if enabled
   curl -H "Accept-Encoding: gzip" -I https://yourdomain.com
   ```

2. **Optimize MediaPipe loading**:
   - Preload script in `<head>`
   - Use CDN with good latency

3. **Reduce particle count for mobile**:
   - Already implemented in responsive config
   - Verify with device testing

4. **Enable CDN for static assets**:
   - Configure assetPrefix in next.config.ts
   - Upload static files to CDN

### CORS Errors with MediaPipe

**Problem**: MediaPipe files blocked by CORS

**Solution**:

MediaPipe CDN should work by default. If issues occur:

1. Check network tab for failed requests
2. Verify CDN is accessible from deployment region
3. Consider self-hosting MediaPipe files:

```bash
# Download MediaPipe files
npm install @mediapipe/hands

# Copy to public directory
cp -r node_modules/@mediapipe/hands public/mediapipe
```

Update CDN URLs in constants.ts:

```typescript
export const MEDIAPIPE_CDN = {
  BASE_URL: "/mediapipe/",
  HANDS_JS: "/mediapipe/hands.js",
};
```

---

## Post-Deployment Checklist

After successful deployment, verify:

- [ ] **HTTPS enabled** (required for camera access)
- [ ] **Camera permissions working** (test in browser)
- [ ] **All shapes load correctly** (Heart, Sphere, Flower, Spiral)
- [ ] **Hand tracking functional** (test with webcam)
- [ ] **Gestures responding** (pinch, swipe, color change)
- [ ] **Mobile responsive** (test on phone/tablet)
- [ ] **Security headers configured** (verify with curl)
- [ ] **Performance acceptable** (60 FPS on desktop, 30+ on mobile)
- [ ] **Error tracking setup** (optional, e.g., Sentry)
- [ ] **Analytics configured** (optional, e.g., Google Analytics)
- [ ] **Custom domain working** (if applicable)
- [ ] **SSL certificate valid** (check expiry date)
- [ ] **Monitoring setup** (uptime, performance)

### Testing Checklist

Test core functionality:

1. **Hand Detection**:
   - Open app, allow camera access
   - Verify "HAND TRACKED" appears when hand visible
   - Test in different lighting conditions

2. **Gestures**:
   - Pinch: Close thumb and index, particles compress
   - Open hand: Spread fingers, particles explode
   - Swipe: Move hand left/right, shapes change
   - Position: Move hand horizontally, colors change

3. **Manual Controls**:
   - Click shape buttons, verify morphing
   - Drag with mouse, verify rotation
   - Test on touch device, verify touch controls

4. **Performance**:
   - Check FPS (should be 60 on desktop)
   - Test on mobile device
   - Monitor CPU/GPU usage

5. **Browser Compatibility**:
   - Chrome (recommended)
   - Firefox
   - Safari (desktop and iOS)
   - Edge

---

## Monitoring and Maintenance

### Uptime Monitoring

Setup monitoring services:

1. **Uptime Robot** (free): https://uptimerobot.com
2. **Pingdom**: https://www.pingdom.com
3. **StatusCake**: https://www.statuscake.com

### Error Tracking

Integrate error tracking:

```bash
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard -i nextjs
```

### Analytics

Add Google Analytics:

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Updates and Rollbacks

Deploy updates:

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild
npm run build

# Redeploy
vercel --prod  # or your deployment method

# PM2 (self-hosted)
pm2 restart neural-particles
```

Rollback if issues:

```bash
# Vercel
vercel rollback

# Git
git revert HEAD
git push origin main

# Docker
docker-compose down
docker pull yourusername/neural-particles:previous-tag
docker-compose up -d
```

---

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Docker Documentation](https://docs.docker.com)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

For support with deployment issues, open an issue on [GitHub](https://github.com/muhvarriel/neural-particles/issues) with:

- Deployment platform
- Error messages
- Build logs
- Browser console errors
