// Espaciado y dimensiones de TasteGo
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Spacing = {
  // Espaciado base
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,

  // Dimensiones de pantalla
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,

  // Radio de bordes
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 50,
    full: 9999,
  },

  // Tamaños de iconos
  iconSize: {
    sm: 16,
    md: 20,
    base: 24,
    lg: 28,
    xl: 32,
    xxl: 48,
  },

  // Alturas de componentes
  buttonHeight: 52,
  inputHeight: 50,
  tabBarHeight: 65,
  headerHeight: 56,
  cardHeight: 200,
};
