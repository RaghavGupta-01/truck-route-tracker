import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LocationPoint } from '../../types/route'
import { deliveryRoutePoints } from '../../data/deliveryRoutes'
import { createCustomLocationIcon } from '../../utils/mapIcons'

const MapBoundsController: React.FC<{ points: LocationPoint[] }> = ({ points }) => {
  const map = useMap()

  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [points, map])

  return null
}

interface RouteMapProps {
  points?: LocationPoint[]
}

export const RouteMap: React.FC<RouteMapProps> = ({ points = deliveryRoutePoints }) => {
  const centerPosition: [number, number] = [14.6819, 77.6006]

  return (
    <div className="w-full h-full min-h-[450px] relative">
      <MapContainer
        center={centerPosition}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[450px] rounded-b-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsController points={points} />

        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            icon={createCustomLocationIcon(point)}
          >
            <Tooltip direction="right" offset={[15, 0]} opacity={1}>
              <div className="text-xs font-semibold text-slate-800 font-sans whitespace-nowrap">
                {point.name}
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
