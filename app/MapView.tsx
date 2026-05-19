import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MapScreen from '../components/MapScreen';
import { useLocalSearchParams } from 'expo-router';

export default function App() {
    const {id} = useLocalSearchParams()
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#1F4E79" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍽️ Restaurantes Cercanos</Text>
      </View>

      {/* Mapa principal */}
      <MapScreen resId={Number(id)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1F4E79' },
  header: {
    backgroundColor: '#1F4E79',
    paddingTop: Platform.OS === 'ios' ? 54 : 36,
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});