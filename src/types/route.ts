export type LocationType = 'origin' | 'delivery'

export interface LocationPoint {
  id: string
  name: string
  latitude: number
  longitude: number
  type: LocationType
}

export interface RouteCoordinate {
  latitude: number
  longitude: number
}

export interface RouteLeg {
  distanceMeters: number
  durationSeconds: number
}

export interface RouteData {
  coordinates: RouteCoordinate[]
  totalDistanceKm: number
  totalDurationMinutes: number
  legs: RouteLeg[]
}
