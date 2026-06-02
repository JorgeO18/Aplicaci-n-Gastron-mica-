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
  const { db, isReady, listarFavoritosUsuario, obtenerUsuarioCorreo } =
    useBaseDeDatos();

  useEffect(() => {
    const cargarFav = async () => {
      const isLogin = await AsyncStorage.getItem(localSesion);
      const u: Usuarios = JSON.parse(isLogin!);
      const usario = await obtenerUsuarioCorreo(u.email);
      const restarante = await listarFavoritosUsuario(Number(usario?.id_usuario));
      setFavoritos(restarante)
    };
    cargarFav()
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>{favoritos.length} platos guardados</Text>
      </View>

      {/* Grid de favoritos */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        <View style={styles.row}>
          {favoritos.map((food, index) => (
            <View key={index} style={styles.cardWrapper}>
              <FoodCard
                name={food.nombre}
                image={food.image}
                ciudad={food.ciudad}
                telefono={food.telefono}
                showAR={true}
                onARPress={() => router.push("/ar/instructions")}
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
