// Pantalla Detalle de Restaurante - Diseño TasteGo
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import GradientButton from '@/components/GradientButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen de cabecera */}
        <View style={styles.headerImage}>
          <Image
            source={require('@/assets/images/restaurant_exterior.png')}
            style={styles.coverImage}
          />
          {/* Overlay gradiente */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageOverlay}
          />
          {/* Botones superiores */}
          <View style={styles.topButtons}>
            <TouchableOpacity onPress={() => router.back()} style={styles.circleButton}>
              <Ionicons name="arrow-back" size={22} color={Colors.textWhite} />
            </TouchableOpacity>
            <View style={styles.topRight}>
              <TouchableOpacity style={styles.circleButton}>
                <Ionicons name="share-outline" size={22} color={Colors.textWhite} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.circleButton}>
                <Ionicons name="heart-outline" size={22} color={Colors.textWhite} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Info del restaurante */}
        <View style={styles.infoContainer}>
          {/* Nombre y rating */}
          <View style={styles.nameRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.restaurantName}>Sabor & Fuego</Text>
              <Text style={styles.cuisine}>Parrilla • Latina • Gourmet</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons name="location-outline" size={20} color={Colors.primary} />
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
                <Ionicons name="calendar-outline" size={20} color={Colors.success} />
              </View>
              <View>
                <Text style={styles.statValue}>Abierto</Text>
                <Text style={styles.statLabel}>9am - 10pm</Text>
              </View>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>Sobre nosotros</Text>
            <Text style={styles.description}>
              Restaurante de parrilla y cocina latina con los mejores cortes de carne y sabores
              auténticos. Disfruta de una experiencia gastronómica única con ingredientes frescos
              y técnicas tradicionales.
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
              <TouchableOpacity onPress={() => router.push('/restaurant/menu')}>
                <Text style={styles.seeAll}>Ver todo</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { name: 'Banga Soup', price: '$30.99', image: require('@/assets/images/food_soup.png') },
                { name: 'Grilled Steak', price: '$35.99', image: require('@/assets/images/restaurant_banner.png') },
                { name: 'Chicken Stew', price: '$18.50', image: require('@/assets/images/food_chicken.png') },
              ].map((dish, index) => (
                <TouchableOpacity key={index} style={styles.miniDishCard}>
                  <Image source={dish.image} style={styles.miniDishImage} />
                  <Text style={styles.miniDishName} numberOfLines={1}>{dish.name}</Text>
                  <Text style={styles.miniDishPrice}>{dish.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Botón fijo inferior */}
      <View style={styles.bottomBar}>
        <GradientButton
          title="Ver platos completos"
          onPress={() => router.push('/restaurant/menu')}
          style={styles.viewMenuButton}
        />
        <GradientButton
          title="Iniciar ruta"
          onPress={() => router.push('/restaurant/route')}
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
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  topButtons: {
    position: 'absolute',
    top: 44,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    padding: Spacing.lg,
    marginTop: -20,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.backgroundGray,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  miniDishImage: {
    width: '100%',
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
    width: '100%',
  },
  routeButton: {
    width: '100%',
  },
});
