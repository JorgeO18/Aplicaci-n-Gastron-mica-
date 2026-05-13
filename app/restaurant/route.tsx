// Pantalla de Ruta al Restaurante (Mapa Mockup)
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import GradientButton from '@/components/GradientButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RouteScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Mapa Mockup (Fondo con elementos geométricos) */}
      <View style={styles.mapContainer}>
        <View style={styles.mapBackground}>
          {/* Simulación de calles */}
          <View style={[styles.mapStreet, { top: '30%', height: 40, width: '100%' }]} />
          <View style={[styles.mapStreet, { left: '45%', width: 40, height: '100%' }]} />
          <View style={[styles.mapStreet, { top: '60%', height: 40, width: '100%' }]} />
          
          {/* Parques/Zonas verdes */}
          <View style={[styles.mapPark, { top: '10%', left: '10%', width: 80, height: 120, borderRadius: 15 }]} />
          <View style={[styles.mapPark, { bottom: '15%', right: '10%', width: 120, height: 80, borderRadius: 15 }]} />

          {/* Línea de ruta trazada */}
          <View style={styles.routePath}>
             <View style={styles.routeLineH} />
             <View style={styles.routeLineV} />
          </View>

          {/* Marcador Usuario */}
          <View style={[styles.marker, { top: '30%', left: '20%' }]}>
            <View style={styles.userMarkerCircle}>
              <View style={styles.userDot} />
            </View>
            <View style={styles.markerLabel}>
              <Text style={styles.labelText}>Tu ubicación</Text>
            </View>
          </View>

          {/* Marcador Restaurante */}
          <View style={[styles.marker, { top: '58%', left: '44%' }]}>
            <View style={styles.restaurantMarker}>
              <Ionicons name="restaurant" size={20} color={Colors.textWhite} />
            </View>
            <View style={styles.markerPointer} />
            <View style={[styles.markerLabel, { backgroundColor: Colors.primary }]}>
              <Text style={styles.labelText}>Sabor & Fuego</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Botón de retroceso flotante */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      {/* Card inferior de información de ruta */}
      <View style={styles.infoCard}>
        <View style={styles.handle} />
        
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.timeTitle}>12 min</Text>
            <Text style={styles.distanceTitle}>1.2 km • Vía Calle 15</Text>
          </View>
          <View style={styles.modeIcon}>
            <Ionicons name="walk" size={24} color={Colors.primary} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.instructionRow}>
          <View style={styles.directionCircle}>
            <Ionicons name="arrow-undo" size={20} color={Colors.textWhite} />
          </View>
          <View style={styles.instructionContent}>
            <Text style={styles.instructionText}>Gira a la izquierda</Text>
            <Text style={styles.instructionSubtext}>Hacia Av. Principal en 200m</Text>
          </View>
        </View>

        <GradientButton 
          title="Finalizar navegación"
          onPress={() => router.back()}
          style={styles.finishButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  mapContainer: {
    flex: 1,
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F0F0F0',
  },
  mapStreet: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  mapPark: {
    position: 'absolute',
    backgroundColor: '#D1E8D1',
  },
  routePath: {
    position: 'absolute',
    top: '32%',
    left: '23%',
    width: 100,
    height: 100,
  },
  routeLineH: {
    width: 80,
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    opacity: 0.8,
  },
  routeLineV: {
    width: 6,
    height: 90,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    marginLeft: 74,
    marginTop: -3,
    opacity: 0.8,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  userMarkerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  userDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2',
  },
  restaurantMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  markerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.primary,
    marginTop: -2,
  },
  markerLabel: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 5,
  },
  labelText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  timeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  distanceTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: Spacing.lg,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  directionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContent: {
    marginLeft: Spacing.md,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  instructionSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  finishButton: {
    width: '100%',
  },
});
