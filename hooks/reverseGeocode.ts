const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export interface Address {
  displayName: string;
  road: string | null;
  suburb: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<Address | null> {
  try {
    const url = `${NOMINATIM_URL}?lat=${latitude}&lon=${longitude}&format=json`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RestaurantesCercanosApp/1.0',
      },
    });

    if (!response.ok) throw new Error('Error en Nominatim');

    const data = await response.json();

    return {
      displayName: data.display_name ?? null,
      road: data.address?.road ?? null,
      suburb: data.address?.suburb ?? null,
      city: data.address?.city ?? data.address?.town ?? data.address?.village ?? null,
      state: data.address?.state ?? null,
      country: data.address?.country ?? null,
    };
  } catch (error) {
    console.error('reverseGeocode error:', error);
    return null;
  }
}