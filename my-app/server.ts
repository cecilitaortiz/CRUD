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
    console.error(' No se pudo conectar a DB2. Verifica la configuración en .env');
    process.exit(1);
  }
});

// GET - Obtener personas (limitado a 10 registros)
app.get('/api/usuarios', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    
    // Query con JOIN para obtener datos incluyendo IDs para actualizar
    const resultados = await query(`
      SELECT 
        p.IDPERSONA as ID,
        TRIM(p.APELLIDOS) || ', ' || TRIM(p.NOMBRES) as NOMBRE,
        TRIM(p.APELLIDOS) as APELLIDOS,
        TRIM(p.NOMBRES) as NOMBRES,
        COALESCE(p.EMAIL, '') as EMAIL,
        COALESCE(t.NUMEROTELEFONO, '') as NUMERO,
        t.IDTELEFONO as ID_TELEFONO,
        COALESCE(pa.NOMBRE, '') as PAIS,
        pa.IDPAIS as ID_PAIS,
        COALESCE(pr.NOMBRE, '') as ESTADO,
        pr.IDPROVINCIA as ID_PROVINCIA,
        COALESCE(c.NOMBRE, '') as CIUDAD,
        c.IDCANTON as ID_CANTON,
        COALESCE(d.DIRECCION, '') as DIRECCION,
        d.IDLUGARDOMICILIO as ID_DOMICILIO,
        p.TIPOIDENTIFICACION,
        p.NUMEROIDENTIFICACION,
        p.ESTADOPERSONA,
        p.TIENEDISCAPACIDAD,
        p.TIENEFAMILDISCAPACIDAD,
        p.IDNACIONALIDAD,
        p.VERSION
      FROM TBL_PERSONA p
      LEFT JOIN TBL_TELEFONO t ON p.IDPERSONA = t.IDPERSONA
      LEFT JOIN TBL_LUGAR_DOMICILIO d ON p.IDLUGARDOMICILIO = d.IDLUGARDOMICILIO
      LEFT JOIN TBL_CANTON c ON d.IDCANTON = c.IDCANTON
      LEFT JOIN TBL_PROVINCIA pr ON c.IDPROVINCIA = pr.IDPROVINCIA
      LEFT JOIN TBL_PAIS pa ON pr.IDPAIS = pa.IDPAIS
      WHERE p.APELLIDOS IS NOT NULL
        AND p.TIPOIDENTIFICACION IS NOT NULL
        AND p.NUMEROIDENTIFICACION IS NOT NULL
        AND p.ESTADOPERSONA = 'A'
        AND p.TIENEDISCAPACIDAD IS NOT NULL
        AND p.TIENEFAMILDISCAPACIDAD IS NOT NULL
        AND p.IDNACIONALIDAD IS NOT NULL
      ORDER BY p.IDPERSONA DESC
      FETCH FIRST ${limit} ROWS ONLY
    `);
    
    res.json(resultados);
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
        d.IDLUGARDOMICILIO as id_domicilio,
        p.TIPOIDENTIFICACION as tipoIdentificacion,
        p.NUMEROIDENTIFICACION as numeroIdentificacion,
        p.ESTADOPERSONA as estadoPersona,
        p.TIENEDISCAPACIDAD as tieneDiscapacidad,
        p.TIENEFAMILDISCAPACIDAD as tieneFamilDiscapacidad,
        p.IDNACIONALIDAD as idNacionalidad,
        p.VERSION as version
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

// POST - Crear nuevo usuario
app.post('/api/usuarios', async (req, res) => {
  try {
    const { 
      nombres, 
      apellidos, 
      email, 
      numero, 
      pais, 
      provincia, 
      canton, 
      direccion,
      tipoIdentificacion,
      numeroIdentificacion,
      tieneDiscapacidad,
      tieneFamilDiscapacidad,
      idNacionalidad
    } = req.body;
    
    // Validaciones básicas
    if (!nombres || !apellidos) {
      return res.status(400).json({ error: 'Nombres y apellidos son requeridos' });
    }

    if (!tipoIdentificacion || !numeroIdentificacion) {
      return res.status(400).json({ error: 'Tipo y número de identificación son requeridos' });
    }

    if (!canton || canton === 0) {
      return res.status(400).json({ error: 'Debe seleccionar un cantón válido' });
    }

    if (!direccion || direccion.trim() === '') {
      return res.status(400).json({ error: 'La dirección es requerida' });
    }

    const tipoIdFinal = tipoIdentificacion || 'CED';
    const estadoPersona = 'A'; // Siempre Activo al crear
    const discapacidadFinal = tieneDiscapacidad || 'N';
    const familDiscapacidadFinal = tieneFamilDiscapacidad || 'N';
    const nacionalidadFinal = idNacionalidad ? parseInt(idNacionalidad.toString()) : 1;

    console.log('📝 Creando usuario con valores:', {
      nombres,
      apellidos,
      email,
      tipoIdFinal,
      numeroIdentificacion,
      estadoPersona,
      discapacidadFinal,
      familDiscapacidadFinal,
      nacionalidadFinal
    });

    // Verificar si ya existe una persona con ese número de identificación
    const [existente] = await query(
      'SELECT IDPERSONA FROM TBL_PERSONA WHERE NUMEROIDENTIFICACION = ?',
      [numeroIdentificacion]
    );

    if (existente) {
      return res.status(400).json({ 
        error: 'Ya existe una persona con ese número de identificación',
        numeroIdentificacion 
      });
    }

    // Obtener IDPAIS del cantón seleccionado
    const [cantonInfo] = await query(
      `SELECT pr.IDPAIS 
       FROM TBL_CANTON c
       JOIN TBL_PROVINCIA pr ON c.IDPROVINCIA = pr.IDPROVINCIA
       WHERE c.IDCANTON = ?`,
      [canton]
    );
    
    const idPais = cantonInfo?.IDPAIS || 1;

    // PASO 1: Crear la persona SIN domicilio primero
    await execute(
      `INSERT INTO TBL_PERSONA (
        NOMBRES, 
        APELLIDOS, 
        EMAIL,
        TIPOIDENTIFICACION,
        NUMEROIDENTIFICACION,
        ESTADOPERSONA,
        TIENEDISCAPACIDAD,
        TIENEFAMILDISCAPACIDAD,
        IDNACIONALIDAD,
        VERSION
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombres, 
        apellidos, 
        email || null,
        tipoIdFinal,
        numeroIdentificacion,
        estadoPersona,
        discapacidadFinal,
        familDiscapacidadFinal,
        nacionalidadFinal,
        1 
      ]
    );

    // Obtener ID de la persona creada
    const [persona] = await query(
      'SELECT IDPERSONA FROM TBL_PERSONA ORDER BY IDPERSONA DESC FETCH FIRST 1 ROW ONLY'
    );
    const idPersona = persona.IDPERSONA;
    console.log('✅ Persona creada con ID:', idPersona);

    // PASO 2: Crear domicilio con IDPERSONA 
    await execute(
      `INSERT INTO TBL_LUGAR_DOMICILIO 
       (DIRECCION, IDCANTON, IDPAIS, IDPERSONA, ESTADO, TIPO, VERSION, DIRECCIONTIPONRO, NAMEARCHIVOCROQUIS) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [direccion, canton, idPais, idPersona, 'A', 'L', 1, 'S#S/N', '0,0']
    );
    
    const [lastDomicilio] = await query(
      'SELECT IDLUGARDOMICILIO FROM TBL_LUGAR_DOMICILIO ORDER BY IDLUGARDOMICILIO DESC FETCH FIRST 1 ROW ONLY'
    );
    const idDomicilio = lastDomicilio.IDLUGARDOMICILIO;
    console.log('✅ Domicilio creado con ID:', idDomicilio);

    // PASO 3: Actualizar la persona con el IDLUGARDOMICILIO
    await execute(
      'UPDATE TBL_PERSONA SET IDLUGARDOMICILIO = ? WHERE IDPERSONA = ?',
      [idDomicilio, idPersona]
    );

    // PASO 4: Insertar teléfono si se proporciona
    if (numero && numero.trim() !== '') {
      await execute(
        'INSERT INTO TBL_TELEFONO (NUMEROTELEFONO, IDPERSONA) VALUES (?, ?)',
        [numero, idPersona]
      );
      console.log('✅ Teléfono creado');
    }

    // Obtener el usuario completo recién creado
    const [usuarioCreado] = await query(`
      SELECT 
        p.IDPERSONA as id,
        p.APELLIDOS as apellidos,
        p.NOMBRES as nombres,
        TRIM(p.APELLIDOS) || ', ' || TRIM(p.NOMBRES) as nombre,
        p.EMAIL as email,
        t.NUMEROTELEFONO as numero,
        pa.NOMBRE as pais,
        pr.NOMBRE as estado,
        c.NOMBRE as ciudad,
        d.DIRECCION as direccion
      FROM TBL_PERSONA p
      LEFT JOIN TBL_TELEFONO t ON p.IDPERSONA = t.IDPERSONA
      LEFT JOIN TBL_LUGAR_DOMICILIO d ON p.IDLUGARDOMICILIO = d.IDLUGARDOMICILIO
      LEFT JOIN TBL_CANTON c ON d.IDCANTON = c.IDCANTON
      LEFT JOIN TBL_PROVINCIA pr ON c.IDPROVINCIA = pr.IDPROVINCIA
      LEFT JOIN TBL_PAIS pa ON pr.IDPAIS = pa.IDPAIS
      WHERE p.IDPERSONA = ?
    `, [idPersona]);

    res.status(201).json(usuarioCreado);
  } catch (error: any) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario', details: error.message });
  }
});

