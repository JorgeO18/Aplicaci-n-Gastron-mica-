import { View, Text, StyleSheet } from 'react-native';
import { GastronomicColors } from '@/constants/theme';

export default function AgendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Nueva Ruta</Text>
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
});
