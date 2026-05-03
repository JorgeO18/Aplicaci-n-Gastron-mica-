import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Trophy } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GastronomicColors } from '../constants/theme';

interface Achievement {
  id: string;
  title: string;
  icon: React.ReactNode;
  earned: boolean;
  progress: number;
}

interface UserStatsProps {
  achievements: Achievement[];
  routesCompleted: number;
  placesVisited: number;
  totalRoutes: number;
}

export const UserStats: React.FC<UserStatsProps> = ({ 
  achievements, 
  routesCompleted, 
  placesVisited,
  totalRoutes 
}) => {
  const progressAnim = useSharedValue(0);
  const trophyRotate = useSharedValue(0);

  useEffect(() => {
    // Animate progress bar
    progressAnim.value = withTiming((routesCompleted / totalRoutes) * 100, { duration: 1000 });

    // Animate Trophy
    trophyRotate.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 500 }),
        withTiming(10, { duration: 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      false
    );
  }, [routesCompleted, totalRoutes]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value}%`,
  }));

  const animatedTrophyStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${trophyRotate.value}deg` }],
  }));

  return (
    <LinearGradient
      colors={[GastronomicColors.primary, GastronomicColors.darkRed]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tu Aventura Gastronómica</Text>
          <Text style={styles.subtitle}>Sigue explorando Sucre</Text>
        </View>
        <Animated.View style={animatedTrophyStyle}>
          <Trophy color="#FFF" size={32} />
        </Animated.View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{routesCompleted}</Text>
          <Text style={styles.statLabel}>Rutas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{placesVisited}</Text>
          <Text style={styles.statLabel}>Lugares</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{achievements.filter(a => a.earned).length}</Text>
          <Text style={styles.statLabel}>Logros</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>Progreso de exploración</Text>
          <Text style={styles.progressTextBold}>
            {Math.round((routesCompleted / totalRoutes) * 100)}%
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBarFill, animatedProgressStyle]} />
        </View>
      </View>

      {/* Achievements Preview */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsRow}>
        {achievements.slice(0, 4).map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementCircle,
              achievement.earned ? styles.achievementEarned : styles.achievementLocked,
            ]}
          >
            {achievement.icon}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#FFF',
  },
  progressTextBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  achievementsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  achievementCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementEarned: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  achievementLocked: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
