import type { LocationPoint } from '../types/route'


export const deliveryRoutePoints: LocationPoint[] = [
  {
    id: 'origin',
    name: 'Bengaluru (Origin)',
    latitude: 12.9716,
    longitude: 77.5946,
    type: 'origin',
  },
  {
    id: 'D1',
    name: 'Anantapur (D1)',
    latitude: 14.6819,
    longitude: 77.6006,
    type: 'delivery',
  },
  {
    id: 'D2',
    name: 'Kurnool (D2)',
    latitude: 15.8281,
    longitude: 78.0373,
    type: 'delivery',
  },
  {
    id: 'D3',
    name: 'Hyderabad (D3)',
    latitude: 17.385,
    longitude: 78.4867,
    type: 'delivery',
  },
]
