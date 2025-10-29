import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const DB_FILE = join(__dirname, 'usuarios.txt');

app.use(cors());
app.use(express.json());

// Inicializar archivo
try {
  readFileSync(DB_FILE, 'utf-8');
} catch {
  writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

// Leer usuarios
const leerUsuarios = () => {
  const data = readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
};

// Guardar usuarios
const guardarUsuarios = (usuarios: any[]) => {
  writeFileSync(DB_FILE, JSON.stringify(usuarios, null, 2));
};

// GET 
app.get('/api/usuarios', (req, res) => {
  const usuarios = leerUsuarios();
  res.json(usuarios);
});

// POST 
app.post('/api/usuarios', (req, res) => {
  const usuarios = leerUsuarios();
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
  
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  res.status(201).json(nuevoUsuario);
});

// PUT 
app.put('/api/usuarios/:id', (req, res) => {
  const usuarios = leerUsuarios();
  const index = usuarios.findIndex((u: any) => u.id === req.params.id);
  
  if (index !== -1) {
    usuarios[index] = {
      ...usuarios[index],
      nombre: req.body.nombre ?? usuarios[index].nombre,
      numero: req.body.numero ?? usuarios[index].numero,
      email: req.body.email ?? usuarios[index].email,
      pais: req.body.pais ?? usuarios[index].pais,
      estado: req.body.estado ?? usuarios[index].estado,
      ciudad: req.body.ciudad ?? usuarios[index].ciudad,
      direccion: req.body.direccion ?? usuarios[index].direccion,
      fechaActualizacion: new Date().toISOString()
    };
    guardarUsuarios(usuarios);
    res.json(usuarios[index]);
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

// DELETE
app.delete('/api/usuarios/:id', (req, res) => {
  const usuarios = leerUsuarios();
  const usuariosFiltrados = usuarios.filter((u: any) => u.id !== req.params.id);
  
  if (usuarios.length !== usuariosFiltrados.length) {
    guardarUsuarios(usuariosFiltrados);
    res.json({ mensaje: 'Usuario eliminado' });
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
});
