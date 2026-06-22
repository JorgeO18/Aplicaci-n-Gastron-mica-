// hooks/geocode.ts
//
// Geocodificación directa: texto de dirección → coordenadas.
// Usa Photon (mismo motor que Nominatim/OSM, sin rate limiting agresivo).
// Incluye soporte especial para direcciones colombianas con
// calle/carrera, número de placa, barrio, manzana, bloque, torre y apto.

const PHOTON_URL = 'https://photon.komoot.io/api';

export interface GeocodeResult {
  displayName: string;
  latitude: number;
  longitude: number;
  road: string | null;
  suburb: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

// Cache para no repetir peticiones con la misma query
const geocodeCache = new Map<string, GeocodeResult[]>();

// Normalizar la query para usarla como clave de caché
// Ej: "Cra 15 #20-45" y "cra   15  #20-45" → misma clave
function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Geocodifica un texto libre de dirección usando Photon.
 *
 * @example
 * const resultados = await geocode('Carrera 15 #20-45, Sincelejo, Colombia');
 * // resultados[0] = {
 * //   displayName: 'Carrera 15, Sincelejo, Colombia',
 * //   latitude: 9.3047,
 * //   longitude: -75.3978,
 * //   road: 'Carrera 15',
 * //   suburb: null,
 * //   city: 'Sincelejo',
 * //   state: 'Sucre',
 * //   country: 'Colombia'
 * // }
 *
 * @example
 * // Pedir varios resultados (útil para autocomplete)
 * const opciones = await geocode('Calle 30', 5);
 */
export async function geocode(
  query: string,
  limit = 5
): Promise<GeocodeResult[] | null> {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    console.warn('geocode: query inválida', { query });
    return null;
  }

  const normalizedQuery = normalizeQuery(query);
  const cacheKey = `${normalizedQuery}|${limit}`;

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!; // ← retorna inmediatamente sin fetch
  }

  try {
    // Photon: mismo motor que Nominatim, sin rate limiting agresivo
    // Photon solo admite idiomas: default, de, en, fr (no español)
    const params = new URLSearchParams({
      q: query.trim(),
      limit: String(limit),
    });
    const url = `${PHOTON_URL}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`geocode: Photon HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Photon devuelve GeoJSON: data.features[]
    const features = data?.features;

    if (!Array.isArray(features) || features.length === 0) {
      console.warn('Photon: sin resultados para', { query });
      return [];
    }

    const results: GeocodeResult[] = features.map((feature: any) => {
      const props = feature?.properties ?? {};
      const coords = feature?.geometry?.coordinates ?? [];
      // GeoJSON usa [longitude, latitude]
      const [lon, lat] = coords;

      return {
        displayName: [props.name, props.street, props.city, props.country]
          .filter(Boolean)
          .join(', '),
        latitude:  typeof lat === 'number' ? lat : NaN,
        longitude: typeof lon === 'number' ? lon : NaN,
        road:    props.street ?? null,
        suburb:  props.district ?? props.suburb ?? null,
        city:    props.city ?? props.town ?? props.village ?? null,
        state:   props.state ?? null,
        country: props.country ?? null,
      };
    }).filter(r => !isNaN(r.latitude) && !isNaN(r.longitude));

    geocodeCache.set(cacheKey, results); // ← guardar en caché
    return results;

  } catch (error) {
    if (error instanceof TypeError) {
      console.error('geocode: sin conexión', error.message);
    } else {
      console.error('geocode: error inesperado', error);
    }
    return null;
  }
}

/**
 * Helper para obtener solo el primer (mejor) resultado.
 *
 * @example
 * const lugar = await geocodeFirst('Parque Santander, Sincelejo');
 * if (lugar) {
 *   mapa.centrar(lugar.latitude, lugar.longitude);
 * }
 */
export async function geocodeFirst(query: string): Promise<GeocodeResult | null> {
  const results = await geocode(query, 1);
  return results && results.length > 0 ? results[0] : null;
}

// ─────────────────────────────────────────────────────────────────────────
// Soporte para direcciones colombianas
// ─────────────────────────────────────────────────────────────────────────
//
// Las direcciones colombianas suelen incluir datos de unidad/conjunto
// (manzana, bloque, torre, apartamento) que NO existen en OpenStreetMap,
// por lo que Photon nunca podrá geocodificarlos directamente.
//
// Estrategia: separamos la dirección en dos partes:
//   1. Lo "geocodificable": tipo de vía + número + barrio + ciudad.
//   2. Lo "no geocodificable": manzana, bloque, torre, apto — se guarda
//      como metadata para mostrarla al repartidor/usuario, pero no se
//      envía a Photon.

export interface ColombianAddress {
  tipoVia: 'Calle' | 'Carrera' | 'Avenida' | 'Diagonal' | 'Transversal';
  numeroVia: string;        // ej: "15"
  numeroPlaca: string;      // ej: "20-45" (el número después del #)
  barrio?: string;
  manzana?: string;
  bloque?: string;
  torre?: string;
  apartamento?: string;     // ej: "2F-20"
  ciudad: string;
  departamento?: string;
  complemento?: string;     // cualquier otra referencia (portería, local, etc.)
}

export type NivelPrecision = 'calle' | 'via' | 'barrio' | 'ciudad' | 'ninguna';

export interface ColombianGeocodeResult {
  resultado: GeocodeResult | null;
  nivelPrecision: NivelPrecision;
}

