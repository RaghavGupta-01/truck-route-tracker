import type { LocationPoint, RouteCoordinate } from '../types/route'

/**
 * Calculates the Haversine distance between two GPS coordinates in kilometers.
 */
export function haversineDistance(
  p1: RouteCoordinate,
  p2: RouteCoordinate
): number {
  const EARTH_RADIUS_KM = 6371
  const dLat = toRadians(p2.latitude - p1.latitude)
  const dLon = toRadians(p2.longitude - p1.longitude)

  const lat1 = toRadians(p1.latitude)
  const lat2 = toRadians(p2.latitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

/**
 * Computes an array of cumulative distances along a route coordinate array.
 * cumulativeDistances[0] = 0
 * cumulativeDistances[i] = cumulativeDistances[i-1] + dist(p[i-1], p[i])
 */
export function computeCumulativeDistances(
  coordinates: RouteCoordinate[]
): number[] {
  if (!coordinates || coordinates.length === 0) return [0]

  const cumulative: number[] = [0]
  let total = 0

  for (let i = 1; i < coordinates.length; i++) {
    const dist = haversineDistance(coordinates[i - 1], coordinates[i])
    total += dist
    cumulative.push(total)
  }

  return cumulative
}

/**
 * Linearly interpolates between two GPS points based on ratio (0 to 1).
 */
export function interpolatePosition(
  p1: RouteCoordinate,
  p2: RouteCoordinate,
  ratio: number
): RouteCoordinate {
  const clampedRatio = Math.max(0, Math.min(1, ratio))
  return {
    latitude: p1.latitude + (p2.latitude - p1.latitude) * clampedRatio,
    longitude: p1.longitude + (p2.longitude - p1.longitude) * clampedRatio,
  }
}

/**
 * Maps each stop location to its exact cumulative kilometer mark along the route polyline.
 */
export function findStopDistances(
  stops: LocationPoint[],
  routeCoordinates: RouteCoordinate[],
  cumulativeDistances: number[]
): number[] {
  if (!stops || stops.length === 0 || !routeCoordinates || routeCoordinates.length === 0) {
    return []
  }

  return stops.map((stop) => {
    let minDist = Infinity
    let closestIdx = 0

    for (let i = 0; i < routeCoordinates.length; i++) {
      const d = haversineDistance(stop, routeCoordinates[i])
      if (d < minDist) {
        minDist = d
        closestIdx = i
      }
    }

    return cumulativeDistances[closestIdx] ?? 0
  })
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}
