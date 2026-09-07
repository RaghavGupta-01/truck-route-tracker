import React from 'react'
import type { SimulationStatus } from '../hooks/useTruckSimulation'

interface SimulationControlsProps {
  status?: SimulationStatus
  speedMultiplier?: number
  onStart?: () => void
  onPause?: () => void
  onReset?: () => void
  onSpeedChange?: (speed: number) => void
}

const SPEED_OPTIONS = [1, 2, 4, 8, 100]

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  status = 'ready',
  speedMultiplier = 1,
  onStart,
  onPause,
  onReset,
  onSpeedChange,
}) => {
  const isStarted = status === 'in_transit'
  const canPause = status === 'in_transit'
  const canReset = status !== 'ready'

  return (
    <div className="p-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
      {/* Primary Playback Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onStart}
          disabled={isStarted}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs rounded transition-colors cursor-pointer"
        >
          {status === 'paused' ? 'Resume' : 'Start Simulation'}
        </button>
        <button
          onClick={onPause}
          disabled={!canPause}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-medium text-xs rounded border border-slate-300 transition-colors cursor-pointer"
        >
          Pause
        </button>
        <button
          onClick={onReset}
          disabled={!canReset}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-medium text-xs rounded border border-slate-300 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Speed Multiplier Options */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200">
        <span className="text-[11px] font-semibold text-slate-500 px-1.5">Speed:</span>
        {SPEED_OPTIONS.map((speed) => {
          const isActive = speedMultiplier === speed
          return (
            <button
              key={speed}
              onClick={() => onSpeedChange?.(speed)}
              className={`px-2 py-0.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {speed}x
            </button>
          )
        })}
      </div>
    </div>
  )
}
