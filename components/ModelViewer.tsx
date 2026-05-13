import { useState, useEffect, Suspense } from "react";
import { StyleSheet, View} from "react-native";
import { Canvas } from "@react-three/fiber/native";
import { useGLTF, OrbitControls } from "@react-three/drei/native";
import { CameraView, useCameraPermissions } from "expo-camera";

function Model({ modelPath,modo = false}: { modelPath: any , modo:boolean}) {
  const gltf = useGLTF(modelPath);
  const scene = (gltf as any).scene;
  const escala = modo ? 0.8 : 1.4;
  
  return <primitive object={scene} position={[0, 0, 0]} scale={escala} />;
}

export default function ModelViewer({
  modelPath,
  defaultModel = "VR",
}: {
  modelPath: any;
  defaultModel: string;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRA, setIsRA] = useState(false);

  useEffect(() => {
    setIsRA(defaultModel === "AR");
  }, [defaultModel]);

  useEffect(() => {
    if (defaultModel === "AR") {
      if (!permission?.granted) {
        requestPermission().then((result) => {
          if (result.granted) setIsRA(true);
        });
      } else {
        setIsRA(true);
      }
    } else {
      setIsRA(false);
    }
  }, [defaultModel]);

  const canvasStyle = StyleSheet.flatten([
    isRA ? StyleSheet.absoluteFillObject : styles.rvCanvas,
    {
      backgroundColor: isRA ? "transparent" : "#a9a49e",
    },
  ]);
  return (
    <View style={styles.container}>
      {/* Cámara de fondo solo en modo AR */}
      {isRA && permission?.granted && (
        <CameraView style={StyleSheet.absoluteFill} facing="back" />
      )}

      <Canvas
        style={canvasStyle}
        camera={{ position: [0, 1, 3], fov: 60 }}
        gl={{ alpha: isRA }}
      >
        {!isRA && (<color attach="background" args={["#a9a49e"]} />)}
        <ambientLight intensity={3} />
        <directionalLight position={[5, 5, 5]} intensity={3} />
        <directionalLight position={[-5, -5, -5]} intensity={1} />
        <Suspense fallback={null}>
          <Model modelPath={modelPath} modo={isRA}/>
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          touches={{ ONE: 0 }}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#a9a49e" },
  rvCanvas: {
    width: 240,
    height: 240,
    alignSelf: "center",
  },
});
