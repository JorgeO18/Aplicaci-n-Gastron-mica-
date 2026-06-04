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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { Typography } from "@/constants/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Usuarios } from "../../hooks/dataBase";



const emergencyContacts = [
  { name: "Carla Rodríguez", relation: "Esposa", phone: "+57 320 456 7890" },
  { name: "Marta López", relation: "Madre", phone: "+57 318 234 5678" },
];

export default function ProfileScreen() {
  const localSesion = "sesion";
  const [user, setUser] = useState<Usuarios | null>(null);
  useEffect(() => {
    const datosUsuario = async () => {
      const isLogin = await AsyncStorage.getItem(localSesion);
      const u: Usuarios = JSON.parse(isLogin!);
      setUser(u);
    };
    datosUsuario()
  });

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(console.error);
  };

  const cerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem("sesion");
      router.replace("../login");
    } catch (error) {}
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
          
          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7}>
            <View style={styles.fieldIcon}>
              <Ionicons name="person-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Nombre</Text>
              <Text style={styles.fieldValue}>{user?.nombre ?? "Cargando..."}</Text>
            </View>
            
          </TouchableOpacity>

          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7}>
            <View style={styles.fieldIcon}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Correo electrónico</Text>
              <Text style={styles.fieldValue}>{user?.email ?? "Cargando..."}</Text>
            </View>
            
          </TouchableOpacity>

          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7}>
            <View style={styles.fieldIcon}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Teléfono</Text>
              {/* @ts-ignore - Si en el futuro agregas teléfono a la BD, aquí se mostrará */}
              <Text style={styles.fieldValue}>{user?.telefono ?? "+57 315 234 5678"}</Text>
            </View>
            
          </TouchableOpacity>

          <TouchableOpacity style={styles.fieldRow} activeOpacity={0.7}>
            <View style={styles.fieldIcon}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Ubicación</Text>
              <Text style={styles.fieldValue}>Sincelejo, Sucre</Text>
            </View>
            
          </TouchableOpacity>
        </View>

        {/* Contactos de Emergencia */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contactos de Emergencia</Text>
            <TouchableOpacity>
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
          {emergencyContacts.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <View style={styles.contactIcon}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={24}
                    color="#ef4444"
                  />
                </View>
                <View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelation}>{contact.relation}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(contact.phone)}
              >
                <Ionicons name="call" size={18} color={Colors.textWhite} />
                <Text style={styles.callButtonText}>Llamar</Text>
              </TouchableOpacity>
            </View>
          ))}
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
});
