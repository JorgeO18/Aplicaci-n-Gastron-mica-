// Pantalla de Favoritos - Grid de platos guardados
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import FoodCard from '@/components/FoodCard';


const favorites = [
  {
    id: '1',
    name: 'Egg Salmon',
    image: require('../../assets/images/food_salmon.png'),
    price: '$25.99',
    rating: 4.8,
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Chicken Stew',
    image: require('../../assets/images/food_chicken.png'),
    price: '$18.50',
    rating: 4.5,
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Banga Soup',
    image: require('../../assets/images/food_soup.png'),
    price: '$30.99',
    rating: 4.9,
    isFavorite: true,
  },
  {
    id: '4',
    name: 'Pizza Margherita',
    image: require('../../assets/images/food_pizza.png'),
    price: '$22.00',
    rating: 4.6,
    isFavorite: true,
  },
  {
    id: '5',
    name: 'Grilled Steak',
    image: require('../../assets/images/restaurant_banner.png'),
    price: '$35.99',
    rating: 4.7,
    isFavorite: true,
  },
  {
    id: '6',
    name: 'Special Soup',
    image: require('../../assets/images/food_soup.png'),
    price: '$28.50',
    rating: 4.4,
    isFavorite: true,
  },
];

interface Favoritos {
  nombre: string;
  image:string;
  ciudad: string;
 telefono: string;
}

export default function FavouritesScreen() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<Favoritos[]|[]>([]);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>{favorites.length} platos guardados</Text>
      </View>

      {/* Grid de favoritos */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        <View style={styles.row}> 
          {favoritos.map((food, index) => (
            <View key={index} style={styles.cardWrapper}>
              <FoodCard
                name={food.nombre}
                image={food.image}
                ciudad={food.ciudad}
                telefono={food.telefono}
                showAR={true}
                onARPress={() => router.push('/ar/instructions')}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    width: '50%',
    padding: Spacing.xs,
  },
});
