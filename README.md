# Truck Route Visualizer

A real-time logistics truck route tracking application built with **React**, **TypeScript**, **Leaflet**, **Tailwind CSS**, and **OSRM (Open Source Routing Machine)**.

It simulates a commercial logistics truck traveling along the highway corridor:
**Bengaluru (Origin) → Anantapur (D1) → Kurnool (D2) → Hyderabad (D3)**

---

> **Live Demo**: https://truck-route-tracker.vercel.app/
> 
> *Tip: The simulation completes in ~82 seconds on **Max** speed.*

---

## Features

- **Interactive Route Map**: Implemented with Leaflet and OpenStreetMap tiles with auto-fitting viewport bounds.
- **Location Markers**: Custom visual pins for Origin (Green) and Delivery Stops D1, D2, D3 (Indigo) with click-to-view tooltip labels.
- **OSRM Road Routing**: Fetches actual highway road geometry via OSRM API and renders a clean road polyline.
- **Session Storage Caching**: Caches fetched OSRM route data in `sessionStorage` to eliminate redundant network calls and rate limits on page reloads.
- **Truck Movement Simulation**: Smooth 60 FPS animation via `requestAnimationFrame` with Start, Pause, Resume, Reset, and speed multiplier controls (1x, 2x, 4x, 8x, Max).
- **Exact Stop Tracking**: Maps each stop location to its exact distance along the OSRM polyline for accurate progress and status updates.
- **Modular Component Architecture**:
  - `Header`: Navigation bar with vehicle identifier badge.
  - `RouteMap`: Leaflet map viewport, tile layer, polyline, and markers.
  - `SimulationControls`: Start, Pause, Reset, and Speed control bar.
  - `TruckStatus`: Live telemetry card for position, distance, next stop, and completion stats.
  - `DeliveryProgress`: Sequential stop progression timeline with blue/grey indicators.
  - `useRouteData`: Custom React hook encapsulating OSRM data fetching and caching logic.
  - `useTruckSimulation`: Custom React hook handling truck movement animation and state.

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Mapping**: Leaflet + React Leaflet
- **Icons**: Lucide React
- **Routing API**: OSRM (Open Source Routing Machine)
- **Linter**: Oxlint

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Run Linter Check
```bash
npm run lint
```

---

## Project Structure

```text
truck-route-tracker/
├── src/
│   ├── components/
│   │   ├── map/
│   │   │   ├── RouteMap.tsx          # Leaflet map, polyline, and markers
│   │   │   └── TruckMarker.tsx       # Truck marker icon
│   │   ├── Header.tsx                # Top navigation header bar
│   │   ├── SimulationControls.tsx    # Simulation control buttons
│   │   ├── TruckStatus.tsx           # Live telemetry status panel
│   │   └── DeliveryProgress.tsx      # Sequential stop progress timeline
│   ├── hooks/
│   │   ├── useRouteData.ts           # Route fetching and caching hook
│   │   └── useTruckSimulation.ts     # Truck animation and simulation hook
│   ├── services/
│   │   └── routingService.ts         # OSRM API integration & sessionStorage cache
│   ├── data/
│   │   └── deliveryRoutes.ts         # Predefined location coordinates
│   ├── utils/
│   │   ├── geoUtils.ts               # Geographic distance & interpolation math
│   │   └── mapIcons.ts               # Leaflet divIcon marker generators
│   ├── types/
│   │   └── route.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                       # Main dashboard layout orchestrator
│   └── index.css                     # Tailwind CSS & Leaflet overrides
├── ASSUMPTIONS.md
├── TECHNICAL_DECISIONS.md
├── README.md
└── package.json
```
