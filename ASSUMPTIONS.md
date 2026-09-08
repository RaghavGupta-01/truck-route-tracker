# Assumptions

## Route
- The route consists of one predefined Origin and three delivery stops.
- Locations are fixed mock coordinates.
- Users do not create or modify routes.

## Routing
- Road-following geometry is obtained from OSRM.
- The application does not implement its own routing algorithm.

## Simulation
- Truck movement is simulated locally.
- No real GPS data is involved.
- Average truck speed is assumed to be 120 km/h.

## Data
- Route and vehicle data are mock/static.
- No backend persistence is required.
