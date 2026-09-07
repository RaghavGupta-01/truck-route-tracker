import React from 'react'
import { Activity } from 'lucide-react'
import type { SimulationStatus } from '../hooks/useTruckSimulation'

interface TruckStatusProps {
  status?: SimulationStatus
  currentPosition?: string
  distanceCoveredKm?: number
  totalDistanceKm?: number | null
  nextStop?: string
  completedCount?: number
  totalStops?: number
}

const statusBadgeStyles: Record<SimulationStatus, { label: string; className: string }> = {
  ready: { label: 'Ready', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  in_transit: { label: 'In Transit', className: 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse' },
  paused: { label: 'Paused', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

export const TruckStatus: React.FC<TruckStatusProps> = ({
  status = 'ready',
  currentPosition = 'Bengaluru (Origin)',
  distanceCoveredKm = 0.0,
  totalDistanceKm = null,
  nextStop = 'Anantapur (D1)',
  completedCount = 0,
  totalStops = 3,
}) => {
  const badge = statusBadgeStyles[status]

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-slate-500" />
          Truck Status
        </h3>
        <span
          className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

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
