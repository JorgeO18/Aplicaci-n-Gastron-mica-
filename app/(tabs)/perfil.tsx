// Pantalla de Perfil de Usuario - Estilo TasteGo con Contactos de Emergencia
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

interface ProfileField {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color?: string;
}

const profileFields: ProfileField[] = [
  { icon: 'person-outline', label: 'Username', value: 'ana_rodriguez' },
  { icon: 'mail-outline', label: 'Correo electrónico', value: 'ana.rodriguez@email.com' },
  { icon: 'call-outline', label: 'Teléfono', value: '+57 315 234 5678' },
  { icon: 'location-outline', label: 'Ubicación', value: 'Sincelejo, Sucre' },
];

const emergencyContacts = [
  { name: 'Carlos Rodríguez', relation: 'Esposo', phone: '+57 320 456 7890' },
  { name: 'Marta López', relation: 'Madre', phone: '+57 318 234 5678' },
];

const menuItems = [
  { icon: 'settings-outline' as const, label: 'Configuración', color: Colors.textSecondary },
  { icon: 'help-circle-outline' as const, label: 'Ayuda y soporte', color: Colors.textSecondary },
  { icon: 'document-text-outline' as const, label: 'Términos y condiciones', color: Colors.textSecondary },
  { icon: 'shield-checkmark-outline' as const, label: 'Privacidad', color: Colors.textSecondary },
  { icon: 'log-out-outline' as const, label: 'Cerrar sesión', color: Colors.error },
];

export default function ProfileScreen() {
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(console.error);
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
              <Text style={styles.avatarText}>AR</Text>
            </View>
            <TouchableOpacity style={styles.editAvatar}>
              <Ionicons name="camera" size={14} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>Ana María Rodríguez</Text>
          <Text style={styles.userEmail}>ana.rodriguez@email.com</Text>
        </LinearGradient>

        {/* Curva */}
        <View style={styles.curve} />

        {/* Información personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          {profileFields.map((field, index) => (
            <TouchableOpacity key={index} style={styles.fieldRow} activeOpacity={0.7}>
              <View style={styles.fieldIcon}>
                <Ionicons name={field.icon} size={20} color={Colors.primary} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <Text style={styles.fieldValue}>{field.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
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
                  <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
                </View>
                <View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelation}>{contact.relation}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.callButton} onPress={() => handleCall(contact.phone)}>
                <Ionicons name="call" size={18} color={Colors.textWhite} />
                <Text style={styles.callButtonText}>Llamar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuRow} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, item.color === Colors.error && { color: Colors.error }]}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          ))}
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
  avatarText: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textWhite,
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
  userName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textWhite,
  },
  userEmail: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ef444415',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
});
