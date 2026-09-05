export type LocationType = 'origin' | 'delivery'

export interface LocationPoint {
  id: string
  name: string
  latitude: number
  longitude: number
  type: LocationType
}
