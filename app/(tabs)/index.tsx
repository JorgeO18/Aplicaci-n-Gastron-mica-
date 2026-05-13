// Pantalla Home - Pantalla principal con diseño de TasteGo
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import SearchBar from '@/components/SearchBar';
import RestaurantCard from '@/components/RestaurantCard';
import CategoryIcon from '@/components/CategoryIcon';

// Datos mock de restaurantes
const popularRestaurants = [
  {
    id: '1',
    name: 'Sabor & Fuego',
    image: require('../../assets/images/restaurant_banner.png'),
    rating: 4.8,
    distance: '1.2 km',
    deliveryTime: '25 min',
    cuisine: 'Parrilla • Latina',
    discount: '15% OFF',
  },
  {
    id: '2',
    name: 'Pizza Hot',
    image: require('../../assets/images/food_pizza.png'),
    rating: 4.5,
    distance: '0.8 km',
    deliveryTime: '20 min',
    cuisine: 'Pizzería • Italiana',
  },
  {
    id: '3',
    name: 'Sushi Master',
    image: require('../../assets/images/food_salmon.png'),
    rating: 4.7,
    distance: '2.1 km',
    deliveryTime: '35 min',
    cuisine: 'Japonesa • Sushi',
  },
];

const moreRestaurants = [
  {
    id: '4',
    name: 'El Buen Gusto',
    image: require('../../assets/images/food_soup.png'),
    rating: 4.3,
    distance: '0.5 km',
    deliveryTime: '15 min',
    cuisine: 'Casera • Sopas',
  },
  {
    id: '5',
    name: 'Chicken House',
    image: require('../../assets/images/food_chicken.png'),
    rating: 4.6,
    distance: '1.8 km',
    deliveryTime: '30 min',
    cuisine: 'Pollo • Americana',
  },
  {
    id: '6',
    name: 'La Trattoria',
    image: require('../../assets/images/food_pizza.png'),
    rating: 4.4,
    distance: '1.0 km',
    deliveryTime: '25 min',
    cuisine: 'Italiana • Pastas',
  },
];

const categories = [
  { name: 'Todo', icon: 'grid-outline' as const, isActive: true },
  { name: 'Pizza', icon: 'pizza-outline' as const },
  { name: 'Burger', icon: 'fast-food-outline' as const },
  { name: 'Sushi', icon: 'fish-outline' as const },
  { name: 'Pollo', icon: 'restaurant-outline' as const },
  { name: 'Postre', icon: 'ice-cream-outline' as const },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola, José! 👋</Text>
            <Text style={styles.subtitle}>¿Qué quieres comer hoy?</Text>
          </View>
          <TouchableOpacity
            style={styles.notifButton}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <SearchBar onPress={() => router.push('/search')} editable={false} />

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
                <Text style={styles.bannerTitle}>Oferta especial{'\n'}de hoy</Text>
                <Text style={styles.bannerSubtitle}>En restaurantes seleccionados</Text>
              </View>
              <View style={styles.bannerImageContainer}>
                <Image
                  source={require('../../assets/images/restaurant_banner.png')}
                  style={styles.bannerImage}
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Categorías */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat, index) => (
              <CategoryIcon
                key={index}
                name={cat.name}
                icon={cat.icon}
                isActive={cat.isActive}
              />
            ))}
          </ScrollView>
        </View>

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
                rating={restaurant.rating}
                distance={restaurant.distance}
                deliveryTime={restaurant.deliveryTime}
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
          {moreRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              name={restaurant.name}
              image={restaurant.image}
              rating={restaurant.rating}
              distance={restaurant.distance}
              deliveryTime={restaurant.deliveryTime}
              cuisine={restaurant.cuisine}
              variant="horizontal"
              onPress={() => router.push(`/restaurant/${restaurant.id}`)}
            />
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 50,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
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
    overflow: 'hidden',
  },
  banner: {
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  discountBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
    alignSelf: 'flex-start',
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
    color: 'rgba(255,255,255,0.8)',
  },
  bannerImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginLeft: Spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});
