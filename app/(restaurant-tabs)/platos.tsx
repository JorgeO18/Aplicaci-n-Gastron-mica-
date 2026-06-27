import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { seleccionarImagen } from '@/hooks/archivos';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Categorias, PlatosI, RestauranteI, useBaseDeDatos } from '../../hooks/dataBase';

export default function PlatosScreen() {
  const router = useRouter();
  const { db, isReady, registrarPlato, obtenerCategorias } = useBaseDeDatos();

  // ── Datos del formulario ──────────────────────────────────────────────────
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [disponible, setDisponible] = useState(true);

  // ── Datos auxiliares ──────────────────────────────────────────────────────
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [guardando, setGuardando] = useState(false);

  // ── Carga de categorías ───────────────────────────────────────────────────
  useEffect(() => {
    const cargarCategoria = async () => {
      if (!isReady || !db) return;
      const categoriaBd = await obtenerCategorias();
      if (categoriaBd) setCategorias(categoriaBd);
    };
    cargarCategoria();
  }, [isReady, db]);

  // ── Selección de imagen via hook archivos.ts ──────────────────────────────
  const handleSubirFoto = async () => {
    if (fotos.length >= 2) {
      alert('Máximo 2 fotos permitidas.');
      return;
    }
    const uri = await seleccionarImagen();
    if (uri) setFotos(prev => [...prev, uri]);
  };

  // ── Limpiar formulario ────────────────────────────────────────────────────
  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setFotos([]);
    setCategoriaSeleccionada(null);
    setDisponible(true);
  };

  // ── Registrar plato en la BD ──────────────────────────────────────────────
  const registrar = async () => {
    if (!isReady || !db) return;

    if (!nombre.trim()) {
      alert('El nombre del platillo es obligatorio.');
      return;
    }
    if (!descripcion.trim()) {
      alert('La descripción es obligatoria.');
      return;
    }
    if (!precio.trim() || isNaN(Number(precio)) || Number(precio) <= 0) {
      alert('Ingresa un precio válido.');
      return;
    }
    if (categoriaSeleccionada === null) {
      alert('Selecciona una categoría para el platillo.');
      return;
    }

    const isLogin = await AsyncStorage.getItem('sesion');
    if (!isLogin) {
      alert('No hay sesión activa. Inicia sesión como restaurante.');
      return;
    }
    const sesion: RestauranteI = JSON.parse(isLogin);
    const idRestaurante: string = sesion.id_restaurante?.toString() ?? '0';

    const nuevoPlato: PlatosI = {
      id_restaurante: idRestaurante,
      id_categoria: categoriaSeleccionada,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      imagen_url: fotos.length > 0 ? JSON.stringify(fotos) : '', // Guardamos ambas fotos como JSON string
    };

    try {
      setGuardando(true);
      await registrarPlato(nuevoPlato);
      alert('¡Platillo registrado con éxito!');
      limpiarFormulario();
    } catch (e) {
      console.log('Error al registrar plato:', e);
      alert('No se pudo registrar el platillo. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Agrega un Platillo</Text>
          <Text style={styles.headerSub}>
            Sube una foto, completa los datos y ofrécelo a tus clientes.
          </Text>
        </View>

        {/* ── Fotos ─────────────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.uploadArea} onPress={handleSubirFoto} activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            <Ionicons name="cloud-upload" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.uploadTitle}>Seleccionar imagen</Text>
          <Text style={styles.uploadSub}>Puedes subir hasta 2 fotos (opcional)</Text>
        </TouchableOpacity>

        {/* Placeholders / Miniaturas */}
        <View style={styles.thumbnailsRow}>
          {[0, 1].map((index) => {
            const hasPhoto = index < fotos.length;
            return (
              <View key={index} style={[styles.thumbnailBox, { width: '48%' }]} pointerEvents="box-none">
                {hasPhoto ? (
                  <View style={{ width: '100%', height: '100%' }}>
                    <Image source={{ uri: fotos[index] }} style={styles.thumbnailImg} resizeMode="cover" />
                    <TouchableOpacity
                      style={styles.removePhotoBadgeList}
                      onPress={() => setFotos(fotos.filter((_, i) => i !== index))}
                    >
                      <Ionicons name="close-circle" size={24} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Ionicons name="image-outline" size={28} color={Colors.textLight} />
                )}
              </View>
            );
          })}
        </View>

        {/* ── Nombre ─────────────────────────────────────────────────────── */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del platillo..."
            placeholderTextColor={Colors.textLight}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        {/* ── Precio ─────────────────────────────────────────────────────── */}
        <View style={styles.inputContainer}>
          <View style={styles.precioRow}>
            <Text style={styles.precioSimbolo}>$</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Precio..."
              placeholderTextColor={Colors.textLight}
              value={precio}
              onChangeText={t => setPrecio(t.replace(/[^0-9.]/g, ''))}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* ── Descripción ────────────────────────────────────────────────── */}
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Escribe una pequeña descripción o los ingredientes principales..."
            placeholderTextColor={Colors.textLight}
            value={descripcion}
            onChangeText={t => { if (t.length <= 300) setDescripcion(t); }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{descripcion.length}/300</Text>
        </View>

        {/* ── Categoría ──────────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Categoría</Text>
        {categorias.length === 0 ? (
          <Text style={styles.emptyCategoria}>Sin categorías disponibles</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
            {categorias.map(cat => {
              const seleccionada = categoriaSeleccionada === cat.id_categoria;
              return (
                <TouchableOpacity
                  key={cat.id_categoria}
                  style={[styles.categoriaChip, seleccionada && styles.categoriaChipActiva]}
                  onPress={() => setCategoriaSeleccionada(cat.id_categoria)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoriaChipText, seleccionada && styles.categoriaChipTextActiva]}>
                    {cat.nombre}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* ── Disponible ─────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.disponibleRow}
          onPress={() => setDisponible(prev => !prev)}
          activeOpacity={0.7}
        >
          <View style={[styles.toggle, disponible && styles.toggleActivo]}>
            <View style={[styles.toggleCircle, disponible && styles.toggleCircleActivo]} />
          </View>
          <Text style={styles.disponibleLabel}>
            {disponible ? 'Platillo disponible' : 'No disponible actualmente'}
          </Text>
        </TouchableOpacity>

        {/* ── Botón Guardar ──────────────────────────────────────────────── */}
        <TouchableOpacity
          onPress={registrar}
          activeOpacity={0.8}
          style={{ marginTop: Spacing.xl }}
          disabled={guardando}
        >
          <LinearGradient
            colors={[Colors.gradientStart, Colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
          >
            {guardando ? (
              <ActivityIndicator color={Colors.textWhite} />
            ) : (
              <Text style={styles.saveButtonText}>Registrar platillo</Text>
            )}
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
    paddingBottom: 40,
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

  // ── Contenedores de Imagen ────────────────────────────────────────────────
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.primary + '50',
    backgroundColor: Colors.primary + '0A',
    borderStyle: 'dashed',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    minHeight: 140,
    justifyContent: 'center',
  },
  thumbnailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
    marginTop: -Spacing.md, // para acercarlo al uploadArea
  },
  thumbnailBox: {
    height: 120, // Rectangular para mejor visualización
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  removePhotoBadgeList: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'white',
    borderRadius: 12,
    zIndex: 10,
    elevation: 3,
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

  // ── Inputs ────────────────────────────────────────────────────────────────
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
  precioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  precioSimbolo: {
    fontSize: Typography.sizes.lg,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  textAreaContainer: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    height: 120,
    position: 'relative',
    marginBottom: Spacing.md,
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

  // ── Categorías ────────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  categoriasScroll: {
    marginBottom: Spacing.xl,
  },
  categoriaChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
    marginRight: Spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoriaChipActiva: {
    backgroundColor: Colors.primary + '18',
    borderColor: Colors.primary,
  },
  categoriaChipText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  categoriaChipTextActiva: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  emptyCategoria: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xl,
  },

  // ── Disponible toggle ─────────────────────────────────────────────────────
  disponibleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  toggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    paddingHorizontal: 3,
    marginRight: Spacing.md,
  },
  toggleActivo: {
    backgroundColor: Colors.primary,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.textWhite,
    alignSelf: 'flex-start',
  },
  toggleCircleActivo: {
    alignSelf: 'flex-end',
  },
  disponibleLabel: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },

  // ── Botón guardar ─────────────────────────────────────────────────────────
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
