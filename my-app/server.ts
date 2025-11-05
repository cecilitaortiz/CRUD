import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query, execute, testConnection } from './src/db/db2';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Verificar conexión al iniciar
testConnection().then(isConnected => {
  if (!isConnected) {
    console.error('❌ No se pudo conectar a DB2. Verifica la configuración en .env');
    process.exit(1);
  }
});

// GET - Obtener personas (limitado a 10 registros por defecto)
app.get('/api/usuarios', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    // Query con JOIN para obtener datos completos de persona con ubicación y teléfono
    const resultados = await query(`
      SELECT 
        p.IDPERSONA as id,
        TRIM(p.APELLIDOS) || ', ' || TRIM(p.NOMBRES) as nombre,
        TRIM(p.APELLIDOS) as apellidos,
        TRIM(p.NOMBRES) as nombres,
        COALESCE(p.EMAIL, '') as email,
        COALESCE(t.NUMEROTELEFONO, '') as numero,
        COALESCE(pa.NOMBRE, '') as pais,
        COALESCE(pr.NOMBRE, '') as estado,
        COALESCE(c.NOMBRE, '') as ciudad,
        COALESCE(d.DIRECCION, '') as direccion
      FROM TBL_PERSONA p
      LEFT JOIN TBL_TELEFONO t ON p.IDPERSONA = t.IDPERSONA
      LEFT JOIN TBL_LUGAR_DOMICILIO d ON p.IDLUGARDOMICILIO = d.IDLUGARDOMICILIO
      LEFT JOIN TBL_CANTON c ON d.IDCANTON = c.IDCANTON
      LEFT JOIN TBL_PROVINCIA pr ON c.IDPROVINCIA = pr.IDPROVINCIA
      LEFT JOIN TBL_PAIS pa ON pr.IDPAIS = pa.IDPAIS
      WHERE p.APELLIDOS IS NOT NULL
      ORDER BY p.IDPERSONA DESC
      FETCH FIRST ${limit} ROWS ONLY
    `);
    
    // Convertir las claves de MAYÚSCULAS a minúsculas
    const usuarios = resultados.map((row: any) => {
      const usuario: any = {};
      for (const key in row) {
        usuario[key.toLowerCase()] = row[key];
      }
      return usuario;
    });
    
    res.json(usuarios);
  } catch (error: any) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
});

// GET - Obtener un usuario específico por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const usuarios = await query(`
      SELECT 
        p.IDPERSONA as id,
        p.APELLIDOS as apellidos,
        p.NOMBRES as nombres,
        TRIM(p.APELLIDOS) || ', ' || TRIM(p.NOMBRES) as nombre,
        p.EMAIL as email,
        t.NUMEROTELEFONO as numero,
        t.IDTELEFONO as id_telefono,
        pa.NOMBRE as pais,
        pa.IDPAIS as id_pais,
        pr.NOMBRE as estado,
        pr.IDPROVINCIA as id_provincia,
        c.NOMBRE as ciudad,
        c.IDCANTON as id_canton,
        d.DIRECCION as direccion,
        d.IDLUGARDOMICILIO as id_domicilio
      FROM TBL_PERSONA p
      LEFT JOIN TBL_TELEFONO t ON p.IDPERSONA = t.IDPERSONA
      LEFT JOIN TBL_LUGAR_DOMICILIO d ON p.IDLUGARDOMICILIO = d.IDLUGARDOMICILIO
      LEFT JOIN TBL_CANTON c ON d.IDCANTON = c.IDCANTON
      LEFT JOIN TBL_PROVINCIA pr ON c.IDPROVINCIA = pr.IDPROVINCIA
      LEFT JOIN TBL_PAIS pa ON pr.IDPAIS = pa.IDPAIS
      WHERE p.IDPERSONA = ?
    `, [req.params.id]);
    
    if (usuarios.length > 0) {
      res.json(usuarios[0]);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error: any) {
    console.error('❌ Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
  }
});

// POST - Crear nuevo usuario (solo lectura por ahora, puedes habilitar INSERT después)
app.post('/api/usuarios', async (req, res) => {
  try {
    // Nota: Por ahora retornamos error ya que insertar requiere IDs de las tablas relacionadas
    
    res.status(501).json({ 
      error: 'Creación no implementada aún',
      message: 'Para crear usuarios se requieren los IDs de país, provincia y cantón. Usa el frontend para consultar datos existentes.'
    });
  } catch (error: any) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario', details: error.message });
  }
});

// PUT - Actualizar usuario (solo lectura por ahora)
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    res.status(501).json({ 
      error: 'Actualización no implementada aún',
      message: 'Por ahora el sistema está en modo solo lectura'
    });
  } catch (error: any) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
  }
});

// DELETE - Eliminar usuario (solo lectura por ahora)
app.delete('/api/usuarios/:id', (req, res) => {
  res.status(501).json({ 
    error: 'Eliminación no implementada',
    message: 'Por ahora el sistema está en modo solo lectura'
  });
});


app.get('/api/paises', async (req, res) => {
  try {
    const paises = await query('SELECT IDPAIS as id, NOMBRE as nombre FROM TBL_PAIS ORDER BY NOMBRE');
    res.json(paises);
  } catch (error: any) {
    console.error('❌ Error al obtener países:', error);
    res.status(500).json({ error: 'Error al obtener países', details: error.message });
  }
});

app.get('/api/provincias/:idPais', async (req, res) => {
  try {
    const provincias = await query(
      'SELECT IDPROVINCIA as id, NOMBRE as nombre FROM TBL_PROVINCIA WHERE IDPAIS = ? ORDER BY NOMBRE',
      [req.params.idPais]
    );
    res.json(provincias);
  } catch (error: any) {
    console.error('❌ Error al obtener provincias:', error);
    res.status(500).json({ error: 'Error al obtener provincias', details: error.message });
  }
});


app.get('/api/cantones/:idProvincia', async (req, res) => {
  try {
    const cantones = await query(
      'SELECT IDCANTON as id, NOMBRE as nombre FROM TBL_CANTON WHERE IDPROVINCIA = ? ORDER BY NOMBRE',
      [req.params.idProvincia]
    );
    res.json(cantones);
  } catch (error: any) {
    console.error('❌ Error al obtener cantones:', error);
    res.status(500).json({ error: 'Error al obtener cantones', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Conectado a DB2 - Base de datos: SAAC`);
  console.log(`📋 Modo: Solo lectura (10 registros por defecto)`);
});
