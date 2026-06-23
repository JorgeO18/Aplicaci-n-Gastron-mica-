import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

const PLANES = [
  {
    id: 'basico',
    nombre: 'Básico',
    precio: '$9.99',
    features: ['Perfil del restaurante', 'Sube hasta 10 platos', 'Estadísticas básicas'],
    popular: false,
    gradientColores: null,
  },
  {
    id: 'pro',
    nombre: 'Pro',
    precio: '$19.99',
    features: ['Perfil destacado', 'Hasta 30 platos', 'Estadísticas avanzadas', 'Soporte prioritario'],
    popular: true,
    gradientColores: [Colors.gradientStart, Colors.gradientEnd] as [string, string],
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: '$29.99',
    features: ['Todo lo del Plan Pro', 'Campañas promocionales', 'Publicación destacada', 'Gerente de cuenta'],
    popular: false,
    gradientColores: null,
  },
];

export default function PlanesScreen() {
  const router = useRouter();

  const handleSuscribir = (planId: string, planNombre: string, planPrecio: string) => {
    router.push({ pathname: '/pago' as any, params: { planId, planNombre, planPrecio } });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planes y Suscripciones</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heroText}>Elige el plan perfecto para tu restaurante</Text>

        {PLANES.map((plan) => {
          const isGradient = !!plan.gradientColores;
          const cardContent = (
            <View style={[styles.planCard, isGradient ? styles.planCardDark : styles.planCardLight]}>
              <View style={styles.planHeader}>
                <View>
                  <View style={styles.planNameRow}>
                    <Text style={[styles.planName, isGradient && styles.textWhite]}>{plan.nombre}</Text>
                    {plan.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>Más popular</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.planPriceRow}>
                    <Text style={[styles.planPrice, isGradient && styles.textWhite]}>{plan.precio}</Text>
                    <Text style={[styles.planPeriod, isGradient && { color: 'rgba(255,255,255,0.7)' }]}>/ mes</Text>
                  </View>
                </View>
              </View>

              <View style={styles.featuresList}>
                {plan.features.map((feat, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color={isGradient ? Colors.textWhite : Colors.primary} style={{ marginRight: 8 }} />
                    <Text style={[styles.featureText, isGradient && styles.textWhite]}>{feat}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => handleSuscribir(plan.id, plan.nombre, plan.precio)}
                style={[styles.suscribirBtn, isGradient ? styles.suscribirBtnLight : styles.suscribirBtnColor]}
                activeOpacity={0.8}
              >
                <Text style={[styles.suscribirBtnText, isGradient && { color: Colors.primary }]}>Suscribirse</Text>
              </TouchableOpacity>
            </View>
          );

          return isGradient ? (
            <LinearGradient
              key={plan.id}
              colors={plan.gradientColores!}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.planCard, { padding: 0, overflow: 'hidden' }]}
            >
              <View style={{ padding: Spacing.lg, flex: 1 }}>
                <View style={styles.planHeader}>
                  <View style={styles.planNameRow}>
                    <Text style={[styles.planName, styles.textWhite]}>{plan.nombre}</Text>
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>Más popular</Text>
                    </View>
                  </View>
                  <View style={styles.planPriceRow}>
                    <Text style={[styles.planPrice, styles.textWhite]}>{plan.precio}</Text>
                    <Text style={[styles.planPeriod, { color: 'rgba(255,255,255,0.7)' }]}> / mes</Text>
                  </View>
                </View>
                <View style={styles.featuresList}>
                  {plan.features.map((feat, idx) => (
                    <View key={idx} style={styles.featureRow}>
                      <Ionicons name="checkmark-circle" size={18} color={Colors.textWhite} style={{ marginRight: 8 }} />
                      <Text style={[styles.featureText, styles.textWhite]}>{feat}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => handleSuscribir(plan.id, plan.nombre, plan.precio)}
                  style={[styles.suscribirBtn, styles.suscribirBtnLight]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.suscribirBtnText, { color: Colors.primary }]}>Suscribirse</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          ) : (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.nombre}</Text>
                <View style={styles.planPriceRow}>
                  <Text style={styles.planPrice}>{plan.precio}</Text>
                  <Text style={styles.planPeriod}> / mes</Text>
                </View>
              </View>
              <View style={styles.featuresList}>
                {plan.features.map((feat, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => handleSuscribir(plan.id, plan.nombre, plan.precio)}
                style={[styles.suscribirBtn, styles.suscribirBtnColor]}
                activeOpacity={0.8}
              >
                <Text style={styles.suscribirBtnText}>Suscribirse</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 55,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  content: { padding: Spacing.lg },
  heroText: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  planCard: {
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  planCardLight: { backgroundColor: Colors.card },
  planCardDark: {},
  planHeader: { marginBottom: Spacing.md },
  planNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  planName: {
    fontSize: Typography.sizes.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  popularBadge: {
    backgroundColor: Colors.orange + '25',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  popularBadgeText: {
    color: Colors.orange,
    fontSize: Typography.sizes.xs ?? 11,
    fontWeight: 'bold',
  },
  planPriceRow: { flexDirection: 'row', alignItems: 'baseline' },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  planPeriod: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  textWhite: { color: Colors.textWhite },
  featuresList: { marginBottom: Spacing.lg },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  featureText: { fontSize: Typography.sizes.base, color: Colors.textSecondary, flex: 1 },
  suscribirBtn: {
    height: 50,
    borderRadius: Spacing.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  suscribirBtnColor: {
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  suscribirBtnLight: {
    borderColor: Colors.textWhite,
    backgroundColor: Colors.textWhite,
  },
  suscribirBtnText: {
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
