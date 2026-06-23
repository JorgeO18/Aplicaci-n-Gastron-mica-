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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import Logo from '@/components/Logo';

export default function RestaurantRegisterScreen() {
  const router = useRouter();
  
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipoCocina, setTipoCocina] = useState('');
  const [horario, setHorario] = useState('');

  const registrarRestaurante = async () => {
    if (
      nombre.trim() === '' || 
      direccion.trim() === '' || 
      telefono.trim() === '' || 
      tipoCocina.trim() === '' || 
      horario.trim() === ''
    ) {
      alert('Rellene todos los campos');
    } else {
      const restData = { nombre, ubicacion: direccion, telefono, tipo_comida: tipoCocina, horario };
      await AsyncStorage.setItem('@sesion_restaurante', JSON.stringify(restData));
      alert('Restaurante registrado con éxito. Bienvenido al panel administrativo.');
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
      >
        {/* Header con botón de volver */}
        <View style={styles.header}>
          <LinearGradient
            colors={[Colors.primary, Colors.gradientStart]}
            style={styles.headerGradient}
          >
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Icon name="arrow-back" size={24} color={Colors.textWhite} />
            </TouchableOpacity>
            <Logo size={60} showText={false} color={Colors.primary} />
          </LinearGradient>
          <View style={styles.curve} />
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.title}>Registrar Restaurante</Text>

          {/* Campo Nombre */}
          <View style={styles.inputContainer}>
            <Icon name="storefront-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre del restaurante"
              placeholderTextColor={Colors.textLight}
              autoCapitalize="words"
            />
          </View>

          {/* Campo Dirección */}
          <View style={styles.inputContainer}>
            <Icon name="location-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Dirección"
              placeholderTextColor={Colors.textLight}
            />
          </View>

          {/* Campo Teléfono */}
          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Teléfono"
              placeholderTextColor={Colors.textLight}
              keyboardType="phone-pad"
            />
          </View>

          {/* Campo Tipo de cocina */}
          <View style={styles.inputContainer}>
            <Icon name="restaurant-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={tipoCocina}
              onChangeText={setTipoCocina}
              placeholder="Tipo de cocina"
              placeholderTextColor={Colors.textLight}
            />
            {/* Opcional: mostrar un icono de dropdown si después se vuelve Select */}
            <Icon name="chevron-down-outline" size={20} color={Colors.textLight} />
          </View>

          {/* Campo Horario de atención */}
          <View style={styles.inputContainer}>
            <Icon name="time-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={horario}
              onChangeText={setHorario}
              placeholder="Horario de atención"
              placeholderTextColor={Colors.textLight}
            />
          </View>

          {/* Botón Registro */}
          <TouchableOpacity onPress={async () => { await registrarRestaurante() }} activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>Registrar</Text>
            </LinearGradient>
          </TouchableOpacity>

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
    marginBottom: Spacing.xl,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
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
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.base,
    height: Spacing.inputHeight,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#EFEFEF', // Ligero borde para igualar el aspecto visual
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  registerButton: {
    height: Spacing.buttonHeight,
    borderRadius: Spacing.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  registerButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
});
