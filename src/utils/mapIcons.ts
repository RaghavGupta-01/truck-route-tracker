import L from 'leaflet'
import type { LocationPoint } from '../types/route'

export function createCustomLocationIcon(point: LocationPoint) {
  const isOrigin = point.type === 'origin'
  const bandColor = isOrigin ? '#10b981' : '#4f46e5'

  const html = `
    <div style="
      width: 16px;
      height: 16px;
      background-color: #ffffff;
      border: 4px solid ${bandColor};
      border-radius: 9999px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      box-sizing: border-box;
      transform: translate(-50%, -50%);
    "></div>
  `

  return L.divIcon({
    className: 'custom-route-marker',
    html: html,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}
