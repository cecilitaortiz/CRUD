import { useState, useEffect } from 'react';
import type { Usuario } from './types/Usuario';
import FormularioUsuario from './components/FormularioUsuario';
import ListaUsuarios from './components/ListaUsuarios';

const API_URL = 'http://localhost:3001/api/usuarios';

interface Mensaje {
  texto: string;
  tipo: 'exito' | 'error';
}

function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);

  // Cargar usuarios
  useEffect(() => {
    cargarUsuarios();
  }, []);



  const cargarUsuarios = async () => {
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Verificar que data sea un array
      if (Array.isArray(data)) {
        setUsuarios(data);
      } else {
        console.error('La respuesta no es un array:', data);
        setUsuarios([]);
        mostrarMensaje('Error: respuesta inesperada del servidor', 'error');
      }
    } catch (error) {
      mostrarMensaje('Error al cargar usuarios. Verifica que el servidor esté ejecutándose.', 'error');
      console.error('Error:', error);
      setUsuarios([]); 
    }
  };

  const guardarUsuario = async (datosUsuario: Omit<Usuario, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => {
    try {
      if (usuarioEditar) {
        // Actualizar
        const response = await fetch(`${API_URL}/${usuarioEditar.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosUsuario)
        });
        
        if (response.ok) {
          mostrarMensaje('Usuario actualizado correctamente', 'exito');
          setUsuarioEditar(null);
        }
      } else {
        // Crear 
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosUsuario)
        });
        
        if (response.ok) {
          mostrarMensaje('Usuario agregado correctamente', 'exito');
        }
      }
      
      cargarUsuarios();
    } catch (error) {
      mostrarMensaje('Error al guardar usuario', 'error');
      console.error('Error:', error);
    }
  };

  const eliminarUsuario = async (id: string) => {

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        mostrarMensaje('Usuario eliminado correctamente', 'exito');
        cargarUsuarios();
      }
    } catch (error) {
      mostrarMensaje('Error al eliminar usuario', 'error');
      console.error('Error:', error);
    }
  };

//editar

  const editarUsuario = (usuario: Usuario) => {
    setUsuarioEditar(usuario);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setUsuarioEditar(null);
  };

  const mostrarMensaje = (texto: string, tipo: 'exito' | 'error') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <div style={styles.contenedor}>
      <div style={styles.contenido}>
        <h1 style={styles.titulo}>Sistema CRUD de Usuarios</h1>
        <p style={styles.subtitulo}>Los datos se guardan en usuarios.txt en el servidor</p>

        {mensaje && (
          <div style={{
            ...styles.mensaje,
            backgroundColor: mensaje.tipo === 'exito' ? '#4CAF50' : '#f44336'
          }}>
            {mensaje.texto}
          </div>
        )}

        <FormularioUsuario
          usuarioEditar={usuarioEditar}
          onGuardar={guardarUsuario}
          onCancelar={cancelarEdicion}
        />

        <ListaUsuarios
          usuarios={usuarios}
          onEditar={editarUsuario}
          onEliminar={eliminarUsuario}
        />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  contenedor: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  contenido: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px'
  },
  titulo: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '10px'
  },
  subtitulo: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
    marginBottom: '30px'
  },
  mensaje: {
    padding: '12px',
    borderRadius: '4px',
    color: 'white',
    textAlign: 'center',
    marginBottom: '20px',
    fontWeight: 'bold'
  }
};

export default App;
