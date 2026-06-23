import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Defs, Path, Rect, Stop, Svg, LinearGradient as SvgGradient } from 'react-native-svg';

const { width } = Dimensions.get('window');

function MetricCard({ icon, title, value, increment, variantColor }: any) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.iconBox, { backgroundColor: variantColor + '20' }]}>
        <Ionicons name={icon} size={24} color={variantColor} />
      </View>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <View style={styles.incrementRow}>
        <Ionicons name="trending-up-outline" size={14} color="#4CAF50" />
        <Text style={styles.incrementText}>{increment}</Text>
      </View>
    </View>
  );
}

function AreaChartLlamativa({ colorBase }: { colorBase: string }) {
  const SvgWidth = width - Spacing.xl * 2 - 40;
  return (
    <View style={styles.chartContainer}>
      <Svg height="140" width={SvgWidth}>
        <Defs>
          <SvgGradient id="gradVisitas" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colorBase} stopOpacity="0.4" />
            <Stop offset="1" stopColor={colorBase} stopOpacity="0.0" />
          </SvgGradient>
        </Defs>
        <Path
          d={`M 0 100 Q 40 40, ${SvgWidth * 0.3} 80 T ${SvgWidth * 0.6} 50 T ${SvgWidth} 60`}
          fill="none"
          stroke={colorBase}
          strokeWidth="4"
        />
        <Path
          d={`M 0 100 Q 40 40, ${SvgWidth * 0.3} 80 T ${SvgWidth * 0.6} 50 T ${SvgWidth} 60 L ${SvgWidth} 140 L 0 140 Z`}
          fill="url(#gradVisitas)"
        />
      </Svg>
    </View>
  );
}

function BarChartLlamativa() {
  const bars = [30, 80, 50, 90, 60, 110, 80, 50];
  const barWidth = 12;
  const padding = 40;
  const SvgWidth = width - Spacing.xl * 2 - padding;
  const spacing = (SvgWidth - (bars.length * barWidth)) / (bars.length + 1);

  return (
    <View style={styles.chartContainer}>
      <Svg height="140" width={SvgWidth}>
        {bars.map((val, i) => {
          const isMax = val >= 100;
          return (
            <Rect
              key={i}
              x={spacing + i * (barWidth + spacing)}
              y={140 - val}
              width={barWidth}
              height={val}
              fill={isMax ? Colors.primary : Colors.primary + '60'}
              rx={6}
            />
          );
        })}
      </Svg>
    </View>
  );
}

