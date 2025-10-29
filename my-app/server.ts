import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const ARCHIVO_TXT = path.join(__dirname, 'usuarios.txt');

// Middleware
app.use(cors());
app.use(express.json());

// Tipos
interface Usuario {
  id: string;
  nombre: string;
  numero: string;
  email: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

// === FUNCIONES AUXILIARES ===

const leerUsuarios = (): Usuario[] => {
  try {
    if (!fs.existsSync(ARCHIVO_TXT)) {
      fs.writeFileSync(ARCHIVO_TXT, '[]', 'utf-8');
      return [];
    }
    const data = fs.readFileSync(ARCHIVO_TXT, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error leyendo usuarios:', error);
    return [];
  }
};

const guardarUsuarios = (usuarios: Usuario[]): boolean => {
  try {
    fs.writeFileSync(ARCHIVO_TXT, JSON.stringify(usuarios, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error guardando usuarios:', error);
    return false;
  }
};

// === ENDPOINTS CRUD ===

// GET - Obtener todos los usuarios
app.get('/api/usuarios', (req: Request, res: Response) => {
  const usuarios = leerUsuarios();
  res.json(usuarios);
});

// POST - Crear un nuevo usuario
app.post('/api/usuarios', (req: Request, res: Response) => {
  const { nombre, numero, email } = req.body;

  if (!nombre || !numero || !email) {
    return res.status(400).json({ 
      error: 'Todos los campos son obligatorios (nombre, numero, email)' 
    });
  }

  const usuarios = leerUsuarios();
  const nuevoUsuario: Usuario = {
    id: Date.now().toString(),
    nombre,
    numero,
    email,
    fechaCreacion: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);
  
  if (guardarUsuarios(usuarios)) {
    res.status(201).json(nuevoUsuario);
  } else {
    res.status(500).json({ error: 'Error al guardar el usuario' });
  }
});

// PUT - Actualizar un usuario existente
app.put('/api/usuarios/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, numero, email } = req.body;

  const usuarios = leerUsuarios();
  const index = usuarios.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  usuarios[index] = {
    ...usuarios[index],
    nombre: nombre || usuarios[index].nombre,
    numero: numero || usuarios[index].numero,
    email: email || usuarios[index].email,
    fechaActualizacion: new Date().toISOString()
  };

  if (guardarUsuarios(usuarios)) {
    res.json(usuarios[index]);
  } else {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// DELETE - Eliminar un usuario
app.delete('/api/usuarios/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const usuarios = leerUsuarios();
  const usuariosFiltrados = usuarios.filter(u => u.id !== id);

  if (usuarios.length === usuariosFiltrados.length) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (guardarUsuarios(usuariosFiltrados)) {
    res.json({ mensaje: 'Usuario eliminado correctamente', id });
  } else {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor CRUD ejecutándose en http://localhost:${PORT}`);
  console.log(`📁 Usuarios almacenados en: ${ARCHIVO_TXT}`);
});
