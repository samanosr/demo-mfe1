# React 19 + Vite Module Federation Demo

A micro-frontend demo showcasing **Module Federation** with **React 19** and **Vite 6**.

## Architecture

```
host/          → Shell app (port 5000) — consumes remote components
remote-app/    → Remote app (port 5001) — exposes Counter & Card components
```

## Quick Start

### 1. Install dependencies

```bash
cd remote-app && npm install
cd ../host && npm install
```

### 2. Run in development mode

**Terminal 1 — Remote App:**
```bash
cd remote-app
npm run dev
```

**Terminal 2 — Host App:**
```bash
cd host
npm run dev
```

### 3. Open in browser

- **Host (Shell):** [http://localhost:5000](http://localhost:5000)
- **Remote (Standalone):** [http://localhost:5001](http://localhost:5001)

## Production Build

```bash
# Build remote first
cd remote-app && npm run build

# Then build host
cd ../host && npm run build

# Preview
cd ../remote-app && npm run preview -- --port 5001 &
cd ../host && npm run preview -- --port 5000
```

## Tech Stack

| Package | Version |
|---------|---------|
| React | ^19.0.0 |
| Vite | ^6.2.0 |
| @module-federation/vite | ^1.12.3 |
