import React from 'react'
import { MapPin } from 'lucide-react'
import type { LocationPoint } from '../types/route'

interface DeliveryProgressProps {
  stops?: LocationPoint[]
}

export const DeliveryProgress: React.FC<DeliveryProgressProps> = ({ stops = [] }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex-1">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-slate-500" />
        Delivery Progress
      </h3>

      <div className="divide-y divide-slate-100">
        {stops.map((stop) => (
          <div key={stop.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-2.5">
              <div>
                <p className="text-xs font-medium text-slate-800">{stop.name}</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {stop.type === 'origin' ? 'Origin' : stop.id}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
