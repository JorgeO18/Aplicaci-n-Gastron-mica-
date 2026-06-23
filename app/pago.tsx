import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

export default function PagoScreen() {
  const router = useRouter();
  const { planId, planNombre, planPrecio } = useLocalSearchParams<{ planId: string; planNombre: string; planPrecio: string }>();

  const [titular, setTitular] = useState('');
  const [numero, setNumero] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [exito, setExito] = useState(false);

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatFecha = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handlePagar = async () => {
    if (!titular.trim() || numero.replace(/\s/g, '').length < 16 || vencimiento.length < 5 || cvv.length < 3) {
      alert('Por favor completa todos los campos correctamente.');
      return;
    }
    setProcesando(true);
    // Simular demora de pasarela
    await new Promise(r => setTimeout(r, 2500));
    await AsyncStorage.setItem('@plan_restaurante', JSON.stringify({ id: planId, nombre: planNombre, precio: planPrecio }));
    setProcesando(false);
    setExito(true);
  };

  const handleIrHome = () => {
    router.replace('/(restaurant-tabs)');
  };

  if (exito) {
    return (
      <View style={styles.exitoContainer}>
        <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.exitoCircle}>
          <Ionicons name="checkmark" size={60} color={Colors.textWhite} />
        </LinearGradient>
        <Text style={styles.exitoTitle}>¡Pago exitoso!</Text>
        <Text style={styles.exitoDesc}>Ya tienes activo el plan <Text style={{ fontWeight: 'bold', color: Colors.primary }}>{planNombre}</Text>. Ahora puedes agregar más platos a tu restaurante.</Text>
        <TouchableOpacity onPress={handleIrHome} activeOpacity={0.8}>
          <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.exitoBtn}>
            <Text style={styles.exitoBtnText}>Ir al Panel</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pago Seguro</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Resumen del plan */}
        <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.planSummary}>
          <View>
            <Text style={styles.planSummaryLabel}>Plan seleccionado</Text>
            <Text style={styles.planSummaryName}>{planNombre}</Text>
          </View>
          <Text style={styles.planSummaryPrice}>{planPrecio}<Text style={{ fontSize: 14 }}>/mes</Text></Text>
        </LinearGradient>

        {/* Tarjeta visual */}
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.cardVisual}>
          <View style={styles.cardChip}>
            <Ionicons name="card" size={28} color="#FFD700" />
          </View>
          <Text style={styles.cardNumber}>
            {numero ? numero.padEnd(19, ' •') : '•••• •••• •••• ••••'}
          </Text>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardFieldLabel}>TITULAR</Text>
              <Text style={styles.cardFieldValue}>{titular || 'NOMBRE APELLIDO'}</Text>
            </View>
            <View>
              <Text style={styles.cardFieldLabel}>VENCE</Text>
              <Text style={styles.cardFieldValue}>{vencimiento || 'MM/AA'}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Datos de la tarjeta</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Titular de la tarjeta"
              placeholderTextColor={Colors.textLight}
              value={titular}
              onChangeText={setTitular}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="card-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Número de tarjeta"
              placeholderTextColor={Colors.textLight}
              value={numero}
              onChangeText={(v) => setNumero(formatCard(v))}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputWrapper, { flex: 1, marginRight: Spacing.sm }]}>
              <Ionicons name="calendar-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="MM/AA"
                placeholderTextColor={Colors.textLight}
                value={vencimiento}
                onChangeText={(v) => setVencimiento(formatFecha(v))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="CVV"
                placeholderTextColor={Colors.textLight}
                value={cvv}
                onChangeText={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>
          </View>

          <View style={styles.secureNote}>
            <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
            <Text style={styles.secureText}>Pago encriptado y 100% seguro</Text>
          </View>
        </View>

        {/* Botón Pagar */}
        <TouchableOpacity onPress={handlePagar} activeOpacity={0.85} disabled={procesando} style={{ marginTop: Spacing.xl, paddingHorizontal: Spacing.lg }}>
          <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.pagarBtn}>
            {procesando ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator color={Colors.textWhite} style={{ marginRight: 10 }} />
                <Text style={styles.pagarBtnText}>Procesando pago...</Text>
              </View>
            ) : (
              <Text style={styles.pagarBtnText}>Pagar {planPrecio}/mes</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxl },
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
  headerTitle: { fontSize: Typography.sizes.lg, fontWeight: 'bold', color: Colors.textPrimary },
  planSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.xl,
  },
  planSummaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: Typography.sizes.sm },
  planSummaryName: { color: Colors.textWhite, fontSize: Typography.sizes.xl, fontWeight: 'bold' },
  planSummaryPrice: { color: Colors.textWhite, fontSize: 24, fontWeight: 'bold' },
  cardVisual: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.xl,
    height: 190,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  cardChip: { alignSelf: 'flex-start' },
  cardNumber: { color: Colors.textWhite, fontSize: 20, fontWeight: 'bold', letterSpacing: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardFieldLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 1 },
  cardFieldValue: { color: Colors.textWhite, fontSize: Typography.sizes.sm, fontWeight: '600', marginTop: 2 },
  form: { padding: Spacing.lg, marginTop: Spacing.md },
  sectionTitle: { fontSize: Typography.sizes.lg, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Spacing.md },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 55,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputIcon: { marginRight: Spacing.sm },
  input: { flex: 1, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  row: { flexDirection: 'row' },
  secureNote: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm },
  secureText: { color: '#4CAF50', fontSize: Typography.sizes.sm, marginLeft: 6, fontWeight: '500' },
  pagarBtn: {
    height: 56,
    borderRadius: Spacing.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  pagarBtnText: { color: Colors.textWhite, fontSize: Typography.sizes.lg, fontWeight: 'bold' },
  // Éxito
  exitoContainer: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  exitoCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  exitoTitle: { fontSize: Typography.sizes.xxl, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: Spacing.md },
  exitoDesc: { fontSize: Typography.sizes.base, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xxl },
  exitoBtn: { paddingHorizontal: 60, height: 56, borderRadius: Spacing.borderRadius.xl, alignItems: 'center', justifyContent: 'center' },
  exitoBtnText: { color: Colors.textWhite, fontSize: Typography.sizes.lg, fontWeight: 'bold' },
});
