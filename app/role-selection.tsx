import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import Logo from '@/components/Logo';

const { width } = Dimensions.get('window');

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleUserSelect = () => {
    router.push('/login');
  };

  const handleRestaurantSelect = () => {
    router.push('/restaurant-login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
         colors={[Colors.primary, Colors.gradientStart]} 
         style={styles.headerBackground} 
      />
      <View style={styles.curve} />

      <View style={styles.content}>
        <View style={styles.headerBox}>
          <Logo size={90} showText={false} color={Colors.textWhite} />
        </View>

        <Text style={styles.title}>Bienvenido a TasteGo</Text>
        <Text style={styles.subtitle}>
          La app que conecta amantes de la{'\n'}buena comida y restaurantes.
        </Text>
        <Text style={styles.instruction}>¿Cómo deseas continuar?</Text>

        <View style={styles.cardsContainer}>
          
          <TouchableOpacity onPress={handleUserSelect} activeOpacity={0.8} style={styles.cardShadow}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryCard}
            >
              <View style={styles.iconCircleWhite}>
                <Ionicons name="person" size={32} color={Colors.primary} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.primaryCardTitle}>Soy Usuario</Text>
                <Text style={styles.primaryCardDesc}>
                  Encuentra los mejores restaurantes y explora sus menús.
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color={Colors.textWhite} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRestaurantSelect} activeOpacity={0.8} style={styles.secondaryCard}>
            <View style={styles.iconCircleColor}>
              <Ionicons name="storefront" size={32} color={Colors.textWhite} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.secondaryCardTitle}>Soy Restaurante</Text>
              <Text style={styles.secondaryCardDesc}>
                Inicia sesión en tu panel para agregar platos y gestionar todo.
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color={Colors.primary} />
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  curve: {
    position: 'absolute',
    top: 230,
    height: 40,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
  },
  headerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: Spacing.xl,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  instruction: {
    fontSize: Typography.sizes.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
    width: '100%',
  },
  cardsContainer: {
    width: '100%',
    gap: Spacing.lg,
  },
  cardShadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
  },
  iconCircleWhite: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.textWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  primaryCardTitle: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  primaryCardDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
  secondaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  iconCircleColor: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  secondaryCardTitle: {
    color: Colors.primaryDark,
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  secondaryCardDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    lineHeight: 18,
  },
});
