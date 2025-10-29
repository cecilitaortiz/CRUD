# 🚀 Guía Rápida - my-app (Vite + TypeScript)

## Pasos para ejecutar el sistema CRUD

### 1️⃣ Abrir dos terminales PowerShell

**Terminal 1 - Backend:**
```powershell
cd C:\Users\USUARIO\Desktop\CRUD\my-app
npm run server
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\USUARIO\Desktop\CRUD\my-app
npm run dev
```

### 2️⃣ Abrir en el navegador

- **Frontend:** http://localhost:5174 (o el puerto que Vite indique)
- **Backend API:** http://localhost:3001

### 3️⃣ Usar la aplicación

1. Completa el formulario con:
   - **Nombre** (ej: "María López")
   - **Número** (ej: "555-9876")
   - **Email** (ej: "maria@ejemplo.com")
2. Click en **"Agregar"**
3. El usuario aparecerá en la tabla
4. Usa los botones **Editar** o **Eliminar** según necesites

### 4️⃣ Ver el archivo usuarios.txt

Los datos se guardan automáticamente en:
```
C:\Users\USUARIO\Desktop\CRUD\my-app\usuarios.txt
```

## ✅ Funcionalidades

- ✅ **Crear**: Agregar nuevos usuarios
- ✅ **Leer**: Ver lista completa
- ✅ **Actualizar**: Editar usuarios existentes
- ✅ **Eliminar**: Borrar usuarios (con confirmación)
- 🔷 **TypeScript**: Type safety completo

## 🛠️ Tecnologías

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Storage**: Archivo .txt con JSON

## 📦 Scripts disponibles

```powershell
npm run dev      # Solo frontend (Vite)
npm run server   # Solo backend (Express)
npm start        # Ambos simultáneamente
npm run build    # Compilar para producción
```

## 🔧 Diferencias con miapp

| Característica | my-app | miapp |
|----------------|--------|-------|
| Framework | Vite | Create React App |
| Lenguaje | TypeScript | JavaScript |
| Puerto frontend | 5174 | 3000 |
| Hot reload | Ultra rápido | Rápido |
| Build tool | Vite | Webpack |

## ⚠️ Importante

- Mantén ambas terminales abiertas
- Los datos persisten en `usuarios.txt`
- Para detener: `Ctrl+C` en cada terminal
