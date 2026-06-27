import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useBaseDeDatos, RestauranteI, CampoRestaurante } from "../../hooks/dataBase";

export default function PerfilScreen() {
  const router = useRouter();
  const { actualizarRestaurante } = useBaseDeDatos();
  const localSesion = "sesion";
  const [restaurant, setRestaurant] = useState< RestauranteI | null>(null);

  const [campoEditando, setCampoEditando] = useState<string | null>(null);
  const [valorEditando, setValorEditando] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [planActual, setPlanActual] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const isLogin = await AsyncStorage.getItem(localSesion);
      if (!isLogin) return;
      const sesion: RestauranteI = JSON.parse(isLogin);
      if (sesion) {
        setRestaurant(sesion)
      }
      
      const planData = await AsyncStorage.getItem('@plan_restaurante');
      if (planData) setPlanActual(JSON.parse(planData).nombre || null);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem(localSesion);
    router.replace('../role-selection');
  };

  const abrirEdicion = (campo: string) => {
    setCampoEditando(campo);
    setValorEditando((restaurant as any)[campo] || '');
  };

  const cerrarEdicion = () => {
    setCampoEditando(null);
    setValorEditando('');
    setShowPasswordInModal(false);
  };

  const guardarCampo = async () => {
    if (!campoEditando || !restaurant) {
      cerrarEdicion();
      return;
    }
    const { mensaje, state, restaurante } = await actualizarRestaurante(
      restaurant.id_restaurante,
      campoEditando as CampoRestaurante,
      valorEditando
    );
    Alert.alert(state ? 'Éxito' : 'Error', mensaje);
    if (state && restaurante) {
      setRestaurant(restaurante);
      await AsyncStorage.setItem(localSesion, JSON.stringify(restaurante));
    }
    cerrarEdicion();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con gradiente (estilo TaseGo) */}
        <LinearGradient
          colors={[Colors.primary, Colors.gradientStart]}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Perfil del Restaurante</Text>

          {/* Avatar principal */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="storefront" size={48} color={Colors.textWhite} />
            </View>
            <TouchableOpacity style={styles.editAvatar}>
              <Ionicons name="camera" size={14} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>

          <Text style={styles.restaurantName}>{restaurant?.nombre}</Text>
          <Text style={styles.restaurantType}>{restaurant?.tipo_comida}</Text>
        </LinearGradient>

        {/* Curva superpuesta */}
        <View style={styles.curve} />

        {/* Información del restaurante */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Local</Text>

          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7} onPress={() => abrirEdicion('nombre')}>
            <View style={styles.fieldIcon}>
              <Ionicons name="restaurant-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Nombre del restaurante</Text>
              <Text style={styles.fieldValue}>{restaurant?.nombre}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7} onPress={() => abrirEdicion('descripcion')}>
            <View style={styles.fieldIcon}>
              <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Descripción</Text>
              <Text style={styles.fieldValue} numberOfLines={2}>{restaurant?.descripcion || 'Sin descripción'}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7} onPress={() => abrirEdicion('tipo_comida')}>
            <View style={styles.fieldIcon}>
              <Ionicons name="fast-food-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Tipo de comida</Text>
              <Text style={styles.fieldValue}>{restaurant?.tipo_comida}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7} onPress={() => abrirEdicion('direccion')}>
            <View style={styles.fieldIcon}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Dirección</Text>
              <Text style={styles.fieldValue}>{restaurant?.direccion}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7} onPress={() => abrirEdicion('telefono')}>
            <View style={styles.fieldIcon}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Teléfono de contacto</Text>
              <Text style={styles.fieldValue}>{restaurant?.telefono}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7} onPress={() => abrirEdicion('horario')}>
            <View style={styles.fieldIcon}>
              <Ionicons name="time-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Horario de atención</Text>
              <Text style={styles.fieldValue}>{restaurant?.horario}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7} onPress={() => abrirEdicion('correo')}>
            <View style={styles.fieldIcon}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Correo electrónico</Text>
              <Text style={styles.fieldValue}>{restaurant?.correo || 'No disponible'}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7} onPress={() => abrirEdicion('contraseña')}>
            <View style={styles.fieldIcon}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Contraseña</Text>
              <Text style={styles.fieldValue}>••••••••</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* General Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7} onPress={() => router.push('/planes' as any)}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.primary + '15' }]}>
              <Ionicons name="trophy-outline" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>Mi Plan</Text>
              <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 2 }}>{planActual ?? 'Gratuito – Toca para actualizar'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7} onPress={handleLogout}>
            <View style={[styles.menuIcon, { backgroundColor: Colors.error + '15' }]}>
              <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            </View>
            <Text style={[styles.menuLabel, { color: Colors.error }]}>Cerrar sesión</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* Modal de edición */}
      <Modal visible={campoEditando !== null} transparent animationType="fade" onRequestClose={cerrarEdicion}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Información</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={[styles.modalInput, { marginBottom: 0, flex: 1, borderWidth: 0 }]}
                value={valorEditando}
                onChangeText={setValorEditando}
                placeholder="Ingresa el nuevo valor"
                placeholderTextColor={Colors.textLight}
                autoCapitalize={campoEditando === 'contraseña' || campoEditando === 'correo' ? "none" : "sentences"}
                keyboardType={campoEditando === 'correo' ? 'email-address' : 'default'}
                secureTextEntry={campoEditando === 'contraseña' && !showPasswordInModal}
              />
              {campoEditando === 'contraseña' && (
                <TouchableOpacity onPress={() => setShowPasswordInModal(!showPasswordInModal)} style={{ paddingHorizontal: 10 }}>
                  <Ionicons 
                    name={showPasswordInModal ? 'eye-outline' : 'eye-off-outline'} 
                    size={20} 
                    color={Colors.textLight} 
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={cerrarEdicion}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={guardarCampo}>
                <Text style={styles.modalBtnSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.textWhite,
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.gradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.textWhite,
  },
  restaurantName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textWhite,
  },
  restaurantType: {
    fontSize: Typography.sizes.md,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  curve: {
    height: 20,
    backgroundColor: Colors.background,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  fieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.lg,
    paddingRight: 5,
  },
  modalInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.sm,
  },
  modalBtnCancel: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  modalBtnCancelText: {
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  modalBtnSave: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.full,
  },
  modalBtnSaveText: {
    color: Colors.textWhite,
    fontWeight: Typography.weights.bold,
  },
});
