import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={styles.header}>
      <h1 style={styles.titulo}>📋 Sistema de Gestión de Usuarios</h1>
      <p style={styles.descripcion}>CRUD simple con almacenamiento en archivo .txt</p>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: '#2196F3',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  titulo: {
    margin: '0 0 10px 0',
    fontSize: '28px'
  },
  descripcion: {
    margin: 0,
    fontSize: '14px',
    opacity: 0.9
  }
};

export default Header;
