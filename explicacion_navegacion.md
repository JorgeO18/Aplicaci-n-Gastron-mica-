# 🚀 ¿Cómo funciona la navegación de Restaurantes en TasteGo?

En esta guía te explicaré paso a paso, sin omitir detalles, cómo logramos que al tocar una tarjeta de restaurante en tu pantalla principal (`index.tsx`) la aplicación sepa exactamente a qué restaurante ir y muestre su información detallada (`[id].tsx`).

Todo esto ocurre gracias a tu librería de navegación: **Expo Router**.

---

## Paso 1: El toque (El detonador)

Todo empieza en tu archivo `app/(tabs)/index.tsx`, específicamente en la tarjeta del restaurante (`<RestaurantCard />`). 

Si observas el código de tu lista de restaurantes, verás esta línea:

```javascript
onPress={() => router.push(`/restaurant/${restaurant.id}`)}
```

### ¿Qué significa esta línea?
1. **`onPress`**: Es el evento que "escucha" cuando el usuario toca la tarjeta con el dedo.
2. **`router.push(...)`**: Es una función de Expo que significa "empújame" (llévame) hacia una nueva pantalla.
3. **`` `/restaurant/${restaurant.id}` ``**: Aquí está la magia. No estamos dándole una dirección fija como "/menu". Estamos construyendo una **dirección personalizada** para cada restaurante usando su `ID`.
   * Si tocas "Red Rock Coffee" (Supongamos que su ID de base de datos es `4`), la dirección que se genera es: `/restaurant/4`.
   * Si tocas "Pizza Hot" (ID `2`), la dirección será: `/restaurant/2`.

---

## Paso 2: La ruta en tus carpetas (El destino)

Expo Router usa un sistema llamado **Enrutamiento basado en archivos**. Esto significa que las URLs o direcciones de tu app se conectan de forma automática con las carpetas que tienes en tu proyecto.

Cuando el Paso 1 le exige a la app ir a `/restaurant/4`, Expo Router hace lo siguiente:

1. Busca una carpeta llamada `restaurant` dentro de tu carpeta principal `app/`. (¡Y la encuentra!).
2. Luego, entra a la carpeta `restaurant` buscando un archivo llamado `4.tsx`. 
3. Como obviamente no creaste un archivo diferente para cada uno de los miles de restaurantes que puede haber, Expo encuentra a su salvador: **un archivo con corchetes llamado `[id].tsx`**.

### ¿Qué son los corchetes `[id]`?
En Expo, nombrar un archivo con corchetes significa que es un **Archivo Dinámico** o un "comodín". Le estás diciendo a la app: *"No importa qué número pongas en la URL después de /restaurant/, ábrelo usando el diseño de este archivo, y además guarda ese número en una variable llamada `id`"*.

---

## Paso 3: Obteniendo la información (La magia interna)

Ya estamos dentro de la pantalla gráfica (`app/restaurant/[id].tsx`), pero la pantalla está vacía. ¿Cómo sabe el archivo qué nombre de restaurante pintar? 

Al inicio de tu archivo `[id].tsx` tenemos código que atrapa esa variable `id` que enviamos en el Paso 1:

```javascript
const { id } = useLocalSearchParams();
```

El gancho (`hook`) llamado `useLocalSearchParams()` inspecciona la barra de dirección oculta de la app y "pesca" el dato. Ahora, la variable local `id` tiene guardado el número `4`.

### El último paso: Consultar la base de datos
Con el número `4` en nuestras manos, usamos el `useEffect` (que se ejecuta tan pronto como entras a la pantalla) para ir a tu base de datos y preguntar por la info:

```javascript
const iniciarBD = async () => {
    // ...
    const result = await db.getAllAsync(`
        SELECT * FROM restaurantes WHERE id_restaurante = ?
    `, [id]); // ← Aquí usamos el '4'
    
    setRestaurante(result);
};
```

**Resultado Final:**
La base de datos busca únicamente al restaurante con el ID `4`. Devuelve su nombre ("Red Rock Coffee"), su foto, sus stats, y tú se los pasas al componente visual (`restaurante[0]?.name`, `restaurante[0]?.cuisine`). 

¡Y listo! Al usuario le parece magia, pero en realidad fue una bonita cadena de mensajes pasándose un número de un lugar a otro.
