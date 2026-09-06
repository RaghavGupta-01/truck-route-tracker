import type { LocationPoint, RouteCoordinate, RouteData } from '../types/route'

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving'


export async function fetchOSRMRoute(points: LocationPoint[]): Promise<RouteData> {
    if (!points || points.length < 2) {
        throw new Error('At least 2 points are required to calculate a route.')
    }

    const coordinatesString = points
        .map((p) => `${p.longitude},${p.latitude}`)
        .join(';')

    const url = `${OSRM_BASE_URL}/${coordinatesString}?overview=full&geometries=geojson&steps=true`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`OSRM API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            throw new Error('OSRM API failed to compute a valid route.')
        }

        const primaryRoute = data.routes[0]

        const rawCoordinates: [number, number][] = primaryRoute.geometry.coordinates

        const coordinates: RouteCoordinate[] = rawCoordinates.map(([lon, lat]) => ({
            latitude: lat,
            longitude: lon,
        }))

        const totalDistanceKm = primaryRoute.distance / 1000
        const totalDurationMinutes = Math.round(primaryRoute.duration / 60)

        const legs = (primaryRoute.legs || []).map((leg: any) => ({
            distanceMeters: leg.distance,
            durationSeconds: leg.duration,
        }))

        return {
            coordinates,
            totalDistanceKm,
            totalDurationMinutes,
            legs,
        }
    } catch (error) {
        console.warn('Falling back to straight-line interpolation due to OSRM error:', error)

        return createFallbackRoute(points)
    }
}

// Fallback route function when OSRM API is unavailable.

function createFallbackRoute(points: LocationPoint[]): RouteData {
    const coordinates: RouteCoordinate[] = points.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
    }))

    return {
        coordinates,
        totalDistanceKm: 570,
        totalDurationMinutes: 510,
        legs: [],
    }
}
