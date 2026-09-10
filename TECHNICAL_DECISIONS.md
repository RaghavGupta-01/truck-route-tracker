# Technical Decisions

## 1. Client-Side Rendering
- **Decision**: Used Client-Side Rendering with React 19 and Vite.
- **Reason**: The application is highly interactive and browser-dependent. Map rendering, interactive controls, and continuous telemetry displays require client-side execution. SSR/RSC provide limited value for this application and would add unnecessary complexity.

---

## 2. Map Library
- **Decision**: Used Leaflet with React Leaflet.
- **Reason**: The application requires an interactive map with markers, polylines, and tooltips. Leaflet provides these capabilities with zero API key requirements, low setup complexity, lightweight overhead, and robust raster tile rendering.

---

## 3. Routing Engine
- **Decision**: Used OSRM (Open Source Routing Machine) with OpenStreetMap highway data.
- **Reason**: The route should follow actual road geometry rather than a straight line between stops. OSRM provides road-following route geometry coordinates that can be rendered directly on the map.

---

## 4. Single-Request Route Fetching
- **Decision**: Request the complete Origin → D1 → D2 → D3 route in a single routing request.
- **Reason**: This provides a continuous route geometry for the map, avoids unnecessary API calls for each segment, and reduces network latency.

---

## 5. Storage & Persistence Caching
- **Decision**: Persist fetched OSRM route geometry in browser `sessionStorage`.
- **Reason**: Public OSRM servers enforce strict rate limits (HTTP 429). Caching the parsed route payload by coordinate key eliminates redundant network calls on page reloads, ensuring instant 0 ms load times while offline or re-rendering.

---

## 6. State Management Architecture
- **Decision**: Used native React state and custom hooks (`useRouteData`, `useTruckSimulation`) rather than introducing a global state library like Zustand.
- **Reason**: The application has a single dashboard page with a flat component tree. Encapsulating route data fetching and simulation state inside custom hooks maintains simple data flow and avoids unneeded dependencies.

---

## 7. Component Modularization & Separation of Concerns
- **Decision**: Strictly decoupled UI presentation (`Header`, `TruckStatus`, `DeliveryProgress`, `SimulationControls`), map container (`RouteMap`), data layer (`routingService`), and hook logic (`useRouteData`, `useTruckSimulation`).
- **Reason**: Separating concerns ensures clean TypeScript contracts, simplifies testing, prevents component bloat, and adheres to clean engineering practices.

---

## 8. Truck Movement Simulation
- **Decision**: Used `requestAnimationFrame` for a time-based animation loop (`useTruckSimulation`).
- **Reason**: Smooth 60 FPS animation that is frame-rate independent across different displays, unlike `setInterval` which can cause stutter. Frame deltas are capped to prevent jumps when switching browser tabs.

---

## 9. Stop Detection
- **Decision**: Track stop completion using cumulative distance along the OSRM route (`findStopDistances`).
- **Reason**: Maps each stop to its exact kilometer mark along the road polyline, making stop detection accurate instead of relying on fixed ratios or floating-point coordinate equality.

---

## 10. Distance Normalization & Telemetry Synchronization
- **Decision**: Normalize the client-side calculated route distance to match the total distance returned by the OSRM API.
- **Reason**: 
  - The client calculates distance by summing straight-line segments between GPS coordinates using the Haversine formula, whereas the OSRM backend calculates distance along exact road curves.
  - This difference creates a minor variance (~573 km vs OSRM's 571.1 km).
  - Normalizing the cumulative distances ensures the truck simulation, stop milestones, and live telemetry counter (`571.1 / 571.1 km`) remain synchronized without exceeding 100% completion.


