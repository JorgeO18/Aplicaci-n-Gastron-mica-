// Tarjeta de restaurante para la pantalla Home
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';

interface RestaurantCardProps {
  name: string;
  image: ImageSourcePropType;
  // rating: number;
  distance: string;
  // deliveryTime: string;
  cuisine: string;
  onPress?: () => void;
  variant?: 'horizontal' | 'vertical';
  discount?: string;
}

export default function RestaurantCard({
  name,
  image,
  // rating,
  distance,
  // deliveryTime,
  cuisine,
  onPress,
  variant = 'vertical',
  discount,
}: RestaurantCardProps) {
  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.8}>
        <Image source={image} style={styles.horizontalImage} />
        <View style={styles.horizontalInfo}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.cuisine}>{cuisine}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.statText}>{distance}</Text>
            </View>
            {/* <View style={styles.stat}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.statText}>{rating}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.statText}>{deliveryTime}</Text> 
            </View>*/}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={20} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.cuisine}>{cuisine}</Text>
        <View style={styles.statsRow}>
          {/* <View style={styles.stat}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.statText}>{rating}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.statText}>{deliveryTime}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.statText}>{distance}</Text>
          </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.lg,
    overflow: 'hidden',
    marginRight: Spacing.base,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: Spacing.borderRadius.lg,
    borderTopRightRadius: Spacing.borderRadius.lg,
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
  },
  discountText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
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
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cuisine: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  // Horizontal variant
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  horizontalImage: {
    width: 100,
    height: 100,
  },
  horizontalInfo: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
});
