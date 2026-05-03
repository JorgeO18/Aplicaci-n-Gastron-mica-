import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import Animated, { FadeInDown, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Navigation, MapPin, Star, Clock, DollarSign, Utensils, Phone, Award, Heart } from 'lucide-react-native';
import { RedButton } from '@/components/RedButton';
import { GastronomicColors } from '@/constants/theme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const restaurants = [
  { id: 1, name: 'Donde Juancho', x: width * 0.3, y: 80, order: 1 },
  { id: 2, name: 'La Cocina de Marta', x: width * 0.55, y: 160, order: 2 },
  { id: 3, name: 'Sabor Costeño', x: width * 0.75, y: 240, order: 3 },
];

const routeStops = [
  {
    id: 1,
    name: 'Donde Juancho',
    address: 'Calle 25 con Carrera 20, Centro Sincelejo',
    phone: '+57 315 456 7890',
    rating: 4.9,
    reviews: 342,
    cuisine: 'Comida Típica Costeña',
    openingTime: '11:00 - 22:00',
    distance: '450m',
    specialty: 'Sancocho de guandú',
    story: 'Restaurante familiar con más de 30 años sirviendo las recetas tradicionales de la abuela Juancha.',
    priceRange: '$$',
    imageUrl: 'https://images.unsplash.com/photo-1644753787071-8933b5daed2d?w=400',
    mustTry: ['Sancocho de guandú', 'Mote de queso', 'Arepa de huevo'],
    waitTime: '5-10 min',
  },
  {
    id: 2,
    name: 'La Cocina de Marta',
    address: 'Carrera 14 #28-45, Sincelejo',
    phone: '+57 320 789 4561',
    rating: 4.8,
    reviews: 286,
    cuisine: 'Pescados y Mariscos',
    openingTime: '12:00 - 21:00',
    distance: '1.2km',
    specialty: 'Cazuela de mariscos',
    story: 'Marta aprendió a cocinar mariscos en Tolú y trajo esos sabores del mar al centro.',
    priceRange: '$$$',
    imageUrl: 'https://images.unsplash.com/photo-1765265432611-17d3f2da2d5d?w=400',
    mustTry: ['Cazuela de mariscos', 'Pescado frito', 'Arroz con coco'],
    waitTime: '15-20 min',
  },
  {
    id: 3,
    name: 'Sabor Costeño',
    address: 'Calle 30 con Carrera 25, Sincelejo',
    phone: '+57 318 234 5678',
    rating: 4.7,
    reviews: 198,
    cuisine: 'Parrilla y Típica',
    openingTime: '10:00 - 23:00',
    distance: '2.1km',
    specialty: 'Carne a la parrilla',
    story: 'El secreto está en el carbón de leña y las marinadas con hierbas de la sabana.',
    priceRange: '$$',
    imageUrl: 'https://images.unsplash.com/photo-1723693407562-bb4fcae76797?w=400',
    mustTry: ['Punta de anca', 'Chorizo costeño', 'Yuca frita'],
    waitTime: '10-15 min',
  },
];

