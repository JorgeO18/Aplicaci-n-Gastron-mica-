# Arquitectura de TasteGo

Este documento describe cómo está organizado el código, las responsabilidades de cada capa y las dependencias entre módulos.

---

## Visión general

TasteGo sigue una arquitectura **monolítica en el cliente**: toda la lógica de negocio, persistencia y llamadas a APIs externas viven en la app móvil. No hay backend propio en este repositorio.

```
┌─────────────────────────────────────────────────────────┐
│                    Capa de presentación                  │
│  app/*.tsx  +  components/*.tsx                          │
├─────────────────────────────────────────────────────────┤
│                    Capa de lógica (hooks)                │
│  dataBase, useRestaurants, useLocation, useRoute, ...    │
├─────────────────────────────────────────────────────────┤
│                    Capa de datos                         │
│  SQLite (miapp.db)  │  AsyncStorage  │  APIs HTTP       │
└─────────────────────────────────────────────────────────┘
```

---

## Punto de entrada y providers

### `app/_layout.tsx`

- Envuelve la app con `SQLiteProvider` (`databaseName="miapp.db"`, `onInit={inicializarDB}`).
- Aplica `ThemeProvider` de React Navigation según tema claro/oscuro.
- Define un `Stack` de Expo Router con pantallas sin cabecera nativa.
- `unstable_settings.anchor = '(tabs)'`: la navegación ancla en el grupo de pestañas tras autenticación.

### `app/(tabs)/_layout.tsx`

Pestañas visibles:

| Ruta | Título | Icono |
|------|--------|-------|
| `index` | Inicio | Home |
| `favoritos` | Favoritos | Heart |
| `perfil` | Perfil | User |

Pantalla oculta del tab bar (`href: null`): `notifications` (acceso desde el icono de campana en Home).

---

## Mapa de pantallas

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `app/index.tsx` | Splash animado (Reanimated) |
| `/login` | `app/login.tsx` | Email y contraseña → SQLite |
| `/register` | `app/register.tsx` | Alta de usuario |
| `/(tabs)` | `app/(tabs)/index.tsx` | Home: listado y búsqueda |
| `/(tabs)/favoritos` | `app/(tabs)/favoritos.tsx` | Restaurantes favoritos del usuario |
| `/(tabs)/perfil` | `app/(tabs)/perfil.tsx` | Datos de sesión y logout |
| `/(tabs)/notifications` | `app/(tabs)/notifications.tsx` | Notificaciones (sin tab visible) |
| `/restaurant/[id]` | `app/restaurant/[id].tsx` | Detalle por `id` dinámico |
| `/restaurant/menu` | `app/restaurant/menu.tsx` | Platos; enlace a AR |
| `/MapView` | `app/MapView.tsx` | Contenedor del mapa (`MapScreen`) |
| `/ar/instructions` | `app/ar/instructions.tsx` | Guía antes de AR |
| `/rarv` | `app/rarv.tsx` | Visor 3D AR/VR (`ModelViewer`) |

### Parámetros de ruta frecuentes

- `id` en `/restaurant/[id]`: ID de OpenStreetMap / `id_restaurante` en SQLite.
- `idRes` en `/MapView` y menú: mismo identificador para mapa y consultas.
- `tipo` en `/rarv`: `"true"` → modo AR; otro valor → VR.

---

## Hooks principales

### `hooks/dataBase.ts`

| Export | Rol |
|--------|-----|
| `inicializarDB` | Crea tablas e índices al abrir la BD |
| `useBaseDeDatos` | CRUD usuarios, favoritos, menú, demos de platos |

### `hooks/useRestaurants.ts`

- Consulta Overpass en un radio de **5000 m**.
- Filtra nodos `amenity` ∈ `restaurant`, `cafe`, `fast_food`, `food_court`.
- Mapea tags OSM al tipo `Restaurant`.

### `hooks/useLocation.ts`

