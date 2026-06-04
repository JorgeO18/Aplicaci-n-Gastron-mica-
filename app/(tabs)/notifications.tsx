// Pantalla de Notificaciones — persistencia con AsyncStorage
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { Spacing } from "@/constants/spacing";
import { Typography } from "@/constants/typography";

const STORAGE_KEY = "@tastego_notificaciones";

type NotificationType = "promo" | "order" | "route" | "system";

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    title: "¡20% en tu próximo pedido!",
    message: "Usa el código SABOR20 en Sabor & Fuego antes del domingo.",
    type: "promo",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "2",
    title: "Pedido en camino",
    message: "Tu pedido de Pizza Hot llegará en aproximadamente 15 minutos.",
    type: "order",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "3",
    title: "Nueva ruta gastronómica",
    message: "Descubre la ruta «Sabores del Centro» cerca de tu ubicación.",
    type: "route",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "4",
    title: "Actualización de la app",
    message: "Mejoramos la experiencia AR en restaurantes. ¡Pruébala!",
    type: "system",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

async function loadFromStorage(): Promise<AppNotification[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
    return DEFAULT_NOTIFICATIONS;
  }
  try {
    const parsed = JSON.parse(raw) as AppNotification[];
    return Array.isArray(parsed) ? parsed : DEFAULT_NOTIFICATIONS;
  } catch {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
    return DEFAULT_NOTIFICATIONS;
  }
}

async function saveToStorage(items: AppNotification[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
}

function iconForType(type: NotificationType): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case "promo":
      return "pricetag";
    case "order":
      return "restaurant";
    case "route":
      return "map";
    default:
      return "information-circle";
  }
}

function accentForType(type: NotificationType): string {
  switch (type) {
    case "promo":
      return Colors.orange;
    case "order":
      return Colors.primary;
    case "route":
      return Colors.success;
    default:
      return Colors.info;
  }
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const items = await loadFromStorage();
      setNotifications(
        [...items].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const updateList = async (next: AppNotification[]) => {
    const sorted = [...next].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    await saveToStorage(sorted);
    setNotifications(sorted);
  };

  const markAsRead = async (id: string) => {
    const next = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    await updateList(next);
  };

  const markAllAsRead = async () => {
    const next = notifications.map((n) => ({ ...n, read: true }));
    await updateList(next);
  };

  const deleteNotification = (id: string) => {
    Alert.alert("Eliminar notificación", "¿Quieres quitar esta notificación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await updateList(notifications.filter((n) => n.id !== id));
        },
      },
    ]);
  };

  const clearAll = () => {
    if (notifications.length === 0) return;
    Alert.alert(
      "Vaciar bandeja",
      "Se eliminarán todas las notificaciones. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Vaciar",
          style: "destructive",
          onPress: async () => {
            await saveToStorage([]);
            setNotifications([]);
          },
        },
      ],
    );
  };

  const restoreDefaults = async () => {
    await saveToStorage(DEFAULT_NOTIFICATIONS);
    setNotifications(
      [...DEFAULT_NOTIFICATIONS].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.gradientStart]}
        style={[styles.headerGradient, { paddingTop: insets.top + Spacing.md }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textWhite} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Notificaciones</Text>
            <Text style={styles.headerSubtitle}>
              {unreadCount > 0
                ? `${unreadCount} sin leer`
                : "Estás al día"}
            </Text>
          </View>
          {unreadCount > 0 ? (
            <TouchableOpacity
              style={styles.headerAction}
              onPress={markAllAsRead}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-done" size={22} color={Colors.textWhite} />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerActionPlaceholder} />
          )}
        </View>
      </LinearGradient>

      <View style={styles.curve} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centered}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color={Colors.textLight}
            />
          </View>
          <Text style={styles.emptyTitle}>Sin notificaciones</Text>
          <Text style={styles.emptyText}>
            Cuando tengas promociones, pedidos o rutas nuevas, aparecerán aquí.
          </Text>
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={restoreDefaults}
            activeOpacity={0.8}
          >
            <Text style={styles.restoreButtonText}>Restaurar ejemplos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {notifications.map((item) => {
            const accent = accentForType(item.type);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, !item.read && styles.cardUnread]}
                activeOpacity={0.85}
                onPress={() => markAsRead(item.id)}
                onLongPress={() => deleteNotification(item.id)}
              >
                <View
                  style={[
                    styles.cardIcon,
                    { backgroundColor: accent + "18" },
                  ]}
                >
                  <Ionicons
                    name={iconForType(item.type)}
                    size={22}
                    color={accent}
                  />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardTitleRow}>
                    <Text
                      style={[
                        styles.cardTitle,
                        !item.read && styles.cardTitleUnread,
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {!item.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.cardMessage} numberOfLines={2}>
                    {item.message}
                  </Text>
                  <Text style={styles.cardTime}>
                    {formatRelativeTime(item.createdAt)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteNotification(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={Colors.textLight}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={styles.clearAllBtn}
            onPress={clearAll}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={18} color={Colors.primary} />
            <Text style={styles.clearAllText}>Vaciar todas</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitles: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textWhite,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerActionPlaceholder: {
    width: 40,
  },
  curve: {
    height: 24,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xxl,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.backgroundGray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  restoreButton: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.full,
    backgroundColor: Colors.primary + "12",
  },
  restoreButtonText: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.card,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardUnread: {
    borderColor: Colors.primary + "35",
    backgroundColor: Colors.primary + "06",
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  cardBody: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  cardTitleUnread: {
    fontWeight: Typography.weights.bold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  cardMessage: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  cardTime: {
    fontSize: Typography.sizes.xs,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  clearAllText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semiBold,
    color: Colors.primary,
  },
});
