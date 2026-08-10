import { useState, useCallback } from 'react';

const SEARCH_RADIUS_METERS = 5000;
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export interface Restaurant {
  id: number;
  name: string;
  description:string;
  cuisine: string | null;
  latitude: number;
  longitude: number;
  image: string | null;
  phone: string | null;
  address: string | null;
  openingHours: string | null;
}

interface UseRestaurantsResult {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  fetchRestaurants: (latitude: number, longitude: number) => Promise<void>;
}

export function useRestaurants(): UseRestaurantsResult {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);

    const query = `
      [out:json][timeout:25];
      node["amenity"~"restaurant|cafe|fast_food|food_court"](around:${SEARCH_RADIUS_METERS},${latitude},${longitude});
      out 100;
    `;

    try {
      console.log('consultando')
      const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'TasteGoApp/1.0 (contact: soporte@tastego.com)',
          'Accept': 'application/json'
        },
        body: `data=${encodeURIComponent(query)}`,
      });
      console.log('Status Overpass:', response.status);  // 👈
      if (!response.ok) throw new Error('Error al consultar restaurantes');

      const data = await response.json();
      console.log('Elementos encontrados:', data.elements?.length); // 👈
      

      const results: Restaurant[] = data.elements
        .filter((el: any) => el.lat && el.lon)
        .map((el: any) => ({
          id: String(el.id),
          name: el.tags?.name ?? 'Restaurante sin nombre',
          description: el.tags?.description ?? null, 
          cuisine: el.tags?.cuisine ?? null,
          latitude: el.lat,
          longitude: el.lon,
          image : el.tags?.image ?? null,
          phone: el.tags?.phone ?? null,
          address: el.tags?.['addr:street']
            ? `${el.tags['addr:street']}${el.tags['addr:housenumber'] ? ' ' + el.tags['addr:housenumber'] : ''}`
            : null,
          openingHours: el.tags?.opening_hours ?? null,
          
        }));
        console.log('consultado..')
      setRestaurants(results);
      
    } catch (err) {
      setError('No se pudieron cargar los restaurantes. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { restaurants, loading, error, fetchRestaurants };
}