import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export async function seleccionarImagen() {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
        alert("Permiso denegado");
        return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!resultado.canceled) {
        const archivo = resultado.assets[0];
        console.log(archivo);
        return archivo.uri;
    }
}

export async function seleccionarGLB() {
    try {
        const resultado = await DocumentPicker.getDocumentAsync({
            type: ['model/gltf-binary'],
            copyToCacheDirectory: true
        });

        if (resultado.canceled) {
            console.log("Selección cancelada");
            return;
        }

        const archivo = resultado.assets[0];
        console.log(archivo);
        return archivo.uri;

    } catch (error) {
        console.log(error);
    }
}