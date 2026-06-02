// Pantalla de Registro de Usuario - Diseño TasteGo
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
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import Logo from '@/components/Logo';
import { useBaseDeDatos } from "../hooks/dataBase";
import DatePicker from 'react-native-date-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultBirthDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date;
};

const formatBirthDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [nombre,setNombre] = useState('')
  const [correo,setCorreo] = useState('')
  const [numero, setNumero] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [contraseña2, setContraseña2] = useState('')
  const { db, isReady, registrarUsuario } = useBaseDeDatos();
  const localSesion = 'sesion'


  const registrar = async() =>{
    if (!isReady || !db) return;
    if(nombre.trim() === '' || correo.trim() === '' || contraseña.trim() === '' || contraseña2.trim() === '' || numero.trim() === '' || birthDate === null){
      alert('Rellene todos los campos')
    }else{
      if (contraseña.trim() === contraseña2.trim()) {
        
        const user = {nombre : nombre, email : correo, password : contraseña, fecha_nacimiento : birthDate.toISOString(), telefono : numero}

        const {mensaje , state} = await registrarUsuario(user)
        alert(mensaje)
        if (state) {
          await AsyncStorage.setItem(localSesion,JSON.stringify(user))
          router.replace('./(tabs)')
        }
      }
    }
  }










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
            <Logo size={60} showText textColor={Colors.textWhite} color={Colors.primary} />
          </LinearGradient>
          <View style={styles.curve} />
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a TasteGo y descubre nuevos sabores</Text>

          {/* Campo Nombre */}
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre completo"
              placeholderTextColor={Colors.textLight}
            />
          </View>

          {/* Campo Email */}
          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={correo}
              onChangeText={setCorreo}
              placeholder="Correo electrónico"
              placeholderTextColor={Colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Campo Fecha de Nacimiento */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setDatePickerOpen(true)}
            activeOpacity={0.7}
          >
            <Icon name="calendar-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <Text style={[styles.input, !birthDate && styles.inputPlaceholder]}>
              {birthDate ? formatBirthDate(birthDate) : 'Fecha de nacimiento (DD/MM/AAAA)'}
            </Text>
          </TouchableOpacity>

          <DatePicker
            modal
            open={datePickerOpen}
            date={birthDate ?? defaultBirthDate()}
            mode="date"
            locale="es"
            theme="light"
            buttonColor={Colors.primary}
            dividerColor={Colors.primary}
            title="Fecha de nacimiento"
            confirmText="Confirmar"
            cancelText="Cancelar"
            maximumDate={new Date()}
            onConfirm={(date) => {
              setDatePickerOpen(false);
              setBirthDate(date);
            }}
            onCancel={() => setDatePickerOpen(false)}
          />

          {/* Campo Teléfono */}
          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={numero}
              onChangeText={setNumero}
              placeholder="Teléfono"
              placeholderTextColor={Colors.textLight}
              keyboardType="phone-pad"
            />
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={contraseña}
              onChangeText={setContraseña}
              placeholder="Contraseña"
              placeholderTextColor={Colors.textLight}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={Colors.textLight}
              />
            </TouchableOpacity>
          </View>

          {/* Campo Confirmar Contraseña */}
          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={contraseña2}
              onChangeText={setContraseña2}
              placeholder="Confirmar contraseña"
              placeholderTextColor={Colors.textLight}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon
                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={Colors.textLight}
              />
            </TouchableOpacity>
          </View>

          {/* Términos y condiciones */}
          <TouchableOpacity 
            style={styles.termsContainer} 
            onPress={() => setAgreeTerms(!agreeTerms)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
              {agreeTerms && <Icon name="checkmark" size={14} color={Colors.textWhite} />}
            </View>
            <Text style={styles.termsText}>
              Acepto los <Text style={styles.termsLink}>Términos y Condiciones</Text>
            </Text>
          </TouchableOpacity>

          {/* Botón Registro */}
          <TouchableOpacity onPress={async() => {await registrar()}} activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.registerButton, !agreeTerms && { opacity: 0.6 }]}
            >
              <Text style={styles.registerButtonText}>Registrarse</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Inicia Sesión</Text>
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
  inputPlaceholder: {
    color: Colors.textLight,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingRight: Spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  termsText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
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
    marginBottom: Spacing.xl,
  },
  registerButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Spacing.xxl,
  },
  loginText: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
});
