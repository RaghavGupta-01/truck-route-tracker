import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { LocationPoint, RouteCoordinate } from '../types/route'
import { computeCumulativeDistances, interpolatePosition, findStopDistances } from '../utils/geoUtils'

export type SimulationStatus = 'ready' | 'in_transit' | 'paused' | 'completed'

interface UseTruckSimulationProps {
  routeCoordinates: RouteCoordinate[]
  stops?: LocationPoint[]
  baseSpeedKmh?: number
}

interface UseTruckSimulationReturn {
  status: SimulationStatus
  currentPosition: RouteCoordinate | null
  distanceCoveredKm: number
  progressPercent: number
  currentLocationName: string
  nextStopName: string
  completedCount: number
  speedMultiplier: number
  startSimulation: () => void
  pauseSimulation: () => void
  resetSimulation: () => void
  setSpeedMultiplier: (speed: number) => void
}

export function useTruckSimulation({
  routeCoordinates,
  stops = [],
  baseSpeedKmh = 50,
}: UseTruckSimulationProps): UseTruckSimulationReturn {
  const [status, setStatus] = useState<SimulationStatus>('ready')
  const [distanceCoveredKm, setDistanceCoveredKm] = useState<number>(0)
  const [speedMultiplier, setSpeedMultiplierState] = useState<number>(1)

  // Compute cumulative distances along the route polyline
  const cumulativeDistances = useMemo(() => {
    return computeCumulativeDistances(routeCoordinates)
  }, [routeCoordinates])

  const totalDistanceKm = useMemo(() => {
    if (cumulativeDistances.length === 0) return 0
    return cumulativeDistances[cumulativeDistances.length - 1]
  }, [cumulativeDistances])

  // Compute exact kilometer mark for each delivery stop along the polyline
  const stopDistances = useMemo(() => {
    return findStopDistances(stops, routeCoordinates, cumulativeDistances)
  }, [stops, routeCoordinates, cumulativeDistances])

  // Animation frame and timer references
  const animFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const distanceRef = useRef<number>(0)
  const speedMultiplierRef = useRef<number>(speedMultiplier)
  const animateStepRef = useRef<(timestamp: number) => void>(() => { })

  // Sync speedMultiplierRef
  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier
  }, [speedMultiplier])

  // Reset state asynchronously when route coordinates change
  useEffect(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    lastTimeRef.current = null
    distanceRef.current = 0
    queueMicrotask(() => {
      setDistanceCoveredKm(0)
      setStatus('ready')
    })
  }, [routeCoordinates])

  // Current position derived from current distance covered
  const currentPosition = useMemo((): RouteCoordinate | null => {
    if (!routeCoordinates || routeCoordinates.length === 0) return null
    if (distanceCoveredKm <= 0) return routeCoordinates[0]
    if (distanceCoveredKm >= totalDistanceKm) return routeCoordinates[routeCoordinates.length - 1]

    let low = 0
    let high = cumulativeDistances.length - 2
    let segIdx = 0

    while (low <= high) {
      const mid = (low + high) >> 1
      if (cumulativeDistances[mid + 1] <= distanceCoveredKm) {
        segIdx = mid
        low = mid + 1
      } else if (cumulativeDistances[mid] > distanceCoveredKm) {
        high = mid - 1
      } else {
        segIdx = mid
        break
      }
    }

    if (segIdx >= routeCoordinates.length - 1) {
      return routeCoordinates[routeCoordinates.length - 1]
    }

    const segStartDist = cumulativeDistances[segIdx]
    const segEndDist = cumulativeDistances[segIdx + 1]
    const segLength = segEndDist - segStartDist

    const p1 = routeCoordinates[segIdx]
    const p2 = routeCoordinates[segIdx + 1]

    if (segLength <= 0) return p1

    const ratio = (distanceCoveredKm - segStartDist) / segLength
    return interpolatePosition(p1, p2, ratio)
  }, [routeCoordinates, cumulativeDistances, distanceCoveredKm, totalDistanceKm])

  // Telemetry details (current location name, next stop name, completed stop count)
  const telemetry = useMemo(() => {
    const defaultOrigin = stops[0]?.name ?? 'Bengaluru (Origin)'
    const defaultNext = stops[1]?.name ?? 'Anantapur (D1)'

    if (stops.length === 0 || totalDistanceKm <= 0 || stopDistances.length === 0) {
      return {
        currentLocationName: defaultOrigin,
        nextStopName: defaultNext,
        completedCount: 0,
      }
    }

    if (status === 'completed' || distanceCoveredKm >= totalDistanceKm - 0.1) {
      return {
        currentLocationName: stops[stops.length - 1]?.name ?? 'Hyderabad (D3)',
        nextStopName: 'Destination Reached',
        completedCount: Math.max(0, stops.length - 1),
      }
    }

    // Find first stop index where stopDistance > distanceCoveredKm
    let nextIdx = 1
    while (nextIdx < stops.length && distanceCoveredKm >= (stopDistances[nextIdx] ?? Infinity)) {
      nextIdx++
    }

    const completedCount = Math.max(0, nextIdx - 1)
    const isAtStop = Math.abs(distanceCoveredKm - (stopDistances[completedCount] ?? 0)) < 0.5

    let currentLocationName = ''
    if (distanceCoveredKm === 0) {
      currentLocationName = stops[0]?.name ?? defaultOrigin
    } else if (isAtStop && completedCount > 0) {
      currentLocationName = `At ${stops[completedCount]?.name}`
    } else {
      currentLocationName = `En Route to ${stops[nextIdx]?.name ?? stops[stops.length - 1]?.name}`
    }

    const nextStopName = nextIdx < stops.length ? stops[nextIdx]?.name : 'Destination Reached'

    return { currentLocationName, nextStopName, completedCount }
  }, [distanceCoveredKm, totalDistanceKm, status, stops, stopDistances])

  // Animation loop logic
  const animate = useCallback(
    (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp
      }

      const rawDeltaTimeSec = (timestamp - lastTimeRef.current) / 1000
      const deltaTimeSec = Math.min(rawDeltaTimeSec, 0.1)
      lastTimeRef.current = timestamp

      const currentSpeedKmh = baseSpeedKmh * speedMultiplierRef.current
      const deltaDistanceKm = (currentSpeedKmh / 3600) * deltaTimeSec
      const nextDistance = distanceRef.current + deltaDistanceKm

      if (nextDistance >= totalDistanceKm && totalDistanceKm > 0) {
        distanceRef.current = totalDistanceKm
        setDistanceCoveredKm(totalDistanceKm)
        setStatus('completed')
        lastTimeRef.current = null
        animFrameRef.current = null
        return
      }

      distanceRef.current = nextDistance
      setDistanceCoveredKm(nextDistance)

      animFrameRef.current = requestAnimationFrame((ts) => animateStepRef.current(ts))
    },
    [baseSpeedKmh, totalDistanceKm]
  )

  useEffect(() => {
    animateStepRef.current = animate
  }, [animate])

  const startSimulation = useCallback(() => {
    if (routeCoordinates.length === 0) return
    if (animFrameRef.current !== null) return

    if (status === 'completed') {
      distanceRef.current = 0
      setDistanceCoveredKm(0)
    }
    setStatus('in_transit')
    lastTimeRef.current = null
    animFrameRef.current = requestAnimationFrame((ts) => animateStepRef.current(ts))
  }, [routeCoordinates.length, status])

  const pauseSimulation = useCallback(() => {
    if (status !== 'in_transit') return
    setStatus('paused')
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    lastTimeRef.current = null
  }, [status])

  const resetSimulation = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    lastTimeRef.current = null
    distanceRef.current = 0
    setDistanceCoveredKm(0)
    setStatus('ready')
  }, [])

  const setSpeedMultiplier = useCallback((speed: number) => {
    setSpeedMultiplierState(speed)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [])

  const progressPercent =
    totalDistanceKm > 0 ? Math.min(100, (distanceCoveredKm / totalDistanceKm) * 100) : 0

  return {
    status,
    currentPosition,
    distanceCoveredKm,
    progressPercent,
    currentLocationName: telemetry.currentLocationName,
    nextStopName: telemetry.nextStopName,
    completedCount: telemetry.completedCount,
    speedMultiplier,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSpeedMultiplier,
  }
}
