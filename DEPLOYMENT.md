# ScholarShield AI — Production Deployment Guide

This document provides step-by-step instructions for deploying **ScholarShield AI** as a high-performance, secure static web application.

---

## 1. Architecture & Deployment Characteristics

- **Runtime Architecture**: 100% Client-Side Single Page Application (SPA).
- **Technology Stack**: React 19, TypeScript (Strict), Vite 6.
- **Backend Requirements**: **None**. Zero external databases, paid LLM APIs, or cloud backend endpoints are required.
- **Build Output Directory**: `dist/`
- **Asset Addressing**: Relative base path (`./`), enabling deployment at the domain root (`/`) or any nested sub-path (e.g. `/scholarshieldai/`).

---

## 2. Pre-Deployment Verification Checklist

Before deploying to any hosting platform, execute the complete quality assurance suite locally:

```bash
# 1. Run clean dependency check
npm audit

# 2. Run automated test suite (61 tests must pass)
npm test

# 3. Verify static analysis and linting (0 errors, 0 warnings)
npm run lint

# 4. Compile production bundle
npm run build

# 5. Local smoke test of production build
npm run preview
```

**Quality Invariant**: Ensure `dist/index.html`, `dist/assets/`, `dist/_redirects`, and `dist/_headers` exist before proceeding.

---

## 3. Hosting Target 1: Vercel (Recommended)

Vercel provides automated SPA routing and edge header management via the included [`vercel.json`](file:///c:/Users/irfan%20khan/Documents/Scholarshieldai/vercel.json).

### Automated Deployment via Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy directly from workspace
vercel

# Production release
vercel --prod
```

### Web Console Deployment (GitHub / GitLab / Bitbucket)
1. Push this repository to your Git provider.
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the `Scholarshieldai` repository.
4. Vercel automatically detects the Vite framework:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**.

The pre-configured `vercel.json` automatically enforces:
- SPA client-side routing fallback (`/* -> /index.html`).
- Strict Content Security Policy (`CSP`).
- `X-Content-Type-Options: nosniff`.
- `X-Frame-Options: DENY`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`.

---

## 4. Hosting Target 2: Netlify

Netlify is fully supported via the pre-built [`public/_redirects`](file:///c:/Users/irfan%20khan/Documents/Scholarshieldai/public/_redirects) and [`public/_headers`](file:///c:/Users/irfan%20khan/Documents/Scholarshieldai/public/_headers) files which Vite automatically copies to `dist/`.

### Deployment via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build production bundle
npm run build

# Deploy dist directory
netlify deploy --dir=dist --prod
```

### Web Console Deployment
1. Log in to [netlify.com](https://netlify.com) and select **"Add new site" -> "Import an existing project"**.
2. Select your repository.
3. Configure build settings:
   - **Base directory**: `.`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Deploy the site. SPA routing and security headers will activate automatically.

---

## 5. Hosting Target 3: GitHub Pages

Because Vite is configured with `base: './'`, ScholarShield AI supports hosting under a repository subpath (e.g. `https://<username>.github.io/<repository-name>/`).

### Option A: GitHub Actions Automated Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Test Suite
        run: npm test

      - name: Build Production Assets
        run: npm run build

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Option B: Manual gh-pages Branch Deployment
```bash
# Install gh-pages utility
npm install --save-dev gh-pages

# Add script to package.json: "deploy": "npm run build && gh-pages -d dist"
npm run deploy
```

---

## 6. Hosting Target 4: Static Nginx / Docker Container

For self-hosted academic laboratory or campus server deployments:

### `Dockerfile`
```dockerfile
# Stage 1: Build production bundle
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm test
RUN npm run build

# Stage 2: Serve via Nginx unprivileged
FROM nginxinc/nginx-unprivileged:alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### `nginx.conf`
```nginx
server {
    listen 8080;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; object-src 'none';" always;

    # SPA route fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static asset caching
    location ~* \.(?:css|js|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

## 7. Security Headers Verification

| Header | Production Setting | Purpose |
| :--- | :--- | :--- |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; ...` | Prevents XSS, unauthorized script loading, and clickjacking |
| `X-Content-Type-Options` | `nosniff` | Disables MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Prevents iframe embedding / clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Protects student referral privacy |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | Disables device hardware access |

---

## 8. Deployment Troubleshooting

### 1. 404 Errors on Deep Navigation Refresh
- **Cause**: The static server does not route unrecognized paths to `index.html`.
- **Remedy**: Ensure `_redirects` (Netlify) or `rewrites` (Vercel) are present in the hosting configuration.

### 2. Assets Failing to Load on GitHub Pages
- **Cause**: Assets linked with absolute paths (`/assets/...`) instead of relative paths (`./assets/...`).
- **Remedy**: Verified resolved in `vite.config.ts` with `base: './'`.

### 3. Fonts Not Rendering Offline
- **Cause**: Google Fonts CDN unreachable in an air-gapped classroom.
- **Remedy**: The application defines system font fallbacks (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`) ensuring full visual legibility even without internet access.

---

## 9. Final Pre-Flight Sign-Off

- [x] Zero external API dependencies required.
- [x] No plaintext credentials or secrets in source code or `.env.example`.
- [x] Production build passes cleanly in under 3 seconds.
- [x] `oxlint` reports 0 errors and 0 warnings on 44 source files.
- [x] 61 Vitest tests pass across 5 test suites.
- [x] Relative asset paths verified in `dist/index.html`.
- [x] Incident Report Export verified for JSON and PDF Print.
- [x] Classroom Presentation Mode functional with keyboard shortcuts.
