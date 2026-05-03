import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GastronomicColors } from '@/constants/theme';

export default function DetalleScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de la Ruta</Text>
      <Text style={styles.subtitle}>ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GastronomicColors.bgGradientTop,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
  },
  subtitle: {
    fontSize: 16,
    color: GastronomicColors.textLight,
    marginTop: 8,
  },
});
