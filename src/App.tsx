import { Truck, Navigation, Activity, MapPin } from 'lucide-react'
import { RouteMap } from './components/map/RouteMap'
import { deliveryRoutePoints } from './data/deliveryRoutes'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation Header */}
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

          {/* Simple Vehicle Info & Status */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <span>Vehicle: <strong className="text-slate-900">TRK-104</strong></span>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Section: Map Container */}
        <section className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden min-h-[500px]">
          {/* Map Header Bar */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <Navigation className="w-4 h-4 text-slate-500" />
              <span>Route Map View</span>
            </div>
          </div>

          {/* Map Viewport */}
          <div className="flex-1 relative min-h-[450px]">
            <RouteMap points={deliveryRoutePoints} />
          </div>

          {/* Controls Bar */}
          <div className="p-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded transition-colors cursor-pointer">
                Start Simulation
              </button>
              <button className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded border border-slate-300 transition-colors cursor-pointer">
                Pause
              </button>
              <button className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded border border-slate-300 transition-colors cursor-pointer">
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* Right Section: Telemetry & Stop List Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-4">
          {/* Tracking Telemetry Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              Truck Status
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Current Position</span>
                <span className="font-semibold text-slate-800">Origin</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Distance Covered</span>
                <span className="font-semibold text-slate-800">0.0 km</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Next Stop</span>
                <span className="font-semibold text-slate-800">Anantapur (D1)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Completed</span>
                <span className="font-semibold text-slate-800">0/3</span>
              </div>
            </div>
          </div>

          {/* Delivery Stop List */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Delivery Progress
            </h3>

            <div className="divide-y divide-slate-100">
              {[
                { name: 'Bengaluru (Origin)', status: 'Pending', tag: 'Origin' },
                { name: 'Anantapur (D1)', status: 'Upcoming', tag: 'D1' },
                { name: 'Kurnool (D2)', status: 'Upcoming', tag: 'D2' },
                { name: 'Hyderabad (D3)', status: 'Upcoming', tag: 'D3' },
              ].map((stop, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <div>
                      <p className="text-xs font-medium text-slate-800">{stop.name}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{stop.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
