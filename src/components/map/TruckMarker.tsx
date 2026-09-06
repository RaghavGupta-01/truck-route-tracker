import React from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import { createTruckIcon } from '../../utils/mapIcons'

interface TruckMarkerProps {
  position: [number, number] | null
  tooltipText?: string
}

export const TruckMarker: React.FC<TruckMarkerProps> = ({
  position,
  tooltipText = 'TRK-104',
}) => {
  if (!position) return null

  return (
    <Marker position={position} icon={createTruckIcon()} zIndexOffset={1000}>
      {tooltipText && (
        <Tooltip direction="top" offset={[0, -18]} opacity={0.95}>
          <div className="text-xs font-semibold text-slate-800 font-sans whitespace-nowrap">
            {tooltipText}
          </div>
        </Tooltip>
      )}
    </Marker>
  )
}
