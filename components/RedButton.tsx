import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { GastronomicColors } from '../constants/theme';

interface RedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const RedButton: React.FC<RedButtonProps> = ({ 
  children, 
  variant = 'primary',
  fullWidth = false,
  onPress,
  style
}) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.base,
        variant === 'primary' ? styles.primary : styles.outline,
        fullWidth && styles.fullWidth,
        style
      ]}
    >
      <Text style={[
        styles.textBase,
        variant === 'primary' ? styles.textPrimary : styles.textOutline
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: GastronomicColors.primary,
    shadowColor: GastronomicColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  outline: {
    backgroundColor: GastronomicColors.bgWhite,
    borderWidth: 1,
    borderColor: GastronomicColors.primary,
  },
  textBase: {
    fontSize: 16,
    fontWeight: '500',
  },
  textPrimary: {
    color: GastronomicColors.bgWhite,
  },
  textOutline: {
    color: GastronomicColors.primary,
  },
});
