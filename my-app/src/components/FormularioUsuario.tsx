import React, { useState, useEffect } from 'react';
import type { Usuario } from '../types/Usuario';

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

  useEffect(() => {
    if (usuarioEditar) {
      setNombre(usuarioEditar.nombre || '');
      setNumero(usuarioEditar.numero || '');
      setEmail(usuarioEditar.email || '');
    }
  }, [usuarioEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({ nombre, numero, email });
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre('');
    setNumero('');
    setEmail('');
  };

  const handleCancelar = () => {
    limpiarFormulario();
    if (onCancelar) onCancelar();
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>{usuarioEditar ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
      
      <div style={styles.campo}>
        <label style={styles.label}>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={styles.input}
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>Número:</label>
        <input
          type="tel"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
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
          style={styles.input}
          placeholder="Ej: correo@ejemplo.com"
        />
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
