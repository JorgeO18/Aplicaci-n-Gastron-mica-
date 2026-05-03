import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { GastronomicColors } from '../constants/theme';

interface FilterPillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
}

export const FilterPill: React.FC<FilterPillProps> = ({ label, active = false, onPress, icon }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        active ? styles.containerActive : styles.containerInactive,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  containerActive: {
    backgroundColor: GastronomicColors.primary,
    borderColor: GastronomicColors.primary,
  },
  containerInactive: {
    backgroundColor: GastronomicColors.bgWhite,
    borderColor: GastronomicColors.primary,
  },
  iconContainer: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  labelActive: {
    color: GastronomicColors.bgWhite,
  },
  labelInactive: {
    color: GastronomicColors.primary,
  },
});
