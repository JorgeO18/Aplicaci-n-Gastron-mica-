// Pantalla Home - Pantalla principal con diseño de TasteGo
import CategoryIcon from "@/components/CategoryIcon";
import RestaurantCard from "@/components/RestaurantCard";
import SearchBar from "@/components/SearchBar";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
//imports necesarios para manejo de api y datos
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBaseDeDatos , Usuarios } from "../../hooks/dataBase";
import { getDistanceInMeters } from "../../hooks/distance";
import { reverseGeocode } from "../../hooks/reverseGeocode";
import { useLocation } from "../../hooks/useLocation";
import { Restaurant, useRestaurants } from "../../hooks/useRestaurants";

const LOCAL_KEY = "ubicacionUsuario";
//---------------------------------------------------

// Datos mock de restaurantes
const popularRestaurants = [
  {
    id: "1",
    name: "Sabor & Fuego",
    image: require("../../assets/images/restaurant_banner.png"),
    rating: 4.8,
    distance: "1.2 km",
    deliveryTime: "25 min",
    cuisine: "Parrilla • Latina",
    discount: "15% OFF",
  },
  {
    id: "2",
    name: "Pizza Hot",
    image: require("../../assets/images/food_pizza.png"),
    rating: 4.5,
    distance: "0.8 km",
    deliveryTime: "20 min",
    cuisine: "Pizzería • Italiana",
  },
  {
    id: "3",
    name: "Sushi Master",
    image: require("../../assets/images/food_salmon.png"),
    rating: 4.7,
    distance: "2.1 km",
    deliveryTime: "35 min",
    cuisine: "Japonesa • Sushi",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  //Manejo de datos y api
  const { db, isReady, insertarDemos } = useBaseDeDatos();
  const localSesion = 'sesion'
  const [user, setUser] = useState<Usuarios | null>(null)
  const { location, error: errorlo, loading: loadingLo } = useLocation();
  const {
    restaurants,
    loading: loadingRe, // varibale de la carga de restaurantes
    fetchRestaurants,
  } = useRestaurants();
  const [restaurante, setRestaurante] = useState<Restaurant[]>([]); //Donde se guardan los restaurantes para visualizar datos
  const lastFetchRef = useRef<{ latitude: number; longitude: number } | null>(
    null,
  );
  const bdCargadaRef = useRef(false); // ← nuevo flag

  // 1. Cargar BD y última ubicación guardada
  useEffect(() => {
    const iniciarBD = async () => {
      if (user === null) {
        const isLogin = await AsyncStorage.getItem(localSesion)
        const u :Usuarios = JSON.parse(isLogin!)
        setUser(u)
        
      }
      console.log(user)
      if (!isReady || !db) return;

      const result = await db.getAllAsync<Restaurant>(`
      SELECT 
        id_restaurante  AS id,
        nombre          AS name,
        descripcion     AS description,
        tipo_comida     AS cuisine,
        direccion       AS address,
        ciudad,
        latitud         AS latitude,
        longitud        AS longitude,
        imagen_url      AS image,
        telefono        AS phone,
        horario         AS openingHours,
        fuente
      FROM restaurantes
    `);

      setRestaurante(result);
      bdCargadaRef.current = true; // ← marcar que la BD ya cargó

      const ubi = await AsyncStorage.getItem(LOCAL_KEY);
      if (ubi) lastFetchRef.current = JSON.parse(ubi); // ← ref, no estado
    };

    iniciarBD();
  }, [db]);

  // 2. Verificar ubicación — ahora usa ref, nunca lee estado stale
  useEffect(() => {
    const verificarUbicacion = async () => {
      if (!location || !bdCargadaRef.current) return; // ← espera que BD cargue

      const last = lastFetchRef.current;

      if (!last) {
        // Primera vez: pedir a la API
        fetchRestaurants(location.latitude, location.longitude);
        lastFetchRef.current = location;
        await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(location));
        return;
      }

      const distance = getDistanceInMeters(
        last.latitude,
        last.longitude,
        location.latitude,
        location.longitude,
      );

      console.log("Distancia recorrida:", distance);

      // Solo llama si se movió más de 5km — ya NO usa restaurante.length
      if (distance > 5000) {
        fetchRestaurants(location.latitude, location.longitude);
        lastFetchRef.current = location;
        await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(location));
      }
    };

    verificarUbicacion();
  }, [location]); // ← location es la única dependencia real

  // 3. Cuando llegan restaurantes de la API y la BD está lista, guardar y mostrar
  useEffect(() => {
    if (!db || restaurants.length === 0) return;
    guardarRestaurants();
  }, [db, restaurants]);

  const guardarRestaurants = async () => {
    if (!db || restaurants.length === 0) {
      console.log("⛔ guardarRestaurants abortado:", {
        db: !!db,
        count: restaurants.length,
      });
      return;
    }

    console.log(`📦 Intentando guardar ${restaurants.length} restaurantes...`);

    for (const item of restaurants) {
      try {
        let displayName = null;
        try {
          const ub = await reverseGeocode(item.latitude, item.longitude);
          displayName = ub?.displayName ?? null;
        } catch (geoErr) {
          console.warn("⚠️ reverseGeocode falló para:", item.id, geoErr);
        }

        await db.runAsync(
          `INSERT OR REPLACE INTO restaurantes
        (id_restaurante, nombre, descripcion, tipo_comida, direccion, ciudad,
         latitud, longitud, imagen_url, telefono, horario, fuente)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            item.id,
            item.name,
            item.description ??
              "Es un restaurante de comida tipica de la region, que promueve la cultura atraves de los platos que ofrece",
            item.cuisine ?? "Tipica",
            item.address ?? displayName ?? null,
            "",
            item.latitude,
            item.longitude,
            item.image ?? null,
            item.phone ?? "8569435741",
            item.openingHours ?? null,
            "api",
          ],
        );
        console.log("✅ Guardado:", item.name);
      } catch (err) {
        console.error("❌ Error guardando restaurante:", item.id, err);
      }
    }

    const result = await db.getAllAsync<Restaurant>(`
    SELECT 
      id_restaurante  AS id,
      nombre          AS name,
      descripcion     AS description,
      tipo_comida     AS cuisine,
      direccion       AS address,
      ciudad,
      latitud         AS latitude,
      longitud        AS longitude,
      imagen_url      AS image,
      telefono        AS phone,
      horario         AS openingHours,
      fuente
    FROM restaurantes
  `);

    await insertarDemos(result);

    console.log(`🍽️ Total en BD después de guardar: ${result.length}`);
    setRestaurante(result);
  };
  //------------------------------------------------------------

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola, {user?.nombre} 👋</Text>
            <Text style={styles.subtitle}>¿Qué quieres comer hoy?</Text>
          </View>
          <TouchableOpacity
            style={styles.notifButton}
            onPress={() => router.push("./notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.textPrimary}
            />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <SearchBar onPress={() => router.push("./search")} editable={false} />

        {/* Banner de oferta */}
        <TouchableOpacity style={styles.bannerContainer} activeOpacity={0.9}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.banner}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerTextContainer}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>15% OFF</Text>
                </View>
                <Text style={styles.bannerTitle}>
                  Oferta especial{"\n"}de hoy
                </Text>
                <Text style={styles.bannerSubtitle}>
                  En restaurantes seleccionados
                </Text>
              </View>
              <View style={styles.bannerImageContainer}>
                <Image
                  source={require("../../assets/images/restaurant_banner.png")}
                  style={styles.bannerImage}
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Los más visitados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Los más visitados</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                name={restaurant.name}
                image={restaurant.image}
                // rating={restaurant.rating}
                // distance={restaurant.distance}
                // deliveryTime={restaurant.deliveryTime}
                cuisine={restaurant.cuisine}
                discount={restaurant.discount}
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Más restaurantes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Más restaurantes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {/* PREGUNTA (Condición): 
// ¿La variable loadingRe dice que la base de datos está cargando 
// O (||) el arreglo de 'restaurante' todavía está vacío (longitud === 0)?*/}

          {loadingRe || restaurante.length === 0 ? (
            // RESPUESTA AFIRMATIVA (Si se cumple alguna de las dos):
            // Dibuja en la pantalla el ActivityIndicator (El circulito dando vueltas)

            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loaderText}>Buscando restaurantes...</Text>
            </View>
          ) : (
            // RESPUESTA NEGATIVA (Si ninguna de las dos se cumple):
            // Empieza a dibujar la lista real de restaurantes usando .map()

            restaurante.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                name={restaurant.name}
                image={require("../../assets/images/restaurant_banner.png")}
                // rating={restaurant.rating}
                // distance={restaurant.distance}
                // deliveryTime={restaurant.deliveryTime}
                cuisine={restaurant.cuisine ?? ""}
                variant="horizontal"
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 50,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundGray,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notifBadge: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  bannerContainer: {
    marginTop: Spacing.lg,
    borderRadius: Spacing.borderRadius.xl,
    overflow: "hidden",
  },
  banner: {
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerTextContainer: {
    flex: 1,
  },
  discountBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
    alignSelf: "flex-start",
    marginBottom: Spacing.sm,
  },
  discountBadgeText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  bannerTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textWhite,
    lineHeight: 26,
    marginBottom: Spacing.xs,
  },
  bannerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.8)",
  },
  bannerImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginLeft: Spacing.md,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  loaderContainer: {
    padding: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: Typography.sizes.md,
  },
});
