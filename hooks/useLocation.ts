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
    let activo = true;

    (async () => {
      try {
        // 1️⃣ Primero revisamos el estado actual, sin disparar ningún diálogo
        let { status } = await Location.getForegroundPermissionsAsync();

        // 2️⃣ Solo pedimos permiso si todavía no se ha decidido
        if (status !== 'granted') {
          const respuesta = await Location.requestForegroundPermissionsAsync();
          status = respuesta.status;
        }

        if (!activo) return;

        if (status !== 'granted') {
          setError('Permiso de ubicación denegado. Por favor actívalo en Configuración.');
          setLoading(false);
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (!activo) return;

        setLocation({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
      } catch (err) {
        if (activo) {
          setError('No se pudo obtener la ubicación. Verifica que el GPS esté activado.');
        }
      } finally {
        if (activo) setLoading(false);
      }
    })();

    return () => {
      activo = false; // evita setState si el componente se desmonta antes de terminar
    };
  }, []);

  return { location, error, loading };
}