/**
 * Construye el texto de búsqueda solo con los campos que existen en OSM.
 * Ignora manzana/bloque/torre/apto a propósito.
 *
 * @example
 * buildGeocodeQuery({
 *   tipoVia: 'Carrera',
 *   numeroVia: '15',
 *   numeroPlaca: '20-45',
 *   barrio: 'La Castellana',
 *   ciudad: 'Sincelejo',
 *   departamento: 'Sucre',
 * })
 * // => "Carrera 15 #20-45, La Castellana, Sincelejo, Sucre, Colombia"
 */
function buildGeocodeQuery(addr: ColombianAddress): string {
  const partes = [
    `${addr.tipoVia} ${addr.numeroVia} #${addr.numeroPlaca}`,
    addr.barrio,
    addr.ciudad,
    addr.departamento,
    'Colombia',
  ].filter(Boolean);

  return partes.join(', ');
}

/**
 * Geocodifica una dirección colombiana estructurada, con fallback
 * progresivo: si la dirección completa no da resultado, va quitando
 * precisión (vía → barrio → ciudad) hasta encontrar algo.
 *
 * Útil porque en ciudades intermedias (ej. Sincelejo) la cobertura de
 * OSM en barrios/conjuntos nuevos suele ser pobre, así que es mejor
 * devolver una coordenada aproximada que nada.
 *
 * @example
 * const direccion: ColombianAddress = {
 *   tipoVia: 'Carrera',
 *   numeroVia: '15',
 *   numeroPlaca: '20-45',
 *   barrio: 'La Castellana',
 *   manzana: 'M5',
 *   bloque: '3',
 *   torre: 'B',
 *   apartamento: '2F-20',
 *   ciudad: 'Sincelejo',
 *   departamento: 'Sucre',
 * };
 *
 * const { resultado, nivelPrecision } = await geocodeColombianAddress(direccion);
 *
 * if (resultado) {
 *   console.log(`Precisión: ${nivelPrecision}`);
 *   // 'calle'  → encontró la vía exacta
 *   // 'via'    → encontró la vía pero sin el barrio
 *   // 'barrio' → solo encontró el barrio
 *   // 'ciudad' → solo encontró la ciudad (peor caso con resultado)
 *
 *   // Guardar coordenadas aproximadas + detalle exacto para el repartidor:
 *   const registro = {
 *     coordenadas: { lat: resultado.latitude, lng: resultado.longitude },
 *     direccionGeocodificada: resultado.displayName,
 *     nivelPrecision,
 *     detalleEntrega: buildDeliveryDetail(direccion),
 *   };
 * } else {
 *   console.log('No se pudo geocodificar ni a nivel de ciudad');
 *   // → mostrar mapa centrado en la ciudad y dejar que el usuario
 *   //   ubique el pin manualmente
 * }
 */
export async function geocodeColombianAddress(
  addr: ColombianAddress
): Promise<ColombianGeocodeResult> {

  // Intento 1: dirección completa (vía + número + barrio + ciudad)
  // Ej: "Carrera 15 #20-45, La Castellana, Sincelejo, Sucre, Colombia"
  const queryCompleta = buildGeocodeQuery(addr);
  let resultados = await geocode(queryCompleta, 1);
  if (resultados && resultados.length > 0) {
    return { resultado: resultados[0], nivelPrecision: 'calle' };
  }

  // Intento 2: solo vía + ciudad (sin barrio, por si el nombre del
  // barrio no coincide exactamente con el de OSM)
  // Ej: "Carrera 15, Sincelejo, Colombia"
  const queryVia = `${addr.tipoVia} ${addr.numeroVia}, ${addr.ciudad}, Colombia`;
  resultados = await geocode(queryVia, 1);
  if (resultados && resultados.length > 0) {
    return { resultado: resultados[0], nivelPrecision: 'via' };
  }

  // Intento 3: solo barrio + ciudad (precisión más baja, pero algo es algo)
  // Ej: "La Castellana, Sincelejo, Colombia"
  if (addr.barrio) {
    const queryBarrio = `${addr.barrio}, ${addr.ciudad}, Colombia`;
    resultados = await geocode(queryBarrio, 1);
    if (resultados && resultados.length > 0) {
      return { resultado: resultados[0], nivelPrecision: 'barrio' };
    }
  }

  // Intento 4: solo ciudad (último recurso, sirve para al menos
  // centrar el mapa cerca de la zona correcta)
  // Ej: "Sincelejo, Colombia"
  const queryCiudad = `${addr.ciudad}, Colombia`;
  resultados = await geocode(queryCiudad, 1);
  if (resultados && resultados.length > 0) {
    return { resultado: resultados[0], nivelPrecision: 'ciudad' };
  }

  return { resultado: null, nivelPrecision: 'ninguna' };
}

/**
 * Genera el texto de detalle de entrega a partir de los campos que
 * Photon no puede geocodificar (manzana, bloque, torre, apto, etc.).
 * Útil para mostrarle al repartidor exactamente dónde llegar una vez
 * que el mapa ya lo ubicó en la zona aproximada.
 *
 * @example
 * buildDeliveryDetail({
 *   manzana: 'M5', bloque: '3', torre: 'B', apartamento: '2F-20',
 *   complemento: 'Portería principal',
 * } as ColombianAddress)
 * // => "Mz M5, Bloque 3, Torre B, Apto 2F-20, Portería principal"
 */
export function buildDeliveryDetail(addr: ColombianAddress): string {
  const partes = [
    addr.manzana ? `Mz ${addr.manzana}` : null,
    addr.bloque ? `Bloque ${addr.bloque}` : null,
    addr.torre ? `Torre ${addr.torre}` : null,
    addr.apartamento ? `Apto ${addr.apartamento}` : null,
    addr.complemento ?? null,
  ].filter(Boolean);

  return partes.join(', ');
}