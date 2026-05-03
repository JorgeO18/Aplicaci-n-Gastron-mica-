import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { RedButton } from './RedButton';
import { Clock, MapPin, Users, Sparkles } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GastronomicColors } from '../constants/theme';

interface RouteCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  stops: number;
  progress: number;
  locations?: string;
  specialty?: string;
  activeUsers?: number;
  onPress?: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  duration, 
  stops, 
  progress,
  locations,
  specialty,
  activeUsers,
  onPress
}) => {
  const progressAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    progressAnim.value = withTiming(progress, { duration: 1000 });
    
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
  }, [progress]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value}%`,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)', 'transparent']}
          style={styles.gradientOverlay}
        />
        
        {locations && (
          <View style={styles.locationBadge}>
            <MapPin color={GastronomicColors.primary} size={12} />
            <Text style={styles.badgeTextDark}>{locations}</Text>
          </View>
        )}

        {specialty && (
          <View style={styles.specialtyBadge}>
            <Sparkles color="#FFF" size={12} />
            <Text style={styles.badgeTextLight}>{specialty}</Text>
          </View>
        )}

        {activeUsers && activeUsers > 20 && (
          <Animated.View style={[styles.usersBadge, pulseStyle]}>
            <Users color={GastronomicColors.primary} size={12} />
            <Text style={styles.badgeTextDark}>{activeUsers} explorando</Text>
          </Animated.View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Clock color={GastronomicColors.primary} size={16} />
            <Text style={styles.metaText}>{duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin color={GastronomicColors.primary} size={16} />
            <Text style={styles.metaText}>{stops} paradas</Text>
          </View>
        </View>
        
        {progress > 0 ? (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Tu progreso</Text>
              <Text style={styles.progressValue}>{progress}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <Animated.View style={[styles.progressBarFill, animatedProgressStyle]} />
            </View>
          </View>
        ) : (
          <Animated.View style={[styles.newAdventureBadge, pulseStyle]}>
            <Text style={styles.newAdventureText}>✨ Nueva aventura esperándote</Text>
          </Animated.View>
        )}
        
        <RedButton fullWidth onPress={onPress}>
          {progress > 0 ? 'Continuar Ruta' : 'Comenzar Aventura'}
        </RedButton>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: GastronomicColors.bgWhite,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
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
    top: 0,
    height: '100%',
  },
  locationBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specialtyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: GastronomicColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  usersBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeTextDark: {
    fontSize: 12,
    fontWeight: '500',
    color: GastronomicColors.textDark,
  },
  badgeTextLight: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: GastronomicColors.textLight,
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: GastronomicColors.textLight,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: GastronomicColors.primary,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: GastronomicColors.bgGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: GastronomicColors.primary,
    borderRadius: 4,
  },
  newAdventureBadge: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#FFF5F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  newAdventureText: {
    fontSize: 12,
    fontWeight: '500',
    color: GastronomicColors.primary,
  },
});
