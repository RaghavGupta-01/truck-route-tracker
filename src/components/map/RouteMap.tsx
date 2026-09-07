import React, { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LocationPoint, RouteCoordinate } from '../../types/route'
import { deliveryRoutePoints } from '../../data/deliveryRoutes'
import { createCustomLocationIcon } from '../../utils/mapIcons'
import { TruckMarker } from './TruckMarker'

const MapBoundsController: React.FC<{ points: LocationPoint[]; routeCoordinates?: RouteCoordinate[] }> = ({
  points,
  routeCoordinates,
}) => {
  const map = useMap()

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(routeCoordinates.map((c) => [c.latitude, c.longitude]))
      map.fitBounds(bounds, { padding: [50, 50] })
    } else if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [points, routeCoordinates, map])

  return null
}

interface RouteMapProps {
  points?: LocationPoint[]
  routeCoordinates?: RouteCoordinate[]
  truckPosition?: [number, number] | null
  truckLabel?: string
}

export const RouteMap: React.FC<RouteMapProps> = ({
  points = deliveryRoutePoints,
  routeCoordinates = [],
  truckPosition = null,
  truckLabel = 'TRK-104',
}) => {
  const centerPosition: [number, number] = [14.6819, 77.6006]

  const polylinePositions: [number, number][] = useMemo(
    () => routeCoordinates.map((c) => [c.latitude, c.longitude]),
    [routeCoordinates]
  )

  const activeTruckPosition: [number, number] | null =
    truckPosition ?? (points.length > 0 ? [points[0].latitude, points[0].longitude] : null)

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

        <MapBoundsController points={points} routeCoordinates={routeCoordinates} />

        {polylinePositions.length > 0 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: '#2563eb',
              weight: 4,
              opacity: 0.85,
              lineJoin: 'round',
            }}
          />
        )}

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

        <TruckMarker position={activeTruckPosition} tooltipText={truckLabel} />
      </MapContainer>
    </div>
  )
}
