// Pantalla de Favoritos - Grid de platos guardados
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { Typography } from "@/constants/typography";
import FoodCard from "@/components/FoodCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBaseDeDatos, Usuarios,Favoritos } from "@/hooks/dataBase";



export default function FavouritesScreen() {
  const router = useRouter();
  const localSesion = "sesion";
  const [favoritos, setFavoritos] = useState<Favoritos[] | []>([]);
  const {
    isReady,
    listarFavoritosUsuario,
    obtenerUsuarioCorreo,
    eliminarFavoritos,
  } = useBaseDeDatos();

  useEffect(() => {
    if (!isReady) return;
    const cargarFavoritos = async () => {
      const isLogin = await AsyncStorage.getItem(localSesion);
      if (!isLogin) {
        setFavoritos([]);
        return;
      }
      try {
        const u: Usuarios = JSON.parse(isLogin);
        const usuario = await obtenerUsuarioCorreo(u.email);
        const restaurantes = await listarFavoritosUsuario(Number(usuario?.id_usuario));
        setFavoritos(restaurantes);
      } catch {
        setFavoritos([]);
      }
    };
    cargarFavoritos();
  }, [isReady, listarFavoritosUsuario, obtenerUsuarioCorreo]);

  const quitarFavorito = async (idRestaurante: string) => {
    const isLogin = await AsyncStorage.getItem(localSesion);
    if (!isLogin) return;
    try {
      const u: Usuarios = JSON.parse(isLogin);
      const usuario = await obtenerUsuarioCorreo(u.email);
      const idUsuario = Number(usuario?.id_usuario);
      if (!idUsuario) return;
      await eliminarFavoritos(idRestaurante, idUsuario);
      setFavoritos((prev) => prev.filter((f) => f.id !== idRestaurante));
    } catch {
      // error al eliminar
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>{favoritos.length} restaurantes guardados</Text>
      </View>

      {/* Grid de favoritos */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        <View style={styles.row}>
          {favoritos.map((food) => (
            <View key={food.id} style={styles.cardWrapper}>
              <FoodCard
                name={food.nombre}
                image={require("@/assets/images/restaurant_banner.png")}
                ciudad={food.ciudad}
                telefono={food.telefono}
                
                onPress={() => router.replace(`../restaurant/${food.id}`)}
                onFavoritePress={() => quitarFavorito(food.id)}
              />
            </View>
          ))}
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 50,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  grid: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardWrapper: {
    width: "50%",
    padding: Spacing.xs,
  },
});
