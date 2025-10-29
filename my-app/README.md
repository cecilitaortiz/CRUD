# 📋 Sistema CRUD de Usuarios (Vite + TypeScript)

Sistema simple de gestión de usuarios con almacenamiento en archivo `.txt`.

## 🎯 Características

- ✅ **Crear** nuevos usuarios (nombre, número, email)
- ✅ **Leer** todos los usuarios
- ✅ **Actualizar** usuarios existentes
- ✅ **Eliminar** usuarios
- 💾 **Almacenamiento persistente** en `usuarios.txt`
- 🔷 **TypeScript** para type safety completo

## 🚀 Instalación y Uso

### 1. Instalar dependencias

```powershell
cd C:\Users\USUARIO\Desktop\CRUD\my-app
npm install
```

### 2. Ejecutar el sistema

**Opción A: Todo junto (Recomendado)**

```powershell
npm start
```

Esto ejecuta automáticamente:
- Servidor backend en puerto 3001
- Cliente Vite en puerto 5173

**Opción B: Por separado**

Terminal 1 - Servidor:
```powershell
npm run server
```

Terminal 2 - Cliente:
```powershell
npm run dev
```

### 3. Abrir en el navegador

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📁 Estructura del Proyecto

```
my-app/
├── server.ts                          # Servidor Express con TypeScript
├── usuarios.txt                       # Datos persistentes (se crea automáticamente)
├── src/
│   ├── App.tsx                       # Componente principal CRUD
│   ├── main.tsx                      # Punto de entrada React
│   ├── types/
│   │   └── Usuario.ts                # Interface TypeScript
│   └── components/
│       ├── Header.tsx                # Encabezado
│       ├── FormularioUsuario.tsx     # Formulario agregar/editar
│       └── ListaUsuarios.tsx         # Tabla de usuarios
└── package.json
```

## 🔌 API Endpoints

| Método | Endpoint              | Descripción              |
|--------|-----------------------|--------------------------|
| GET    | `/api/usuarios`       | Obtener todos los usuarios |
| POST   | `/api/usuarios`       | Crear un nuevo usuario   |
| PUT    | `/api/usuarios/:id`   | Actualizar un usuario    |
| DELETE | `/api/usuarios/:id`   | Eliminar un usuario      |

## 💾 Formato del archivo usuarios.txt

```json
[
  {
    "id": "1730123456789",
    "nombre": "Juan Pérez",
    "numero": "555-1234",
    "email": "juan@ejemplo.com",
    "fechaCreacion": "2025-10-28T12:34:56.789Z"
  }
]
```

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express** - Servidor API REST
- **TypeScript** - Tipado estático
- **tsx** - Ejecutor TypeScript para Node
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build tool ultra-rápido

## 📝 Scripts Disponibles

```powershell
npm run dev      # Solo cliente Vite (puerto 5173)
npm run server   # Solo servidor backend (puerto 3001)
npm start        # Cliente + Servidor juntos
npm run build    # Compilar para producción
npm run lint     # Linter ESLint
```

## ⚠️ Requisitos

- Node.js (v18 o superior)
- npm

## 🐛 Solución de Problemas

**Error: "Error al cargar usuarios"**
- Verifica que el servidor esté corriendo: `npm run server`

**Puerto en uso**
- Modifica el puerto en `server.ts` (línea 11) o `App.tsx` (línea 7)

**Errores de TypeScript**
- Ejecuta `npm install` para instalar tipos faltantes

## 🎨 Personalización

Los estilos están inline en cada componente. Para usar CSS tradicional:
1. Crea archivos `.module.css`
2. Importa en cada componente
3. Reemplaza el objeto `styles`
