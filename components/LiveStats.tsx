import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Users, TrendingUp } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { GastronomicColors } from '../constants/theme';

interface LiveStatsProps {
  activeUsers: number;
  completedToday: number;
}

export const LiveStats: React.FC<LiveStatsProps> = ({ activeUsers, completedToday }) => {
  const scaleAnim = useSharedValue(1);
  const dotScaleAnim = useSharedValue(1);

  useEffect(() => {
    scaleAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(1.02, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1, // infinite
      false
    );

    dotScaleAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 750 }),
        withTiming(1.3, { duration: 750 }),
        withTiming(1, { duration: 750 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScaleAnim.value }],
  }));

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.iconWrapper}>
          <Users color={GastronomicColors.primary} size={20} />
          <Animated.View style={[styles.greenDot, animatedDotStyle]} />
        </View>
        <View>
          <Text style={styles.subtitle}>Explorando ahora</Text>
          <Text style={styles.title}>{activeUsers} personas</Text>
        </View>
      </Animated.View>

      <View style={styles.cardTrending}>
        <TrendingUp color={GastronomicColors.primary} size={20} />
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>Rutas hoy</Text>
          <Text style={styles.titleTrending}>+{completedToday}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 4, // To avoid shadow clipping
  },
  card: {
    backgroundColor: GastronomicColors.bgWhite,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTrending: {
    backgroundColor: '#FFF5F6',
    borderColor: 'rgba(230, 57, 70, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrapper: {
    position: 'relative',
  },
  greenDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    backgroundColor: '#22c55e', // green-500
    borderRadius: 4,
  },
  textContainer: {
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
  },
  titleTrending: {
    fontSize: 14,
    fontWeight: 'bold',
    color: GastronomicColors.primary,
  },
});
