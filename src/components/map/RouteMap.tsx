import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export const RouteMap: React.FC = () => {

  const position: [number, number] = [12.9716, 77.5946]

  return (
    <div className="w-full h-full min-h-[450px] relative">
      <MapContainer
        center={position}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[450px] rounded-b-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  )
}