export default function RestaurantHomeScreen() {
  const [platos, setPlatos] = useState<any[]>([]);
  const [nombreRestaurante, setNombreRestaurante] = useState("Restaurante");
  const [planActual, setPlanActual] = useState<string | null>(null);

  // Estados para edición
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPlato, setEditingPlato] = useState<any>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editFotos, setEditFotos] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchSession = async () => {
        const stored = await AsyncStorage.getItem('@sesion_restaurante');
        if (stored) {
          const p = JSON.parse(stored);
          setNombreRestaurante(p.nombre || "Restaurante");
        }
        const planData = await AsyncStorage.getItem('@plan_restaurante');
        if (planData) {
          const plan = JSON.parse(planData);
          setPlanActual(plan.nombre || null);
        } else {
          setPlanActual(null);
        }
      };

      const cargarPlatos = async () => {
        try {
          const almacenados = await AsyncStorage.getItem('@platos_restaurante');
          if (almacenados) {
            setPlatos(JSON.parse(almacenados).reverse());
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchSession();
      cargarPlatos();
    }, [])
  );

  const handleDeletePlato = async (id: string) => {
    Alert.alert(
      "Eliminar Plato",
      "¿Estás seguro de que quieres eliminar este plato? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const almacenados = await AsyncStorage.getItem('@platos_restaurante');
              if (almacenados) {
                const listado = JSON.parse(almacenados);
                const nuevoListado = listado.filter((p: any) => p.id !== id);
                await AsyncStorage.setItem('@platos_restaurante', JSON.stringify(nuevoListado));
                setPlatos(nuevoListado.reverse());
              }
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "No se pudo eliminar el plato.");
            }
          }
        }
      ]
    );
  };

  const handleEditPlato = (plato: any) => {
    setEditingPlato(plato);
    setEditNombre(plato.nombre);
    setEditDescripcion(plato.descripcion);
    // Manejar compatibilidad con datos viejos
    setEditFotos(plato.fotos || (plato.foto ? [plato.foto] : []));
    setIsEditModalVisible(true);
  };

  const handleSubirFotoEdicion = async () => {
    if (editFotos.length >= 2) {
      Alert.alert("Límite", "Máximo 2 fotos permitidas.");
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permisos", "Necesitamos acceso a tu galería.");
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
        setEditFotos([...editFotos, result.assets[0].uri]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveEdit = async () => {
    if (!editNombre.trim() || !editDescripcion.trim()) {
      Alert.alert("Error", "El nombre y la descripción no pueden estar vacíos.");
      return;
    }

    try {
      const almacenados = await AsyncStorage.getItem('@platos_restaurante');
      if (almacenados) {
        const listado = JSON.parse(almacenados);
        const index = listado.findIndex((p: any) => p.id === editingPlato.id);
        if (index !== -1) {
          listado[index] = {
            ...listado[index],
            nombre: editNombre,
            descripcion: editDescripcion,
            fotos: editFotos,
            foto: editFotos.length > 0 ? editFotos[0] : null, // Mantener compatibilidad por si a caso
          };
          await AsyncStorage.setItem('@platos_restaurante', JSON.stringify(listado));
          setPlatos(listado.reverse());
          setIsEditModalVisible(false);
          Alert.alert("Éxito", "Plato actualizado correctamente.");
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo actualizar el plato.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* Cabezal Premium con Gradient */}
        <LinearGradient
          colors={[Colors.primary, Colors.gradientStart]}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greetingHeader}>¡Hola, {nombreRestaurante}! 👋</Text>
              <Text style={styles.subtitleHeader}>Aquí está el resumen de hoy</Text>
              <View style={styles.planBadge}>
                <Ionicons name="star" size={12} color={Colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.planBadgeText}>
                  Plan: {planActual ?? 'Gratuito (2 platos)'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notifButtonHeader}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.curve} />

        <View style={styles.scrollContent}>
          {/* Header Metrics */}
          <View style={styles.metricsRow}>
            <MetricCard icon="eye" title="Visitas" value="1,248" increment="12%" variantColor={Colors.orange} />
            <MetricCard icon="cart" title="Pedidos" value="356" increment="8%" variantColor={Colors.primaryDark} />
            <MetricCard icon="star" title="Calificación" value="4.6" increment="5%" variantColor="#F5B041" />
          </View>

          {/* Gráficas Llamativas */}
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Flujo de Visitas</Text>
            <View style={styles.chartBoxWrapper}>
              <AreaChartLlamativa colorBase={Colors.orange} />
            </View>
          </View>

          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Rendimiento de Pedidos</Text>
            <View style={styles.chartBoxWrapper}>
              <BarChartLlamativa />
            </View>
          </View>

          <View style={styles.sectionMargin}>
            <Text style={styles.chartTitle}>Tus Platos Activos</Text>
            {platos.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="fast-food-outline" size={40} color={Colors.textLight} />
                <Text style={styles.noPlatesText}>Aún no has agregado platos a tu menú.</Text>
              </View>
            ) : (
              platos.map((plato) => {
                const displayFotos = plato.fotos || (plato.foto ? [plato.foto] : []);
                return (
                  <View key={plato.id} style={styles.dishCard}>
                    <View style={styles.dishImagesContainer}>
                      {displayFotos.length > 0 ? (
                        displayFotos.map((f: string, i: number) => (
                          <Image
                            key={i}
                            source={{ uri: f }}
                            style={[
                              styles.dishImage,
                              displayFotos.length === 2 ? { width: 40, height: 75, marginRight: 2 } : { width: 75, height: 75 }
                            ]}
                          />
                        ))
                      ) : (
                        <View style={styles.dishImagePlaceholder}>
                          <Ionicons name="image-outline" size={24} color={Colors.textLight} />
                        </View>
                      )}
                    </View>
                    <View style={styles.dishInfo}>
                      <Text style={styles.dishName}>{plato.nombre}</Text>
                      <Text style={styles.dishDesc} numberOfLines={2}>
                        {plato.descripcion}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.manageButton} onPress={() => handleEditPlato(plato)}>
                      <Ionicons name="pencil" size={18} color={Colors.textWhite} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.manageButton, { backgroundColor: Colors.error, marginRight: 0 }]} 
                      onPress={() => handleDeletePlato(plato.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color={Colors.textWhite} />
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Edición */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Plato</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Nombre del Plato</Text>
              <TextInput
                style={styles.modalInput}
                value={editNombre}
                onChangeText={setEditNombre}
                placeholder="Nombre del plato"
              />

              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                value={editDescripcion}
                onChangeText={setEditDescripcion}
                placeholder="Descripción del plato"
                multiline
                numberOfLines={4}
              />

              <Text style={styles.inputLabel}>Fotos (Máx 2)</Text>
              <View style={styles.editFotosRow}>
                {[0, 1].map((idx) => {
                  const hasPhoto = idx < editFotos.length;
                  return (
                    <View key={idx} style={styles.editPhotoBox}>
                      {hasPhoto ? (
                        <View style={{ width: '100%', height: '100%' }}>
                          <Image source={{ uri: editFotos[idx] }} style={styles.editPhotoImg} />
                          <TouchableOpacity
                            style={styles.removePhotoBadgeSmall}
                            onPress={() => setEditFotos(editFotos.filter((_, i) => i !== idx))}
                          >
                            <Ionicons name="close-circle" size={18} color={Colors.error} />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity style={styles.addPhotoIcon} onPress={handleSubirFotoEdicion}>
                          <Ionicons name="add" size={24} color={Colors.textLight} />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>

              <TouchableOpacity style={styles.saveEditButton} onPress={handleSaveEdit}>
                <Text style={styles.saveEditButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelEditButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelEditButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
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
    paddingTop: 65,
    paddingBottom: 40,
    paddingHorizontal: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingHeader: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textWhite,
  },
  subtitleHeader: {
    fontSize: Typography.sizes.md,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  planBadgeText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
  },
  notifButtonHeader: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.textWhite,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  notifBadge: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.textWhite,
  },
  curve: {
    height: 24,
    backgroundColor: Colors.background,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
    marginTop: Spacing.sm,
  },
  metricCard: {
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    width: '31%',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metricTitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: '600',
    textAlign: 'center'
  },
  metricValue: {
    fontSize: 19,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  incrementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incrementText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  chartSection: {
    marginBottom: Spacing.xxl,
  },
  chartTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  chartBoxWrapper: {
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.primary + '15',
    height: 170,
    alignItems: 'center',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  sectionMargin: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  emptyStateContainer: {
    backgroundColor: Colors.primary + '0A',
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '20',
    borderStyle: 'dashed',
  },
  noPlatesText: {
    color: Colors.primaryDark,
    fontSize: Typography.sizes.md,
    textAlign: 'center',
    marginTop: Spacing.md,
    fontWeight: '500',
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  dishImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'center',
  },
  dishImage: {
    borderRadius: Spacing.borderRadius.lg,
  },
  dishImagePlaceholder: {
    width: 75,
    height: 75,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dishInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.xs,
  },
  dishName: {
    fontSize: Typography.sizes.md,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dishDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  manageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: Spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginLeft: 4,
  },
  modalInput: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveEditButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.xl,
    alignItems: 'center',
    marginTop: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  saveEditButtonText: {
    color: Colors.textWhite,
    fontSize: Typography.sizes.md,
    fontWeight: 'bold',
  },
  cancelEditButton: {
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  cancelEditButtonText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.md,
  },
  editFotosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  editPhotoBox: {
    width: '48%',
    height: 100,
    backgroundColor: Colors.backgroundGray,
    borderRadius: Spacing.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  editPhotoImg: {
    width: '100%',
    height: '100%',
  },
  addPhotoIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoBadgeSmall: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'white',
    borderRadius: 9,
  },
});
