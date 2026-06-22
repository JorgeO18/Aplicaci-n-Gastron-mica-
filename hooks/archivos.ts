import * as ImagePicker from 'expo-image-picker';

import * as DocumentPicker from 'react-native-document-picker';

export async function seleccionarImagen (){
    

    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      alert("Permiso denegado");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1
    });

    if (!resultado.canceled) {

      const archivo = resultado.assets[0];
      console.log(archivo);
      return(archivo.uri)
    }

  };
export async function seleccionarGLB () {

    try {

      const resultado = await DocumentPicker.pick({
        type: ['model/gltf-binary']
      });

      const archivo = resultado[0];

      

      console.log(archivo);
      return(archivo.uri)

    } catch(error) {
      console.log(error);
    }

  };