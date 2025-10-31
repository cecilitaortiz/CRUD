import React, { useState, useEffect } from 'react';
import type { Usuario } from '../types/Usuario';
import {
  CitySelect,
  CountrySelect,
  StateSelect
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

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
  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);
  const [countryName, setCountryName] = useState('');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (usuarioEditar) {
      setNombre(usuarioEditar.nombre || '');
      setNumero(usuarioEditar.numero || '');
      setEmail(usuarioEditar.email || '');
      setCountryName(usuarioEditar.pais || '');
      setStateName(usuarioEditar.estado || '');
      setCityName(usuarioEditar.ciudad || '');
      setAddress(usuarioEditar.direccion || '');
      setCountryId(0);
      setStateId(0);
    } else {
      limpiarFormulario();
    }
  }, [usuarioEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({ 
      nombre, 
      numero, 
      email,
      direccion: address,
      pais: countryName,
      estado: stateName,
      ciudad: cityName
    });
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre('');
    setNumero('');
    setEmail('');
    setCountryId(0);
    setStateId(0);
    setCountryName('');
    setStateName('');
    setCityName('');
    setAddress('');
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
          maxLength={50}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[a-zA-ZñÑ\s]*$/.test(value)) {
              setNombre(value);
            }
          }}
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
          onChange={(e) => {
            const value = e.target.value;
            if (/^[0-9]*$/.test(value)) {
              setNumero(value);
            }
          }}
          required
          min="0"
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
          maxLength={20}
          style={styles.input}
          placeholder="Ej: correo@ejemplo.com"
        />
      </div>
       <div style={styles.campo}>
        <label style={styles.label}>Dirección:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          maxLength={50}
          style={styles.input}
          placeholder="Ej: Calle Falsa 123"
        />
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>País:</label>
        {usuarioEditar && countryName && countryId === 0 ? (
          <div>
            <p style={styles.selectedText}>Valor actual: <strong>{countryName}</strong></p>
            <small style={styles.ayuda}>Selecciona un nuevo país para cambiar</small>
          </div>
        ) : null}
        <CountrySelect
          onChange={(e: any) => {
            setCountryId(e.id);
            setCountryName(e.name);
            setStateId(0);
            setStateName('');
            setCityName('');
          }}
          placeHolder={usuarioEditar && countryName ? `Cambiar de: ${countryName}` : "Selecciona un país"}
        />
        {countryName && countryId !== 0 && <p style={styles.selectedText}>Nuevo: {countryName}</p>}
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>Estado/Provincia:</label>
        {usuarioEditar && stateName && stateId === 0 ? (
          <div>
            <p style={styles.selectedText}>Valor actual: <strong>{stateName}</strong></p>
            <small style={styles.ayuda}>Selecciona primero un país</small>
          </div>
        ) : null}
        <StateSelect
          key={`state-${countryId}`}
          countryid={countryId}
          onChange={(e: any) => {
            setStateId(e.id);
            setCityName('');
            setStateName(e.name);
            
          }}
          placeHolder={usuarioEditar && stateName ? `Cambiar de: ${stateName}` : "Selecciona un estado"}
        />
        {stateName && stateId !== 0 && <p style={styles.selectedText}>Nuevo: {stateName}</p>}
      </div>

      <div style={styles.campo}>
        <label style={styles.label}>Ciudad:</label>
        {usuarioEditar && cityName && stateId === 0 ? (
          <div>
            <p style={styles.selectedText}>Valor actual: <strong>{cityName}</strong></p>
            <small style={styles.ayuda}>Selecciona primero un país y estado</small>
          </div>
        ) : null}
        <CitySelect
          key={`city-${countryId}-${stateId}`}
          countryid={countryId}
          stateid={stateId}
          onChange={(e: any) => {
            setCityName(e.name);
          }}
          placeHolder={usuarioEditar && cityName ? `Cambiar de: ${cityName}` : "Selecciona una ciudad"}
        />
        {cityName && (countryId !== 0 || stateId !== 0) && <p style={styles.selectedText}>Nuevo: {cityName}</p>}
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
