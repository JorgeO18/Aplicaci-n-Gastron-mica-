import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Pressable, TextInput } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSequence, FadeInDown, FadeIn } from 'react-native-reanimated';
import { ArrowLeft, Star, RotateCw, Info, Flame, Heart, ChevronRight, Search } from 'lucide-react-native';
import { RedButton } from '@/components/RedButton';
import { GastronomicColors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import model from '../../assets/models/Untitled.glb'; //Temporal
import ModelViewer from '../../components/ModelViewer';


const menuItems = [
  {
    id: 1,
    name: 'Sancocho de Guandú',
    description: 'Sopa tradicional costeña con yuca, ñame, plátano y carne',
    price: '$18.000',
    imageUrl: 'https://images.unsplash.com/photo-1741026079032-7cb660e44bad?w=800',
    featured: true,
    spicy: false,
  },
  {
    id: 2,
    name: 'Pescado Frito',
    description: 'Mojarra frita con patacones, ensalada y arroz con coco',
    price: '$25.000',
    imageUrl: 'https://images.unsplash.com/photo-1765265432611-17d3f2da2d5d?w=800',
    featured: true,
    spicy: false,
  },
  {
    id: 3,
    name: 'Arepa de Huevo',
    description: 'Arepa frita rellena de huevo, la especialidad de la casa',
    price: '$5.000',
    imageUrl: 'https://images.unsplash.com/photo-1644753787071-8933b5daed2d?w=800',
    featured: true,
    spicy: false,
  },
  {
    id: 4,
    name: 'Empanadas de Carne',
    description: 'Empanadas crujientes rellenas de carne y papa',
    price: '$2.500',
    imageUrl: 'https://images.unsplash.com/photo-1711989874705-bb85dc205541?w=800',
    featured: false,
    spicy: true,
  },
  {
    id: 5,
    name: 'Jugo Natural',
    description: 'Jugos de fruta tropical: corozo, tamarindo, maracuyá',
    price: '$6.000',
    imageUrl: 'https://images.unsplash.com/photo-1665582513044-376da77ebec0?w=800',
    featured: false,
    spicy: false,
  },
  {
    id: 6,
    name: 'Bandeja Paisa',
    description: 'Frijoles, chicharrón, carne, huevo, arroz, plátano y aguacate',
    price: '$30.000',
    imageUrl: 'https://images.unsplash.com/photo-1723693407562-bb4fcae76797?w=800',
    featured: false,
    spicy: false,
  },
];

const restaurant = {
  name: 'Donde Juancho',
  rating: 4.9,
  reviews: 286,
  cuisine: 'Comida Típica Costeña',
  location: 'Sincelejo, Sucre',
};

export default function MenuScreen() {
  const router = useRouter();
  const [selectedDish, setSelectedDish] = useState(menuItems[0]);
  const [showInfo, setShowInfo] = useState(false);
  const [liked, setLiked] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const rotationY = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleRotate = () => {
    scale.value = withSequence(withTiming(1.1, { duration: 250 }), withTiming(1, { duration: 250 }));
    rotationY.value = withTiming(rotationY.value + 360, { duration: 800 });
  };

  const handleDishSelect = (dish: typeof menuItems[0]) => {
    setSelectedDish(dish);
    rotationY.value = 0; // reiniciar
    setShowInfo(false);
  };

  const animatedDishStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 500 },
      { rotateY: `${rotationY.value}deg` },
      { scale: scale.value }
    ]
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#1D1D1D" size={24} />
        </TouchableOpacity>
        

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
              {['Donde Juancho', 'centro', 'San Onofre', 'guacari', 'viva'].map((term) => (
                <TouchableOpacity key={term} style={styles.suggestionTag}>
                  <Text style={styles.suggestionText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
      </Animated.View>


        <View style={styles.headerInfo}>
          <View>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
            <Text style={styles.locationText}>📍 {restaurant.location}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Star color={GastronomicColors.primary} fill={GastronomicColors.primary} size={14} />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
            <Text style={styles.reviewsText}>({restaurant.reviews})</Text>
          </View>
        </View>
      </View>

      {/* Sección del Visor 3D */}
      <View style={styles.viewerSection}>
        <View style={styles.viewerContainer}>
          <View style={styles.viewerHeader}>
            <View>
              <Text style={styles.viewerTitle}>Vista 3D Interactiva</Text>
              <Text style={styles.viewerSubtitle}>Toca para explorar el plato</Text>
            </View>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>🆕 NUEVO</Text>
            </View>
          </View>

          {/* Caja 3D */}
          {/* */}
          <ModelViewer modelPath={model} defaultModel={'VR'} />

          {/* Controles */}
          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.controlButton} onPress={handleRotate}>
              <RotateCw color={GastronomicColors.primary} size={20} />
              <Text style={styles.controlButtonText}>Rotar 360°</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={() => setShowInfo(!showInfo)}>
              <Info color={GastronomicColors.primary} size={20} />
              <Text style={styles.controlButtonText}>Info</Text>
            </TouchableOpacity>
          </View>

          {/* Panel de Información */}
          {showInfo && (
            <Animated.View entering={FadeInDown} style={styles.infoPanel}>
              <Text style={styles.infoTitle}>{selectedDish.name}</Text>
              <Text style={styles.infoDescription}>{selectedDish.description}</Text>
              <View style={styles.infoFooter}>
                <Text style={styles.infoPrice}>{selectedDish.price}</Text>
                {selectedDish.spicy && (
                  <View style={styles.spicyBadge}>
                    <Flame color={GastronomicColors.primary} size={14} />
                    <Text style={styles.spicyText}>Picante</Text>
                  </View>
                )}
              </View>
            </Animated.View>
          )}

          {/* Botón de Realidad Aumentada (AR) */}
          <RedButton style={{ paddingVertical: 16 }} onPress={()=>{router.push({pathname:'../rarv',params:{tipo:'true'}})}}>🥽 Ver en Realidad Aumentada (AR)</RedButton>
        </View>
      </View>

      {/* Lista Completa del Menú */}
      <View style={styles.menuListSection}>
        <Text style={styles.listTitle}>Menú Completo del Restaurante</Text>
        
        {menuItems.map((item, index) => {
          const isSelected = selectedDish.id === item.id;
          
          return (
            <Animated.View key={item.id} entering={FadeInDown.delay(200 + index * 50)}>
              <TouchableOpacity 
                style={[styles.menuItem, isSelected && styles.menuItemSelected]}
                onPress={() => handleDishSelect(item)}
              >
                <View style={styles.itemImageWrapper}>
                  <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  {item.featured && (
                    <View style={styles.item3DBadge}>
                      <Text style={styles.item3DText}>3D</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.itemContent}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.itemIcons}>
                      {item.featured && <View style={styles.small3DBadge}><Text style={styles.small3DText}>3D</Text></View>}
                      {item.spicy && <Flame color={GastronomicColors.primary} size={16} />}
                    </View>
                  </View>
                  
                  <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
                  
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                    <ChevronRight color={GastronomicColors.textLight} size={20} />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    marginBottom: 4,
  },
  cuisineText: {
    fontSize: 14,
    color: GastronomicColors.textLight,
  },
  locationText: {
    fontSize: 12,
    color: GastronomicColors.textLight,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  ratingText: {
    color: GastronomicColors.primary,
    fontWeight: 'bold',
  },
  reviewsText: {
    color: GastronomicColors.textLight,
    fontSize: 12,
  },
  viewerSection: {
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  viewerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  viewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
  },
  viewerSubtitle: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  newBadge: {
    backgroundColor: GastronomicColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  interactiveBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gridBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    // Un efecto de cuadrícula simplificado de forma nativa
  },
  dishWrapper: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishImage: {
    width: '100%',
    height: '100%',
    // la sombra requiere especificaciones de plataforma o imágenes
  },
  dishShadow: {
    position: 'absolute',
    bottom: 20,
    width: 150,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 75,
    transform: [{ scaleY: 0.3 }],
  },
  priceTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: GastronomicColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  priceTagText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  likeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  hintBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  hintText: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  controlButtonText: {
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
  },
  infoPanel: {
    backgroundColor: '#FFF5F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: GastronomicColors.textLight,
    marginBottom: 12,
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GastronomicColors.primary,
  },
  spicyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spicyText: {
    color: GastronomicColors.primary,
    fontSize: 12,
  },
  menuListSection: {
    padding: 20,
    paddingBottom: 40,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    marginBottom: 12,
    gap: 12,
  },
  menuItemSelected: {
    borderColor: GastronomicColors.primary,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  item3DBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  item3DText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    flex: 1,
  },
  itemIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  small3DBadge: {
    backgroundColor: GastronomicColors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  small3DText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 12,
    color: GastronomicColors.textLight,
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontWeight: 'bold',
    color: GastronomicColors.primary,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchInputFocused: {
    borderColor: GastronomicColors.primary,
    backgroundColor: '#FFF',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: GastronomicColors.textDark,
  },
  searchSuggestions: {
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  suggestionsTitle: {
    fontSize: 13,
    color: GastronomicColors.textLight,
    marginBottom: 10,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  suggestionText: {
    fontSize: 13,
    color: GastronomicColors.textDark,
  },
});
