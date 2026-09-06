import React from 'react'
import { Activity } from 'lucide-react'

interface TruckStatusProps {
  currentPosition?: string
  distanceCoveredKm?: number
  totalDistanceKm?: number | null
  nextStop?: string
  completedCount?: number
  totalStops?: number
}

export const TruckStatus: React.FC<TruckStatusProps> = ({
  currentPosition = 'Bengaluru (Origin)',
  distanceCoveredKm = 0.0,
  totalDistanceKm = null,
  nextStop = 'Anantapur (D1)',
  completedCount = 0,
  totalStops = 3,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5 text-slate-500" />
        Truck Status
      </h3>

      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Current Position</span>
          <span className="font-semibold text-slate-800">{currentPosition}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Distance Covered</span>
          <span className="font-semibold text-slate-800">
            {distanceCoveredKm.toFixed(1)} / {totalDistanceKm ? `${totalDistanceKm.toFixed(1)} km` : '-- km'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Next Stop</span>
          <span className="font-semibold text-slate-800">{nextStop}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500 font-medium">Completed</span>
          <span className="font-semibold text-slate-800">
            {completedCount}/{totalStops}
          </span>
        </div>
      </div>
    </div>
  )
}
