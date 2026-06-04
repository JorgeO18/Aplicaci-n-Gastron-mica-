import { Tabs } from 'expo-router';
import React from 'react';
import { LogBox, Platform } from 'react-native';
import { Home, Heart, User, Utensils } from 'lucide-react-native';
import { GastronomicColors } from '@/constants/theme';
LogBox.ignoreLogs([
  'Looks like you have configured linking in multiple places',
]);
if (__DEV__) {
  const _error = console.error.bind(console);
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('linking in multiple places')
    ) return; // ← descarta solo este warning específico
    _error(...args);
  };
}
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: GastronomicColors.primary,
        tabBarInactiveTintColor: GastronomicColors.textLight,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          ...Platform.select({
            ios: {
              height: 85,
            },
            android: {
              height: 65,
              paddingBottom: 10,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: -5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      {/* Ocultar explore.tsx si existe en la plantilla por defecto */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
