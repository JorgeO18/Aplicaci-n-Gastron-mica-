// Pantalla de Vista AR (Mockup) - Plato 3D sobre mesa
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ARViewScreen() {
  const router = useRouter();
  const [captured, setCaptured] = useState(false);

  return (
    <View style={styles.container}>
      {/* Fondo simulando cámara (oscuro con cuadrícula) */}
      <View style={styles.cameraView}>
        <View style={styles.darkOverlay} />
        
        {/* Grid de fondo (cuadrícula completa como en la foto) */}
        <View style={styles.fullGrid}>
          {[...Array(15)].map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLineH, { top: `${i * 7}%` }]} />
          ))}
          {[...Array(10)].map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineV, { left: `${i * 11}%` }]} />
          ))}
        </View>

        {/* Indicador de superficie con esquinas rojas */}
        <View style={styles.surfaceArea}>
          {/* Esquinas (Brackets) */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {/* Plato 3D */}
          <View style={styles.plateWrapper}>
            <View style={styles.glow} />
            <View style={styles.plateShadow} />
            <View style={styles.plateInner}>
              <Image
                source={require('@/assets/images/food_soup.png')}
                style={styles.plateImage}
              />
            </View>
            {/* Barra oscura debajo del plato (sombra proyectada) */}
            <View style={styles.dishGroundShadow} />
          </View>
        </View>
      </View>

      {/* Header overlay */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity onPress={() => router.back()} style={styles.circleButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <View style={styles.arBadge}>
          <View style={styles.arDot} />
          <Text style={styles.arText}>AR Activo</Text>
        </View>
        <TouchableOpacity style={styles.circleButton}>
          <Ionicons name="settings-outline" size={22} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>

      {/* Info del plato (Badge central inferior) */}
      <View style={styles.dishBadgeContainer}>
        <View style={styles.dishBadge}>
          <Text style={styles.dishName}>Banga Soup</Text>
          <Text style={styles.dishPrice}>$30.99</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.ratingText}>4.9</Text>
          </View>
        </View>
      </View>

      {/* Controles inferiores (Exactamente como en la foto) */}
      <View style={styles.bottomControls}>
        <View style={styles.sideControls}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="images-outline" size={24} color={Colors.textWhite} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="refresh-outline" size={24} color={Colors.textWhite} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.mainCaptureButton}
          onPress={() => setCaptured(!captured)}
        >
          <View style={styles.captureCircle}>
            <View style={[styles.captureInner, captured && { backgroundColor: Colors.primary }]} />
          </View>
          <Text style={styles.captureHint}>
            {captured ? '¡Capturado!' : 'Toca el botón para capturar'}
          </Text>
        </TouchableOpacity>

        <View style={styles.sideControls}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="expand-outline" size={24} color={Colors.textWhite} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color={Colors.textWhite} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#121212',
  },
  fullGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FFF',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#FFF',
  },
  surfaceArea: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FF4D4D', // Rojo intenso como en la foto
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  plateWrapper: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,77,77,0.1)',
  },
  plateShadow: {
    position: 'absolute',
    bottom: -15,
    width: 140,
    height: 20,
    borderRadius: 70,
    backgroundColor: 'rgba(0,0,0,0.6)',
    transform: [{ scaleX: 1.5 }],
  },
  plateInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  plateImage: {
    width: '100%',
    height: '100%',
  },
  dishGroundShadow: {
    position: 'absolute',
    bottom: -40,
    width: 160,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    opacity: 0.5,
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  arDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  arText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dishBadgeContainer: {
    position: 'absolute',
    bottom: 180,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  dishBadge: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 15,
  },
  dishName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dishPrice: {
    color: '#FFD700', // Dorado para el precio
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 14,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sideControls: {
    gap: 20,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCaptureButton: {
    alignItems: 'center',
    gap: 10,
  },
  captureCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  captureInner: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    backgroundColor: '#FFF',
  },
  captureHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    position: 'absolute',
    bottom: -25,
    width: 200,
    textAlign: 'center',
  },
});
