import { useState, useCallback } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  distanceMeters: number;
  durationSeconds: number;
}

interface UseRouteResult {
  routeCoords: Coordinates[];
  routeInfo: RouteInfo | null;
  loading: boolean;
  error: string | null;
  fetchRoute: (origin: Coordinates, destination: Coordinates) => Promise<void>;
  clearRoute: () => void;
}

function decodePolyline(encoded: string): Coordinates[] {
  const points: Coordinates[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return points;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remaining = mins % 60;
  return `${hrs}h ${remaining}min`;
}

export function useRoute(): UseRouteResult {
  const [routeCoords, setRouteCoords] = useState<Coordinates[]>([]);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoute = useCallback(async (origin: Coordinates, destination: Coordinates) => {
    setLoading(true);
    setError(null);
    setRouteCoords([]);
    setRouteInfo(null);

    const { latitude: oLat, longitude: oLon } = origin;
    const { latitude: dLat, longitude: dLon } = destination;

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${oLon},${oLat};${dLon},${dLat}` +
      `?overview=full&geometries=polyline`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al calcular la ruta');

      const data = await response.json();

      if (data.code !== 'Ok' || !data.routes?.length) {
        throw new Error('No se encontró una ruta disponible');
      }

      const route = data.routes[0];
      const coords = decodePolyline(route.geometry);

      setRouteCoords(coords);
      setRouteInfo({
        distance: formatDistance(route.distance),
        duration: formatDuration(route.duration),
        distanceMeters: route.distance,
        durationSeconds: route.duration,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo calcular la ruta.');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRoute = useCallback(() => {
    setRouteCoords([]);
    setRouteInfo(null);
    setError(null);
  }, []);

  return { routeCoords, routeInfo, loading, error, fetchRoute, clearRoute };
}