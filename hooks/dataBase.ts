import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { Restaurant } from './useRestaurants';

export interface Usuarios {
    id_usuario: number;
    nombre: string;
    email: string;
    password: string;
    fecha_nacimiento: string;
    telefono: string;
    ubicacion?: string;
}

export type CampoUsuario = 'nombre' | 'email' | 'telefono' | 'ubicacion';
interface UsuariosI {
    nombre: string;
    email: string;
    password: string;
    fecha_nacimiento: string;
    telefono: string;
}
export interface Platos {
    id_plato: number;
    id_restaurante: string;
    id_categoria: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_url: string;
    modelo_3d_url: string;
    disponible: number;
}
export interface Favoritos {
    id: string;
    nombre: string;
    image: string;
    ciudad: string;
    telefono: string;
}

export interface ContactoEmergencia {
    id_contacto: number;
    id_usuario: number;
    nombre: string;
    relacion: string;
    telefono: string;
}

export interface ContactoEmergenciaInput {
    nombre: string;
    relacion: string;
    telefono: string;
}

// ✅ Esta función se pasa a SQLiteProvider y solo corre UNA vez
export async function inicializarDB(database: SQLite.SQLiteDatabase) {
    await database.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS restaurantes (
            id_restaurante TEXT PRIMARY KEY NOT NULL,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            tipo_comida TEXT,
            direccion TEXT,
            ciudad TEXT,
            latitud REAL,
            longitud REAL,
            imagen_url TEXT,
            telefono TEXT,
            horario TEXT,
            fuente TEXT DEFAULT 'local'
        );
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE,
            password TEXT NOT NULL,
            fecha_nacimiento TEXT,
            telefono TEXT,
            fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS preferencias (
            id_preferencia INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            tipo_comida TEXT NOT NULL,
            fecha_actualizacion TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS categoria (
            id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT
        );
        CREATE TABLE IF NOT EXISTS platos (
            id_plato INTEGER PRIMARY KEY AUTOINCREMENT,
            id_restaurante TEXT NOT NULL,
            id_categoria INTEGER NOT NULL,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio REAL,
            imagen_url TEXT,
            modelo_3d_url TEXT,
            disponible INTEGER DEFAULT 1,
            FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id_restaurante) ON DELETE CASCADE,
            FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS favoritos (
            id_favorito INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            id_restaurante TEXT NOT NULL,
            fecha_guardado TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
            FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id_restaurante) ON DELETE CASCADE,
            UNIQUE (id_usuario, id_restaurante)
        );
        CREATE TABLE IF NOT EXISTS historial_busquedas (
            id_busqueda INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER,
            id_categoria INTEGER,
            tipo_comida TEXT,
            ciudad TEXT,
            latitud REAL,
            longitud REAL,
            fecha_busqueda TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
            FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE SET NULL
        );
        CREATE TABLE IF NOT EXISTS rutas (
            id_ruta INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER,
            id_restaurante TEXT NOT NULL,
            origen_latitud REAL,
            origen_longitud REAL,
            destino_latitud REAL,
            destino_longitud REAL,
            distancia_texto TEXT,
            duracion_texto TEXT,
            medio_desplazamiento TEXT,
            fecha_consulta TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
            FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id_restaurante) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS contactos_emergencia (
            id_contacto INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            nombre TEXT NOT NULL,
            relacion TEXT NOT NULL,
            telefono TEXT NOT NULL,
            fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_platos_restaurante ON platos(id_restaurante);
        CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(id_usuario);
        CREATE INDEX IF NOT EXISTS idx_historial_usuario ON historial_busquedas(id_usuario);
        CREATE INDEX IF NOT EXISTS idx_contactos_usuario ON contactos_emergencia(id_usuario);
    `);

    try {
        await database.execAsync(`ALTER TABLE usuarios ADD COLUMN ubicacion TEXT`);
    } catch {
        // La columna ya existe en instalaciones previas
    }
}

// ✅ Hook que reemplaza useBaseDeDatos — usa el contexto del provider
export function useBaseDeDatos() {
    const db = useSQLiteContext(); // ← ya está lista, sin useEffect ni estados

    const insertarDemos = async (rest: Restaurant[]) => {
        const platos = [
            [1, 'Mote de queso', 'Sopa tradicional de la región Caribe', 15000.0, '../assets/images/food_soup.png', 'Untitled'],
            [2, 'Bandeja paisa', 'Plato típico antioqueño con frijoles, arroz y carne', 20000.0, '../assets/images/food_soup.png', 'Untitled'],
            [1, 'Sancocho de gallina', 'Caldo tradicional preparado con yuca, papa y gallina', 14000.0, '../assets/images/food_soup.png', 'Untitled'],
            [2, 'Arepa de huevo', 'Arepa frita rellena con huevo típica de la costa', 10000.0, '../assets/images/food_soup.png', 'Untitled'],
            [1, 'Lechona tolimense', 'Cerdo relleno con arroz y arvejas al estilo tolimense', 22000.0, '../assets/images/food_soup.png', 'Untitled'],
            [2, 'Ajiaco santafereño', 'Sopa bogotana preparada con pollo y diferentes papas', 18000.0, '../assets/images/food_soup.png', 'Untitled'],
            [1, 'Tamal valluno', 'Masa de maíz rellena de carne y verduras envuelta en hoja', 15000.0, '../assets/images/food_soup.png', 'Untitled'],
        ];
        const categorias = [
            ['regional', 'Plato tradicional de la region'],
            ['local', 'Plato tradicional de la ciudad'],
        ];

        try {
            for (const categoria of categorias) {
                await db.runAsync(
                    `INSERT OR IGNORE INTO categoria (nombre, descripcion) VALUES (?, ?)`,
                    categoria
                );
            }
            for (const r of rest) {
                for (const p of platos) {
                    await db.runAsync(
                        `INSERT OR IGNORE INTO platos 
                        (id_restaurante, id_categoria, nombre, descripcion, precio, imagen_url, modelo_3d_url)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [r.id, ...p]  // ✅ comas, no punto y coma
                    );
                }
            }
        } catch (error) {
            console.log('Error al insertar datos Demo:', error);
        }
    };

    const registrarUsuario = async (user: UsuariosI) => {
        const existeCorreo = await db.getFirstAsync(
            `SELECT * FROM usuarios WHERE email = ?`, [user.email]
        );
        if (existeCorreo) {
            return { mensaje: 'Correo ya registrado, intente otro o inicie sesión', state: false };
        }
        const resultado = await db.runAsync(
            `INSERT INTO usuarios (nombre, email, password, fecha_nacimiento, telefono) VALUES (?, ?, ?, ?, ?)`,
            [user.nombre, user.email, user.password, user.fecha_nacimiento, user.telefono]
        );
        const usuario = await db.getFirstAsync<Usuarios>(
            `SELECT * FROM usuarios WHERE id_usuario = ?`,
            [resultado.lastInsertRowId]
        );
        return { mensaje: 'Registro exitoso', state: true, usuario: usuario ?? undefined };
    };

    const iniciarSesion = async (correo: string, contraseña: string) => {
        try {
            return await db.getFirstAsync(
                `SELECT * FROM usuarios WHERE email = ? AND password = ?`, [correo, contraseña]
            ) ?? false;
        } catch (error) {
            console.log('Error al iniciar sesión:', error);
            return false;
        }
    };

    const agregarFavoritos = async (idRest: string, idUser: number) => {
        try {
            await db.runAsync(
                `INSERT INTO favoritos (id_usuario, id_restaurante) VALUES (?, ?)`, [idUser, idRest]
            );
        } catch (error) {
            console.log('Error al agregar a favoritos:', error);
        }
    };

    const eliminarFavoritos = async (idRest: string, idUser: number) => {
        try {
            await db.runAsync(
                `DELETE FROM favoritos WHERE id_usuario = ? AND id_restaurante = ?`,
                [idUser, idRest]
            );
        } catch (error) {
            console.log('Error al eliminar de favoritos:', error);
        }
    };

    const estaEnFavoritos = async (idRest: string, idUser: number): Promise<boolean> => {
        try {
            const fila = await db.getFirstAsync(
                `SELECT 1 FROM favoritos WHERE id_usuario = ? AND id_restaurante = ?`,
                [idUser, idRest]
            );
            return fila != null;
        } catch (error) {
            console.log('Error al verificar favoritos:', error);
            return false;
        }
    };

    const listarFavoritosUsuario = async (idUsuario: number) => {
        try {
            return await db.getAllAsync<Favoritos>(`
                SELECT r.id_restaurante AS id, r.nombre AS nombre,
                       r.imagen_url AS image, r.ciudad, r.telefono
                FROM restaurantes r
                INNER JOIN favoritos f ON r.id_restaurante = f.id_restaurante
                WHERE f.id_usuario = ?
            `, [idUsuario]) ?? [];
        } catch (error) {
            console.log('Error al encontrar favoritos:', error);
            return [];
        }
    };

    const listarMenuRestaurante = async (idRest: string) => {
        try {
            return await db.getAllAsync<Platos>(
                `SELECT * FROM platos WHERE id_restaurante = ?`, [idRest]
            ) ?? [];
        } catch (error) {
            console.log('Error al listar menú:', error);
            return [];
        }
    };
    const obtenerUsuarioCorreo = async (email: string) => {
        try {
            return await db.getFirstAsync<Usuarios>(
                `SELECT * FROM usuarios WHERE email = ?`,
                [email.trim()]
            ) ?? undefined;
        } catch (error) {
            console.log('Error al obtener usuario por correo:', error);
            return undefined;
        }
    };

    const obtenerUsuarioPorId = async (idUsuario: number) => {
        const id = Number(idUsuario);
        if (!id || Number.isNaN(id)) return undefined;

        try {
            return await db.getFirstAsync<Usuarios>(
                `SELECT * FROM usuarios WHERE id_usuario = ?`,
                [id]
            ) ?? undefined;
        } catch (error) {
            console.log('Error al obtener usuario por id:', error);
            return undefined;
        }
    };

    const agregarContactoEmergencia = async (
        idUsuario: number,
        contacto: ContactoEmergenciaInput
    ): Promise<{ mensaje: string; state: boolean; contacto?: ContactoEmergencia }> => {
        const nombre = contacto.nombre.trim();
        const relacion = contacto.relacion.trim();
        const telefono = contacto.telefono.trim();

        if (!nombre || !relacion || !telefono) {
            return { mensaje: 'Completa todos los campos del contacto', state: false };
        }

        try {
            const resultado = await db.runAsync(
                `INSERT INTO contactos_emergencia (id_usuario, nombre, relacion, telefono) VALUES (?, ?, ?, ?)`,
                [idUsuario, nombre, relacion, telefono]
            );

            const nuevoContacto = await db.getFirstAsync<ContactoEmergencia>(
                `SELECT * FROM contactos_emergencia WHERE id_contacto = ?`,
                [resultado.lastInsertRowId]
            );

            return {
                mensaje: 'Contacto agregado',
                state: true,
                contacto: nuevoContacto ?? undefined,
            };
        } catch (error) {
            console.log('Error al agregar contacto de emergencia:', error);
            return { mensaje: 'No se pudo agregar el contacto', state: false };
        }
    };

    const listarContactosEmergencia = async (idUsuario: number): Promise<ContactoEmergencia[]> => {
        try {
            return await db.getAllAsync<ContactoEmergencia>(
                `SELECT * FROM contactos_emergencia WHERE id_usuario = ? ORDER BY fecha_creacion DESC`,
                [idUsuario]
            ) ?? [];
        } catch (error) {
            console.log('Error al listar contactos de emergencia:', error);
            return [];
        }
    };

    const actualizarUsuario = async (
        idUsuario: number,
        campo: CampoUsuario,
        valor: string,
        emailRespaldo?: string
    ): Promise<{ mensaje: string; state: boolean; usuario?: Usuarios }> => {
        const valorLimpio = valor.trim();
        if (!valorLimpio) {
            return { mensaje: 'El campo no puede estar vacío', state: false };
        }

        try {
            let id = Number(idUsuario);
            if (!id || Number.isNaN(id)) {
                if (emailRespaldo) {
                    const porCorreo = await obtenerUsuarioCorreo(emailRespaldo);
                    id = Number(porCorreo?.id_usuario);
                }
            }

            if (!id || Number.isNaN(id)) {
                return {
                    mensaje: 'Sesión inválida. Cierra sesión e ingresa de nuevo.',
                    state: false,
                };
            }

            const usuarioExistente = await obtenerUsuarioPorId(id);
            if (!usuarioExistente) {
                return {
                    mensaje: 'No se encontró el usuario. Cierra sesión e ingresa de nuevo.',
                    state: false,
                };
            }

            if (campo === 'email') {
                const correoExistente = await db.getFirstAsync(
                    `SELECT id_usuario FROM usuarios WHERE email = ? AND id_usuario != ?`,
                    [valorLimpio, id]
                );
                if (correoExistente) {
                    return { mensaje: 'Este correo ya está registrado', state: false };
                }
            }

            const resultado = await db.runAsync(
                `UPDATE usuarios SET ${campo} = ? WHERE id_usuario = ?`,
                [valorLimpio, id]
            );

            if (resultado.changes === 0) {
                return { mensaje: 'No se pudo actualizar el usuario', state: false };
            }

            const usuario = await obtenerUsuarioPorId(id);
            if (!usuario) {
                return { mensaje: 'No se encontró el usuario', state: false };
            }

            return { mensaje: 'Datos actualizados', state: true, usuario };
        } catch (error) {
            console.log('Error al actualizar usuario:', error);
            return { mensaje: 'No se pudo actualizar el dato', state: false };
        }
    };

    return {
        db,
        isReady: true, // ✅ SQLiteProvider garantiza que ya está lista
        insertarDemos,
        registrarUsuario,
        iniciarSesion,
        agregarFavoritos,
        eliminarFavoritos,
        estaEnFavoritos,
        listarFavoritosUsuario,
        listarMenuRestaurante,
        obtenerUsuarioCorreo,
        obtenerUsuarioPorId,
        actualizarUsuario,
        agregarContactoEmergencia,
        listarContactosEmergencia,
    };
}