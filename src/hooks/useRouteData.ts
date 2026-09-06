import { useState, useEffect, useCallback } from 'react'
import type { LocationPoint, RouteData } from '../types/route'
import { fetchOSRMRoute } from '../services/routingService'

interface UseRouteDataResult {
  routeData: RouteData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useRouteData(points: LocationPoint[]): UseRouteDataResult {
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadRoute = useCallback(async () => {
    if (!points || points.length < 2) {
      setError('At least 2 route points are required.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await fetchOSRMRoute(points)
      setRouteData(data)
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch OSRM road route.')
    } finally {
      setLoading(false)
    }
  }, [points])

  useEffect(() => {
    loadRoute()
  }, [loadRoute])

  return {
    routeData,
    loading,
    error,
    refetch: loadRoute,
  }
}
