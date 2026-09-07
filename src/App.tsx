import { Navigation, Loader2, AlertCircle } from 'lucide-react'
import { Header } from './components/Header'
import { RouteMap } from './components/map/RouteMap'
import { SimulationControls } from './components/SimulationControls'
import { TruckStatus } from './components/TruckStatus'
import { DeliveryProgress } from './components/DeliveryProgress'
import { deliveryRoutePoints } from './data/deliveryRoutes'
import { useRouteData } from './hooks/useRouteData'
import { useTruckSimulation } from './hooks/useTruckSimulation'

function App() {
  const { routeData, loading, error } = useRouteData(deliveryRoutePoints)

  const {
    status,
    currentPosition,
    speedMultiplier,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSpeedMultiplier,
  } = useTruckSimulation({
    routeCoordinates: routeData?.coordinates ?? [],
  })

  const truckPosTuple: [number, number] | null = currentPosition
    ? [currentPosition.latitude, currentPosition.longitude]
    : null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header Bar */}
      <Header vehicleId="TRK-104" />

      {/* Main Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Section: Map & Simulation Controls */}
        <section className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden min-h-[500px]">
          {/* Map Header Bar */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <Navigation className="w-4 h-4 text-slate-500" />
              <span>Route Map View</span>
            </div>
            {loading && (
              <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching OSRM road route...
              </span>
            )}
            {error && (
              <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Direct Route Fallback
              </span>
            )}
          </div>

          {/* Map Viewport */}
          <div className="flex-1 relative min-h-[450px]">
            <RouteMap
              points={deliveryRoutePoints}
              routeCoordinates={routeData?.coordinates}
              truckPosition={truckPosTuple}
            />
          </div>

          {/* Controls Bar */}
          <SimulationControls
            status={status}
            speedMultiplier={speedMultiplier}
            onStart={startSimulation}
            onPause={pauseSimulation}
            onReset={resetSimulation}
            onSpeedChange={setSpeedMultiplier}
          />
        </section>

        {/* Right Section: Telemetry & Progress Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-4">
          <TruckStatus
            currentPosition="Bengaluru (Origin)"
            distanceCoveredKm={0.0}
            totalDistanceKm={routeData?.totalDistanceKm ?? null}
            nextStop="Anantapur (D1)"
            completedCount={0}
            totalStops={3}
          />
          <DeliveryProgress stops={deliveryRoutePoints} />
        </aside>
      </main>
    </div>
  )
}

export default App

