// Tarjeta de plato de comida para Favoritos y Menú
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';

interface FoodCardProps {
  name: string;
  image: string;
ciudad: string;
  telefono: string;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
  showAR?: boolean;
  onARPress?: () => void;
}

export default function FoodCard({
  name,
  image,
  ciudad,
  telefono,
  isFavorite = false,
  onPress,
  onFavoritePress,
  showAR = false,
  onARPress,
}: FoodCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{uri: image}} style={styles.image} />
        <TouchableOpacity style={styles.heartButton} onPress={onFavoritePress}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? Colors.primary : Colors.textWhite}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{ciudad}</Text>
          {telefono && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFB800" />
              <Text style={styles.ratingText}>{telefono}</Text>
            </View>
          )}
        </View>
        {showAR && (
          <TouchableOpacity style={styles.arButton} onPress={onARPress}>
            <Ionicons name="cube-outline" size={14} color={Colors.primary} />
            <Text style={styles.arText}>Ver 3D</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.lg,
    overflow: 'hidden',
    margin: Spacing.xs,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
  },
  heartButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: Spacing.borderRadius.full,
    padding: Spacing.xs + 2,
  },
  info: {
    padding: Spacing.md,
  },
  name: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  arButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  arText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
});
