import React from 'react';
import type { Usuario } from '../types/Usuario';

interface ListaUsuariosProps {
  usuarios: Usuario[];
  onEditar: (usuario: Usuario) => void;
  onEliminar: (id: string) => void;
}

const ListaUsuarios: React.FC<ListaUsuariosProps> = ({ usuarios, onEditar, onEliminar }) => {
  if (!usuarios || usuarios.length === 0) {
    return <p style={styles.vacio}>No hay usuarios registrados.</p>;
  }

  return (
    <div style={styles.contenedor}>
      <h3>Lista de Usuarios ({usuarios.length})</h3>
      <table style={styles.tabla}>
        <thead>
          <tr style={styles.encabezado}>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Número</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} style={styles.fila}>
              <td style={styles.td}>{usuario.nombre}</td>
              <td style={styles.td}>{usuario.numero}</td>
              <td style={styles.td}>{usuario.email}</td>
              <td style={styles.td}>
                <button
                  onClick={() => onEditar(usuario)}
                  style={styles.btnEditar}
                >
                  Editar
                </button>
                <button
                  onClick={() => onEliminar(usuario.id)}
                  style={styles.btnEliminar}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  contenedor: {
    marginTop: '20px'
  },
  vacio: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px'
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  encabezado: {
    backgroundColor: '#2196F3',
    color: 'white'
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold'
  },
  fila: {
    borderBottom: '1px solid #ddd'
  },
  td: {
    padding: '12px'
  },
  btnEditar: {
    backgroundColor: '#FF9800',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '12px'
  },
  btnEliminar: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  }
};

export default ListaUsuarios;
