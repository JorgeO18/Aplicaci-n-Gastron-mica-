import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PlatosScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);

  // Eliminamos el hook que puede causar problemas de registro en Android
  // const [permissionStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const MAX_FOTOS = 2;

  const handleSubirFoto = async () => {
    if (fotos.length >= MAX_FOTOS) {
      alert(`Máximo ${MAX_FOTOS} fotos permitidas`);
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Necesitamos permisos para acceder a tu galería de fotos.");
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFotos([...fotos, result.assets[0].uri]);
      }
    } catch (e) {
      alert('Hubo un error al abrir la galería.');
      console.log(e);
    }
  };

  const handleGuardar = async () => {
    if (!nombre.trim() || !descripcion.trim()) {
      alert("Comienza por darle un nombre y descripción al plato.");
      return;
    }

    // Verificar límite de platos según plan
    try {
      const almacenados = await AsyncStorage.getItem('@platos_restaurante');
      const listado = almacenados ? JSON.parse(almacenados) : [];
      const planData = await AsyncStorage.getItem('@plan_restaurante');
      const plan = planData ? JSON.parse(planData) : null;
      const MAX_GRATIS = 2;
      const MAX_BASICO = 10;
      const MAX_PRO = 30;

      // Sin plan: solo 2 platos
      if (!plan && listado.length >= MAX_GRATIS) {
        alert(`Has alcanzado el límite de ${MAX_GRATIS} platos del plan gratuito. Suscríbete para agregar más.`);
        router.push('/planes' as any);
        return;
      }
      // Plan básico: hasta 10 platos
      if (plan?.id === 'basico' && listado.length >= MAX_BASICO) {
        alert(`Tu plan Básico permite hasta ${MAX_BASICO} platos. Actualiza tu plan para agregar más.`);
        router.push('/planes' as any);
        return;
      }
      // Plan pro: hasta 30 platos
      if (plan?.id === 'pro' && listado.length >= MAX_PRO) {
        alert(`Tu plan Pro permite hasta ${MAX_PRO} platos. Actualiza al plan Premium para agregar más.`);
        router.push('/planes' as any);
        return;
      }
    } catch (e) {
      console.warn('Error verificando plan:', e);
    }

    const nuevoPlato = {
      id: Date.now().toString(),
      nombre,
      descripcion,
      fotos: fotos, // Guardamos todas las fotos seleccionadas (máximo 2)
    };

    try {
      const almacenados = await AsyncStorage.getItem('@platos_restaurante');
      let listado = almacenados ? JSON.parse(almacenados) : [];
      listado.push(nuevoPlato);
      await AsyncStorage.setItem('@platos_restaurante', JSON.stringify(listado));

      alert("Plato guardado con éxito.");
      setNombre('');
      setDescripcion('');
      setFotos([]);
    } catch (e) {
      alert("Error al guardar plato.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Agrega un Platillo</Text>
          <Text style={styles.headerSub}>Sube fotos, nombre y descripción y ofrécelo a tus clientes.</Text>
        </View>

        {/* Zona de Drag/Drop (Subir fotos) */}
        <TouchableOpacity style={styles.uploadArea} onPress={handleSubirFoto} activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            <Ionicons name="cloud-upload" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.uploadTitle}>Seleccionar de Galería</Text>
          <Text style={styles.uploadSub}>Toca aquí para seleccionar una imagen</Text>
        </TouchableOpacity>

        {/* Placeholders / Miniaturas */}
        <View style={styles.thumbnailsRow}>
          {[0, 1].map((index) => {
            const hasPhoto = index < fotos.length;
            return (
              <View key={index} style={[styles.thumbnailBox, { width: '48%' }]}>
                {hasPhoto ? (
                  <View style={{ width: '100%', height: '100%' }}>
                    <Image source={{ uri: fotos[index] }} style={styles.thumbnailImg} />
                    <TouchableOpacity 
                      style={styles.removePhotoBadge} 
                      onPress={() => setFotos(fotos.filter((_, i) => i !== index))}
                    >
                      <Ionicons name="close-circle" size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Ionicons name="image-outline" size={24} color={Colors.textLight} />
                )}
              </View>
            );
          })}
        </View>

        {/* Formulario */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del platillo..."
            placeholderTextColor={Colors.textLight}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Escribe una pequeña descripción o los ingredientes principales..."
            placeholderTextColor={Colors.textLight}
            value={descripcion}
            onChangeText={(t) => { if (t.length <= 300) setDescripcion(t) }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{descripcion.length}/300</Text>
        </View>

        {/* Guardar */}
        <TouchableOpacity onPress={handleGuardar} activeOpacity={0.8} style={{ marginTop: Spacing.xl }}>
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Guardar platillo</Text>
          </LinearGradient>
        </TouchableOpacity>

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
    padding: Spacing.xl,
    paddingTop: 60,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  headerTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.primary + '50',
    backgroundColor: Colors.primary + '0A',
    borderStyle: 'dashed',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.textWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  uploadSub: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
  },
  thumbnailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  thumbnailBox: {
    width: 70,
    height: 70,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  removePhotoBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  inputContainer: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  input: {
    height: 55,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  textAreaContainer: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    height: 120,
    position: 'relative',
  },
  textArea: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  charCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
  },
  saveButton: {
    height: 55,
    borderRadius: Spacing.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
  },
});
