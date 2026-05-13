// Pantalla de Splash Animada - Secuencia TasteGo
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // Valores animados
  const logoCircleScale = useSharedValue(1);
  const whiteExpandScale = useSharedValue(0);
  const wordmarkOpacity = useSharedValue(0);
  const wordmarkScale = useSharedValue(0.8);
  const finalFade = useSharedValue(1);

  const navigateToLogin = () => {
    router.replace('/login');
  };

  useEffect(() => {
    // 1. El círculo blanco central crece un poco
    logoCircleScale.value = withTiming(1.2, { duration: 600, easing: Easing.out(Easing.back(1.5)) });

    // 2. Expansión masiva del blanco para llenar la pantalla
    whiteExpandScale.value = withDelay(
      800,
      withTiming(20, { duration: 1000, easing: Easing.in(Easing.cubic) })
    );

    // 3. Aparece el wordmark "TasteGo" en naranja sobre el fondo blanco
    wordmarkOpacity.value = withDelay(
      1800,
      withTiming(1, { duration: 600 })
    );
    wordmarkScale.value = withDelay(
      1800,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.2)) })
    );

    // 4. Fade out final y navegación
    finalFade.value = withDelay(
      3000,
      withTiming(0, { duration: 400 }, () => {
        runOnJS(navigateToLogin)();
      })
    );
  }, []);

  // Estilos animados
  const whiteExpandStyle = useAnimatedStyle(() => ({
    transform: [{ scale: whiteExpandScale.value }],
  }));

  const logoCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoCircleScale.value }],
    // Ocultar el círculo pequeño cuando la expansión blanca lo cubra
    opacity: whiteExpandScale.value > 1.5 ? 0 : 1,
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ scale: wordmarkScale.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: finalFade.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Círculo blanco que se expande */}
      <Animated.View style={[styles.expandingCircle, whiteExpandStyle]} />

      {/* Logo inicial (tg en círculo) */}
      <Animated.View style={[styles.logoCircle, logoCircleStyle]}>
        <Text style={styles.logoText}>tg</Text>
      </Animated.View>

      {/* Wordmark final (TasteGo) */}
      <Animated.View style={[styles.wordmarkContainer, wordmarkStyle]}>
        <Text style={styles.wordmarkText}>TasteGo</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // Fondo naranja inicial
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandingCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.textWhite,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.textWhite,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: Colors.primary,
  },
  wordmarkContainer: {
    position: 'absolute',
    zIndex: 20,
  },
  wordmarkText: {
    fontSize: 52,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: Colors.primary,
    letterSpacing: -1,
  },
});
