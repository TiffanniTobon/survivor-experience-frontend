# Survivor Experience — Frontend

Aplicación web responsiva para la gestión de reservas de clases grupales con selección visual de posiciones, desarrollada con React + Vite.

---

## Tecnologías

| Tecnología       | Versión | Uso                               |
| ---------------- | ------- | --------------------------------- |
| React            | 18      | Librería principal de UI          |
| Vite             | 5       | Bundler y servidor de desarrollo  |
| React Router DOM | 6       | Enrutamiento del lado del cliente |
| Axios            | 1       | Peticiones HTTP al backend        |
| Tailwind CSS     | 3       | Estilos utilitarios               |

---

## Requisitos previos

- Node.js >= 18
- npm >= 9
- Backend de Survivor Experience corriendo en `http://localhost:3000`

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/TiffanniTobon/survivor-experience-frontend.git
cd survivor-experience-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_API_URL=/api
```

> El proxy de Vite redirige `/api` hacia `http://localhost:3000`. Si el backend corre en otro puerto, actualiza `vite.config.js`.

---

## Correr el proyecto

```bash
# Modo desarrollo
npm run dev
```

La aplicación quedará disponible en: `http://localhost:5173`

```bash
# Build para producción
npm run build

# Vista previa del build
npm run preview
```

---

## Estructura de carpetas

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.jsx       # Sidebar del panel admin (desktop)
│   │   ├── AdminBottomBar.jsx     # Barra de navegación inferior (móvil)
│   │   ├── ClassesTable.jsx       # Tabla/tarjetas de clases
│   │   ├── ClassModal.jsx         # Modal crear/editar clase
│   │   ├── ClassForm.jsx          # Formulario interno del modal
│   │   ├── WeekNavigator.jsx      # Selector de semana y día
│   │   └── RoomMap.jsx            # Mapa visual de posiciones del salón
│   ├── user/
│   │   ├── UserSidebar.jsx        # Sidebar del usuario (desktop)
│   │   └── UserBottomBar.jsx      # Barra de navegación inferior (móvil)
│   └── ui/
│       ├── Toast.jsx              # Notificaciones toast
│       └── ConfirmModal.jsx       # Modal de confirmación reutilizable
├── context/
│   └── AuthContext.jsx            # Contexto de autenticación global
├── hooks/
│   └── useIsMobile.js             # Hook para detectar dispositivo móvil
├── layouts/
│   ├── AdminLayout.jsx            # Layout con sidebar/bottombar para admin
│   └── UserLayout.jsx             # Layout con sidebar/bottombar para usuario
├── pages/
│   ├── LoginPage.jsx              # Página de login y registro
│   ├── AdminPage.jsx              # Cronograma semanal del admin
│   ├── CyclingMapPage.jsx         # Mapa del salón Cycling (admin)
│   ├── CardioStepMapPage.jsx      # Mapa del salón Cardio Step (admin)
│   ├── ClassesPage.jsx            # Cronograma de clases del usuario
│   ├── ReservePage.jsx            # Página de reserva de posición
│   └── UserReservationsPage.jsx   # Mis reservas activas
├── routes/
│   └── ProtectedRoute.jsx         # Ruta protegida por autenticación y rol
├── services/
│   ├── authService.js             # Login y registro
│   ├── classService.js            # CRUD de clases
│   ├── catalogService.js          # Tipos de clase e instructores
│   ├── positionService.js         # Estado de posiciones por salón y clase
│   └── reservationService.js      # Crear, cancelar y consultar reservas
└── utils/
    └── classHelpers.js            # Helpers de fechas, estados y colores
```

---

## Funcionalidades principales

### Usuario

- Visualización del cronograma semanal de clases
- Reserva de posición específica en salones Cycling y Cardio Step mediante mapa visual interactivo
- Consulta y cancelación de reservas activas

### Administrador

- Gestión completa de clases (crear, editar, eliminar) con validaciones de horario del gym y disponibilidad de salón
- Visualización del mapa de posiciones por clase
- Bloqueo de posiciones mediante reserva directa

---

## Roles y acceso

| Rol     | Ruta principal | Acceso                        |
| ------- | -------------- | ----------------------------- |
| `user`  | `/classes`     | Cronograma y reservas         |
| `admin` | `/admin`       | Panel administrativo completo |

La autenticación se maneja con **JWT**. El token se almacena en `localStorage` y se envía en el header `Authorization: Bearer <token>` en cada petición.

---

## Ramas del repositorio

```
main        → código estable aprobado
develop     → integración de features
feature/*   → desarrollo de funcionalidades específicas
```
