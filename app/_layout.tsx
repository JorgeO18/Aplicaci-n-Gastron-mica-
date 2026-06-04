import { inicializarDB } from '@/hooks/dataBase';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

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

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SQLiteProvider databaseName="miapp.db" onInit={inicializarDB}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="restaurant/menu" options={{ headerShown: false }} />
          <Stack.Screen name="ar/instructions" options={{ headerShown: false }} />
          <Stack.Screen name="rarv" options={{ headerShown: false }} />
          <Stack.Screen name="MapView" options={{ headerShown: false }} />
          
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SQLiteProvider>
  );
}