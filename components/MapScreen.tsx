import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Animated,
} from "react-native";
import { WebView } from "react-native-webview";

import { useLocation } from "../hooks/useLocation";
import { useRestaurants, Restaurant } from "../hooks/useRestaurants";
import { useRoute } from "../hooks/useRoute";
import { useBaseDeDatos } from "../hooks/dataBase";


const COLORS = {
  primary: "#1F4E79",
  accent: "#2E75B6",
  light: "#D6E4F0",
  white: "#FFFFFF",
  gray: "#F2F2F2",
  text: "#1A1A2E",
  subtext: "#666666",
  danger: "#C0392B",
} as const;

// Genera el HTML completo de Leaflet con los datos inyectados
function buildLeafletHTML(
  userLat: number,
  userLon: number,
  restaurants: Restaurant[],
  routeCoords: { latitude: number; longitude: number }[],
): string {
  const restaurantsJSON = JSON.stringify(
    restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      lat: r.latitude,
      lon: r.longitude,
      cuisine: r.cuisine,
      address: r.address,
      phone: r.phone,
    })),
  );

  const routeJSON = JSON.stringify(
    routeCoords.map((c) => [c.latitude, c.longitude]),
  );

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
    .user-marker {
      width: 20px; height: 20px;
      background: #1F4E79; border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    }
    .restaurant-marker {
      width: 32px; height: 32px;
      background: white; border: 2px solid #C0392B;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    .restaurant-marker.selected {
      border-color: #2E75B6;
      background: #D6E4F0;
      transform: scale(1.2);
    }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  var userLat = ${userLat};
  var userLon = ${userLon};
  var restaurants = ${restaurantsJSON};
  var routeCoords = ${routeJSON};

  // Inicializar mapa centrado en el usuario
  var map = L.map('map', { zoomControl: true }).setView([userLat, userLon], 15);

  // Tiles de OpenStreetMap — sin API key
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Marcador del usuario
  var userIcon = L.divIcon({ className: '', html: '<div class="user-marker"></div>', iconSize: [20,20], iconAnchor: [10,10] });
  L.marker([userLat, userLon], { icon: userIcon }).addTo(map).bindPopup('📍 Tu ubicación');

  // Marcadores de restaurantes
  restaurants.forEach(function(r) {
    var icon = L.divIcon({
      className: '',
      html: '<div class="restaurant-marker" id="marker-' + r.id + '">🍽️</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    var marker = L.marker([r.lat, r.lon], { icon: icon }).addTo(map);
    marker.on('click', function() {
      // Enviar evento al React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'RESTAURANT_SELECTED',
        restaurant: r
      }));
      // Resaltar marcador seleccionado
      document.querySelectorAll('.restaurant-marker').forEach(function(el) {
        el.classList.remove('selected');
      });
      var el = document.getElementById('marker-' + r.id);
      if (el) el.classList.add('selected');
    });
  });

  // Dibujar ruta si hay coordenadas
  var routeLayer = null;
  function drawRoute(coords) {
    if (routeLayer) map.removeLayer(routeLayer);
    if (!coords || coords.length === 0) return;
    routeLayer = L.polyline(coords, {
      color: '#2E75B6',
      weight: 5,
      opacity: 0.85,
      lineJoin: 'round'
    }).addTo(map);
    map.fitBounds(routeLayer.getBounds(), { padding: [60, 60] });
  }

  if (routeCoords.length > 0) drawRoute(routeCoords);

  // Escuchar mensajes desde React Native
  document.addEventListener('message', function(e) { handleMessage(e.data); });
  window.addEventListener('message', function(e) { handleMessage(e.data); });

  function handleMessage(data) {
    try {
      var msg = JSON.parse(data);
      if (msg.type === 'DRAW_ROUTE') drawRoute(msg.coords);
      if (msg.type === 'CLEAR_ROUTE') { if (routeLayer) map.removeLayer(routeLayer); routeLayer = null; }
      if (msg.type === 'CENTER_USER') map.setView([userLat, userLon], 15);
    } catch(e) {}
  }
