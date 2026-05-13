// Componente Logo "tg" de TasteGo
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface LogoProps {
  size?: number;
  color?: string;
  showText?: boolean;
  textColor?: string;
}

export default function Logo({ 
  size = 80, 
  color = Colors.primary,
  showText = false,
  textColor = Colors.primary,
}: LogoProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={[styles.logoText, { fontSize: size * 0.4, color }]}>tg</Text>
      </View>
      {showText && (
        <Text style={[styles.brandName, { color: textColor }]}>TasteGo</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    backgroundColor: Colors.textWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontWeight: '700',
    fontStyle: 'italic',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '700',
    fontStyle: 'italic',
    marginTop: 12,
    letterSpacing: 1,
  },
});
