import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, Quote } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GastronomicColors } from '../constants/theme';

interface TestimonialProps {
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}

export const Testimonial: React.FC<TestimonialProps> = ({ 
  name, 
  location, 
  text, 
  rating,
  avatar 
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <LinearGradient
          colors={[GastronomicColors.primary, GastronomicColors.darkRed]}
          style={styles.avatarGradient}
        >
          <Text style={styles.avatarText}>{avatar}</Text>
        </LinearGradient>
        
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.location}>{location}</Text>
        </View>
        
        <View style={styles.ratingContainer}>
          {[...Array(rating)].map((_, i) => (
            <Star key={i} color={GastronomicColors.primary} fill={GastronomicColors.primary} size={16} />
          ))}
        </View>
      </View>
      
      <View style={styles.textContainer}>
        <Quote color={GastronomicColors.primary} size={32} style={styles.quoteIcon} opacity={0.2} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 288, // w-72
    backgroundColor: GastronomicColors.bgWhite,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6', // gray-100
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: GastronomicColors.textDark,
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: GastronomicColors.textLight,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  textContainer: {
    position: 'relative',
    paddingLeft: 16,
  },
  quoteIcon: {
    position: 'absolute',
    top: -8,
    left: -8,
  },
  text: {
    fontSize: 14,
    color: GastronomicColors.textLight,
    lineHeight: 20,
  },
});
