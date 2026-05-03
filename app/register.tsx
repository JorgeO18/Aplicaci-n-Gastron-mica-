import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleRegister = () => {
    // Redirigir al inicio después del registro
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* Logo TasteGo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Taste<Text style={styles.logoTextGo}>Go.</Text></Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#9CA3AF"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Repetir contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={repeatPassword}
              onChangeText={setRepeatPassword}
            />
          </View>

          {/* Botón Principal */}
          <TouchableOpacity onPress={handleRegister} activeOpacity={0.8} style={styles.loginButtonContainer}>
            <LinearGradient
              colors={['#F97316', '#EF4444']} // Naranja a Rojo
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Registrarse</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divisor */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O regístrate con</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Redes Sociales */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={[styles.socialIcon, { color: '#DB4437' }]}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={[styles.socialIcon, { color: '#4267B2', fontWeight: 'bold' }]}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={[styles.socialIcon, { color: '#000000', fontSize: 22 }]}></Text>
            </TouchableOpacity>
          </View>

          {/* Volver al Login */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.registerLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    marginBottom: 50,
    marginTop: 20,
  },
  logoText: {
    fontSize: 56,
    color: '#E63946',
    fontWeight: 'bold',
    fontStyle: 'italic', // Simulando la fuente cursiva
    letterSpacing: -2,
  },
  logoTextGo: {
    fontSize: 56,
    color: '#E63946',
    fontWeight: 'normal',
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
    gap: 16,
  },
  input: {
    backgroundColor: '#F3F4F6', // Gris muy claro
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  loginButtonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  loginButton: {
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#9CA3AF',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    color: '#6B7280',
    fontSize: 15,
  },
  registerLink: {
    color: '#D9534F', // Rojo/Naranja
    fontSize: 15,
    fontWeight: 'bold',
  },
});
