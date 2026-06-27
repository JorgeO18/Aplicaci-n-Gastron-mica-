import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { geocode } from './geocode';


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
export interface PlatosI {

    id_restaurante: string;
    id_categoria: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_url: string;

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

export interface Restaurante {
    nombre: string;
    descripcion: string;
    tipo_comida: string;
    direccion: string;
    telefono: string;
    horario: string;
    contraseña: string;
    correo: string;
}
export interface RestauranteI {
    id_restaurante: number;
    nombre: string;
    descripcion: string;
    tipo_comida: string;
    direccion: string;
    ciudad: string;
    latitud: number;
    longitud: number;
    imagen_url: string;
    telefono: string;
    horario: string;
    correo?: string;
    contraseña?: string;
}

export type CampoRestaurante = 'nombre' | 'descripcion' | 'tipo_comida' | 'direccion' | 'telefono' | 'horario' | 'correo' | 'contraseña';
export interface Categorias {
    id_categoria: number,
    nombre : string
}


// ✅ Esta función se pasa a SQLiteProvider y solo corre UNA vez
export async function inicializarDB(database: SQLite.SQLiteDatabase) {
    await database.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS restaurantes (
            id_restaurante INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
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
            fuente TEXT DEFAULT 'local',
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS clientes(
            id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            nombre TEXT NOT NULL,
            fecha_nacimiento TEXT,
            telefono TEXT,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT NOT NULL,
            id_tipo_usuario INTEGER DEFAULT 1,
            fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_tipo_usuario) REFERENCES tipo_usuario(id_tipo_usuario) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS tipo_usuario(
            id_tipo_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo_usuario TEXT NOT NULL
        
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
            id_restaurante INTEGER NOT NULL,
            id_categoria INTEGER NOT NULL,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio REAL,
            imagen_url TEXT,
            modelo_3d_url TEXT DEFAULT 'Untitled',
            disponible INTEGER DEFAULT 1,
            FOREIGN KEY (id_restaurante) REFERENCES restaurantes(id_restaurante) ON DELETE CASCADE,
            FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS favoritos (
            id_favorito INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            id_restaurante INTEGER NOT NULL,
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
            id_restaurante INTEGER NOT NULL,
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

    const tiposUsuario = ['cliente', 'restaurante', 'sistema'];
    for (const tipo of tiposUsuario) {
        await database.runAsync(
            `INSERT OR IGNORE INTO tipo_usuario (tipo_usuario) VALUES (?)`,
            [tipo]
        );
    }

}

// ✅ Hook que reemplaza useBaseDeDatos — usa el contexto del provider
export function useBaseDeDatos() {
    const db = useSQLiteContext(); // ← ya está lista, sin useEffect ni estados

    const insertarDemos = async (rest: RestauranteI[]) => {
        const platos = [
            [1, 'Mote de queso', 'Sopa tradicional de la región Caribe', 15000.0, 'https://cdn.ajoverdarnel.com/img/pm/platos-termicos-biodegrdables-banner-movil.jpg', 'Untitled'],
            [2, 'Bandeja paisa', 'Plato típico antioqueño con frijoles, arroz y carne', 20000.0, 'https://cdn.ajoverdarnel.com/img/pm/platos-termicos-biodegrdables-banner-movil.jpg', 'Untitled'],
            [1, 'Sancocho de gallina', 'Caldo tradicional preparado con yuca, papa y gallina', 14000.0, 'https://cdn.ajoverdarnel.com/img/pm/platos-termicos-biodegrdables-banner-movil.jpg', 'Untitled'],
            [2, 'Arepa de huevo', 'Arepa frita rellena con huevo típica de la costa', 10000.0, 'https://cdn.ajoverdarnel.com/img/pm/platos-termicos-biodegrdables-banner-movil.jpg', 'Untitled'],
            [1, 'Lechona tolimense', 'Cerdo relleno con arroz y arvejas al estilo tolimense', 22000.0, 'https://cdn.ajoverdarnel.com/img/pm/platos-termicos-biodegrdables-banner-movil.jpg', 'Untitled'],
            [2, 'Ajiaco santafereño', 'Sopa bogotana preparada con pollo y diferentes papas', 18000.0, 'https://cdn.ajoverdarnel.com/img/pm/platos-termicos-biodegrdables-banner-movil.jpg', 'Untitled'],
            [1, 'Tamal valluno', 'Masa de maíz rellena de carne y verduras envuelta en hoja', 15000.0, 'https://cdn.ajoverdarnel.com/img/pm/platos-termicos-biodegrdables-banner-movil.jpg', 'Untitled'],
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
                        [r.id_restaurante, ...p]  // ✅ comas, no punto y coma
                    );
                }
            }

            // ✅ corregido: usuarios solo tiene email, password e id_tipo_usuario
            await db.runAsync(
                `INSERT OR IGNORE INTO usuarios (email, password, id_tipo_usuario) VALUES (?, ?, ?)`,
                ['sistema@gmail.com', '12345', 3]
            );
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
            `INSERT INTO usuarios (email, password) VALUES (?, ?)`,
            [user.email, user.password]
        );
        const cliente = await db.runAsync(
            `INSERT INTO clientes (id_usuario, nombre, fecha_nacimiento, telefono) VALUES (?, ?, ?, ?)`,
            [resultado.lastInsertRowId, user.nombre, user.fecha_nacimiento, user.telefono]
        );
        // ✅ corregido: sin coma colgante, JOIN explícito entre usuarios y clientes
        const usuario = await db.getFirstAsync<Usuarios>(
            `SELECT c.id_cliente AS id_usuario, c.nombre, u.email, u.password, c.fecha_nacimiento, c.telefono
             FROM clientes c
             JOIN usuarios u ON u.id_usuario = c.id_usuario
             WHERE c.id_cliente = ?`,
            [cliente.lastInsertRowId]
        );
        return { mensaje: 'Registro exitoso', state: true, usuario: usuario ?? undefined };
    };

    const iniciarSesion = async (correo: string, contraseña: string, tipo: number) => {
        try {
            if (tipo === 1) {
                // ✅ corregido: sin coma colgante, JOIN explícito
                return await db.getFirstAsync(
                    `SELECT c.id_cliente AS id_usuario, c.nombre, u.email, u.password, c.fecha_nacimiento, c.telefono
                     FROM usuarios u
                     JOIN clientes c ON c.id_usuario = u.id_usuario
                     WHERE u.email = ? AND u.password = ?`,
                    [correo, contraseña]
                ) ?? false;

            } else if (tipo === 2) {
                // ✅ corregido: tabla "restaurantes" (no "restaurante"), columna id_usuario (no id_admin), JOIN explícito
                return await db.getFirstAsync(
                    `SELECT r.id_restaurante, r.nombre, r.descripcion, r.tipo_comida, r.direccion,
                            r.ciudad, r.latitud, r.longitud, r.imagen_url, r.telefono, r.horario
                     FROM usuarios u
                     JOIN restaurantes r ON r.id_usuario = u.id_usuario
                     WHERE u.email = ? AND u.password = ?`,
                    [correo, contraseña]
                ) ?? false;
            }
            return false; // ✅ corregido: antes no retornaba nada si tipo no era 1 ni 2
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
    const obtenerUsuarioPorId = async (idUsuario: number) => {
        const id = Number(idUsuario);
        if (!id || Number.isNaN(id)) return undefined;

        try {
            return await db.getFirstAsync<Usuarios>(
                `SELECT u.id_usuario, u.email, u.password, u.ubicacion,
                    c.nombre, c.telefono, c.fecha_nacimiento
             FROM usuarios u
             LEFT JOIN clientes c ON c.id_usuario = u.id_usuario
             WHERE u.id_usuario = ?`,
                [id]
            ) ?? undefined;
        } catch (error) {
            console.log('Error al obtener usuario por id:', error);
            return undefined;
        }
    };

    const obtenerUsuarioCorreo = async (email: string) => {
        try {
            return await db.getFirstAsync<Usuarios>(
                `SELECT u.id_usuario, u.email, u.password, u.ubicacion,
                    c.nombre, c.telefono, c.fecha_nacimiento
             FROM usuarios u
             LEFT JOIN clientes c ON c.id_usuario = u.id_usuario
             WHERE u.email = ?`,
                [email.trim()]
            ) ?? undefined;
        } catch (error) {
            console.log('Error al obtener usuario por correo:', error);
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

            // ✅ corregido: 'nombre' y 'telefono' viven en la tabla "clientes",
            // no en "usuarios". 'email' y 'ubicacion' sí viven en "usuarios".
            if (campo === 'email') {
                const correoExistente = await db.getFirstAsync(
                    `SELECT id_usuario FROM usuarios WHERE email = ? AND id_usuario != ?`,
                    [valorLimpio, id]
                );
                if (correoExistente) {
                    return { mensaje: 'Este correo ya está registrado', state: false };
                }

                const resultado = await db.runAsync(
                    `UPDATE usuarios SET email = ? WHERE id_usuario = ?`,
                    [valorLimpio, id]
                );
                if (resultado.changes === 0) {
                    return { mensaje: 'No se pudo actualizar el usuario', state: false };
                }

            } else if (campo === 'ubicacion') {
                const resultado = await db.runAsync(
                    `UPDATE usuarios SET ubicacion = ? WHERE id_usuario = ?`,
                    [valorLimpio, id]
                );
                if (resultado.changes === 0) {
                    return { mensaje: 'No se pudo actualizar el usuario', state: false };
                }

            } else if (campo === 'nombre' || campo === 'telefono') {
                const resultado = await db.runAsync(
                    `UPDATE clientes SET ${campo} = ? WHERE id_usuario = ?`,
                    [valorLimpio, id]
                );
                if (resultado.changes === 0) {
                    return { mensaje: 'No se pudo actualizar el usuario', state: false };
                }
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

    const registrarRestaurantes = async (restaurante: Restaurante) => {
        const existeCorreo = await db.getFirstAsync(
            `SELECT * FROM usuarios WHERE email = ?`, [restaurante.correo]
        );
        if (existeCorreo) {
            return { mensaje: 'Correo ya registrado, intente otro o inicie sesión', state: false };
        }
        const ubicacion = await geocode(restaurante.direccion)
        if (!ubicacion) {
            return { mensaje: 'No se pudo encontrar la direccion que ingreso', state: false }
        }
        try {
            const resultado = await db.runAsync(
                `INSERT INTO usuarios (email, password) VALUES (?, ?)`,
                [restaurante.correo, restaurante.contraseña]
            );
            const newRest = await db.runAsync(
                `INSERT INTO restaurantes (id_usuario, nombre, descripcion, tipo_comida, direccion, ciudad, latitud, longitud, imagen_url, telefono, horario)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    resultado.lastInsertRowId,
                    restaurante.nombre,
                    restaurante.descripcion,
                    restaurante.tipo_comida,
                    restaurante.direccion,
                    ubicacion[0]?.city,
                    ubicacion[0]?.latitude,
                    ubicacion[0]?.longitude,
                    'https://cloudfront-us-east-1.images.arcpublishing.com/bloomberglinea/H6P7BHWDTVFYTC4K6NUF3TBA7I.jpeg',
                    restaurante.telefono,
                    restaurante.horario
                ]
            );

            const resta = await db.getFirstAsync(
                `SELECT r.id_restaurante, r.nombre, r.descripcion, r.tipo_comida, r.direccion,
                            r.ciudad, r.latitud, r.longitud, r.imagen_url, r.telefono, r.horario
                     FROM usuarios u
                     JOIN restaurantes r ON r.id_usuario = u.id_usuario
                     WHERE r.id_restaurante = ?`,
                [newRest.lastInsertRowId]
            )

            return { mensaje: 'Registro exitoso', state: true, restaurante: resta ?? undefined }

        } catch (error) {
            console.log('Error al registrar restaurante:', error); // ✅ ahora sí loguea el error real
            return { mensaje: 'No se hacer el registro', state: false }
        }
    }
    const registrarPlato = async (plato: PlatosI) => {
        try {
            await db.runAsync(
                `INSERT OR IGNORE INTO platos (id_restaurante, id_categoria, nombre, descripcion, precio, imagen_url) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    plato.id_restaurante,
                    plato.id_categoria,
                    plato.nombre,
                    plato.descripcion,
                    plato.precio,
                    plato.imagen_url
                ]
            );
        } catch (error) {
            console.log('Error al registrar plato:', error); // ✅ catch ya no queda vacío
        }
    }
    const actualizarRestaurante = async (
        idRestaurante: number,
        campo: CampoRestaurante,
        valor: string
    ): Promise<{ mensaje: string; state: boolean; restaurante?: RestauranteI }> => {
        const valorLimpio = valor.trim();
        if (!valorLimpio) {
            return { mensaje: 'El campo no puede estar vacío', state: false };
        }
        try {
            if (campo === 'correo') {
                // Actualizar email en tabla usuarios a través del restaurante
                const correoExistente = await db.getFirstAsync(
                    `SELECT u.id_usuario FROM usuarios u
                     JOIN restaurantes r ON r.id_usuario = u.id_usuario
                     WHERE u.email = ? AND r.id_restaurante != ?`,
                    [valorLimpio, idRestaurante]
                );
                if (correoExistente) {
                    return { mensaje: 'Este correo ya está registrado', state: false };
                }
                const resultado = await db.runAsync(
                    `UPDATE usuarios SET email = ?
                     WHERE id_usuario = (SELECT id_usuario FROM restaurantes WHERE id_restaurante = ?)`,
                    [valorLimpio, idRestaurante]
                );
                if (resultado.changes === 0) {
                    return { mensaje: 'No se pudo actualizar el correo', state: false };
                }
            } else if (campo === 'contraseña') {
                const resultado = await db.runAsync(
                    `UPDATE usuarios SET password = ?
                     WHERE id_usuario = (SELECT id_usuario FROM restaurantes WHERE id_restaurante = ?)`,
                    [valorLimpio, idRestaurante]
                );
                if (resultado.changes === 0) {
                    return { mensaje: 'No se pudo actualizar la contraseña', state: false };
                }
            } else if (campo === 'direccion') {
                const ubicacion = await geocode(valorLimpio);
                if (!ubicacion || ubicacion.length === 0) {
                    return { mensaje: 'No se pudo encontrar la dirección que ingresó', state: false };
                }
                const ciudad = ubicacion[0]?.city || '';
                const latitud = ubicacion[0]?.latitude;
                const longitud = ubicacion[0]?.longitude;

                const resultado = await db.runAsync(
                    `UPDATE restaurantes SET direccion = ?, ciudad = ?, latitud = ?, longitud = ? WHERE id_restaurante = ?`,
                    [valorLimpio, ciudad, latitud, longitud, idRestaurante]
                );
                if (resultado.changes === 0) {
                    return { mensaje: 'No se pudo actualizar la dirección', state: false };
                }
            } else {
                const resultado = await db.runAsync(
                    `UPDATE restaurantes SET ${campo} = ? WHERE id_restaurante = ?`,
                    [valorLimpio, idRestaurante]
                );
                if (resultado.changes === 0) {
                    return { mensaje: 'No se pudo actualizar el campo', state: false };
                }
            }

            const resta = await db.getFirstAsync<RestauranteI>(
                `SELECT r.id_restaurante, r.nombre, r.descripcion, r.tipo_comida, r.direccion,
                        r.ciudad, r.latitud, r.longitud, r.imagen_url, r.telefono, r.horario,
                        u.email AS correo
                 FROM restaurantes r
                 JOIN usuarios u ON u.id_usuario = r.id_usuario
                 WHERE r.id_restaurante = ?`,
                [idRestaurante]
            );
            return { mensaje: 'Datos actualizados', state: true, restaurante: resta ?? undefined };
        } catch (error) {
            console.log('Error al actualizar restaurante:', error);
            return { mensaje: 'No se pudo actualizar el dato', state: false };
        }
    };

    const obtenerCategorias = async ()=>{
        try {
            return await db.getAllAsync<Categorias>(`SELECT id_categoria,nombre FROM categoria`) ?? []
        } catch (error) {
            
        }
    }
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
        registrarRestaurantes,
        registrarPlato,
        obtenerCategorias,
        actualizarRestaurante
    };
}