// PUT - Actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombres, 
      apellidos, 
      email, 
      numero, 
      canton, 
      direccion, 
      id_telefono, 
      id_domicilio,
      tipoIdentificacion,
      numeroIdentificacion,
      estadoPersona,
      tieneDiscapacidad,
      tieneFamilDiscapacidad,
      idNacionalidad
    } = req.body;

    console.log('Datos recibidos para actualización:', req.body);

    // Validaciones
    if (!nombres || !apellidos) {
      return res.status(400).json({ error: 'Nombres y apellidos son requeridos' });
    }

    // Validar campos
    if (!tipoIdentificacion || !numeroIdentificacion) {
      return res.status(400).json({ error: 'Tipo y número de identificación son requeridos' });
    }

    // Verificar si el número de identificación ya existe en otra persona
    const [existente] = await query(
      'SELECT IDPERSONA FROM TBL_PERSONA WHERE NUMEROIDENTIFICACION = ? AND IDPERSONA != ?',
      [numeroIdentificacion, id]
    );

    if (existente) {
      return res.status(400).json({ 
        error: 'Ya existe otra persona con ese número de identificación',
        numeroIdentificacion 
      });
    }

    // Validar canton
    if (!canton || canton === 0) {
      return res.status(400).json({ error: 'Debe seleccionar un cantón válido' });
    }

    // Validar que direccion tenga un valor
    if (!direccion || direccion.trim() === '') {
      return res.status(400).json({ error: 'La dirección es requerida' });
    }

    let idDomicilioFinal = id_domicilio;

    // 1. Actualizar o crear domicilio
    if (id_domicilio && id_domicilio > 0) {
      await execute(
        'UPDATE TBL_LUGAR_DOMICILIO SET DIRECCION = ?, IDCANTON = ? WHERE IDLUGARDOMICILIO = ?',
        [direccion, canton, id_domicilio]
      );
    } else {
      // Crear nuevo domicilio 
      const [cantonInfo] = await query(
        `SELECT pr.IDPAIS 
         FROM TBL_CANTON c
         JOIN TBL_PROVINCIA pr ON c.IDPROVINCIA = pr.IDPROVINCIA
         WHERE c.IDCANTON = ?`,
        [canton]
      );
      
      const idPais = cantonInfo?.IDPAIS || 1;
      
      await execute(
        `INSERT INTO TBL_LUGAR_DOMICILIO 
         (DIRECCION, IDCANTON, IDPAIS, IDPERSONA, ESTADO, TIPO) 
         VALUES (?, ?, ?, ?, 'A', 'D')`,
        [direccion, canton, idPais, id, 'A', 'D']
      );
      
      const [lastId] = await query(
        'SELECT IDLUGARDOMICILIO FROM TBL_LUGAR_DOMICILIO ORDER BY IDLUGARDOMICILIO DESC FETCH FIRST 1 ROW ONLY'
      );
      
      idDomicilioFinal = lastId.IDLUGARDOMICILIO;
    }

    // 2. Actualizar persona con TODOS los campos obligatorios
    const emailValue = email && email.trim() !== '' ? email : null;
    
    // Asegurar valores por defecto para campos obligatorios
    const tipoIdFinal = tipoIdentificacion || 'CED';
    const estadoFinal = estadoPersona || 'A';
    const discapacidadFinal = tieneDiscapacidad || 'N';
    const familDiscapacidadFinal = tieneFamilDiscapacidad || 'N';
    const nacionalidadFinal = idNacionalidad ? parseInt(idNacionalidad.toString()) : 1;
    
    console.log(' Valores finales para UPDATE:', {
      nombres,
      apellidos,
      emailValue,
      tipoIdFinal,
      numeroIdentificacion,
      estadoFinal,
      discapacidadFinal,
      familDiscapacidadFinal,
      nacionalidadFinal,
      idDomicilioFinal
    });
    
    await execute(
      `UPDATE TBL_PERSONA 
       SET NOMBRES = ?, 
           APELLIDOS = ?, 
           EMAIL = ?,
           TIPOIDENTIFICACION = ?,
           NUMEROIDENTIFICACION = ?,
           ESTADOPERSONA = ?,
           TIENEDISCAPACIDAD = ?,
           TIENEFAMILDISCAPACIDAD = ?,
           IDNACIONALIDAD = ?,
           IDLUGARDOMICILIO = ?
       WHERE IDPERSONA = ?`,
      [
        nombres, 
        apellidos, 
        emailValue, 
        tipoIdFinal,
        numeroIdentificacion,
        estadoFinal,
        discapacidadFinal,
        familDiscapacidadFinal,
        nacionalidadFinal,
        idDomicilioFinal,
        id
      ]
    );

    // 3. Actualizar o crear teléfono
    if (numero && numero.trim() !== '') {
      if (id_telefono) {
        await execute(
          'UPDATE TBL_TELEFONO SET NUMEROTELEFONO = ? WHERE IDTELEFONO = ?',
          [numero, id_telefono]
        );
      } else {
        await execute(
          'INSERT INTO TBL_TELEFONO (NUMEROTELEFONO, IDPERSONA) VALUES (?, ?)',
          [numero, id]
        );
      }
    } else if (id_telefono) {
      // Si se borró el número, eliminar el registro
      await execute('DELETE FROM TBL_TELEFONO WHERE IDTELEFONO = ?', [id_telefono]);
    }

    // Obtener el usuario actualizado
    const [usuarioActualizado] = await query(`
      SELECT 
        p.IDPERSONA as id,
        p.APELLIDOS as apellidos,
        p.NOMBRES as nombres,
        TRIM(p.APELLIDOS) || ', ' || TRIM(p.NOMBRES) as nombre,
        p.EMAIL as email,
        t.NUMEROTELEFONO as numero,
        pa.NOMBRE as pais,
        pr.NOMBRE as estado,
        c.NOMBRE as ciudad,
        d.DIRECCION as direccion
      FROM TBL_PERSONA p
      LEFT JOIN TBL_TELEFONO t ON p.IDPERSONA = t.IDPERSONA
      LEFT JOIN TBL_LUGAR_DOMICILIO d ON p.IDLUGARDOMICILIO = d.IDLUGARDOMICILIO
      LEFT JOIN TBL_CANTON c ON d.IDCANTON = c.IDCANTON
      LEFT JOIN TBL_PROVINCIA pr ON c.IDPROVINCIA = pr.IDPROVINCIA
      LEFT JOIN TBL_PAIS pa ON pr.IDPAIS = pa.IDPAIS
      WHERE p.IDPERSONA = ?
    `, [id]);

    res.json(usuarioActualizado);
  } catch (error: any) {
    console.error(' Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
  }
});

