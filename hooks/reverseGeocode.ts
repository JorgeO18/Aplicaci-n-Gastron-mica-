// hooks/reverseGeocode.ts

const PHOTON_URL = 'https://photon.komoot.io/reverse';

export interface Address {
  displayName: string;
  road: string | null;
  suburb: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

// Cache para no repetir peticiones con las mismas coordenadas
const geocodeCache = new Map<string, Address>();

// Redondear a ~111m de precisión — evita peticiones duplicadas por GPS que fluctúa
function roundCoord(value: number, decimals = 3): number {
  return parseFloat(value.toFixed(decimals));
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<Address | null> {
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    console.warn('reverseGeocode: coordenadas inválidas', { latitude, longitude });
    return null;
  }

  // Clave de caché con coordenadas redondeadas
  const lat = roundCoord(latitude);
  const lon = roundCoord(longitude);
  const cacheKey = `${lat},${lon}`;

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!; // ← retorna inmediatamente sin fetch
  }

  try {
    // Photon: misma idea que Nominatim, sin rate limiting agresivo
    // Photon solo admite: default, de, en, fr (no español)
    const url = `${PHOTON_URL}?lat=${lat}&lon=${lon}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`reverseGeocode: Photon HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Photon devuelve GeoJSON: data.features[0].properties
    const props = data?.features?.[0]?.properties;

    if (!props) {
      console.warn('Photon: sin resultados para', { lat, lon });
      return null;
    }

    const address: Address = {
      displayName: [props.name, props.street, props.city, props.country]
        .filter(Boolean)
        .join(', '),
      road:    props.street ?? null,
      suburb:  props.district ?? props.suburb ?? null,
      city:    props.city ?? props.town ?? props.village ?? null,
      state:   props.state ?? null,
      country: props.country ?? null,
    };

    geocodeCache.set(cacheKey, address); // ← guardar en caché
    return address;

  } catch (error) {
    if (error instanceof TypeError) {
      console.error('reverseGeocode: sin conexión', error.message);
    } else {
      console.error('reverseGeocode: error inesperado', error);
    }
    return null;
  }
}