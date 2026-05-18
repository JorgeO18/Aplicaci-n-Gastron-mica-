import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ModelViewer from '../components/ModelViewer';

export default function ARScreen() {
  const { tipo } = useLocalSearchParams();

  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    const cargarModelo = async () => {
      try {
        const data = await AsyncStorage.getItem('moldelRA');

        if (data) {
          const parsed = JSON.parse(data);

          console.log('Modelo:', parsed);

          setModel(parsed);
        }
      } catch (error) {
        console.log(error);
      }
    };

    cargarModelo();
  }, []);

  const rarv = useMemo(() => {
    return tipo === 'true' ? 'AR' : 'VR';
  }, [tipo]);

  if (!model) return null;

  return (
    <ModelViewer
      modelPath={model}
      defaultModel={rarv}
    />
  );
}