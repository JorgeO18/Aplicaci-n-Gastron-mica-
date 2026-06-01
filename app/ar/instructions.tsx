// Pantalla de Instrucciones AR - Carrusel de 3 pasos
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import GradientButton from '@/components/GradientButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Step {
  id: string;
  step: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
}

const steps: Step[] = [
  {
    id: '1',
    step: 1,
    title: 'Apunta tu cámara\na una superficie plana',
    description: 'Busca una mesa o superficie plana y estable. Apunta tu cámara hacia ella para que podamos detectar el espacio.',
    icon: 'phone-portrait-outline',
    bgColor: Colors.background,
  },
  {
    id: '2',
    step: 2,
    title: 'Espera a que\ndetectemos la superficie',
    description: 'Mueve tu dispositivo lentamente para que el sistema pueda mapear la superficie correctamente.',
    icon: 'scan-outline',
    bgColor: Colors.background,
  },
  {
    id: '3',
    step: 3,
    title: '¡Listo! Disfruta\ntu plato en 3D',
    description: 'El plato aparecerá sobre la superficie. Puedes rotarlo, acercarlo y capturar fotos.',
    icon: 'cube-outline',
    bgColor: Colors.primary,
  },
];

export default function ARInstructionsScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const isLastSlide = currentIndex === steps.length - 1;
  const currentStep = steps[currentIndex];
  const isDark = currentStep.bgColor === Colors.primary;

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      // Usar ruta absoluta para evitar ambigüedades
      router.replace({pathname:'../rarv',params:{tipo:'true'}});
    }
  };

  const renderStep = ({ item }: { item: Step }) => {
    const isDarkBg = item.bgColor === Colors.primary;
    return (
      <View style={[styles.slide, { backgroundColor: item.bgColor }]}>
        {/* Ilustración circular */}
        <View style={styles.illustrationContainer}>
          <View style={[
            styles.outerCircle,
            isDarkBg && { backgroundColor: 'rgba(255,255,255,0.15)' }
          ]}>
            <View style={[
              styles.middleCircle,
              isDarkBg && { backgroundColor: 'rgba(255,255,255,0.2)' }
            ]}>
              <View style={[
                styles.innerCircle,
                isDarkBg && { backgroundColor: Colors.textWhite }
              ]}>
                <Ionicons
                  name={item.icon}
                  size={50}
                  color={isDarkBg ? Colors.primary : Colors.primary}
                />
              </View>
            </View>
          </View>

          {/* Número de paso */}
          <View style={[
            styles.stepBadge,
            isDarkBg && { backgroundColor: Colors.textWhite }
          ]}>
            <Text style={[
              styles.stepNumber,
              isDarkBg && { color: Colors.primary }
            ]}>{item.step}</Text>
          </View>
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          <Text style={[
            styles.title,
            isDarkBg && { color: Colors.textWhite }
          ]}>{item.title}</Text>
          <Text style={[
            styles.description,
            isDarkBg && { color: 'rgba(255,255,255,0.8)' }
          ]}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: currentStep.bgColor }]}>
      {/* Botón cerrar */}
      <TouchableOpacity
        style={[styles.closeButton, isDark && { backgroundColor: 'rgba(255,255,255,0.2)' }]}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={24} color={isDark ? Colors.textWhite : Colors.textPrimary} />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={steps}
        renderItem={renderStep}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.dotActive,
                isDark && styles.dotDark,
                isDark && currentIndex === index && styles.dotActiveDark,
              ]}
            />
          ))}
        </View>

        {/* Botón */}
        {isDark ? (
          <GradientButton
            title="Siguiente"
            onPress={handleNext}
            variant="white"
            style={styles.button}
          />
        ) : (
          <GradientButton
            title="Siguiente"
            onPress={handleNext}
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: Spacing.xxl,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadge: {
    position: 'absolute',
    top: '25%',
    right: '20%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textWhite,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    lineHeight: 32,
  },
  description: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotDark: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActiveDark: {
    backgroundColor: Colors.textWhite,
  },
  button: {
    width: '100%',
  },
});