// DELETE - Eliminación LÓGICA
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const [usuario] = await query(
      'SELECT IDPERSONA, ESTADOPERSONA FROM TBL_PERSONA WHERE IDPERSONA = ?',
      [id]
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log(`Eliminación del usuario ${id}`);

    // Marcar como inactivo 
    await execute(
      'UPDATE TBL_PERSONA SET ESTADOPERSONA = ? WHERE IDPERSONA = ?',
      ['I', id]
    );
    
    res.json({ 
      message: 'Usuario desactivado exitosamente (eliminación lógica)', 
      id,
      note: 'El usuario fue marcado como inactivo. Los datos se conservan en la base de datos.'
    });
  } catch (error: any) {
    console.error(' Error al desactivar usuario:', error);
    res.status(500).json({ error: 'Error al desactivar usuario', details: error.message });
  }
});


app.get('/api/paises', async (req, res) => {
  try {
    const resultados = await query('SELECT IDPAIS as id, NOMBRE as nombre FROM TBL_PAIS ORDER BY NOMBRE');
    
    const paises = resultados.map((row: any) => ({
      id: row.IDPAIS || row.ID || row.id,
      nombre: row.NOMBRE || row.nombre
    }));
    
    res.json(paises);
  } catch (error: any) {
    console.error(' Error al obtener países:', error);
    res.status(500).json({ error: 'Error al obtener países', details: error.message });
  }
});

