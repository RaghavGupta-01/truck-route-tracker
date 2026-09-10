import React from 'react'
import { Truck } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-md text-white">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Truck Route Tracker
            </h1>
          </div>
        </div>

      </div>
    </header>
  )
}
