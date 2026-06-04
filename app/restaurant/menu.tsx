// Pantalla del Menú del Restaurante - Diseño TasteGo
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { Typography } from "@/constants/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBaseDeDatos, Platos } from "@/hooks/dataBase";


export default function MenuScreen() {
  const { idRes } = useLocalSearchParams<{ idRes: string }>();
  const { db, isReady, listarMenuRestaurante } = useBaseDeDatos();
  const [menu, setMenu] = useState<Platos[] | []>([]);
  const router = useRouter();
  const local = "moldelRA";
  const verRA = async (model: string) => {
    try {
      await AsyncStorage.setItem(local, JSON.stringify(model));

      console.log("Modelo guardado:", JSON.stringify(model));

      router.push("/ar/instructions");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const cargarMenu = async () => {
      if (!isReady || !db) return;
      const menus = await listarMenuRestaurante(idRes);
      
      setMenu(menus);
      
    };
    
    cargarMenu();
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Menú</Text>
          <Text style={styles.subtitle}>Sabor & Fuego</Text>
        </View>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons
            name="search-outline"
            size={22}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Categorías del menú */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
      >
        {[
          "Todo",
          "Entradas",
          "Plato fuerte",
          "Sopas",
          "Postres",
          "Bebidas",
        ].map((cat, index) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryTab,
              index === 0 && styles.categoryTabActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                index === 0 && styles.categoryTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de platos */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuList}
      >
        {menu.map((item) => (
          <TouchableOpacity
            key={item.id_plato}
            style={styles.menuCard}
            activeOpacity={0.8}
          >
            <Image source={require("@/assets/images/food_soup.png")} style={styles.menuImage} />
            <View style={styles.menuInfo}>
              <Text style={styles.menuName}>{item.nombre}</Text>
              <Text style={styles.menuDescription} numberOfLines={2}>
                {item.descripcion}
              </Text>
              <View style={styles.menuBottom}>
                <Text style={styles.menuPrice}>{item.precio}</Text>
                <View style={styles.menuActions}>
                  <TouchableOpacity
                    style={styles.arBadge}
                    onPress={async () => await verRA(item.modelo_3d_url)}
                  >
                    <Ionicons
                      name="cube-outline"
                      size={14}
                      color={Colors.primary}
                    />
                    <Text style={styles.arBadgeText}>Ver 3D</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: 50,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.full,
    backgroundColor: Colors.backgroundGray,
    height:Spacing.sm
  },
  categoryTabActive: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.textWhite,
    fontWeight: Typography.weights.bold,
  },
  menuList: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  menuCard: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  menuImage: {
    width: 110,
    height: 130,
  },
  menuInfo: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: "space-between",
  },
  menuName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  menuBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuPrice: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  menuActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  ratingSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingSmallText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  arBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  arBadgeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
});
