import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { RouteCoordinate } from '../types/route'
import { computeCumulativeDistances, interpolatePosition } from '../utils/geoUtils'

export type SimulationStatus = 'ready' | 'in_transit' | 'paused' | 'completed'

interface UseTruckSimulationProps {
  routeCoordinates: RouteCoordinate[]
  baseSpeedKmh?: number
}

interface UseTruckSimulationReturn {
  status: SimulationStatus
  currentPosition: RouteCoordinate | null
  speedMultiplier: number
  startSimulation: () => void
  pauseSimulation: () => void
  resetSimulation: () => void
  setSpeedMultiplier: (speed: number) => void
}

export function useTruckSimulation({
  routeCoordinates,
  baseSpeedKmh = 120,
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

  // Animation frame and timer references
  const animFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const distanceRef = useRef<number>(0)
  const speedMultiplierRef = useRef<number>(speedMultiplier)

  // Sync speedMultiplierRef
  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier
  }, [speedMultiplier])

  // Reset when route coordinates change
  useEffect(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    distanceRef.current = 0
    setDistanceCoveredKm(0)
    setStatus('ready')
  }, [routeCoordinates])

  // Current position derived from current distance covered
  const currentPosition = useMemo((): RouteCoordinate | null => {
    if (!routeCoordinates || routeCoordinates.length === 0) return null
    if (distanceCoveredKm <= 0) return routeCoordinates[0]
    if (distanceCoveredKm >= totalDistanceKm) return routeCoordinates[routeCoordinates.length - 1]

    let segIdx = 0
    while (
      segIdx < cumulativeDistances.length - 1 &&
      cumulativeDistances[segIdx + 1] < distanceCoveredKm
    ) {
      segIdx++
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

  // Animation loop logic
  const animate = useCallback(
    (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp
      }

      const deltaTimeSec = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      const currentSpeedKmh = baseSpeedKmh * speedMultiplierRef.current
      const deltaDistanceKm = (currentSpeedKmh / 3600) * deltaTimeSec
      const nextDistance = distanceRef.current + deltaDistanceKm

      if (nextDistance >= totalDistanceKm && totalDistanceKm > 0) {
        distanceRef.current = totalDistanceKm
        setDistanceCoveredKm(totalDistanceKm)
        setStatus('completed')
        lastTimeRef.current = null
        return
      }

      distanceRef.current = nextDistance
      setDistanceCoveredKm(nextDistance)

      animFrameRef.current = requestAnimationFrame(animate)
    },
    [baseSpeedKmh, totalDistanceKm]
  )

  const startSimulation = useCallback(() => {
    if (routeCoordinates.length === 0) return
    if (status === 'completed') {
      distanceRef.current = 0
      setDistanceCoveredKm(0)
    }
    setStatus('in_transit')
    lastTimeRef.current = null
    animFrameRef.current = requestAnimationFrame(animate)
  }, [routeCoordinates.length, status, animate])

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

  return {
    status,
    currentPosition,
    speedMultiplier,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSpeedMultiplier,
  }
}
