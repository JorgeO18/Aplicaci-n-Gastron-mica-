import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Search, MapPin, Sparkles, Leaf, Tag, TrendingUp, Flame, Gift, ChevronRight, Globe } from 'lucide-react-native';
import { FilterPill } from '@/components/FilterPill';
import { RouteCard } from '@/components/RouteCard';
import { UserStats } from '@/components/UserStats';
import { LiveStats } from '@/components/LiveStats';
import { Testimonial } from '@/components/Testimonial';
import { AirbnbCard } from '@/components/AirbnbCard';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GastronomicColors } from '@/constants/theme';

const filters = [
  { id: 'typical', label: 'Típica Costeña', icon: <Sparkles size={16} color={GastronomicColors.primary} /> },
  { id: 'seafood', label: 'Mariscos', icon: <Leaf size={16} color={GastronomicColors.primary} /> },
  { id: 'beach', label: 'Playa', icon: <MapPin size={16} color={GastronomicColors.primary} /> },
  { id: 'promo', label: 'Ofertas', icon: <Tag size={16} color={GastronomicColors.primary} /> },
  { id: 'popular', label: 'Populares', icon: <TrendingUp size={16} color={GastronomicColors.primary} /> },
  { id: 'new', label: 'Nuevas', icon: <Flame size={16} color={GastronomicColors.primary} /> },
];

const routes = [
  {
    id: '1',
    title: '🔥 Ruta Costeña del Centro',
    description: 'Sincelejo te espera con mote de queso, sancocho de guandú y las mejores arepas de huevo',
    imageUrl: 'https://images.unsplash.com/photo-1644753787071-8933b5daed2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBmb29kJTIwYXJlcGFzfGVufDF8fHx8MTc3MjAyNjgyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '3h',
    stops: 5,
    progress: 0,
    locations: 'Sincelejo',
    specialty: 'Comida Típica',
    discount: null,
    activeUsers: 24,
  },
  {
    id: '2',
    title: '🌊 Paraíso Costero Tolú-Coveñas',
    description: 'Disfruta langosta, pargo frito y cazuela de mariscos frente al mar Caribe',
    imageUrl: 'https://images.unsplash.com/photo-1767252740447-63c764458b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwbG9ic3RlciUyMHNlYWZvb2R8ZW58MXx8fHwxNzcyMDI3MTk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '4h',
    stops: 6,
    progress: 0,
    locations: 'Tolú, Coveñas',
    specialty: 'Mariscos',
    discount: '20%',
    activeUsers: 38,
  },
  {
    id: '3',
    title: '🥘 Sabores Tradicionales',
    description: 'Recorre Sampués y Morroa: enyucado, butifarra, y dulce de papaya con arequipe',
    imageUrl: 'https://images.unsplash.com/photo-1741026079032-7cb660e44bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5jb2NobyUyMGNvbG9tYmlhbiUyMHNvdXB8ZW58MXx8fHwxNzcyMDI2ODI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '3.5h',
    stops: 4,
    progress: 0,
    locations: 'Sampués, Morroa',
    specialty: 'Dulces Típicos',
    discount: null,
    activeUsers: 15,
  },
  {
    id: '4',
    title: '🌅 Atardecer en San Onofre',
    description: 'Pescado fresco, arroz con coco y agua de coco mientras ves el atardecer',
    imageUrl: 'https://images.unsplash.com/photo-1764397576374-7ba65a81d821?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHNlYWZvb2QlMjByZXN0YXVyYW50JTIwc3Vuc2V0fGVufDF8fHx8MTc3MjAyNzE5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '2.5h',
    stops: 3,
    progress: 0,
    locations: 'San Onofre',
    specialty: 'Pescados',
    discount: null,
    activeUsers: 19,
  },
  {
    id: '5',
    title: '🍢 Street Food de Sincelejo',
    description: 'La mejor experiencia callejera: empanadas, carimañolas, y bollo limpio',
    imageUrl: 'https://images.unsplash.com/photo-1759374514091-74aa7d9d073f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBzdHJlZXQlMjBmb29kJTIwdmVuZG9yc3xlbnwxfHx8fDE3NzIwMjcxOTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '2h',
    stops: 7,
    progress: 0,
    locations: 'Sincelejo Centro',
    specialty: 'Comida Callejera',
    discount: '15%',
    activeUsers: 42,
  },
  {
    id: '6',
    title: '🥥 Ruta del Coco',
    description: 'Todo lo que se puede hacer con coco: arroz, cocadas, agua, encocado',
    imageUrl: 'https://images.unsplash.com/photo-1757332051114-ae8c79214cef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNvY29udXQlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzIwMjcxOTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '3h',
    stops: 5,
    progress: 0,
    locations: 'Tolú, Coveñas',
    specialty: 'Especialidad Coco',
    discount: null,
    activeUsers: 28,
  },
];

