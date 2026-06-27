# TasteGo

**TasteGo** es una aplicación móvil gastronómica desarrollada con [Expo](https://expo.dev) y [React Native](https://reactnative.dev). Permite descubrir restaurantes cercanos, consultar menús, guardar favoritos, calcular rutas y visualizar platos en realidad aumentada (AR) o realidad virtual (VR).

| Campo | Valor |
|-------|--------|
| Nombre en tiendas | TasteGo |
| Slug Expo | `tastego` |
| Versión | 1.0.0 |
| Paquete Android | `com.jorge_ortega.aplicaciongastronomica` |
| Esquema deep link | `aplicaciongastronomica` |

---

## Tabla de contenidos

1. [Características principales](#características-principales)
2. [Requisitos](#requisitos)
3. [Instalación y ejecución](#instalación-y-ejecución)
4. [Scripts disponibles](#scripts-disponibles)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Flujo de la aplicación](#flujo-de-la-aplicación)
7. [Tecnologías](#tecnologías)
8. [Servicios externos](#servicios-externos)
9. [Base de datos local](#base-de-datos-local)
10. [Build y despliegue (EAS)](#build-y-despliegue-eas)
11. [Documentación adicional](#documentación-adicional)
12. [Notas de seguridad](#notas-de-seguridad)

---

## Características principales

- **Descubrimiento de restaurantes**: sincronización con [Overpass](https://wiki.openstreetmap.org/wiki/Overpass_API) (radio 5 km), caché en SQLite y refresco solo si el usuario se desplaza más de 5 km.
- **Búsqueda en Home**: filtro en tiempo real por tipo de comida (`cuisine`), sin acentos.
- **Geolocalización**: GPS, geocodificación inversa al guardar restaurantes y umbral de movimiento de 5 km.
- **Detalle de restaurante**: ficha con información, favoritos y acceso al menú.
- **Menú y platos**: Listado gestionado vía restaurantes, con soporte para carrusel de múltiples imágenes en los platos si se proporcionan.
- **Favoritos**: persistencia por usuario en base de datos local.
- **Rutas**: cálculo de trayectos con [OSRM](https://project-osrm.org/) y visualización en mapa (Google Maps en Android).
- **Realidad aumentada / virtual**: visualización de modelos 3D (`.glb`) con `@react-three/fiber`, `expo-gl` y cámara.
- **Autenticación y Roles**: Diferente inicio de sesión/registro para usuarios regulares (clientes) y restaurantes. Check automático de sesión en el Splash screen.
- **Perfil editable**: nombre, correo, teléfono, ubicación (para clientes), o detalles operacionales para cuentas de restaurantes.
- **Contactos de emergencia**: alta en Perfil, listado y llamada directa desde la app.

---

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (recomendado LTS)
- npm o yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (vía `npx expo`)
- Para Android: [Android Studio](https://developer.android.com/studio) y emulador o dispositivo físico
- Para iOS (solo macOS): Xcode y simulador
- Cuenta en [Expo](https://expo.dev) para builds con EAS (opcional)
- **Google Maps API Key** configurada en `app.json` → `android.config.googleMaps.apiKey` (necesaria para el mapa en Android)
- Conexión a internet para Overpass, OSRM y geocodificación

---

## Instalación y ejecución

```bash
# Clonar el repositorio e instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npx expo start
```

Desde la terminal de Expo puedes abrir la app en:

- **Android**: tecla `a` o `npm run android`
- **iOS**: tecla `i` o `npm run ios` (macOS)
- **Web**: tecla `w` o `npm run web`
- **Expo Go**: escanear el código QR (algunas funciones nativas, como AR o mapas avanzados, pueden requerir un *development build*)

### Development build

Para cámara, SQLite y mapas sin las limitaciones de Expo Go:

```bash
npx expo run:android
# o
npx expo run:ios
```

Perfil de desarrollo definido en `eas.json` (`development` con `developmentClient: true`).

---

## Scripts disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `start` | `npm start` | Inicia Expo (`expo start`) |
| `android` | `npm run android` | Compila y ejecuta en Android |
| `ios` | `npm run ios` | Compila y ejecuta en iOS |
| `web` | `npm run web` | Modo web estático |
| `lint` | `npm run lint` | ESLint con `eslint-config-expo` |
| `reset-project` | `npm run reset-project` | Script de plantilla Expo (mueve código de ejemplo) |

---

## Estructura del proyecto

```
├── app/                    # Pantallas (Expo Router, file-based routing)
│   ├── _layout.tsx         # Layout raíz: SQLite, tema, Stack
│   ├── index.tsx           # Splash animado → login
│   ├── login.tsx           # Inicio de sesión
│   ├── register.tsx        # Registro de usuario
│   ├── (tabs)/             # Navegación por pestañas
│   │   ├── index.tsx       # Home: restaurantes y búsqueda
│   │   ├── favoritos.tsx   # Lista de favoritos
│   │   ├── perfil.tsx      # Perfil y cierre de sesión
│   │   └── notifications.tsx  # Notificaciones (sin tab en barra)
│   ├── restaurant/
│   │   ├── [id].tsx        # Detalle dinámico por ID
│   │   └── menu.tsx        # Menú del restaurante
│   ├── ar/
│   │   └── instructions.tsx   # Tutorial antes de AR
│   ├── MapView.tsx         # Mapa con ruta
│   └── rarv.tsx            # Visor 3D AR/VR
├── components/             # UI reutilizable (cards, mapa, ModelViewer, etc.)
├── constants/              # Colores, tipografía, modelos 3D
├── hooks/                  # Lógica: BD, ubicación, restaurantes, rutas
├── assets/                 # Imágenes y modelos `.glb`
├── eas.json                # Perfiles EAS Build
└── app.json                # Configuración Expo
```

Documentación detallada: [docs/ARQUITECTURA.md](./docs/ARQUITECTURA.md) y [docs/BASE_DE_DATOS.md](./docs/BASE_DE_DATOS.md).

---

## Flujo de la aplicación

```mermaid
flowchart TD
    A[Splash app/index.tsx] --> B{¿Sesión válida?}
    B -->|Sí| C[(tabs) Home]
    B -->|No| R[Role Selection]
    R --> L[Login / Res Login]
    L --> C
    C --> E[Overpass: restaurantes cercanos]
    E --> F[SQLite: cache local]
    D --> G["/restaurant/:id"]
    G --> H[Menú / Mapa / Favoritos]
    H --> I[AR: instructions → rarv]
```

1. **Splash** (`app/index.tsx`): animación y evaluación de sesión (`AsyncStorage`). Si hay sesión activa → Home, si no hay → Selección de rol (`/role-selection`).
2. **Login / registro (Separado por Roles)**: credenciales en SQLite; sesión guardada en `AsyncStorage` bajo la clave `sesion`. Funcional para usuarios y establecimientos.
3. **Home** (`app/(tabs)/index.tsx`): carga SQLite, sincroniza Overpass si hace falta, filtra por cocina.
4. **Perfil** (`app/(tabs)/perfil.tsx`): edita datos del usuario y gestiona contactos de emergencia.
5. **Detalle** (`app/restaurant/[id].tsx`): consulta por `id_restaurante`, favoritos, menú y mapa.
6. **AR**: menú → instrucciones → `rarv` con modelo 3D (`moldelRA` en AsyncStorage).

Guía paso a paso del enrutamiento dinámico: [explicacion_navegacion.md](./explicacion_navegacion.md).

---

## Tecnologías

| Área | Librerías |
|------|-----------|
| Framework | Expo SDK 54, React 19, React Native 0.81 |
| Navegación | Expo Router 6, React Navigation 7 |
| Persistencia | expo-sqlite, AsyncStorage |
| Ubicación | expo-location |
| Mapas / rutas | Google Maps (Android), OSRM, hooks propios |
| 3D / AR | three, @react-three/fiber, @react-three/drei, expo-gl, expo-camera |
| UI | expo-linear-gradient, lucide-react-native, react-native-reanimated |
| Tipado | TypeScript 5.9 |

Alias de rutas: `@/*` → raíz del proyecto (`tsconfig.json`).

---

## Servicios externos

| Servicio | Uso | Archivo relacionado |
|----------|-----|------------------------|
| Overpass API | Restaurantes en radio de 5 km | `hooks/useRestaurants.ts` |
| OSRM | Geometría y duración de rutas | `hooks/useRoute.ts` |
| Geocodificación inversa | Ciudad / dirección desde coordenadas | `hooks/reverseGeocode.ts` |
| Google Maps | Mapa nativo en Android | `app.json`, `components/MapScreen.tsx` |

---

## Base de datos local

- Archivo: `miapp.db` (gestionado por `SQLiteProvider` en `app/_layout.tsx`).
- Inicialización: `hooks/dataBase.ts` → función `inicializarDB`.
- Hook de acceso: `useBaseDeDatos()`.

Esquema completo de tablas e índices: [docs/BASE_DE_DATOS.md](./docs/BASE_DE_DATOS.md).

---

## Build y despliegue (EAS)

El proyecto incluye `eas.json` con perfiles:

| Perfil | Uso |
|--------|-----|
| `development` | Cliente de desarrollo, distribución interna |
| `preview` | Builds internas de prueba |
| `production` | Producción con `autoIncrement` de versión |

```bash
# Instalar EAS CLI (global o npx)
npx eas-cli login
npx eas build --platform android --profile preview
npx eas submit --platform android --profile production
```

`app.json` → `extra.eas.projectId` vincula el proyecto con Expo Application Services.

---

## Documentación adicional

| Documento | Contenido |
|-----------|-----------|
| [docs/ARQUITECTURA.md](./docs/ARQUITECTURA.md) | Capas, pantallas, hooks y componentes |
| [docs/MODULOS_HOME_PERFIL_BD.md](./docs/MODULOS_HOME_PERFIL_BD.md) | Home, Perfil y `hooks/dataBase.ts` en detalle |
| [docs/BASE_DE_DATOS.md](./docs/BASE_DE_DATOS.md) | Esquema SQLite y operaciones |
| [docs/DIAGRAMA_PANTALLAS.md](./docs/DIAGRAMA_PANTALLAS.md) | Diagrama de pantallas y flujos de navegación |
| [explicacion_navegacion.md](./explicacion_navegacion.md) | Rutas dinámicas con Expo Router |

---

## Notas de seguridad

- Las contraseñas se almacenan en texto plano en SQLite; **no es adecuado para producción**. Valorar hash (bcrypt/argon2) y autenticación en backend.
- La API key de Google Maps en `app.json` debe rotarse si se expone públicamente y restringirse por paquete Android en Google Cloud Console.
- Overpass y OSRM son servicios públicos con límites de uso; conviene cachear resultados y manejar errores de red.

---

## Licencia

Proyecto privado (`"private": true` en `package.json`). Consultar al propietario del repositorio para términos de uso y distribución.
