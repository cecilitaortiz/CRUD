import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const DB_FILE = join(__dirname, 'usuarios.db');

app.use(cors());
app.use(express.json());

// Inicializar base de datos
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

// GET - Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  try {
    const usuarios = db.prepare('SELECT * FROM usuarios').all();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// POST - Crear nuevo usuario
app.post('/api/usuarios', (req, res) => {
  try {
    const nuevoUsuario = {
      id: Date.now().toString(),
      nombre: req.body.nombre || '',
      numero: req.body.numero || '',
      email: req.body.email || '',
      pais: req.body.pais || '',
      estado: req.body.estado || '',
      ciudad: req.body.ciudad || '',
      direccion: req.body.direccion || '',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    const stmt = db.prepare(`
      INSERT INTO usuarios (id, nombre, numero, email, pais, estado, ciudad, direccion, fechaCreacion, fechaActualizacion)
      VALUES (@id, @nombre, @numero, @email, @pais, @estado, @ciudad, @direccion, @fechaCreacion, @fechaActualizacion)
    `);
    
    stmt.run(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT - Actualizar usuario
app.put('/api/usuarios/:id', (req, res) => {
  try {
    const usuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuarioActualizado = {
      id: req.params.id,
      nombre: req.body.nombre ?? (usuario as any).nombre,
      numero: req.body.numero ?? (usuario as any).numero,
      email: req.body.email ?? (usuario as any).email,
      pais: req.body.pais ?? (usuario as any).pais,
      estado: req.body.estado ?? (usuario as any).estado,
      ciudad: req.body.ciudad ?? (usuario as any).ciudad,
      direccion: req.body.direccion ?? (usuario as any).direccion,
      fechaCreacion: (usuario as any).fechaCreacion,
      fechaActualizacion: new Date().toISOString()
    };

    const stmt = db.prepare(`
      UPDATE usuarios 
      SET nombre = @nombre, 
          numero = @numero, 
          email = @email, 
          pais = @pais, 
          estado = @estado, 
          ciudad = @ciudad, 
          direccion = @direccion,
          fechaActualizacion = @fechaActualizacion
      WHERE id = @id
    `);
    
    stmt.run(usuarioActualizado);
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE - Eliminar usuario
app.delete('/api/usuarios/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM usuarios WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes > 0) {
      res.json({ mensaje: 'Usuario eliminado' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Cerrar base de datos cuando el servidor se cierra
process.on('exit', () => db.close());
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
  console.log(`📦 Base de datos SQLite: ${DB_FILE}`);
});