</script>
</body>
</html>
  `;
}


export default function MapScreen({
  resId,
}: {
  resId: number;
}): React.JSX.Element {
  const webViewRef = useRef<WebView>(null);
  const { location, error: locError, loading: locLoading } = useLocation();
  
  const {
    routeCoords,
    routeInfo,
    loading: routeLoading,
    error: routeError,
    fetchRoute,
    clearRoute,
  } = useRoute();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [panelAnim] = useState(new Animated.Value(0));
  const [mapReady, setMapReady] = useState(false);

  const { db, isReady, } = useBaseDeDatos();
  const [restaurante, setRestaurante] = useState<Restaurant[]>([]);
 

  useEffect(() => {
    const iniciarBD = async () => {
      if (!isReady || !db) return;
      const result = await db.getAllAsync<Restaurant>(`
    SELECT 
      id_restaurante  AS id,
      nombre          AS name,
      descripcion     AS description,
      tipo_comida     AS cuisine,
      direccion       AS address,
      ciudad,
      latitud         AS latitude,
      longitud        AS longitude,
      imagen_url      AS image,
      telefono        AS phone,
      horario         AS openingHours,
      fuente
    FROM restaurantes
  `);
      setRestaurante(result);

      
    };
    iniciarBD();
  }, [db]);

  useEffect(() => {
    
    if (restaurante.length === 0) return;
    if (!location) return;
    try {
      
      // Buscar por id, no por índice
      const defaultRestaurant = restaurante.find((r) => r.id === String(resId));
      console.log(resId)
      if (!defaultRestaurant) return;
  
      
      const currentLocation = location;
      if (!currentLocation) return;
  
      setSelectedRestaurant(defaultRestaurant);
      
  
      fetchRoute(currentLocation, {
        latitude: defaultRestaurant.latitude,
        longitude: defaultRestaurant.longitude,
      });
    } catch (error) {
      console.log(error)
    }

  }, [restaurante, location]);

   // Enviar ruta al WebView cuando se calcula
  useEffect(() => {
    if (routeCoords.length > 0 && webViewRef.current) {
      const coords = routeCoords.map((c) => [c.latitude, c.longitude]);
      webViewRef.current.postMessage(
        JSON.stringify({ type: "DRAW_ROUTE", coords }),
      );
    }
    
  }, [routeCoords]);

  useEffect(() => {
    Animated.spring(panelAnim, {
      toValue: selectedRestaurant ? 1 : 0,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  }, [selectedRestaurant]);

 

  const handleWebViewMessage = (event: any): void => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "RESTAURANT_SELECTED") {
        const r = msg.restaurant;
        setSelectedRestaurant({
          id: r.id,
          name: r.name,
          description: r.description,
          cuisine: r.cuisine,
          latitude: r.lat,
          longitude: r.lon,
          image: r.image,
          address: r.address,
          phone: r.phone,
          openingHours: null,
        });
        clearRoute();
      }
    } catch (e) {}
  };

  const handleGetRoute = (): void => {
    if (location && selectedRestaurant) {
      fetchRoute(location, {
        latitude: selectedRestaurant.latitude,
        longitude: selectedRestaurant.longitude,
      });
    }
  };

  const handleClose = (): void => {
    setSelectedRestaurant(null);
    clearRoute();
    webViewRef.current?.postMessage(JSON.stringify({ type: "CLEAR_ROUTE" }));
    webViewRef.current?.postMessage(JSON.stringify({ type: "CENTER_USER" }));
  };

  if (locLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Obteniendo tu ubicación...</Text>
      </View>
    );
  }

  if (locError || !location) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>📍</Text>
        <Text style={styles.errorTitle}>Ubicación no disponible</Text>
        <Text style={styles.errorText}>{locError}</Text>
      </View>
    );
  }

  const htmlContent = buildLeafletHTML(
    location.latitude,
    location.longitude,
    selectedRestaurant ? [selectedRestaurant] : [],
    routeCoords,
  );

  return (
    <View style={styles.container}>
      {/* Mapa Leaflet en WebView */}
      <WebView
        ref={webViewRef}
        style={styles.map}
        source={{ html: htmlContent }}
        onMessage={handleWebViewMessage}
        onLoad={() => setMapReady(true)}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        mixedContentMode="always"
      />

      {/* Cargando mapa */}
      {!mapReady && (
        <View style={styles.mapLoading}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>Cargando mapa...</Text>
        </View>
      )}

      {/* Panel inferior */}
      <Animated.View
        style={[
          styles.panel,
          {
            transform: [
              {
                translateY: panelAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ],
          },
        ]}
      >
        {selectedRestaurant && (
          <>
            <View style={styles.panelHandle} />
            <View style={styles.panelHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.panelName}>{selectedRestaurant.name}</Text>
                {selectedRestaurant.cuisine && (
                  <Text style={styles.panelCuisine}>
                    🍴 {selectedRestaurant.cuisine}
                  </Text>
                )}
                {selectedRestaurant.address && (
                  <Text style={styles.panelAddress}>
                    📍 {selectedRestaurant.address}
                  </Text>
                )}
                {selectedRestaurant.phone && (
                  <Text style={styles.panelAddress}>
                    📞 {selectedRestaurant.phone}
                  </Text>
                )}
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {routeInfo && (
              <View style={styles.routeInfo}>
                <View style={styles.routeInfoItem}>
                  <Text style={styles.routeInfoValue}>
                    {routeInfo.distance}
                  </Text>
                  <Text style={styles.routeInfoLabel}>Distancia</Text>
                </View>
                <View style={styles.routeInfoDivider} />
                <View style={styles.routeInfoItem}>
                  <Text style={styles.routeInfoValue}>
                    {routeInfo.duration}
                  </Text>
                  <Text style={styles.routeInfoLabel}>Tiempo est.</Text>
                </View>
              </View>
            )}

            {routeError && <Text style={styles.routeError}>{routeError}</Text>}

            <TouchableOpacity
              style={[styles.routeBtn, routeLoading && styles.routeBtnDisabled]}
              onPress={handleGetRoute}
              disabled={routeLoading}
            >
              {routeLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.routeBtnText}>
                  {routeCoords.length > 0
                    ? "🔄 Recalcular ruta"
                    : "🗺️ Ver ruta más corta"}
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: COLORS.white,
  },
  mapLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.subtext,
    fontWeight: "500",
  },
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    color: COLORS.subtext,
    textAlign: "center",
    lineHeight: 22,
  },
  badge: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeText: { color: COLORS.white, fontSize: 14, fontWeight: "600" },
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  panelName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  panelCuisine: {
    fontSize: 13,
    color: COLORS.accent,
    marginBottom: 2,
    textTransform: "capitalize",
  },
  panelAddress: { fontSize: 13, color: COLORS.subtext, marginTop: 2 },
  closeBtn: {
    backgroundColor: COLORS.gray,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  closeBtnText: { fontSize: 14, color: COLORS.subtext, fontWeight: "600" },
  routeInfo: {
    flexDirection: "row",
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    justifyContent: "space-around",
    alignItems: "center",
  },
  routeInfoItem: { alignItems: "center" },
  routeInfoValue: { fontSize: 18, fontWeight: "700", color: COLORS.primary },
  routeInfoLabel: { fontSize: 12, color: COLORS.subtext, marginTop: 2 },
  routeInfoDivider: { width: 1, height: 32, backgroundColor: "#C0D8EF" },
  routeError: {
    color: COLORS.danger,
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
  },
  routeBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  routeBtnDisabled: { opacity: 0.6 },
  routeBtnText: { color: COLORS.white, fontSize: 15, fontWeight: "700" },
});
