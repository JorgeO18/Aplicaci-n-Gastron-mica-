import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ModelViewer from "../components/ModelViewer";
import { MODELS } from "@/constants/models";

export default function ARScreen() {
  const { tipo } = useLocalSearchParams();

  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    const cargarModelo = async () => {
      try {
        const data = await AsyncStorage.getItem("moldelRA");
        console.log("data:", data);
        if (data) {
          const parsed = JSON.parse(data);

          console.log("parsed:", parsed);
          console.log("typeof parsed:", typeof parsed);

          const modelRequerido = MODELS[parsed];

          console.log("modelRequerido:", modelRequerido);

          setModel(modelRequerido);
        }
      } catch (error) {
        console.log(error);
      }
    };
    cargarModelo();
  }, []);

  const rarv = useMemo(() => {
    return tipo === "true" ? "AR" : "VR";
  }, [tipo]);
  console.log("ARScreen render");
  console.log("model:", model);
  if (!model) return null;

  return <ModelViewer modelPath={model} defaultModel={rarv} />;
}