export default function MapaScreen() {
  const router = useRouter();
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [visitedStops, setVisitedStops] = useState<number[]>([]);
  const [liked, setLiked] = useState(false);
  const [showStory, setShowStory] = useState(false);

  const currentStop = routeStops[currentStopIndex];

  const handleNextStop = () => {
    if (currentStopIndex < routeStops.length - 1) {
      setVisitedStops([...visitedStops, currentStopIndex]);
      setCurrentStopIndex(currentStopIndex + 1);
      setShowStory(false);
    }
  };

  const handleCheckIn = () => {
    setVisitedStops([...visitedStops, currentStopIndex]);
  };

  // Reanimated style for active pin pulsing
  const pulseAnim = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withRepeat(
          withSequence(withTiming(1.2, { duration: 1000 }), withTiming(1, { duration: 1000 })),
          -1,
          true
        ),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Map Area */}
      <View style={styles.mapArea}>
        <View style={styles.gridOverlay}>
          <Svg height="100%" width="100%">
            <Line x1="10%" y1="25%" x2="90%" y2="25%" stroke="#D1D5DB" strokeWidth="2" />
            <Line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#D1D5DB" strokeWidth="2" />
            <Line x1="10%" y1="75%" x2="90%" y2="75%" stroke="#D1D5DB" strokeWidth="2" />
            <Line x1="25%" y1="10%" x2="25%" y2="90%" stroke="#D1D5DB" strokeWidth="2" />
            <Line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#D1D5DB" strokeWidth="2" />
            <Line x1="75%" y1="10%" x2="75%" y2="90%" stroke="#D1D5DB" strokeWidth="2" />

            <Path
              d={`M ${restaurants[0].x} ${restaurants[0].y} 
                  Q ${(restaurants[0].x + restaurants[1].x) / 2} ${(restaurants[0].y + restaurants[1].y) / 2 - 20} 
                  ${restaurants[1].x} ${restaurants[1].y} 
                  Q ${(restaurants[1].x + restaurants[2].x) / 2} ${(restaurants[1].y + restaurants[2].y) / 2 - 20} 
                  ${restaurants[2].x} ${restaurants[2].y}`}
              stroke={GastronomicColors.primary}
              strokeWidth="4"
              fill="none"
              strokeDasharray="10 5"
            />
          </Svg>
        </View>

        {/* Location Label */}
        <View style={styles.locationBadge}>
          <Text style={styles.locationTitle}>📍 Sincelejo, Sucre</Text>
          <Text style={styles.locationSubtitle}>Centro histórico</Text>
        </View>

        {/* Navigation Button */}
        <TouchableOpacity style={styles.navButton}>
          <Navigation color={GastronomicColors.primary} size={20} />
        </TouchableOpacity>

        {/* Pins */}
        {restaurants.map((restaurant, index) => {
          const isCurrent = index === currentStopIndex;
          const isVisited = visitedStops.includes(index);
          
          return (
            <View 
              key={restaurant.id} 
              style={[styles.pinWrapper, { left: restaurant.x - 24, top: restaurant.y - 24 }]}
            >
              <Animated.View 
                style={[
                  styles.pin, 
                  isCurrent ? styles.pinActive : isVisited ? styles.pinVisited : styles.pinPending,
                  isCurrent && pulseAnim
                ]}
              >
                <Text style={[styles.pinText, isCurrent && styles.pinTextActive]}>
                  {isVisited ? '✓' : restaurant.order}
                </Text>
              </Animated.View>
              {isCurrent && (
                <View style={styles.pinLabel}>
                  <Text style={styles.pinLabelText}>{restaurant.name}</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Progress Indicator */}
        <View style={styles.progressBadge}>
          <Award color={GastronomicColors.primary} size={16} />
          <Text style={styles.progressText}>
            Parada {currentStopIndex + 1} de {restaurants.length}
          </Text>
        </View>
      </View>

      {/* Bottom Sheet */}
      <Animated.ScrollView 
        entering={FadeInDown.duration(500)}
        style={styles.bottomSheet} 
        contentContainerStyle={styles.bottomSheetContent}
      >
        <View style={styles.handleBar} />
        
        <View style={styles.headerRow}>
          <View style={styles.nextStopBadge}>
            <Text style={styles.nextStopText}>🎯 PRÓXIMA PARADA</Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.distanceLabel}>
              <Navigation color={GastronomicColors.textLight} size={14} />
              <Text style={styles.distanceText}>{currentStop.distance}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.likeButton, liked && styles.likeButtonActive]} 
              onPress={() => setLiked(!liked)}
            >
              <Heart 
                color={liked ? GastronomicColors.primary : GastronomicColors.textLight} 
                fill={liked ? GastronomicColors.primary : 'transparent'} 
                size={20} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.restaurantName}>{currentStop.name}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.ratingBadge}>
            <Star color={GastronomicColors.primary} fill={GastronomicColors.primary} size={14} />
            <Text style={styles.ratingText}>{currentStop.rating}</Text>
            <Text style={styles.reviewsText}>({currentStop.reviews})</Text>
          </View>
          <Text style={styles.waitTime}>• {currentStop.waitTime} espera</Text>
        </View>

        <View style={styles.addressRow}>
          <MapPin color={GastronomicColors.primary} size={16} />
          <Text style={styles.addressText}>{currentStop.address}</Text>
        </View>

        {/* Story Section */}
        {showStory && (
          <View style={styles.storyBox}>
            <Text style={styles.storyTitle}>📖 Historia del lugar</Text>
            <Text style={styles.storyText}>{currentStop.story}</Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.toggleStoryButton} onPress={() => setShowStory(!showStory)}>
          <Text style={styles.toggleStoryText}>
            {showStory ? '▲ Ocultar historia' : '▼ Conocer la historia'}
          </Text>
        </TouchableOpacity>

        <Image source={{ uri: currentStop.imageUrl }} style={styles.restaurantImage} />

        {/* Must Try */}
        <View style={styles.mustTryBox}>
          <Text style={styles.mustTryTitle}>
            <Utensils color={GastronomicColors.primary} size={20} /> Debes probar:
          </Text>
          {currentStop.mustTry.map((dish, i) => (
            <View key={i} style={styles.mustTryItem}>
              <Text style={styles.mustTryDot}>•</Text>
              <Text style={styles.mustTryText}>{dish}</Text>
            </View>
          ))}
        </View>

        {/* Grid Info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Clock color={GastronomicColors.primary} size={16} />
              <Text style={styles.infoCardLabel}>Horario</Text>
            </View>
            <Text style={styles.infoCardValue}>{currentStop.openingTime}</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <DollarSign color={GastronomicColors.primary} size={16} />
              <Text style={styles.infoCardLabel}>Precio</Text>
            </View>
            <Text style={styles.infoCardValue}>{currentStop.priceRange}</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Utensils color={GastronomicColors.primary} size={16} />
              <Text style={styles.infoCardLabel}>Cocina</Text>
            </View>
            <Text style={styles.infoCardValue}>{currentStop.cuisine}</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Phone color={GastronomicColors.primary} size={16} />
              <Text style={styles.infoCardLabel}>Llamar</Text>
            </View>
            <Text style={styles.infoCardValue}>Contactar</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {!visitedStops.includes(currentStopIndex) && (
            <RedButton onPress={handleCheckIn} style={{ marginBottom: 12, paddingVertical: 16 }}>
              ✓ Hacer Check-In (+10 puntos)
            </RedButton>
          )}

          <View style={styles.twoButtonsRow}>
            <RedButton variant="outline" style={{ flex: 1, marginRight: 8 }}>
              Cómo llegar
            </RedButton>
            <RedButton style={{ flex: 1, marginLeft: 8 }} onPress={() => router.push('/menu')}>
              Ver Menú 3D
            </RedButton>
          </View>

          {currentStopIndex < routeStops.length - 1 && (
            <TouchableOpacity style={styles.nextStopButton} onPress={handleNextStop}>
              <Text style={styles.nextStopButtonText}>Siguiente parada →</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  mapArea: {
    height: '45%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  locationBadge: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  locationTitle: {
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
  },
  locationSubtitle: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  navButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  pin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  pinActive: {
    backgroundColor: GastronomicColors.primary,
  },
  pinVisited: {
    backgroundColor: '#22c55e',
  },
  pinPending: {
    backgroundColor: '#FFF',
    borderColor: GastronomicColors.primary,
  },
  pinText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: GastronomicColors.primary,
  },
  pinTextActive: {
    color: '#FFF',
  },
  pinLabel: {
    position: 'absolute',
    top: 55,
    backgroundColor: GastronomicColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: 140,
    alignItems: 'center',
  },
  pinLabelText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  progressBadge: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  progressText: {
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    fontSize: 14,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  bottomSheetContent: {
    padding: 20,
    paddingBottom: 40,
  },
  handleBar: {
    width: 48,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextStopBadge: {
    backgroundColor: GastronomicColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  nextStopText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  distanceLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    color: GastronomicColors.textLight,
    fontSize: 14,
  },
  likeButton: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 20,
  },
  likeButtonActive: {
    backgroundColor: '#FFF5F6',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: GastronomicColors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewsText: {
    color: GastronomicColors.textLight,
    fontSize: 12,
  },
  waitTime: {
    color: GastronomicColors.textLight,
    fontSize: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  addressText: {
    color: GastronomicColors.textLight,
    fontSize: 14,
  },
  storyBox: {
    backgroundColor: '#FFF5F6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(230,57,70,0.1)',
    marginBottom: 12,
  },
  storyTitle: {
    fontWeight: 'bold',
    color: GastronomicColors.primary,
    marginBottom: 8,
  },
  storyText: {
    fontSize: 14,
    color: GastronomicColors.textLight,
    lineHeight: 20,
  },
  toggleStoryButton: {
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleStoryText: {
    color: GastronomicColors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  restaurantImage: {
    width: '100%',
    height: 192,
    borderRadius: 16,
    marginBottom: 20,
  },
  mustTryBox: {
    backgroundColor: '#FFF5F6',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  mustTryTitle: {
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    marginBottom: 12,
    fontSize: 16,
  },
  mustTryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  mustTryDot: {
    color: GastronomicColors.primary,
    fontSize: 18,
  },
  mustTryText: {
    color: GastronomicColors.textDark,
    fontSize: 14,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoCardLabel: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  infoCardValue: {
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    fontSize: 14,
  },
  actionContainer: {
    marginTop: 8,
  },
  twoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nextStopButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  nextStopButtonText: {
    color: GastronomicColors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
