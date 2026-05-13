// Icono de categoría circular (Pizza, Burger, etc.)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';

interface CategoryIconProps {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  isActive?: boolean;
  onPress?: () => void;
  color?: string;
}

export default function CategoryIcon({
  name,
  icon,
  isActive = false,
  onPress,
  color,
}: CategoryIconProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[
        styles.iconCircle,
        isActive && styles.activeCircle,
        color ? { backgroundColor: color + '15' } : {},
      ]}>
        <Ionicons
          name={icon}
          size={24}
          color={isActive ? Colors.textWhite : (color || Colors.primary)}
        />
      </View>
      <Text style={[styles.label, isActive && styles.activeLabel]}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: Spacing.base,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  activeCircle: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  activeLabel: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
});
