import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, View } from 'react-native';

/**
 * Muestra una imagen estática si `imagenUrl` contiene una sola URL,
 * o un slideshow con crossfade cada 2 segundos si hay varias URLs separadas por '|'.
 */
export function ImagenAnimada({ imagenUrl, style }: { imagenUrl?: string | null; style?: any }) {
  let urls: string[] = [];
  if (imagenUrl) {
    if (imagenUrl.startsWith('[')) {
      try {
        urls = JSON.parse(imagenUrl);
      } catch (e) {
        urls = [];
      }
    } else {
      urls = imagenUrl.split('|').map(u => u.trim()).filter(Boolean);
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (urls.length <= 1) return;
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % urls.length);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, [urls.length]);

  if (urls.length === 0) {
    return (
      <View style={[style, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="image-outline" size={24} color="#aaa" />
      </View>
    );
  }

  if (urls.length === 1) {
    return <Image source={{ uri: urls[0] }} style={style} />;
  }

  return (
    <Animated.Image
      source={{ uri: urls[currentIndex] }}
      style={[style, { opacity: fadeAnim }]}
    />
  );
}