app.get('/api/provincias/:idPais', async (req, res) => {
  try {
    const resultados = await query(
      'SELECT IDPROVINCIA as id, NOMBRE as nombre FROM TBL_PROVINCIA WHERE IDPAIS = ? ORDER BY NOMBRE',
      [req.params.idPais]
    );
    
    const provincias = resultados.map((row: any) => ({
      id: row.IDPROVINCIA || row.ID || row.id,
      nombre: row.NOMBRE || row.nombre
    }));
    
    res.json(provincias);
  } catch (error: any) {
    console.error(' Error al obtener provincias:', error);
    res.status(500).json({ error: 'Error al obtener provincias', details: error.message });
  }
});


app.get('/api/cantones/:idProvincia', async (req, res) => {
  try {
    const resultados = await query(
      'SELECT IDCANTON as id, NOMBRE as nombre FROM TBL_CANTON WHERE IDPROVINCIA = ? ORDER BY NOMBRE',
      [req.params.idProvincia]
    );
    
    const cantones = resultados.map((row: any) => ({
      id: row.IDCANTON || row.ID || row.id,
      nombre: row.NOMBRE || row.nombre
    }));
    
    res.json(cantones);
  } catch (error: any) {
    console.error(' Error al obtener cantones:', error);
    res.status(500).json({ error: 'Error al obtener cantones', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(` Servidor backend ejecutándose en http://localhost:${PORT}`);
  console.log(` Conectado a DB2 - Base de datos: SAAC`);
  console.log(` Modo: CRUD completo (Create, Read, Update, Delete)`);
});
