# Copy-Paste Converter Hub

A fast, privacy-focused, no-login utility site for developers and data analysts.
Built with Next.js 14, TypeScript, and pure CSS.

## Features
- **Offline & Private**: all conversions happen in-browser. No data sent to servers.
- **Fast**: Minimal JS bundle, static generation for all tools.
- **Tools**:
  - Timestamp Converter (Unix <-> Date)
  - JSON Formatter & Validator
  - JSON <-> CSV Converter
  - Base64 & URL Encoder/Decoder
  - Case Converter (camel, snake, kebab, etc.)
  - Word & Character Counter
  - Text to SQL IN List

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Variables (Dark/Light mode support)
- **Tests**: Vitest
- **Deployment**: Vercel (recommended) or Static Export

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run locally**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

3. **Run tests**:
   ```bash
   npm run test
   ```

## Deployment

### Vercel (Recommended)
1. Push to GitHub.
2. Import project in Vercel.
3. Framework Preset: Next.js.
4. Deploy.

### Static Export
1. Run `npm run build`.
2. The `out` folder (if configured for export) or `.next` folder contains the build.
   *Note: Default config uses standard Next.js server/static hybrid. To export purely static HTML, add `output: 'export'` to `next.config.mjs`.*
