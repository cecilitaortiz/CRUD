import React from 'react';
import type { Usuario } from '../types/Usuario';

interface ListaUsuariosProps {
  usuarios: Usuario[];
  onEditar: (usuario: Usuario) => void;
  onEliminar: (id: string) => void;
}

const ListaUsuarios: React.FC<ListaUsuariosProps> = ({ usuarios, onEditar, onEliminar }) => {
  return (
    <div style={styles.contenedor}>
      <h3 style={styles.titulo}>Lista de Usuarios ({usuarios.length})</h3>
      
      {usuarios.length === 0 ? (
        <p style={styles.mensajeVacio}>No hay usuarios registrados</p>
      ) : (
        <div style={styles.tabla}>
          <div style={styles.encabezado}>
            <div style={styles.celda}>Nombre</div>
            <div style={styles.celda}>Dirección</div>
            <div style={styles.celda}>Estado</div>
            <div style={styles.celda}>Ciudad</div>
            <div style={styles.celdaAcciones}>Acciones</div>
          </div>
          
          {usuarios.map((usuario, index) => (
            <div key={usuario.id || `usuario-${index}`} style={styles.fila}>
              <div style={styles.celda}>{usuario.nombre || 'Sin nombre'}</div>
              <div style={styles.celda}>{usuario.direccion || 'Sin dirección'}</div>
              <div style={styles.celda}>{usuario.estado || 'Sin estado'}</div>
              <div style={styles.celda}>{usuario.ciudad || 'Sin ciudad'}</div>
              <div style={styles.celdaAcciones}>
                <button 
                  onClick={() => onEditar(usuario)} 
                  style={styles.btnEditar}
                  title="Editar usuario"
                >
                  Editar
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`¿Eliminar a ${usuario.nombre}?`)) {
                      onEliminar(usuario.id);
                    }
                  }}
                  style={styles.btnEliminar}
                  title="Eliminar usuario"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  contenedor: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  titulo: {
    marginTop: 0,
    marginBottom: '15px',
    color: '#333'
  },
  mensajeVacio: {
    textAlign: 'center',
    color: '#999',
    padding: '20px'
  },
  tabla: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  encabezado: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 120px',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '4px',
    fontSize: '14px'
  },
  fila: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 120px',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    alignItems: 'center',
    fontSize: '14px'
  },
  celda: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  celdaAcciones: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center'
  },
  direccion: {
    fontSize: '12px',
    color: '#666'
  },
  sinUbicacion: {
    fontSize: '12px',
    color: '#999',
    fontStyle: 'italic'
  },
  btnEditar: {
    padding: '6px 12px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  btnEliminar: {
    padding: '6px 12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default ListaUsuarios;