const achievements = [
  { id: '1', title: 'Primer Paso', icon: <MapPin size={20} color="#FFF" />, earned: true, progress: 100 },
  { id: '2', title: 'Explorador', icon: <Sparkles size={20} color="#FFF" />, earned: true, progress: 100 },
  { id: '3', title: 'Gourmet', icon: <Leaf size={20} color="#FFF" />, earned: false, progress: 60 },
  { id: '4', title: 'Maestro', icon: <Flame size={20} color="#FFF" />, earned: false, progress: 30 },
];

const testimonials = [
  {
    name: 'María Gómez',
    location: 'Bogotá',
    text: 'La ruta de Tolú fue increíble. Los mariscos fresquísimos y la experiencia del atardecer en la playa fue mágica. ¡100% recomendado!',
    rating: 5,
    avatar: 'MG',
  },
  {
    name: 'Carlos Pérez',
    location: 'Medellín',
    text: 'Nunca había probado sancocho de guandú tan auténtico. La app me llevó a lugares que nunca hubiera encontrado solo.',
    rating: 5,
    avatar: 'CP',
  },
  {
    name: 'Ana Rodríguez',
    location: 'Cartagena',
    text: 'Las arepas de huevo en Sincelejo son otro nivel. Cada parada fue una experiencia única. Ya quiero volver!',
    rating: 5,
    avatar: 'AR',
  },
];

