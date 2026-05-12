import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Linking } from 'react-native';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { 
  MapPin, Camera, Edit, AlertTriangle, ChevronRight, 
  Phone, Mail, Activity, FileText, Upload, Shield, LogOut
} from 'lucide-react-native';
import { GastronomicColors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const userData = {
  name: 'Ana María Rodríguez',
  email: 'ana.rodriguez@email.com',
  phone: '+57 315 234 5678',
  bloodType: 'O+',
  location: 'Sincelejo, Sucre',
  memberSince: 'Febrero 2026',
  stats: {
    routesCompleted: 8,
    placesVisited: 23,
    achievements: 12,
    points: 850,
  },
  emergencyContacts: [
    { name: 'Carlos Rodríguez', relation: 'Esposo', phone: '+57 320 456 7890' },
    { name: 'Marta López', relation: 'Madre', phone: '+57 318 234 5678' },
  ],
  insurance: {
    provider: 'Seguros Bolívar',
    policy: 'POL-2024-45678',
    emergency: '018000 123 456',
  },
  documents: {
    id: true,
    insurance: true,
    medicalHistory: false,
  },
};

const emergencyServices = [
  { id: 'medical', name: 'Centro Médico', phone: '123', color: '#ef4444', icon: '🚑' },
  { id: 'police', name: 'Policía', phone: '112', color: '#3b82f6', icon: '🚓' },
  { id: 'fire', name: 'Bomberos', phone: '119', color: '#f97316', icon: '🚒' },
  { id: 'tow', name: 'Grúa', phone: '+57 315 999 9999', color: '#ca8a04', icon: '🛻' },
];

export default function PerfilScreen() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);

  const handleEmergencyCall = (service: typeof emergencyServices[0]) => {
    setSelectedEmergency(service.id);
    setTimeout(() => {
      setSelectedEmergency(null);
      setShowEmergencyModal(false);
      Linking.openURL(`tel:${service.phone}`).catch(console.error);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Portada del Encabezado */}
        <LinearGradient
          colors={['#E63946', '#d32f3c']}
          style={styles.headerCover}
        >
          {/* Usamos un overlay para dar textura */}
          <View style={styles.coverOverlay} />
        </LinearGradient>

        {/* Tarjeta de Perfil */}
        <View style={styles.profileCardWrapper}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.profileCard}>
            
            <View style={styles.profileHeaderRow}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#E63946', '#d32f3c']}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarInitials}>AM</Text>
                </LinearGradient>
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera color={GastronomicColors.primary} size={14} />
                </TouchableOpacity>
              </View>

              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{userData.name}</Text>
                  <TouchableOpacity style={styles.editButton}>
                    <Edit color={GastronomicColors.textLight} size={14} />
                  </TouchableOpacity>
                </View>
                <View style={styles.locationRow}>
                  <MapPin color={GastronomicColors.textLight} size={12} />
                  <Text style={styles.locationText}>{userData.location}</Text>
                </View>
                <Text style={styles.memberText}>Miembro desde {userData.memberSince}</Text>
              </View>
            </View>

            {/* Estadísticas */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{userData.stats.routesCompleted}</Text>
                <Text style={styles.statLabel}>Rutas</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{userData.stats.placesVisited}</Text>
                <Text style={styles.statLabel}>Lugares</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{userData.stats.achievements}</Text>
                <Text style={styles.statLabel}>Logros</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{userData.stats.points}</Text>
                <Text style={styles.statLabel}>Puntos</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Botón de Emergencia */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <TouchableOpacity onPress={() => setShowEmergencyModal(true)}>
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              style={styles.emergencyButton}
            >
              <View style={styles.emergencyContent}>
                <AlertTriangle color="#FFF" size={32} />
                <View>
                  <Text style={styles.emergencyTitle}>Botón de Emergencia</Text>
                  <Text style={styles.emergencySubtitle}>Ayuda inmediata 24/7</Text>
                </View>
              </View>
              <ChevronRight color="#FFF" size={24} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Información Personal */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Phone color={GastronomicColors.primary} size={20} />
              <View style={styles.infoTexts}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{userData.phone}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Mail color={GastronomicColors.primary} size={20} />
              <View style={styles.infoTexts}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Activity color={GastronomicColors.primary} size={20} />
              <View style={styles.infoTexts}>
                <Text style={styles.infoLabel}>Tipo de Sangre</Text>
                <Text style={[styles.infoValue, { color: GastronomicColors.primary }]}>{userData.bloodType}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Contactos de Emergencia */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contactos de Emergencia</Text>
            <TouchableOpacity><Text style={styles.addButtonText}>+ Agregar</Text></TouchableOpacity>
          </View>
          {userData.emergencyContacts.map((contact, index) => (
            <View key={index} style={styles.contactItem}>
              <View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>{contact.relation}</Text>
              </View>
              <TouchableOpacity style={styles.callButton} onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
                <Text style={styles.callButtonText}>Llamar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>

        {/* Información del Seguro */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Seguro Médico</Text>
          <View style={styles.insuranceCard}>
            <View style={styles.insuranceHeader}>
              <Shield color="#2563eb" size={24} />
              <View>
                <Text style={styles.insuranceProvider}>{userData.insurance.provider}</Text>
                <Text style={styles.insurancePolicy}>Póliza: {userData.insurance.policy}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.insuranceCallButton} 
              onPress={() => Linking.openURL(`tel:${userData.insurance.emergency}`)}
            >
              <Phone color="#FFF" size={16} />
              <Text style={styles.insuranceCallText}>Línea de Emergencia</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Documentos */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Documentos Importantes</Text>
          <View style={styles.infoList}>
            <View style={styles.documentItem}>
              <View style={styles.documentInfo}>
                <FileText color={GastronomicColors.primary} size={20} />
                <View>
                  <Text style={styles.documentName}>Cédula de Identidad</Text>
                  <Text style={styles.documentStatus}>{userData.documents.id ? '✓ Cargado' : 'No cargado'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.documentAction}>
                {userData.documents.id ? <Edit color={GastronomicColors.textLight} size={16} /> : <Upload color={GastronomicColors.primary} size={16} />}
              </TouchableOpacity>
            </View>

            <View style={styles.documentItem}>
              <View style={styles.documentInfo}>
                <FileText color={GastronomicColors.primary} size={20} />
                <View>
                  <Text style={styles.documentName}>Tarjeta Seguro Médico</Text>
                  <Text style={styles.documentStatus}>{userData.documents.insurance ? '✓ Cargado' : 'No cargado'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.documentAction}>
                {userData.documents.insurance ? <Edit color={GastronomicColors.textLight} size={16} /> : <Upload color={GastronomicColors.primary} size={16} />}
              </TouchableOpacity>
            </View>

            <View style={styles.documentItem}>
              <View style={styles.documentInfo}>
                <FileText color={GastronomicColors.primary} size={20} />
                <View>
                  <Text style={styles.documentName}>Historia Médica</Text>
                  <Text style={styles.documentStatus}>{userData.documents.medicalHistory ? '✓ Cargado' : 'No cargado'}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.documentAction}>
                <Upload color={GastronomicColors.primary} size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Cerrar Sesión */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut color={GastronomicColors.textLight} size={20} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Modal de Emergencia */}
      <Modal
        visible={showEmergencyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEmergencyModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowEmergencyModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            
            <Text style={styles.modalTitle}>¿Qué tipo de ayuda necesitas?</Text>
            <Text style={styles.modalSubtitle}>Selecciona el servicio de emergencia</Text>

            <View style={styles.servicesGrid}>
              {emergencyServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[styles.serviceButton, { backgroundColor: service.color }]}
                  onPress={() => handleEmergencyCall(service)}
                  disabled={selectedEmergency !== null}
                >
                  <Text style={styles.serviceIcon}>{service.icon}</Text>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePhone}>{service.phone}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.modalCancelButton} 
              onPress={() => setShowEmergencyModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAFA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerCover: {
    height: 140,
    width: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    backgroundColor: '#000',
  },
  profileCardWrapper: {
    paddingHorizontal: 20,
    marginTop: -60,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GastronomicColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarInitials: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 6,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
  },
  editButton: {
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: GastronomicColors.textLight,
  },
  memberText: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GastronomicColors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  emergencyTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emergencySubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    marginBottom: 12,
  },
  addButtonText: {
    color: GastronomicColors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  infoList: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoTexts: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: GastronomicColors.textDark,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  contactName: {
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    fontSize: 16,
  },
  contactRelation: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  callButton: {
    backgroundColor: GastronomicColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  insuranceCard: {
    backgroundColor: '#eff6ff', // blue-50
    borderWidth: 2,
    borderColor: '#bfdbfe', // blue-200
    borderRadius: 16,
    padding: 16,
  },
  insuranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  insuranceProvider: {
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    fontSize: 16,
  },
  insurancePolicy: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  insuranceCallButton: {
    backgroundColor: '#2563eb', // blue-600
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  insuranceCallText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  documentName: {
    fontWeight: '500',
    color: GastronomicColors.textDark,
    fontSize: 14,
  },
  documentStatus: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  documentAction: {
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    borderRadius: 16,
  },
  logoutText: {
    fontWeight: '500',
    color: GastronomicColors.textLight,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 400,
  },
  modalHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: GastronomicColors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  serviceButton: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  serviceName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  servicePhone: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  modalCancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    color: GastronomicColors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