- Solicita permisos y coordenadas con `expo-location`.
- Usado en Home para disparar `fetchRestaurants`.

### `hooks/useRoute.ts`

- Llama a OSRM (`router.project-osrm.org`) en modo `driving`.
- Decodifica polilínea y expone distancia/duración formateadas.

### `hooks/distance.ts`

- Cálculo de distancia en metros entre dos coordenadas (fórmula haversine o similar).

### `hooks/reverseGeocode.ts`

- Obtiene ciudad o dirección legible a partir de lat/lon.

---

## Componentes destacados

| Componente | Ubicación | Función |
|------------|-----------|---------|
| `RestaurantCard` | `components/RestaurantCard.tsx` | Tarjeta de restaurante en listas |
| `SearchBar` | `components/SearchBar.tsx` | Búsqueda en Home |
| `MapScreen` | `components/MapScreen.tsx` | Mapa + marcadores + ruta |
| `ModelViewer` | `components/ModelViewer.tsx` | Canvas Three.js + cámara AR |
| `FoodCard` | `components/FoodCard.tsx` | Ítem de menú |
| `GradientButton` | `components/GradientButton.tsx` | Botón con gradiente de marca |

### Modelos 3D

- Registro en `constants/models.ts` (`MODELS`).
- Archivos `.glb` en `assets/models/` (referenciados por clave, p. ej. `'Untitled'`).
- El menú guarda en `AsyncStorage` la clave del modelo bajo `moldelRA` antes de abrir `/rarv`.

---

## Flujo de datos: restaurantes

1. `useLocation` entrega `latitude` / `longitude`.
2. `useRestaurants.fetchRestaurants` consulta Overpass.
3. Home persiste resultados en tabla `restaurantes` (upsert por `id_restaurante`).
4. `insertarDemos` añade platos de ejemplo por restaurante.
5. Detalle y menú leen desde SQLite; favoritos cruzan `usuarios` + `favoritos`.

```
GPS → Overpass → estado React → SQLite → UI (cards, detalle, menú)
```

---

## Flujo de sesión

1. `registrarUsuario` / `iniciarSesion` en `useBaseDeDatos`.
2. Tras login exitoso, se guarda el usuario en `AsyncStorage` (`sesion`).
3. Pantallas leen `sesion` para `id_usuario` en favoritos y perfil.
4. Logout en perfil: `AsyncStorage.removeItem` + `router.replace('/login')`.

---

## Constantes de diseño

| Archivo | Contenido |
|---------|-----------|
| `constants/colors.ts` | Paleta TasteGo |
| `constants/theme.ts` | `GastronomicColors` para tabs y tema |
| `constants/typography.ts` | Tamaños y pesos de fuente |
| `constants/spacing.ts` | Márgenes y padding estándar |

---

## Configuración nativa relevante

Definida en `app.json`:

- **Permisos Android**: ubicación fina/gruesa, cámara, audio.
- **Plugins**: `expo-router`, `expo-splash-screen`, `expo-sqlite`, `expo-camera`.
- **New Architecture**: habilitada (`newArchEnabled: true`).
- **Rutas tipadas**: `experiments.typedRoutes: true`.

---

## Decisiones y limitaciones actuales

1. **Sin backend**: usuarios y favoritos solo existen en el dispositivo.
2. **IDs de restaurante**: provienen de OpenStreetMap (`node id`); deben coincidir entre Overpass y SQLite.
3. **AR**: flujo `menú` → `ar/instructions` → `rarv` con `ModelViewer` y modelos `.glb`.
4. **Rutas**: la navegación al restaurante usa `MapView` + OSRM, no una pantalla de ruta dedicada.
5. **Expo Go**: AR, mapas y SQLite pueden requerir development build según la plataforma.

Para el detalle del enrutamiento dinámico `[id]`, ver [explicacion_navegacion.md](../explicacion_navegacion.md).
