// Pantalla de Perfil de Usuario - Estilo TasteGo con Contactos de Emergencia
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { Typography } from "@/constants/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  CampoUsuario,
  ContactoEmergencia,
  Usuarios,
  useBaseDeDatos,
} from "../../hooks/dataBase";
import { reverseGeocode } from "../../hooks/reverseGeocode";
import { useLocation } from "../../hooks/useLocation";

const LOCAL_KEY = "ubicacionUsuario";

const CAMPOS_EDITABLES: Record<CampoUsuario, { label: string; teclado: "default" | "email-address" | "phone-pad" }> = {
  nombre: { label: "Nombre", teclado: "default" },
  email: { label: "Correo electrónico", teclado: "email-address" },
  telefono: { label: "Teléfono", teclado: "phone-pad" },
  ubicacion: { label: "Ubicación", teclado: "default" },
};

export default function ProfileScreen() {
  const localSesion = "sesion";
  const {
    actualizarUsuario,
    agregarContactoEmergencia,
    listarContactosEmergencia,
    obtenerUsuarioPorId,
    obtenerUsuarioCorreo,
  } = useBaseDeDatos();
  const [user, setUser] = useState<Usuarios | null>(null);
  const [contactos, setContactos] = useState<ContactoEmergencia[]>([]);
  const [campoEditando, setCampoEditando] = useState<CampoUsuario | null>(null);
  const [valorEditando, setValorEditando] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [modalContactoVisible, setModalContactoVisible] = useState(false);
  const [nuevoContacto, setNuevoContacto] = useState({
    nombre: "",
    relacion: "",
    telefono: "",
  });
  const [guardandoContacto, setGuardandoContacto] = useState(false);
  const { location } = useLocation();
  const [ubicacion, setUbicacion] = useState("");

  const cargarContactos = async (idUsuario: number) => {
    const lista = await listarContactosEmergencia(idUsuario);
    setContactos(lista);
  };

  useEffect(() => {
    const cargarUbicacion = async () => {
      const ubi = await AsyncStorage.getItem(LOCAL_KEY);
      const coords = ubi
        ? (JSON.parse(ubi) as { latitude: number; longitude: number })
        : location;

      if (!coords?.latitude || !coords?.longitude) return;

      const ub = await reverseGeocode(coords.latitude, coords.longitude);
      if (ub) setUbicacion(ub.displayName);
    };
    cargarUbicacion();
  }, [location]);

  useEffect(() => {
    const datosUsuario = async () => {
      const isLogin = await AsyncStorage.getItem(localSesion);
      if (!isLogin) return;

      const sesion: Usuarios = JSON.parse(isLogin);
      let usuarioDb =(sesion.email ? await obtenerUsuarioCorreo(sesion.email) : undefined);

      if (usuarioDb) {
        setUser(usuarioDb);
        await AsyncStorage.setItem(localSesion, JSON.stringify(usuarioDb));
        await cargarContactos(Number(usuarioDb.id_usuario));
        return;
      }

      setUser(sesion);
      if (sesion.id_usuario) {
        await cargarContactos(Number(sesion.id_usuario));
      }
      
    };
    datosUsuario();
  }, []);

  const abrirEdicion = (campo: CampoUsuario) => {
    if (!user) return;
    setCampoEditando(campo);
    setValorEditando(user[campo] ?? "");
  };

  const cerrarEdicion = () => {
    setCampoEditando(null);
    setValorEditando("");
  };

  const guardarCampo = async () => {
    if (!user || !campoEditando) return;

    setGuardando(true);
    const resultado = await actualizarUsuario(
      Number(user.id_usuario),
      campoEditando,
      valorEditando,
      user.email
    );
    setGuardando(false);

    if (!resultado.state || !resultado.usuario) {
      Alert.alert("Error", resultado.mensaje);
      return;
    }

    setUser(resultado.usuario);
    await AsyncStorage.setItem(localSesion, JSON.stringify(resultado.usuario));
    cerrarEdicion();
  };

  const abrirModalContacto = () => {
    setNuevoContacto({ nombre: "", relacion: "", telefono: "" });
    setModalContactoVisible(true);
  };

  const cerrarModalContacto = () => {
    setModalContactoVisible(false);
    setNuevoContacto({ nombre: "", relacion: "", telefono: "" });
  };

  const guardarContacto = async () => {
    if (!user) return;

    setGuardandoContacto(true);
    const resultado = await agregarContactoEmergencia(
      Number(user.id_usuario),
      nuevoContacto
    );
    setGuardandoContacto(false);

    if (!resultado.state) {
      Alert.alert("Error", resultado.mensaje);
      return;
    }

    await cargarContactos(user.id_usuario);
    cerrarModalContacto();
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(console.error);
  };

  const cerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem("sesion");
      router.replace("../role-selection");
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con gradiente */}
        <LinearGradient
          colors={[Colors.primary, Colors.gradientStart]}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Mi Perfil</Text>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image source={require("@/assets/images/user.png")} style={styles.avatarImage} />
            </View>
            <TouchableOpacity style={styles.editAvatar}>
              <Ionicons name="camera" size={14} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.nombre}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </LinearGradient>

        {/* Curva */}
        <View style={styles.curve} />

        {/* Información personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <TouchableOpacity
            style={styles.fieldRow}
            activeOpacity={0.7}
            onPress={() => abrirEdicion("nombre")}
          >
            <View style={styles.fieldIcon}>
              <Ionicons name="person-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Nombre</Text>
              <Text style={styles.fieldValue}>{user?.nombre ?? "Cargando..."}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fieldRow}
            activeOpacity={0.7}
            onPress={() => abrirEdicion("email")}
          >
            <View style={styles.fieldIcon}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Correo electrónico</Text>
              <Text style={styles.fieldValue}>{user?.email ?? "Cargando..."}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fieldRow}
            activeOpacity={0.7}
            onPress={() => abrirEdicion("telefono")}
          >
            <View style={styles.fieldIcon}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Teléfono</Text>
              <Text style={styles.fieldValue}>{user?.telefono || "Sin teléfono"}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fieldRow}
            activeOpacity={0.7}
            onPress={() => abrirEdicion("ubicacion")}
          >
            <View style={styles.fieldIcon}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Ubicación</Text>
              <Text style={styles.fieldValue}>{ubicacion || "Sin ubicación"}</Text>
            </View>
            <Ionicons name="pencil-outline" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Contactos de Emergencia */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contactos de Emergencia</Text>
            <TouchableOpacity onPress={abrirModalContacto}>
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
          {contactos.length === 0 ? (
            <Text style={styles.emptyContacts}>
              No tienes contactos de emergencia. Toca + Agregar para crear uno.
            </Text>
          ) : (
            contactos.map((contact) => (
              <View key={contact.id_contacto} style={styles.contactCard}>
                <View style={styles.contactInfo}>
                  <View style={styles.contactIcon}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={24}
                      color="#ef4444"
                    />
                  </View>
                  <View>
                    <Text style={styles.contactName}>{contact.nombre}</Text>
                    <Text style={styles.contactRelation}>{contact.relacion}</Text>
                    <Text style={styles.contactPhone}>{contact.telefono}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCall(contact.telefono)}
                >
                  <Ionicons name="call" size={18} color={Colors.textWhite} />
                  <Text style={styles.callButtonText}>Llamar</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: Colors.textSecondary + "15" },
              ]}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={Colors.textSecondary}
              />
            </View>
            <Text style={styles.menuLabel}>Configuración</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: Colors.textSecondary + "15" },
              ]}
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={Colors.textSecondary}
              />
            </View>
            <Text style={styles.menuLabel}>Ayuda y soporte</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: Colors.textSecondary + "15" },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color={Colors.textSecondary}
              />
            </View>
            <Text style={styles.menuLabel}>Términos y condiciones</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: Colors.textSecondary + "15" },
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={Colors.textSecondary}
              />
            </View>
            <Text style={styles.menuLabel}>Privacidad</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textLight}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={async () => {
              await cerrarSesion();
            }}
          >
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: Colors.error + "15" },
              ]}
            >
              <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            </View>
            <Text style={[styles.menuLabel, { color: Colors.error }]}>
              Cerrar sesión
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <Modal
        visible={modalContactoVisible}
        transparent
        animationType="fade"
        onRequestClose={cerrarModalContacto}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo contacto de emergencia</Text>
            <TextInput
              style={styles.modalInput}
              value={nuevoContacto.nombre}
              onChangeText={(text) => setNuevoContacto((prev) => ({ ...prev, nombre: text }))}
              placeholder="Nombre completo"
              placeholderTextColor={Colors.textLight}
            />
            <TextInput
              style={styles.modalInput}
              value={nuevoContacto.relacion}
              onChangeText={(text) => setNuevoContacto((prev) => ({ ...prev, relacion: text }))}
              placeholder="Relación (ej. Madre, Esposo)"
              placeholderTextColor={Colors.textLight}
            />
            <TextInput
              style={styles.modalInput}
              value={nuevoContacto.telefono}
              onChangeText={(text) => setNuevoContacto((prev) => ({ ...prev, telefono: text }))}
              placeholder="Teléfono"
              placeholderTextColor={Colors.textLight}
              keyboardType="phone-pad"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={cerrarModalContacto}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtnSave, guardandoContacto && styles.modalBtnDisabled]}
                onPress={guardarContacto}
                disabled={guardandoContacto}
              >
                <Text style={styles.modalBtnSaveText}>
                  {guardandoContacto ? "Guardando..." : "Agregar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={campoEditando !== null}
        transparent
        animationType="fade"
        onRequestClose={cerrarEdicion}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Editar {campoEditando ? CAMPOS_EDITABLES[campoEditando].label : ""}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={valorEditando}
              onChangeText={setValorEditando}
              keyboardType={campoEditando ? CAMPOS_EDITABLES[campoEditando].teclado : "default"}
              autoCapitalize={campoEditando === "email" ? "none" : "sentences"}
              placeholder={`Ingresa tu ${campoEditando ? CAMPOS_EDITABLES[campoEditando].label.toLowerCase() : "dato"}`}
              placeholderTextColor={Colors.textLight}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={cerrarEdicion}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtnSave, guardando && styles.modalBtnDisabled]}
                onPress={guardarCampo}
                disabled={guardando}
              >
                <Text style={styles.modalBtnSaveText}>
                  {guardando ? "Guardando..." : "Guardar"}
                </Text>
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.textWhite,
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
  },
  avatarText: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textWhite,
  },
  editAvatar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.gradientStart,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.textWhite,
  },
  userName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textWhite,
  },
  userEmail: {
    fontSize: Typography.sizes.md,
    color: "rgba(255,255,255,0.8)",
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.md,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  fieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary + "12",
    alignItems: "center",
    justifyContent: "center",
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
  contactCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ef444415",
    alignItems: "center",
    justifyContent: "center",
  },
  contactName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  contactRelation: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  contactPhone: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
    marginTop: 2,
  },
  emptyContacts: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingVertical: Spacing.lg,
  },
  callButton: {
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.full,
  },
  callButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
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
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
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
  modalBtnDisabled: {
    opacity: 0.6,
  },
  modalBtnSaveText: {
    color: Colors.textWhite,
    fontWeight: Typography.weights.bold,
  },
});
