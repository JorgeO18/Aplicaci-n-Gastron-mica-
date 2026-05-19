import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';

export function useBaseDeDatos() {

    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

    const iniciarDB = async () => {

        const database = await SQLite.openDatabaseAsync('miapp.db');

        setDb(database);

        await database.execAsync(`
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
            
        `);
    };

    useEffect(() => {
        iniciarDB();
    }, []);

    return db;
}