const airbnbListings = [
  {
    id: 'air-1',
    title: 'Casa Colonial en el Centro',
    location: 'Sincelejo Centro',
    distance: '500m',
    price: '$85.000',
    rating: 4.9,
    reviews: 127,
    imageUrl: 'https://images.unsplash.com/photo-1679494415048-c2f8d798d992?w=400',
    amenities: ['wifi', 'parking', 'breakfast'],
    hostType: 'Superhost',
  },
  {
    id: 'air-2',
    title: 'Apartamento Vista al Mar',
    location: 'Tolú Playa',
    distance: '200m',
    price: '$120.000',
    rating: 5.0,
    reviews: 89,
    imageUrl: 'https://images.unsplash.com/photo-1675409145919-277c0fc2aa7d?w=400',
    amenities: ['wifi', 'parking'],
    hostType: 'Superhost',
  },
  {
    id: 'air-3',
    title: 'Cabaña Costeña Tradicional',
    location: 'Coveñas',
    distance: '1.2km',
    price: '$95.000',
    rating: 4.8,
    reviews: 64,
    imageUrl: 'https://images.unsplash.com/photo-1679494415048-c2f8d798d992?w=400',
    amenities: ['wifi', 'breakfast'],
    hostType: 'Host',
  },
];

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [filteredRoutes, setFilteredRoutes] = useState(routes);
  const [showSpecialOffer, setShowSpecialOffer] = useState(true);
  const router = useRouter();

  const titleAnim = useSharedValue(0);
  const giftRotate = useSharedValue(0);

  useEffect(() => {
    if (activeFilter === '') {
      setFilteredRoutes(routes);
    } else if (activeFilter === 'promo') {
      setFilteredRoutes(routes.filter(r => r.discount));
    } else if (activeFilter === 'popular') {
      setFilteredRoutes([...routes].sort((a, b) => (b.activeUsers || 0) - (a.activeUsers || 0)));
    } else {
      setFilteredRoutes(routes);
    }
  }, [activeFilter]);

  useEffect(() => {
    titleAnim.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );

    giftRotate.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 500 }),
        withTiming(10, { duration: 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      false
    );
  }, []);

  const animatedTitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleAnim.value }],
  }));

  const animatedGiftStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${giftRotate.value}deg` }],
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* Encabezado */}
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Animated.View style={animatedTitleStyle}>
          <Text style={styles.title}>¡Bienvenido a Sucre! 🌴</Text>
        </Animated.View>
        <Text style={styles.subtitle}>Descubre los sabores auténticos del Caribe</Text>
        
        <View style={styles.liveStatsContainer}>
          <LiveStats activeUsers={127} completedToday={43} />
        </View>
      </Animated.View>

      {/* Oferta Especial */}
      {showSpecialOffer && (
        <Animated.View entering={FadeIn.duration(400)}>
          <LinearGradient
            colors={['#E63946', '#ff4757', '#E63946']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.offerBanner}
          >
            <TouchableOpacity 
              style={styles.closeOfferButton} 
              onPress={() => setShowSpecialOffer(false)}
            >
              <Text style={styles.closeOfferText}>✕</Text>
            </TouchableOpacity>
            
            <View style={styles.offerContent}>
              <Animated.View style={animatedGiftStyle}>
                <Gift color="#FFF" size={40} />
              </Animated.View>
              <View style={styles.offerTextContainer}>
                <Text style={styles.offerTitle}>¡Oferta Limitada!</Text>
                <Text style={styles.offerSubtitle}>20% OFF en rutas costeras este fin de semana</Text>
              </View>
              <ChevronRight color="#FFF" size={24} />
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Estadísticas de Usuario */}
      <UserStats 
        achievements={achievements}
        routesCompleted={2}
        placesVisited={8}
        totalRoutes={6}
      />

      {/* Búsqueda */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, searchFocused && styles.searchInputFocused]}>
          <Search color={searchFocused ? GastronomicColors.primary : GastronomicColors.textLight} size={20} style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar platos, lugares, municipios..."
            placeholderTextColor={GastronomicColors.textLight}
            style={styles.searchInput}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </View>
        {searchFocused && (
          <Animated.View entering={FadeInDown} style={styles.searchSuggestions}>
            <Text style={styles.suggestionsTitle}>Búsquedas populares:</Text>
            <View style={styles.suggestionsRow}>
              {['Sancocho', 'Arepas', 'Mariscos', 'Tolú', 'Pescado frito'].map((term) => (
                <TouchableOpacity key={term} style={styles.suggestionTag}>
                  <Text style={styles.suggestionText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
      </Animated.View>

      {/* Filtros */}
      <Animated.View entering={FadeInDown.duration(500).delay(200)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {filters.map((filter) => (
            <FilterPill
              key={filter.id}
              label={filter.label}
              icon={filter.icon}
              active={activeFilter === filter.id}
              onPress={() => setActiveFilter(activeFilter === filter.id ? '' : filter.id)}
            />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Routes Section Header */}
      <Animated.View entering={FadeIn.duration(500).delay(400)} style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Rutas Gastronómicas</Text>
          <Text style={styles.sectionSubtitle}>6 experiencias únicas en Sucre</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Ver todas</Text>
          <ChevronRight color={GastronomicColors.primary} size={16} />
        </TouchableOpacity>
      </Animated.View>

      {/* Route Cards */}
      <View style={styles.routesContainer}>
        {filteredRoutes.map((route, index) => (
          <Animated.View key={route.id} entering={FadeInDown.duration(500).delay(500 + (index * 100))}>
            <View style={styles.routeWrapper}>
              {route.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{route.discount} OFF</Text>
                </View>
              )}
              {route.activeUsers && route.activeUsers > 30 && (
                <View style={styles.trendingBadge}>
                  <Text style={styles.trendingText}>🔥 Trending</Text>
                </View>
              )}
              <RouteCard 
                {...route} 
                onPress={() => router.push({ pathname: '/detalle/[id]', params: { id: route.id } })} 
              />
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Explore Colombia Banner */}
      <Animated.View entering={FadeInDown.duration(500).delay(700)}>
        <LinearGradient
          colors={['#3b82f6', '#a855f7', '#ec4899']}
          style={styles.colombiaBanner}
        >
          <View style={styles.colombiaBannerHeader}>
            <View>
              <Text style={styles.colombiaFlag}>🇨🇴</Text>
              <Text style={styles.colombiaTitle}>Explora Colombia Completa</Text>
              <Text style={styles.colombiaSubtitle}>32 departamentos llenos de sabor</Text>
            </View>
            <ChevronRight color="#FFF" size={32} />
          </View>

          <View style={styles.colombiaStats}>
            <View style={styles.colombiaStatBox}>
              <Text style={styles.colombiaStatNumber}>45+</Text>
              <Text style={styles.colombiaStatLabel}>Rutas</Text>
            </View>
            <View style={styles.colombiaStatBox}>
              <Text style={styles.colombiaStatNumber}>9</Text>
              <Text style={styles.colombiaStatLabel}>Regiones</Text>
            </View>
            <View style={styles.colombiaStatBox}>
              <Text style={styles.colombiaStatNumber}>300+</Text>
              <Text style={styles.colombiaStatLabel}>Platos</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.colombiaButton}>
            <Globe color="#a855f7" size={20} />
            <Text style={styles.colombiaButtonText}>Descubrir todo Colombia</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      {/* Testimonials */}
      <Animated.View entering={FadeIn.duration(500).delay(800)} style={styles.horizontalSection}>
        <Text style={styles.sectionTitle}>Lo que dicen viajeros</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Airbnb */}
      <Animated.View entering={FadeIn.duration(500).delay(800)} style={styles.horizontalSection}>
        <Text style={styles.sectionTitle}>Alojamientos Populares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {airbnbListings.map((listing, index) => (
            <AirbnbCard key={index} {...listing} />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Final CTA */}
      <Animated.View entering={FadeInDown.duration(500).delay(1000)}>
        <LinearGradient
          colors={['#E63946', '#d32f3c']}
          style={styles.ctaBanner}
        >
          <Sparkles color="#FFF" size={48} style={{ marginBottom: 12 }} />
          <Text style={styles.ctaTitle}>¡Completa tu primera ruta!</Text>
          <Text style={styles.ctaSubtitle}>
            Desbloquea el logro "Explorador de Sucre" y gana descuentos exclusivos
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/agendar')}>
            <Text style={styles.ctaButtonText}>Comenzar Ahora</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAFA',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60, // Espaciado para la barra de estado
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: GastronomicColors.textLight,
    marginBottom: 16,
  },
  liveStatsContainer: {
    marginTop: 8,
  },
  offerBanner: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  closeOfferButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 10,
  },
  closeOfferText: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 'bold',
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  offerSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 12,
  },
  searchContainer: {
    marginBottom: 24,
    zIndex: 10,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GastronomicColors.bgWhite,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  searchInputFocused: {
    borderColor: GastronomicColors.primary,
    shadowColor: GastronomicColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 56,
    color: GastronomicColors.textDark,
    fontSize: 16,
  },
  searchSuggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 8,
    backgroundColor: GastronomicColors.bgWhite,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  suggestionsTitle: {
    fontSize: 12,
    color: GastronomicColors.textLight,
    marginBottom: 8,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionTag: {
    backgroundColor: GastronomicColors.bgGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  suggestionText: {
    fontSize: 12,
    color: GastronomicColors.textDark,
  },
  filtersScroll: {
    gap: 12,
    paddingBottom: 8,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: GastronomicColors.textLight,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: GastronomicColors.primary,
  },
  routesContainer: {
    gap: 24,
    marginBottom: 32,
  },
  routeWrapper: {
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: GastronomicColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  discountText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trendingBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: GastronomicColors.bgWhite,
    borderColor: GastronomicColors.primary,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trendingText: {
    color: GastronomicColors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  colombiaBanner: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  colombiaBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  colombiaFlag: {
    fontSize: 32,
    marginBottom: 8,
  },
  colombiaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  colombiaSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  colombiaStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  colombiaStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  colombiaStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  colombiaStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  colombiaButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  colombiaButtonText: {
    color: '#a855f7',
    fontWeight: 'bold',
    fontSize: 16,
  },
  horizontalSection: {
    marginBottom: 32,
  },
  horizontalScroll: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  ctaBanner: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  ctaButtonText: {
    color: GastronomicColors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
