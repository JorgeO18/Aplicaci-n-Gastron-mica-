import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import Logo from '@/components/Logo';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RestaurantLoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [contraseña, setContraseña] = useState('');
  const [nombreRestaurante, setNombreRestaurante] = useState('');

  const loginRestaurante = async () => {
    if (contraseña.trim() === '' || nombreRestaurante.trim() === '') {
      alert('Rellene todos los campos');
    } else {
      // TODO: Lógica de inicio de sesión de restaurante
      router.replace('/(restaurant-tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header con logo */}
        <View style={styles.header}>
          <LinearGradient
            colors={[Colors.primary, Colors.gradientStart]}
            style={styles.headerGradient}
          >
            <Logo size={70} showText textColor={Colors.textWhite} color={Colors.primary} />
          </LinearGradient>
          {/* Curva decorativa */}
          <View style={styles.curve} />
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.title}>Login Restaurante</Text>
          <Text style={styles.subtitle}>Ingresa tus datos para continuar</Text>

          {/* Campo Nombre del restaurante */}
          <View style={styles.inputContainer}>
            <Ionicons name="storefront-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={nombreRestaurante}
              onChangeText={setNombreRestaurante}
              placeholder="Nombre del restaurante"
              placeholderTextColor={Colors.textLight}
              autoCapitalize="words"
            />
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={contraseña}
              onChangeText={setContraseña}
              placeholder="Contraseña"
              placeholderTextColor={Colors.textLight}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={Colors.textLight}
              />
            </TouchableOpacity>
          </View>

          {/* ¿Olvidaste tu contraseña? */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Botón Iniciar Sesión */}
          <TouchableOpacity onPress={async () => { await loginRestaurante() }} activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
          </View>

          {/* Registro */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/restaurant-register')}>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    position: 'relative',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  curve: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  form: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.base,
    height: Spacing.inputHeight,
    marginBottom: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
  },
  forgotPasswordText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  loginButton: {
    height: Spacing.buttonHeight,
    borderRadius: Spacing.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'transparent',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Spacing.xxl,
  },
  registerText: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
});
