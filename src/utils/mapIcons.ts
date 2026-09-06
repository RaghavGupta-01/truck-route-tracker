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

export function createTruckIcon() {
  const html = `
    <div style="
      width: 32px;
      height: 32px;
      background-color: #0f172a;
      border: 2px solid #ffffff;
      border-radius: 9999px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
      transition: transform 0.1s linear;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
        <path d="M15 18H9"/>
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10"/>
        <circle cx="17" cy="18" r="2"/>
        <circle cx="7" cy="18" r="2"/>
      </svg>
    </div>
  `

  return L.divIcon({
    className: 'custom-truck-marker',
    html: html,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}
