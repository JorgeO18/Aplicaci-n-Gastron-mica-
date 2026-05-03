import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { Star, MapPin, Wifi, Coffee, Car, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GastronomicColors } from '../constants/theme';

interface AirbnbCardProps {
  id: string;
  title: string;
  location: string;
  distance: string;
  price: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  amenities: string[];
  hostType: string;
}

export const AirbnbCard: React.FC<AirbnbCardProps> = ({
  title,
  location,
  distance,
  price,
  rating,
  reviews,
  imageUrl,
  amenities,
  hostType,
}) => {
  const [liked, setLiked] = useState(false);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi color={GastronomicColors.textLight} size={16} />;
      case 'parking': return <Car color={GastronomicColors.textLight} size={16} />;
      case 'breakfast': return <Coffee color={GastronomicColors.textLight} size={16} />;
      default: return <Text style={{ color: GastronomicColors.textLight }}>•</Text>;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.gradientOverlay}
        />
        
        {/* Heart Button */}
        <TouchableOpacity 
          style={styles.heartButton}
          onPress={() => setLiked(!liked)}
        >
          <Heart 
            color={liked ? GastronomicColors.primary : GastronomicColors.textLight} 
            fill={liked ? GastronomicColors.primary : 'transparent'}
            size={20} 
          />
        </TouchableOpacity>

        {/* Host Type Badge */}
        <View style={styles.hostBadge}>
          <Text style={styles.hostBadgeText}>{hostType}</Text>
        </View>

        {/* Distance */}
        <View style={styles.distanceBadge}>
          <MapPin color={GastronomicColors.primary} size={12} />
          <Text style={styles.distanceText}>{distance} de la ruta</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.location}>{location}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Star color={GastronomicColors.primary} fill={GastronomicColors.primary} size={16} />
            <Text style={styles.ratingText}>{rating}</Text>
            <Text style={styles.reviewsText}>({reviews})</Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.amenitiesContainer}>
          {amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityBadge}>
              {getAmenityIcon(amenity)}
              <Text style={styles.amenityText}>
                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.priceContainer}>
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.perNight}> / noche</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Ver detalles</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 320, // w-80
    backgroundColor: GastronomicColors.bgWhite,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginRight: 16,
  },
  imageContainer: {
    height: 192, // h-48
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hostBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hostBadgeText: {
    color: GastronomicColors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    color: GastronomicColors.textDark,
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: GastronomicColors.textLight,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
  },
  reviewsText: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  amenityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: GastronomicColors.bgGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  amenityText: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GastronomicColors.primary,
  },
  perNight: {
    fontSize: 14,
    color: GastronomicColors.textLight,
  },
  detailsButton: {
    backgroundColor: GastronomicColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
