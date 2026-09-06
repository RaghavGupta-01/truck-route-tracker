# Truck Route Visualizer — Fleet Tracking Application

A real-time logistics truck route tracking application built with **React**, **TypeScript**, **Leaflet**, **Tailwind CSS**, and **OSRM (Open Source Routing Machine)**.

It simulates a commercial logistics truck traveling along the highway corridor:
**Bengaluru (Origin) → Anantapur (D1) → Kurnool (D2) → Hyderabad (D3)**

---

## Features

- **Interactive Route Map**: Implemented with Leaflet and OpenStreetMap tiles with auto-fitting viewport bounds.
- **Location Markers**: Custom visual pins for Origin (Green) and Delivery Stops D1, D2, D3 (Purple/Indigo) with click-to-view tooltip labels.
- **OSRM Road Routing**: Fetches actual highway road geometry via OSRM API and renders a clean road polyline.
- **Session Storage Caching**: Caches fetched OSRM route data in `sessionStorage` to eliminate redundant network calls and rate limits on page reloads.
- **Modular Component Architecture**:
  - `Header`: Navigation bar with vehicle identifier badge.
  - `RouteMap`: Leaflet map viewport, tile layer, polyline, and markers.
  - `SimulationControls`: Start, Pause, and Reset control bar.
  - `TruckStatus`: Live telemetry card for position, distance, next stop, and completion stats.
  - `DeliveryProgress`: Sequential stop progression list.
  - `useRouteData`: Custom React hook encapsulating OSRM data fetching and caching logic.

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
│   │   │   └── RouteMap.tsx          # Leaflet map, polyline, and markers
│   │   ├── Header.tsx                # Top navigation header bar
│   │   ├── SimulationControls.tsx    # Simulation control buttons
│   │   ├── TruckStatus.tsx           # Live telemetry status panel
│   │   └── DeliveryProgress.tsx      # Sequential stop progress checklist
│   ├── hooks/
│   │   └── useRouteData.ts           # Route fetching and caching hook
│   ├── services/
│   │   └── routingService.ts         # OSRM API integration & sessionStorage cache
│   ├── data/
│   │   └── deliveryRoutes.ts         # Predefined location coordinates
│   ├── utils/
│   │   └── mapIcons.ts               # Leaflet divIcon marker generators
│   ├── types/
│   │   └── route.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                       # Main dashboard layout orchestrator
│   └── index.css                     # Tailwind CSS & Leaflet overrides
├── README.md
└── package.json
```
