import React from 'react'
import { MapPin } from 'lucide-react'
import type { LocationPoint } from '../types/route'
import type { SimulationStatus } from '../hooks/useTruckSimulation'

interface DeliveryProgressProps {
  stops?: LocationPoint[]
  completedCount?: number
  status?: SimulationStatus
}

export const DeliveryProgress: React.FC<DeliveryProgressProps> = ({
  stops = [],
  completedCount = 0,
  status = 'ready',
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex-1">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-slate-500" />
        Delivery Progress
      </h3>

      <div className="space-y-4">
        {stops.map((stop, idx) => {
          const isOrigin = stop.type === 'origin'
          const isLast = idx === stops.length - 1

          let isReached = false
          if (isOrigin) {
            isReached = status !== 'ready' || completedCount > 0
          } else {
            isReached = completedCount >= idx
          }

          const isLineBlue =
            status === 'completed' ||
            completedCount > idx ||
            (completedCount === idx && (status === 'in_transit' || status === 'paused'))

          return (
            <div key={stop.id} className="relative flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">

                <div className="relative flex flex-col items-center justify-center w-4">
                  {!isLast && (
                    <div
                      className={`absolute top-3.5 w-0.5 h-7 z-0 transition-colors duration-300 ${isLineBlue ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                    />
                  )}
                  <div className="relative z-10 bg-white py-0.5">
                    {isReached ? (
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                    )}
                  </div>
                </div>

                <p className={`font-semibold ${isReached ? 'text-slate-800' : 'text-slate-500'}`}>
                  {stop.name}
                </p>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}
