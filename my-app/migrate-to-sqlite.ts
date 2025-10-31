import Database from 'better-sqlite3';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_FILE = join(__dirname, 'usuarios.db');
const TXT_FILE = join(__dirname, 'usuarios.txt');

console.log('🔄 Iniciando migración de datos...');

// Crear/conectar a la base de datos
const db = new Database(DB_FILE);

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    numero TEXT NOT NULL,
    email TEXT NOT NULL,
    pais TEXT,
    estado TEXT,
    ciudad TEXT,
    direccion TEXT,
    fechaCreacion TEXT NOT NULL,
    fechaActualizacion TEXT NOT NULL
  )
`);

// Leer datos del archivo txt si existe
if (existsSync(TXT_FILE)) {
  try {
    const data = readFileSync(TXT_FILE, 'utf-8');
    const usuarios = JSON.parse(data);

    console.log(`📄 Encontrados ${usuarios.length} usuarios en ${TXT_FILE}`);

    // Preparar statement de inserción
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO usuarios (id, nombre, numero, email, pais, estado, ciudad, direccion, fechaCreacion, fechaActualizacion)
      VALUES (@id, @nombre, @numero, @email, @pais, @estado, @ciudad, @direccion, @fechaCreacion, @fechaActualizacion)
    `);

    // Insertar todos los usuarios
    const insertMany = db.transaction((usuarios) => {
      for (const usuario of usuarios) {
        stmt.run({
          id: usuario.id,
          nombre: usuario.nombre || '',
          numero: usuario.numero || '',
          email: usuario.email || '',
          pais: usuario.pais || '',
          estado: usuario.estado || '',
          ciudad: usuario.ciudad || '',
          direccion: usuario.direccion || '',
          fechaCreacion: usuario.fechaCreacion || new Date().toISOString(),
          fechaActualizacion: usuario.fechaActualizacion || new Date().toISOString()
        });
      }
    });

    insertMany(usuarios);

    console.log('✅ Migración completada exitosamente!');
    console.log(`📦 Base de datos SQLite creada en: ${DB_FILE}`);
    
    // Verificar
    const count = db.prepare('SELECT COUNT(*) as total FROM usuarios').get() as { total: number };
    console.log(`📊 Total de usuarios en la base de datos: ${count.total}`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  }
} else {
  console.log('⚠️  No se encontró el archivo usuarios.txt');
  console.log('✅ Base de datos SQLite creada y lista para usar');
}

db.close();
console.log('🎉 Proceso completado!');
