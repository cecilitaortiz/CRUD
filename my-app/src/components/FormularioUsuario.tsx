import React, { useState, useEffect } from 'react';
import type { Usuario } from '../types/Usuario';

interface Pais {
  id: number;
  nombre: string;
}

interface Provincia {
  id: number;
  nombre: string;
}

interface Canton {
  id: number;
  nombre: string;
}

interface FormularioUsuarioProps {
  usuarioEditar: Usuario | null;
  onGuardar: (datos: Omit<Usuario, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => void;
  onCancelar?: () => void;
}

const FormularioUsuario: React.FC<FormularioUsuarioProps> = ({ 
  usuarioEditar, 
  onGuardar, 
  onCancelar 
}) => {
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  
  // Campos obligatorios de TBL_PERSONA
  const [tipoIdentificacion, setTipoIdentificacion] = useState('CED');
  const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
  const [tieneDiscapacidad, setTieneDiscapacidad] = useState('N');
  const [tieneFamilDiscapacidad, setTieneFamilDiscapacidad] = useState('N');
  const [idNacionalidad, setIdNacionalidad] = useState(1);
  
  // Listas de la BD
  const [paises, setPaises] = useState<Pais[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [cantones, setCantones] = useState<Canton[]>([]);
  
  // IDs seleccionados
  const [paisId, setPaisId] = useState<number>(0);
  const [provinciaId, setProvinciaId] = useState<number>(0);
  const [cantonId, setCantonId] = useState<number>(0);

  // Cargar países al inicio
  useEffect(() => {
    cargarPaises();
  }, []);

  // Cargar datos cuando se edita un usuario
  useEffect(() => {
    if (usuarioEditar) {
      setNombre(usuarioEditar.NOMBRE || usuarioEditar.nombre || '');
      setNumero(usuarioEditar.NUMERO || usuarioEditar.numero || '');
      setEmail(usuarioEditar.EMAIL || usuarioEditar.email || '');
      setDireccion(usuarioEditar.DIRECCION || usuarioEditar.direccion || '');
      setTipoIdentificacion(usuarioEditar.TIPOIDENTIFICACION || usuarioEditar.tipoIdentificacion || 'CED');
      setNumeroIdentificacion(usuarioEditar.NUMEROIDENTIFICACION || usuarioEditar.numeroIdentificacion || '');
      setTieneDiscapacidad(usuarioEditar.TIENEDISCAPACIDAD || usuarioEditar.tieneDiscapacidad || 'N');
      setTieneFamilDiscapacidad(usuarioEditar.TIENEFAMILDISCAPACIDAD || usuarioEditar.tieneFamilDiscapacidad || 'N');
      setIdNacionalidad(usuarioEditar.IDNACIONALIDAD || usuarioEditar.idNacionalidad || 1);
      
      const paisIdVal = usuarioEditar.ID_PAIS || usuarioEditar.id_pais;
      const provinciaIdVal = usuarioEditar.ID_PROVINCIA || usuarioEditar.id_provincia;
      const cantonIdVal = usuarioEditar.ID_CANTON || usuarioEditar.id_canton;
      
      if (paisIdVal && paisIdVal > 0) {
        setPaisId(paisIdVal);
        cargarProvincias(paisIdVal);
        
        if (provinciaIdVal && provinciaIdVal > 0) {
          setProvinciaId(provinciaIdVal);
          cargarCantones(provinciaIdVal);
          
          if (cantonIdVal && cantonIdVal > 0) {
            setCantonId(cantonIdVal);
          }
        }
      } else {
        // Si no tiene ubicación, resetear los valores
        setPaisId(0);
        setProvinciaId(0);
        setCantonId(0);
        setProvincias([]);
        setCantones([]);
      }
    } else {
      limpiarFormulario();
    }
  }, [usuarioEditar]);

  const cargarPaises = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/paises');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Países cargados:', data);
      if (Array.isArray(data)) {
        setPaises(data);
      } else {
        console.error('Los países no son un array:', data);
      }
    } catch (error) {
      console.error('Error al cargar países:', error);
      alert('No se pudieron cargar los países. Verifica que el servidor esté corriendo.');
    }
  };

  const cargarProvincias = async (idPais: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/provincias/${idPais}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Provincias cargadas:', data);
      if (Array.isArray(data)) {
        setProvincias(data);
      }
    } catch (error) {
      console.error('Error al cargar provincias:', error);
    }
  };

  const cargarCantones = async (idProvincia: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/cantones/${idProvincia}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Cantones cargados:', data);
      if (Array.isArray(data)) {
        setCantones(data);
      }
    } catch (error) {
      console.error('Error al cargar cantones:', error);
    }
  };

  const handlePaisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setPaisId(id);
    setProvinciaId(0);
    setCantonId(0);
    setProvincias([]);
    setCantones([]);
    if (id > 0) {
      cargarProvincias(id);
    }
  };

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setProvinciaId(id);
    setCantonId(0);
    setCantones([]);
    if (id > 0) {
      cargarCantones(id);
    }
  };

  const handleCantonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setCantonId(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado un cantón válido
    if (!cantonId || cantonId === 0) {
      alert('Por favor selecciona un país, provincia y cantón');
      return;
    }
    
    // Validar identificación
    if (!numeroIdentificacion || numeroIdentificacion.trim() === '') {
      alert('Por favor ingresa el número de identificación');
      return;
    }
    
    if (tipoIdentificacion === 'CED' && numeroIdentificacion.length !== 10) {
      alert('La cédula debe tener exactamente 10 dígitos');
      return;
    }
    
    if (tipoIdentificacion === 'RUC' && numeroIdentificacion.length !== 13) {
      alert('El RUC debe tener exactamente 13 dígitos');
      return;
    }
    
    if (tipoIdentificacion === 'PAS' && (numeroIdentificacion.length < 6 || numeroIdentificacion.length > 15)) {
      alert('El pasaporte debe tener entre 6 y 15 caracteres');
      return;
    }
    
    const paisNombre = paises.find(p => p.id === paisId)?.nombre || '';
    const provinciaNombre = provincias.find(p => p.id === provinciaId)?.nombre || '';
    const cantonNombre = cantones.find(c => c.id === cantonId)?.nombre || '';
    
    const datosAGuardar = { 
      nombre, 
      numero, 
      email,
      direccion,
      pais: paisNombre,
      estado: provinciaNombre,
      ciudad: cantonNombre,
      id_pais: paisId,
      id_provincia: provinciaId,
      id_canton: cantonId,
      tipoIdentificacion,
      numeroIdentificacion,
      estadoPersona: 'A', 
      tieneDiscapacidad,
      tieneFamilDiscapacidad,
      idNacionalidad,
      version: usuarioEditar?.VERSION || usuarioEditar?.version
    };
    
    console.log('📋 Datos del formulario antes de guardar:', datosAGuardar);
    
    onGuardar(datosAGuardar);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre('');
    setNumero('');
    setEmail('');
    setDireccion('');
    setTipoIdentificacion('CED');
    setNumeroIdentificacion('');
    setTieneDiscapacidad('N');
    setTieneFamilDiscapacidad('N');
    setIdNacionalidad(1);
    setPaisId(0);
    setProvinciaId(0);
    setCantonId(0);
    setProvincias([]);
    setCantones([]);
  };

  const handleCancelar = () => {
    limpiarFormulario();
    if (onCancelar) onCancelar();
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>{usuarioEditar ? 'Editar Usuario' : 'Agregar Usuario'}</h3>     
      <div style={styles.campo}>
        <label style={styles.label}>Nombre Completo:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[A-Za-z,\s]*$/.test(value)) {
              setNombre(value);
            }
          }}
          required
          maxLength={50}
          style={styles.input}
          placeholder="Apellidos, Nombres"
        />
        <small style={styles.ayuda}>Formato: Apellidos, Nombres</small>
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>Número:</label>
        <input
          type="tel"
          value={numero}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[0-9]*$/.test(value)) {
              setNumero(value);
            }
          }}
          required
          maxLength={10}
          style={styles.input}
          placeholder="Ej: 555-1234"
        />
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={100}
          style={styles.input}
          placeholder="Ej: correo@ejemplo.com"
        />
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>Tipo de Identificación:</label>
        <select
          value={tipoIdentificacion}
          onChange={(e) => setTipoIdentificacion(e.target.value)}
          required
          style={styles.input}
        >
          <option value="CED">Cédula</option>
          <option value="PAS">Pasaporte</option>
          <option value="RUC">RUC</option>
        </select>
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>Número de Identificación:</label>
        <input
          type="text"
          value={numeroIdentificacion}
          onChange={(e) => {
            const value = e.target.value;
            if (tipoIdentificacion === 'CED' && /^[0-9]*$/.test(value) && value.length <= 10) {
              setNumeroIdentificacion(value);
            } else if (tipoIdentificacion === 'RUC' && /^[0-9]*$/.test(value) && value.length <= 13) {
              setNumeroIdentificacion(value);
            } else if (tipoIdentificacion === 'PAS' && value.length <= 15) {
              setNumeroIdentificacion(value);
            }
          }}
          required
          maxLength={tipoIdentificacion === 'CED' ? 10 : tipoIdentificacion === 'RUC' ? 13 : 15}
          style={styles.input}
          placeholder={
            tipoIdentificacion === 'CED' ? 'Ej: 0123456789' :
            tipoIdentificacion === 'RUC' ? 'Ej: 0123456789001' :
            'Ej: AB123456'
          }
        />
        <small style={styles.ayuda}>
          {tipoIdentificacion === 'CED' && 'Cédula: 10 dígitos'}
          {tipoIdentificacion === 'RUC' && 'RUC: 13 dígitos'}
          {tipoIdentificacion === 'PAS' && 'Pasaporte: entre 6 y 15 caracteres alfanuméricos'}
        </small>
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>Dirección:</label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
          maxLength={200}
          style={styles.input}
          placeholder="Ej: Calle Falsa 123"
        />
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>País:</label>
        <select 
          value={paisId} 
          onChange={handlePaisChange}
          style={styles.input}
          required
        >
          <option value={0}>Selecciona un país</option>
          {paises.map(pais => (
            <option key={pais.id} value={pais.id}>{pais.nombre}</option>
          ))}
        </select>
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>Provincia/Estado:</label>
        <select 
          value={provinciaId} 
          onChange={handleProvinciaChange}
          style={styles.input}
          required
          disabled={!paisId}
        >
          <option value={0}>Selecciona una provincia</option>
          {provincias.map(provincia => (
            <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
          ))}
        </select>
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>Cantón/Ciudad:</label>
        <select 
          value={cantonId} 
          onChange={handleCantonChange}
          style={styles.input}
          required
          disabled={!provinciaId}
        >
          <option value={0}>Selecciona un cantón</option>
          {cantones.map(canton => (
            <option key={canton.id} value={canton.id}>{canton.nombre}</option>
          ))}
        </select>
      </div>

      <div style={styles.separador}>
        <h4 style={styles.subtitulo}>Información Adicional</h4>
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>¿Tiene discapacidad?</label>
        <select
          value={tieneDiscapacidad}
          onChange={(e) => setTieneDiscapacidad(e.target.value)}
          required
          style={styles.input}
        >
          <option value="N">No</option>
          <option value="S">Sí</option>
        </select>
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>¿Tiene familiar con discapacidad?</label>
        <select
          value={tieneFamilDiscapacidad}
          onChange={(e) => setTieneFamilDiscapacidad(e.target.value)}
          required
          style={styles.input}
        >
          <option value="N">No</option>
          <option value="S">Sí</option>
        </select>
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>Nacionalidad (ID):</label>
        <input
          type="number"
          value={idNacionalidad}
          onChange={(e) => setIdNacionalidad(parseInt(e.target.value) || 1)}
          required
          min="1"
          style={styles.input}
          placeholder="1"
        />
        <small style={styles.ayuda}>Por defecto 1 = Ecuador</small>
      </div>

      <div style={styles.botones}>
        <button type="submit" style={styles.btnGuardar}>
          {usuarioEditar ? 'Actualizar' : 'Agregar'}
        </button>
        {usuarioEditar && (
          <button type="button" onClick={handleCancelar} style={styles.btnCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    maxWidth: '500px'
  },
  alerta: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '15px',
    border: '1px solid #ffeaa7',
    fontSize: '14px'
  },
  separador: {
    marginTop: '20px',
    marginBottom: '15px',
    borderTop: '2px solid #ddd',
    paddingTop: '15px'
  },
  subtitulo: {
    margin: 0,
    color: '#555',
    fontSize: '16px'
  },
  campo: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  selectedText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px',
    fontStyle: 'italic'
  },
  ayuda: {
    fontSize: '11px',
    color: '#999',
    display: 'block',
    marginTop: '4px',
    marginBottom: '8px'
  },
  botones: {
    display: 'flex',
    gap: '10px'
  },
  btnGuardar: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  btnCancelar: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  }
};

export default FormularioUsuario;
