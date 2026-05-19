import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UseLocationResult {
  location: Coordinates | null;
  error: string | null;
  loading: boolean;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permiso de ubicación denegado. Por favor actívalo en Configuración.');
          setLoading(false);
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
      } catch (err) {
        setError('No se pudo obtener la ubicación. Verifica que el GPS esté activado.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, error, loading };
}