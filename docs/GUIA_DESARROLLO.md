# Guía de desarrollo — TasteGo

Pasos prácticos para configurar el entorno, depurar y extender la aplicación.

---

## Configuración inicial

1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Revisar `app.json`:
   - Sustituir la API key de Google Maps en `android.config.googleMaps.apiKey` por una propia con restricciones de paquete.
   - Verificar `owner` y `extra.eas.projectId` si usas EAS del equipo correcto.
4. Ejecutar `npx expo start`.

---

## Variables y secretos

No hay archivo `.env` en el proyecto actual. Las claves sensibles están en:

- `app.json` → Google Maps (Android)

**Recomendación**: migrar la API key a variables de entorno con `expo-constants` o `app.config.js` y no commitear claves reales.

---

## Depuración por módulo

### Restaurantes no aparecen en Home

1. Comprobar permisos de ubicación en el dispositivo.
2. Revisar logs de `useRestaurants` (status Overpass, cantidad de elementos).
3. Verificar conexión a `https://overpass.kumi.systems/api/interpreter`.
4. Confirmar que `bdCargadaRef` está en `true` antes del efecto de ubicación.
5. Revisar `guardarRestaurants` en consola (`📦`, `✅`, `❌`).
6. Si moviste el dispositivo menos de 5 km, Overpass no se vuelve a llamar (borrar `ubicacionUsuario` en AsyncStorage para forzar refresh).

### Búsqueda por cocina no devuelve resultados

1. El filtro usa `tipo_comida` / `cuisine`, no el nombre del restaurante.
2. La búsqueda ignora mayúsculas y acentos (`normalizarTexto`).
3. Si `restaurante` está vacío, primero resuelve la carga de Overpass/SQLite.

### Perfil y contactos de emergencia

1. El usuario debe existir en `sesion` (login previo).
2. Editar perfil usa `actualizarUsuario`; el email debe ser único.
3. La columna `ubicacion` se crea con migración en `inicializarDB`; reinstalar la app si la BD quedó corrupta.
4. Contactos requieren nombre, relación y teléfono no vacíos.

### Favoritos no funcionan

1. Usuario debe estar logueado (`AsyncStorage` → `sesion`).
2. `id_usuario` debe pasarse a `agregarFavoritos` / `estaEnFavoritos`.
3. El `id_restaurante` debe existir en tabla `restaurantes`.

### Mapa en blanco (Android)

1. API key de Google Maps válida y con **Maps SDK for Android** habilitado.
2. SHA-1 del keystore registrado en Google Cloud (debug y release).
3. Usar development build: `npx expo run:android`.

### AR / modelo 3D

1. Modelo registrado en `constants/models.ts`.
2. Archivo `.glb` presente en `assets/models/`.
3. Permiso de cámara concedido (`expo-camera`).
4. Flujo: menú → guardar clave en `moldelRA` → `/ar/instructions` → `/rarv?tipo=true`.

## ⚠️ Optimización de modelos 3D (.glb)

Los modelos deben estar optimizados antes de subirlos al proyecto, o pueden 
renderizarse en negro / sin textura en dispositivos móviles (AR).

Recomendado:
- Malla: máx. ~20,000 vértices (usar modificador Decimate en Blender)
- Texturas: máx. 1024x1024 px
- Peso final del .glb: idealmente bajo 5 MB

Sin estos límites, expo-gl puede fallar al subir las texturas/geometría a la 
GPU del teléfono, y el modelo se ve negro y sin luz aunque el código de 
React esté bien.

---

## Añadir un nuevo plato con modelo 3D

1. Colocar `MiPlato.glb` en `assets/models/`.
2. Registrar en `constants/models.ts`:

   ```ts
   export const MODELS: Record<string, any> = {
     'MiPlato': require('../assets/models/MiPlato.glb'),
     // ...
   };
   ```

3. Insertar fila en `platos` con `modelo_3d_url = 'MiPlato'`.
4. En la UI del menú, al seleccionar el plato, guardar en AsyncStorage:

   ```ts
   await AsyncStorage.setItem('moldelRA', JSON.stringify('MiPlato'));
   router.push('/ar/instructions');
   ```

---

## Añadir una pantalla nueva

1. Crear archivo en `app/`, p. ej. `app/mi-pantalla.tsx`.
2. Si debe mostrarse sin header, registrar en `app/_layout.tsx`:

   ```tsx
   <Stack.Screen name="mi-pantalla" options={{ headerShown: false }} />
   ```

3. Navegar con `router.push('/mi-pantalla')` o con parámetros:

   ```tsx
   router.push({ pathname: '/mi-pantalla', params: { foo: 'bar' } });
   ```

4. Leer parámetros con `useLocalSearchParams()`.

---

## Lint y TypeScript

```bash
npm run lint
npx tsc --noEmit
```

Rutas tipadas: con `experiments.typedRoutes: true`, Expo genera tipos en `.expo/types` al ejecutar el proyecto.

---

## Builds EAS

```bash
# Preview Android (APK/AAB interno)
npx eas build -p android --profile preview

# Producción
npx eas build -p android --profile production
```

Antes del primer build: `npx eas-cli login` y vincular el proyecto si `projectId` no coincide con tu cuenta Expo.

---

## Estructura de commits sugerida

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` documentación
- `refactor:` cambio interno sin cambio de comportamiento
- `chore:` dependencias, configuración

---

## Recursos útiles

- [Expo Router](https://docs.expo.dev/router/introduction/)
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Overpass QL](https://wiki.openstreetmap.org/wiki/overpassQL)
- [OSRM API](http://project-osrm.org/docs/v5.24.0/api/)
