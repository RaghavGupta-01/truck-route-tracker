import React from 'react'

interface SimulationControlsProps {
  isStarted?: boolean
  onStart?: () => void
  onPause?: () => void
  onReset?: () => void
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isStarted = false,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div className="p-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onStart}
          disabled={isStarted}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs rounded transition-colors cursor-pointer"
        >
          Start Simulation
        </button>
        <button
          onClick={onPause}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded border border-slate-300 transition-colors cursor-pointer"
        >
          Pause
        </button>
        <button
          onClick={onReset}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded border border-slate-300 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
