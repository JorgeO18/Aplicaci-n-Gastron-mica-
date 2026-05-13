import ModelViewer from '../components/ModelViewer';
import { useLocalSearchParams } from 'expo-router';
import model from '../assets/models/Untitled.glb';
import { useMemo } from 'react';

export default function ARScreen() {
  const { tipo } = useLocalSearchParams(); // ← desestructura correctamente
  
  const rarv = useMemo(() => {
    return tipo === 'true' ? 'AR' : 'VR';
  }, [tipo]);

  return (
    <ModelViewer modelPath={model} defaultModel={rarv} />
  );
}