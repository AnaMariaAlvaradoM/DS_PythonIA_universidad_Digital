# Universidad Digital 🎓

Sistema de gestión académica universitaria que permite administrar materias, usuarios e inscripciones con control de acceso basado en roles.

---

## Tabla de contenidos

- [Descripción](#descripción)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y configuración](#instalación-y-configuración)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Variables de entorno](#variables-de-entorno)
- [Endpoints de la API](#endpoints-de-la-api)
- [Roles y permisos](#roles-y-permisos)

---

## Descripción

**Universidad Digital** es una plataforma web full-stack que centraliza la gestión del sistema académico. Permite a los administradores crear y eliminar materias, gestionar usuarios e inscribir estudiantes. Los estudiantes pueden autenticarse, explorar el catálogo de materias e inscribirse de forma autónoma en los períodos disponibles.

La autenticación se basa en JWT con control de acceso diferenciado por rol (`admin` / `estudiante`).

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | FastAPI · Python 3.11+ |
| Base de datos | PostgreSQL · SQLAlchemy ORM |
| Autenticación | JWT (python-jose) · bcrypt |
| Frontend | React 18 · Vite |
| Estilos | Tailwind CSS v3 |
| HTTP client | Axios |
| Routing | React Router DOM v6 |

---

## Estructura del proyecto

```
universidad-digital/
│
├── backend/
│   ├── app/
│   │   ├── main.py                  # Entrada de la aplicación FastAPI
│   │   ├── database.py              # Configuración de SQLAlchemy y sesión
│   │   ├── auth.py                  # JWT, hashing, dependencias de autenticación
│   │   │
│   │   ├── models/
│   │   │   ├── usuario.py           # Modelo ORM de usuarios
│   │   │   ├── materia.py           # Modelo ORM de materias
│   │   │   └── inscripcion.py       # Modelo ORM de inscripciones
│   │   │
│   │   ├── schemas/
│   │   │   ├── usuario.py           # Schemas Pydantic de usuarios y tokens
│   │   │   ├── materia.py           # Schemas Pydantic de materias
│   │   │   └── inscripcion.py       # Schemas Pydantic de inscripciones
│   │   │
│   │   └── routers/
│   │       ├── usuarios.py          # Endpoints de registro, login y perfil
│   │       ├── materias.py          # CRUD de materias
│   │       └── inscripciones.py     # Gestión de inscripciones
│   │
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── main.jsx                 # Punto de entrada React
    │   ├── App.jsx                  # Rutas principales
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx      # Contexto global de autenticación
    │   │
    │   ├── services/
    │   │   └── api.js               # Instancia Axios + interceptor JWT + endpoints
    │   │
    │   └── pages/
    │       ├── Login.jsx            # Página de inicio de sesión
    │       ├── DashboardAdmin.jsx   # Panel de administración
    │       └── DashboardEstudiante.jsx  # Panel del estudiante
    │
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env
```

---

## Instalación y configuración

### Requisitos previos

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

---

### Backend

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/universidad-digital.git
cd universidad-digital/backend

# 2. Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE universidad_digital;"

# 5. Configurar variables de entorno (ver sección Variables de entorno)
cp .env.example .env

# 6. Ejecutar el servidor
uvicorn app.main:app --reload
```

El servidor quedará disponible en `http://127.0.0.1:8000`.  
La documentación interactiva estará en `http://127.0.0.1:8000/docs`.

---

### Frontend

```bash
cd universidad-digital/frontend

# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar el servidor de desarrollo
npm run dev
```

El frontend quedará disponible en `http://localhost:5173`.

---

## Variables de entorno

### Backend — `backend/.env`

```env
# Cadena de conexión a PostgreSQL
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/universidad_digital

# Clave secreta para firmar los JWT (usar una cadena larga y aleatoria en producción)
SECRET_KEY=cambia_esto_por_una_clave_segura

# Algoritmo de firma JWT
ALGORITHM=HS256

# Duración del token en minutos
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend — `frontend/.env`

```env
# URL base del backend (sin barra al final)
VITE_API_URL=http://127.0.0.1:8000
```

> **Nota:** en `api.js` la `baseURL` de Axios apunta directamente a `http://127.0.0.1:8000`. Si cambias el puerto del backend, actualiza esta variable.

---

## Endpoints de la API

La documentación completa está disponible en `/docs` (Swagger UI) una vez levantado el backend.

### Autenticación — `/usuarios`

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `POST` | `/usuarios/registro` | Público | Crea un nuevo usuario |
| `POST` | `/usuarios/login` | Público | Devuelve JWT + rol + usuario_id |
| `GET` | `/usuarios/perfil` | Autenticado | Devuelve el perfil del usuario actual |
| `GET` | `/usuarios/` | Admin | Lista todos los usuarios |
| `PUT` | `/usuarios/{id}` | Autenticado | Actualiza nombre, email o contraseña |

**Respuesta de login:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "rol": "estudiante",
  "usuario_id": 4
}
```

---

### Materias — `/materias`

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `GET` | `/materias/` | Autenticado | Lista todas las materias |
| `POST` | `/materias/` | Admin | Crea una materia nueva |
| `PUT` | `/materias/{id}` | Admin | Actualiza una materia |
| `DELETE` | `/materias/{id}` | Admin | Elimina una materia |

**Body para crear/actualizar materia:**
```json
{
  "nombre": "Álgebra Lineal",
  "codigo": "MAT202",
  "creditos": 3
}
```

---

### Inscripciones — `/inscripciones`

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `POST` | `/inscripciones/` | Autenticado* | Crea una inscripción |
| `GET` | `/inscripciones/mis-materias` | Estudiante | Lista las materias del estudiante actual |
| `GET` | `/inscripciones/` | Admin | Lista todas las inscripciones |
| `DELETE` | `/inscripciones/{id}` | Admin | Cancela una inscripción |

> *Un estudiante solo puede inscribirse a sí mismo (`usuario_id` debe coincidir con el del token). El admin puede inscribir a cualquier estudiante.

**Body para crear inscripción:**
```json
{
  "usuario_id": 4,
  "materia_id": 2,
  "periodo": "2025-1"
}
```

**Códigos de error relevantes:**

| Código | Causa |
|--------|-------|
| `400` | Inscripción duplicada (mismo usuario, materia y período) |
| `403` | Estudiante intentando inscribir a otro usuario |
| `404` | Usuario o materia no encontrados |

---

## Roles y permisos

| Acción | Estudiante | Admin |
|--------|:----------:|:-----:|
| Login / Registro | ✅ | ✅ |
| Ver catálogo de materias | ✅ | ✅ |
| Ver sus propias materias inscritas | ✅ | — |
| Inscribirse a sí mismo | ✅ | — |
| Inscribir a cualquier estudiante | — | ✅ |
| Crear / eliminar materias | — | ✅ |
| Ver todos los usuarios | — | ✅ |
| Ver todas las inscripciones | — | ✅ |
| Cancelar inscripciones | — | ✅ |

---

## Flujo de autenticación

```
Cliente                          Backend
  │                                 │
  │── POST /usuarios/login ────────>│
  │                                 │ Verifica email + contraseña
  │<── { access_token, rol, id } ───│
  │                                 │
  │  Guarda token en localStorage   │
  │                                 │
  │── GET /materias/ ──────────────>│
  │   Authorization: Bearer <token> │ Valida JWT en interceptor Axios
  │<── [ { id, nombre, codigo } ] ──│
```

---

## Licencia

MIT © Universidad Digital