// Pantalla Detalle de Restaurante - Diseño TasteGo
import GradientButton from "@/components/GradientButton";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { Typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Resena,
  RestauranteI,
  useBaseDeDatos,
  Usuarios,
} from "../../hooks/dataBase";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const localSesion = "sesion";
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    db,
    isReady,
    agregarFavoritos,
    eliminarFavoritos,
    estaEnFavoritos,
    obtenerUsuarioCorreo,
    agregarResena,
    listarResenasRestaurante,
    obtenerPromedioRestaurante,
  } = useBaseDeDatos();
  const [restaurante, setRestaurante] = useState<RestauranteI[] | []>([]);
  const [esFavorito, setEsFavorito] = useState(false);

  // Estados para reseñas
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [promedio, setPromedio] = useState(0);
  const [totalResenas, setTotalResenas] = useState(0);
  const [puntuacionNueva, setPuntuacionNueva] = useState(0);
  const [comentarioNuevo, setComentarioNuevo] = useState("");
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState<Usuarios | null>(null);

  useEffect(() => {
    const iniciarBD = async () => {
      if (!isReady || !db) return;
      const result = await db.getAllAsync<RestauranteI>(
        `
    SELECT 
      id_restaurante  ,
      nombre          ,
      descripcion     ,
      tipo_comida     ,
      direccion       ,
      ciudad,
      latitud         ,
      longitud        ,
      imagen_url      ,
      portada_url     ,
      telefono        ,
      horario         ,
      fuente
    FROM restaurantes WHERE id_restaurante = ?
  `,
        [id],
      );
      setRestaurante(result);
    };
    iniciarBD();
  }, [db, id, isReady]);

  useEffect(() => {
    const cargarEstadoFavorito = async () => {
      if (!isReady || !id) return;
      const isLogin = await AsyncStorage.getItem(localSesion);
      if (!isLogin) {
        setEsFavorito(false);
        return;
      }
      try {
        const u: Usuarios = JSON.parse(isLogin);
        const usuario = await obtenerUsuarioCorreo(u.email);
        if (!usuario?.id_usuario) return;
        const enFavoritos = await estaEnFavoritos(
          id,
          Number(usuario.id_usuario),
        );
        setEsFavorito(enFavoritos);
      } catch {
        setEsFavorito(false);
      }
    };
    cargarEstadoFavorito();
  }, [id, isReady, estaEnFavoritos, obtenerUsuarioCorreo]);

  // Cargar reseñas y promedio
  const cargarResenas = async () => {
    if (!id) return;
    const idNum = Number(id);
    const lista = await listarResenasRestaurante(idNum);
    setResenas(lista);
    const prom = await obtenerPromedioRestaurante(idNum);
    setPromedio(prom.promedio);
    setTotalResenas(prom.total);
  };

  useEffect(() => {
    if (!isReady || !id) return;
    cargarResenas();

    // Cargar usuario actual
    const cargarUsuario = async () => {
      const isLogin = await AsyncStorage.getItem(localSesion);
      if (isLogin) {
        try {
          const u: Usuarios = JSON.parse(isLogin);
          const usuario = await obtenerUsuarioCorreo(u.email);
          if (usuario) setUsuarioActual(usuario);
        } catch {}
      }
    };
    cargarUsuario();
  }, [id, isReady]);

  const enviarResena = async () => {
    if (!usuarioActual || !id) return;
    if (puntuacionNueva === 0) {
      alert("Selecciona una puntuación");
      return;
    }
    if (!comentarioNuevo.trim()) {
      alert("Escribe un comentario");
      return;
    }
    setEnviandoResena(true);
    const result = await agregarResena(
      Number(usuarioActual.id_usuario),
      Number(id),
      puntuacionNueva,
      comentarioNuevo,
    );
    if (result.state) {
      setPuntuacionNueva(0);
      setComentarioNuevo("");
      await cargarResenas();
    } else {
      alert(result.mensaje);
    }
    setEnviandoResena(false);
  };

  const alternarFavorito = async () => {
    const isLogin = await AsyncStorage.getItem(localSesion);
    if (!isLogin) return;
    try {
      const u: Usuarios = JSON.parse(isLogin);
      const usuario = await obtenerUsuarioCorreo(u.email);
      const idUsuario = Number(usuario?.id_usuario);
      if (!idUsuario) return;

      if (esFavorito) {
        await eliminarFavoritos(id, idUsuario);
        setEsFavorito(false);
      } else {
        await agregarFavoritos(id, idUsuario);
        setEsFavorito(true);
      }
    } catch {
      // sin sesión válida o error de BD
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen de cabecera */}
        <View style={styles.headerImage}>
          <Image
            source={{
              uri: restaurante[0]?.portada_url || restaurante[0]?.imagen_url,
            }}
            style={styles.coverImage}
          />

          {/* Overlay gradiente */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.imageOverlay}
          />
          {/* Botones superiores */}
          <View style={styles.topButtons}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.circleButton}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.textWhite} />
            </TouchableOpacity>
            <View style={styles.topRight}>
              <TouchableOpacity style={styles.circleButton}>
                <Ionicons
                  name="share-outline"
                  size={22}
                  color={Colors.textWhite}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.circleButton}
                onPress={alternarFavorito}
              >
                <Ionicons
                  name={esFavorito ? "heart" : "heart-outline"}
                  size={22}
                  color={esFavorito ? Colors.primary : Colors.textWhite}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Info del restaurante */}
        <View style={styles.infoContainer}>
          {/* Nombre y rating */}
          <View style={styles.nameRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.restaurantName}>
                {restaurante[0]?.nombre}
              </Text>
              <Text style={styles.cuisine}>
                {restaurante[0]?.tipo_comida ?? ""}
              </Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.ratingText}>
                {totalResenas > 0 ? promedio.toFixed(1) : "N/A"}
              </Text>
              {totalResenas > 0 && (
                <Text style={styles.ratingCount}>({totalResenas})</Text>
              )}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View>
                <Text style={styles.statValue}>1.2 km</Text>
                <Text style={styles.statLabel}>Distancia</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="time-outline" size={20} color={Colors.orange} />
              </View>
              <View>
                <Text style={styles.statValue}>25 min</Text>
                <Text style={styles.statLabel}>Tiempo</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={Colors.success}
                />
              </View>
              <View>
                <Text style={styles.statValue}>Abierto</Text>
                <Text style={styles.statLabel}>{restaurante[0]?.horario}</Text>
              </View>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>Sobre nosotros</Text>
            <Text style={styles.description}>
              {restaurante[0]?.descripcion}
            </Text>
          </View>

          {/* Horario */}
          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>Horario</Text>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>Lunes - Viernes</Text>
              <Text style={styles.scheduleTime}>9:00 AM - 10:00 PM</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>Sábado - Domingo</Text>
              <Text style={styles.scheduleTime}>10:00 AM - 11:00 PM</Text>
            </View>
          </View>

          {/* Platos populares (preview) */}
          <View style={styles.dishesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Platos populares</Text>
              <TouchableOpacity onPress={() => router.push("/restaurant/menu")}>
                <Text style={styles.seeAll}>Ver todo</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                {
                  name: "Banga Soup",
                  price: "$30.99",
                  image: require("@/assets/images/food_soup.png"),
                },
                {
                  name: "Grilled Steak",
                  price: "$35.99",
                  image: require("@/assets/images/restaurant_banner.png"),
                },
                {
                  name: "Chicken Stew",
                  price: "$18.50",
                  image: require("@/assets/images/food_chicken.png"),
                },
              ].map((dish, index) => (
                <TouchableOpacity key={index} style={styles.miniDishCard}>
                  <Image source={dish.image} style={styles.miniDishImage} />
                  <Text style={styles.miniDishName} numberOfLines={1}>
                    {dish.name}
                  </Text>
                  <Text style={styles.miniDishPrice}>{dish.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Sección: Agregar reseña */}
          {usuarioActual && (
            <View style={styles.reviewFormSection}>
              <Text style={styles.sectionTitle}>Deja tu reseña</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setPuntuacionNueva(star)}
                  >
                    <Ionicons
                      name={star <= puntuacionNueva ? "star" : "star-outline"}
                      size={36}
                      color="#FFB800"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.commentInput}
                placeholder="Escribe tu comentario..."
                placeholderTextColor={Colors.textLight}
                value={comentarioNuevo}
                onChangeText={setComentarioNuevo}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={[
                  styles.sendReviewButton,
                  enviandoResena && { opacity: 0.6 },
                ]}
                onPress={enviarResena}
                disabled={enviandoResena}
              >
                <Ionicons name="send" size={18} color={Colors.textWhite} />
                <Text style={styles.sendReviewText}>
                  {enviandoResena ? "Enviando..." : "Enviar reseña"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Sección: Comentarios de usuarios */}
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>
              Comentarios ({totalResenas})
            </Text>
            {resenas.length === 0 ? (
              <View style={styles.noReviewsContainer}>
                <Ionicons
                  name="chatbubble-outline"
                  size={40}
                  color={Colors.textLight}
                />
                <Text style={styles.noReviewsText}>
                  Sé el primero en opinar
                </Text>
              </View>
            ) : (
              resenas.map((resena) => (
                <View key={resena.id_resena} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Ionicons
                      name="person-circle"
                      size={36}
                      color={Colors.primary}
                    />
                    <View style={styles.reviewHeaderInfo}>
                      <Text style={styles.reviewerName}>
                        {resena.nombre_usuario ?? "Usuario"}
                      </Text>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Ionicons
                            key={s}
                            name={
                              s <= resena.puntuacion ? "star" : "star-outline"
                            }
                            size={14}
                            color="#FFB800"
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>
                      {resena.fecha_creacion?.split(" ")[0] ?? ""}
                    </Text>
                  </View>
                  <Text style={styles.reviewComment}>{resena.comentario}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Botón fijo inferior */}
      <View style={styles.bottomBar}>
        <GradientButton
          title="Ver platos completos"
          onPress={() =>
            router.push({ pathname: "/restaurant/menu", params: { idRes: id } })
          }
          style={styles.viewMenuButton}
        />
        <GradientButton
          title="Iniciar ruta"
          onPress={() =>
            router.push({ pathname: "../MapView", params: { idRes: id } })
          }
          variant="outline"
          style={styles.routeButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerImage: {
    width: SCREEN_WIDTH,
    height: 280,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  topButtons: {
    position: "absolute",
    top: 44,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topRight: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    padding: Spacing.lg,
    marginTop: -20,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  nameContainer: {
    flex: 1,
  },
  restaurantName: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cuisine: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.lg,
    gap: 4,
  },
  ratingText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.backgroundGray,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textLight,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  descSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  scheduleSection: {
    marginBottom: Spacing.xl,
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  scheduleDay: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  scheduleTime: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  dishesSection: {
    marginBottom: Spacing.huge,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  miniDishCard: {
    width: 130,
    marginRight: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.md,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  miniDishImage: {
    width: "100%",
    height: 90,
  },
  miniDishName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  miniDishPrice: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
    paddingTop: 2,
  },
  bottomBar: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.sm, // Espacio entre los dos botones
  },
  viewMenuButton: {
    width: "100%",
  },
  routeButton: {
    width: "100%",
  },
  ratingCount: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  reviewFormSection: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.backgroundGray,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  commentInput: {
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.md,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  sendReviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    gap: Spacing.sm,
  },
  sendReviewText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  reviewsSection: {
    marginBottom: Spacing.huge,
  },
  noReviewsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxl,
  },
  noReviewsText: {
    color: Colors.textLight,
    fontSize: Typography.sizes.md,
    marginTop: Spacing.sm,
  },
  reviewCard: {
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  reviewHeaderInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  reviewerName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semiBold,
    color: Colors.textPrimary,
  },
  reviewStars: {
    flexDirection: "row",
    marginTop: 2,
  },
  reviewDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textLight,
  },
  reviewComment: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
