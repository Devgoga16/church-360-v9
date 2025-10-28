# Iglesia 360 - Sistema Integral de Gestión de Solicitudes Financieras

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Modelo de Datos](#modelo-de-datos)
4. [Roles y Permisos](#roles-y-permisos)
5. [Flujo de Solicitudes](#flujo-de-solicitudes)
6. [API REST](#api-rest)
7. [Reglas de Negocio](#reglas-de-negocio)
8. [Interfaz de Usuario](#interfaz-de-usuario)
9. [Datos Mock](#datos-mock)
10. [Pruebas](#pruebas)
11. [Notificaciones](#notificaciones)
12. [Seguridad](#seguridad)

---

## 🎯 Descripción General

**Iglesia 360** es una aplicación integral de gestión de solicitudes financieras diseñada específicamente para iglesias y organizaciones religiosas. El sistema proporciona:

- **Gestión de Usuarios**: Control completo de usuarios con roles específicos
- **Gestión de Permisos**: Control granular de acceso por módulo y acción
- **Solicitudes Financieras**: Sistema completo de solicitud, aprobación y seguimiento de gastos
- **Auditoría**: Registro completo de todas las acciones realizadas en el sistema
- **Dashboard**: Panel de control con estadísticas y solicitudes recientes

### Módulos Principales

1. **Gestor de Usuarios**: Administración de usuarios y asignación de roles
2. **Gestor de Permisos**: Configuración de permisos por rol
3. **Solicitudes Financieras**: Creación, aprobación y tracking de solicitudes

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

**Frontend:**
- React 18 + React Router 6 (SPA)
- TypeScript
- TailwindCSS 3
- Vite
- Lucide React (iconos)
- React Query (gestión de estado)

**Backend:**
- Express.js
- TypeScript
- Node.js

**Base de Datos:**
- MySQL (recomendado para producción)
- SQLite (desarrollo local)

**Testing:**
- Vitest (unit tests)
- Integration tests con fetch API

---

## 📊 Modelo de Datos

### Tablas Principales

#### `users`
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `roles`
Roles disponibles:
- `admin`: Administrador con acceso total
- `tesorero`: Responsable de finanzas
- `pastor_general`: Pastor general de la iglesia
- `pastor_red`: Pastor de red/miniiglesia
- `usuario`: Miembro normal

#### `solicitudes`
Estados posibles:
- `borrador`: Borrador (no enviado)
- `pendiente`: Enviado, pendiente de revisión
- `en_revision`: Bajo revisión de aprobadores
- `aprobado_parcial`: Parcialmente aprobado
- `aprobado`: Completamente aprobado
- `rechazado`: Rechazado
- `completado`: Completado (pago registrado)
- `cancelado`: Cancelado

#### `solicitud_items`
Detalles de línea de cada solicitud con cantidad, descripción y monto

#### `aprobaciones`
Registro de cada aprobación/rechazo en la cadena de autorización

#### `solicitud_logs`
Auditoría completa de todas las acciones realizadas

#### `movimientos_financieros`
Registro de movimientos de caja (gastos, ingresos, ajustes)

---

## 👥 Roles y Permisos

### Matriz de Permisos

| Permiso | Admin | Tesorero | Pastor General | Pastor Red | Usuario |
|---------|-------|----------|---|---|---|
| Crear usuarios | ✅ | ❌ | ❌ | ❌ | ❌ |
| Ver usuarios | ✅ | ✅ | ✅ | ✅ | ❌ |
| Crear solicitud | ✅ | ❌ | ❌ | ❌ | ✅ |
| Ver todas solicitudes | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ver propias solicitudes | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editar borrador | ✅ | ❌ | ❌ | ❌ | ✅ |
| Aprobar | ✅ | ✅ | ✅ | ✅ | ❌ |
| Forzar aprobación | ✅ | ❌ | ✅ | ❌ | ❌ |
| Marcar como pagado | ✅ | ✅ | ❌ | ❌ | ❌ |
| Comentar | ✅ | ✅ | ✅ | ✅ | ✅ |
| Adjuntar documento | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔄 Flujo de Solicitudes

### Paso 1: Creación (Estado: Borrador)
1. Usuario inicia sesión y accede al formulario de nueva solicitud
2. Completa los campos:
   - Ministerio/Iglesia
   - Encargado (pastor responsable)
   - Descripción general
   - Moneda
   - Items detallados (descripción, monto)
   - Detalle del abono
   - Tipo de pago (a sí mismo o a terceros)
   - Documentos opcionales (comprobantes, presupuestos)
3. Guarda como borrador (puede editar)

### Paso 2: Envío (Estado: Pendiente)
1. Usuario envía la solicitud para revisión
2. Sistema valida:
   - Todos los campos obligatorios están completados
   - Suma de items = total solicitado
   - Documentos están adjuntos (si aplica)
3. Se asignan aprobadores según:
   - Monto total
   - Tipo de ministerio
   - Políticas configuradas

### Paso 3: Revisión (Estado: En Revisión)
1. Aprobadores designados revisan la solicitud
2. Pueden:
   - Solicitar más documentos
   - Hacer comentarios
   - Marcar como revisado

### Paso 4: Aprobación (Estados: Aprobado/Rechazado/Parcial)
- **Aprobación simple**: 1 aprobador
- **Aprobación múltiple**: Tesorero + Pastor General (según monto)
- **Rechazo**: Con razón documentada

### Paso 5: Completado
1. Se suben documentos finales
2. Se registra movimiento financiero
3. Solicitud marcada como completada

---

## 📡 API REST

### Base URL
```
http://localhost:8080/api
```

### Endpoints Principales

#### Usuarios

**GET /users**
```bash
curl -X GET "http://localhost:8080/api/users?page=1&pageSize=10&status=active"
```

**POST /users**
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@iglesia360.com",
    "name": "Juan García",
    "phone": "+34 666 123 456",
    "roles": ["usuario"]
  }'
```

#### Solicitudes

**GET /solicitudes**
```bash
curl -X GET "http://localhost:8080/api/solicitudes?status=pendiente"
```

**POST /solicitudes**
```bash
curl -X POST http://localhost:8080/api/solicitudes \
  -H "Content-Type: application/json" \
  -d '{
    "ministryId": 1,
    "title": "Equipos de sonido",
    "description": "Micrófono y amplificador",
    "responsibleUserId": 4,
    "paymentType": "terceros",
    "paymentDetail": "Pagar a TechSound",
    "items": [
      {
        "itemNumber": 1,
        "description": "Micrófono inalámbrico",
        "amount": 500,
        "quantity": 1
      }
    ]
  }'
```

**POST /solicitudes/{id}/submit**
```bash
curl -X POST http://localhost:8080/api/solicitudes/1/submit \
  -H "Content-Type: application/json" \
  -d '{"comments": "Lista para aprobación"}'
```

**POST /solicitudes/{solicitudId}/approve**
```bash
curl -X POST http://localhost:8080/api/solicitudes/1/approve \
  -H "Content-Type: application/json" \
  -d '{"comments": "Aprobado"}'
```

**POST /solicitudes/{solicitudId}/reject**
```bash
curl -X POST http://localhost:8080/api/solicitudes/1/reject \
  -H "Content-Type: application/json" \
  -d '{
    "rejectionReason": "No cumple requisitos",
    "comments": "Se requieren más documentos"
  }'
```

#### Dashboard

**GET /solicitudes/dashboard/stats**
```bash
curl -X GET http://localhost:8080/api/solicitudes/dashboard/stats
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "totalSolicitudes": 6,
    "pendingSolicitudes": 2,
    "approvedSolicitudes": 3,
    "totalAmount": 20200.00,
    "approvedAmount": 11000.00,
    "ministries": 5,
    "users": 6
  }
}
```

---

## 📋 Reglas de Negocio

### Validaciones

1. **Campos Obligatorios**
   - Título y descripción no pueden estar vacíos
   - Ministerio debe existir en la base de datos
   - Monto total debe ser > 0
   - Items deben sumar igual al monto total

2. **Adjuntos**
   - Tipo de archivo permitido: PDF, JPG, PNG, DOC, DOCX
   - Tamaño máximo: 10MB por archivo
   - Máximo 5 adjuntos por solicitud

3. **Monedas Soportadas**
   - USD (predeterminada)
   - EUR
   - MXN
   - O la configurada en el sistema

### Flujo de Aprobación

**Por Monto:**
- **< $5,000**: 1 aprobador (pastor designado)
- **$5,000 - $10,000**: 2 aprobadores (pastor designado + tesorero)
- **> $10,000**: 3 aprobadores (pastor designado + tesorero + pastor general)

**Por Ministerio:**
- Algunos ministerios pueden requerir aprobación adicional
- Configurable por administrador

### Límites

- **Presupuesto por ministerio**: Configurab le (ej: $10,000/mes)
- **Límite por solicitud**: Sin límite (controlado por aprobación)
- **Números de aprobadores**: 1-3

### Auditoría

Toda acción es registrada con:
- ID del usuario
- Acción realizada
- Fecha y hora
- Cambios realizados (before/after)
- Comentario del usuario
- Dirección IP
- User Agent

---

## 🎨 Interfaz de Usuario

### Páginas Principales

#### 1. Dashboard (/)
- Bienvenida personalizada
- Estadísticas clave (total solicitudes, pendientes, aprobadas, monto total)
- Solicitudes recientes (últimas 5)
- Quick actions (nueva solicitud, pendientes de aprobación)

#### 2. Solicitudes (/solicitudes)
- Listado de todas las solicitudes
- Filtros: por estado, ministerio, fecha
- Búsqueda: por código, título, ministerio
- Resumen: total solicitudes, monto total, aprobadas, pendientes
- Click en solicitud abre detalles

#### 3. Solicitud Detalle (/solicitudes/:id)
- Información completa de la solicitud
- Items con montos
- Adjuntos y documentos
- Historial de aprobaciones con comentarios
- Auditoría de cambios
- Acciones según rol (aprobar, rechazar, comentar, etc.)

#### 4. Nueva Solicitud (/solicitudes/nueva)
- Formulario paso a paso
- Paso 1: Información básica
- Paso 2: Items
- Paso 3: Adjuntos
- Paso 4: Revisión y envío

#### 5. Usuarios (/usuarios)
- Listado de usuarios
- Filtros por rol y estado
- Crear usuario
- Editar usuario
- Asignar/cambiar roles

#### 6. Configuración (/configuracion)
- Gestión de ministerios
- Configuración de aprobadores
- Límites de presupuesto
- Tipos de documento permitidos

### Componentes Reutilizables

- **Header**: Navegación superior con user menu y notificaciones
- **Sidebar**: Navegación lateral con menú principal
- **StatusBadge**: Muestra estado de solicitud con color
- **StatCard**: Tarjeta con estadística y tendencia
- **Layout**: Wrapper con header + sidebar

---

## 📦 Datos Mock

### Usuarios Mock (6 usuarios)

1. **Juan García** (admin@iglesia360.com)
   - Rol: Admin
   - Permisos: Todos

2. **María López** (tesorero@iglesia360.com)
   - Rol: Tesorero
   - Permisos: Ver y aprobar solicitudes, marcar como pagado

3. **Carlos Rodríguez** (pastor@iglesia360.com)
   - Rol: Pastor General
   - Permisos: Ver y aprobar solicitudes, forzar aprobación

4. **Ana Martínez** (pastor_red1@iglesia360.com)
   - Rol: Pastor Red
   - Permisos: Ver y aprobar solicitudes de su red

5. **Pedro Sánchez** (miembro1@iglesia360.com)
   - Rol: Usuario
   - Permisos: Crear y editar sus propias solicitudes

6. **Rosa González** (miembro2@iglesia360.com)
   - Rol: Usuario
   - Permisos: Crear y editar sus propias solicitudes

### Ministerios Mock (5 ministerios)

1. MIN001 - Ministerio de Alabanza (presupuesto: $5,000)
2. MIN002 - Ministerio de Jóvenes (presupuesto: $8,000)
3. MIN003 - Ministerio de Niños (presupuesto: $6,000)
4. MIN004 - Ministerio de Obras Sociales (presupuesto: $10,000)
5. MIN005 - Ministerio de Misiones (presupuesto: $15,000)

### Solicitudes Mock (6 solicitudes en distintos estados)

1. **SOL001** - Borrador: Equipos de sonido ($2,500)
2. **SOL002** - Pendiente: Retiro de jóvenes ($4,500)
3. **SOL003** - En Revisión: Material didáctico ($1,800)
4. **SOL004** - Aprobado Parcial: Kits de alimentos ($3,200)
5. **SOL005** - Aprobado: Viaje misionero ($6,500)
6. **SOL006** - Completado: Reparación de instrumentos ($1,200)

Ver `database/seed.sql` para datos completos.

---

## 🧪 Pruebas

### Pruebas de Integración (`test/backend/api.integration.test.ts`)

Casos de prueba:
- Listar usuarios
- Obtener usuario específico
- Crear usuario
- Filtrar usuarios por rol
- Listar solicitudes
- Filtrar solicitudes por estado
- Crear solicitud
- Actualizar solicitud
- Enviar solicitud
- Aprobar solicitud
- Rechazar solicitud
- Validaciones de negocio
- Manejo de errores
- Paginación

### Pruebas Unitarias (`test/backend/business-logic.test.ts`)

- **Transiciones de estado**: Validar flujos válidos
- **Validación de montos**: Cálculos correctos
- **Requisitos de aprobación**: Según monto
- **Validación de pagos**: Tipos y detalles
- **Permisos por rol**: Matriz de permisos
- **Validación de datos**: Email, teléfono, etc.
- **Auditoría**: Registro de acciones
- **Manejo de moneda**: Formato y conversión

### Ejecutar Pruebas

```bash
# Todas las pruebas
npm run test

# Solo integración
npm run test test/backend/api.integration.test.ts

# Solo unitarias
npm run test test/backend/business-logic.test.ts

# Con cobertura
npm run test -- --coverage
```

---

## 🔔 Notificaciones

### Sistema de Notificaciones

#### Por Email

Triggers:
1. **Solicitud Enviada**: Al usuario + aprobadores
2. **Solicitud Aprobada**: Al solicitante
3. **Solicitud Rechazada**: Al solicitante con razón
4. **Documentos Solicitados**: Al solicitante
5. **Solicitud Completada**: Al solicitante

Plantillas:
- Bienvenida
- Solicitud pendiente aprobación
- Aprobación
- Rechazo
- Recordatorio

#### In-App

- Bell icon en header
- Dropdown con últimas 5 notificaciones
- Marcar como leído
- Link a solicitud relacionada

#### Tabla `notifications`

```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  solicitud_id INT,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL
);
```

---

## 🔒 Seguridad

### Controles de Acceso

1. **Autenticación** (TODO - Implementar)
   - Login con email/password
   - JWT tokens
   - Refresh tokens
   - Session management

2. **Autorización**
   - Control basado en roles (RBAC)
   - Control granular por acción
   - Validación en backend de cada request

3. **Validación de Datos**
   - Validación de entrada en frontend y backend
   - Sanitización de strings
   - Validación de tipos con Zod

### Protección de Archivos

1. **Validación de Adjuntos**
   - Solo tipos permitidos: PDF, JPG, PNG, DOC, DOCX
   - Tamaño máximo: 10MB
   - Validación de magic numbers
   - Antivirus scan (opcional)

2. **Almacenamiento Seguro**
   - Archivos fuera del webroot
   - Nombres de archivo hasheados
   - Permisos restrictivos

### Auditoría y Logs

1. **Registro de Acciones**
   - Tabla `solicitud_logs` detallada
   - IP address
   - User agent
   - Timestamps precisos

2. **Retención de Logs**
   - Mínimo 7 años (requisito legal)
   - Archivado después de 1 año
   - Anonymización al vencer retención

### Cifrado

- **En Tránsito**: HTTPS/TLS
- **En Reposo**: Datos sensibles cifrados (contraseñas, docs confidenciales)
- **Datos Personales**: Cumple RGPD/CCPA

### Rate Limiting

```javascript
// Limitar intentos de login
app.post('/login', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5 // 5 intentos
}), loginHandler);

// Limitar créación de solicitudes
app.post('/api/solicitudes', rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20 // 20 solicitudes
}), createSolicitud);
```

---

## 📚 Historias de Usuario

### 1. Crear Nueva Solicitud
**Dado que** soy un miembro de la iglesia
**Cuando** necesito solicitar fondos para mi ministerio
**Entonces** puedo crear una solicitud con título, descripción, items y adjuntos

**Criterios de aceptación:**
- [ ] Formulario muestra todos los campos requeridos
- [ ] Puedo agregar múltiples items
- [ ] Puedo adjuntar documentos
- [ ] Se valida que suma de items = total
- [ ] Solicitud se guarda como borrador

### 2. Enviar Solicitud para Aprobación
**Dado que** tengo una solicitud en borrador
**Cuando** completo todos los campos
**Entonces** puedo enviarla para aprobación

**Criterios de aceptación:**
- [ ] Botón "Enviar" solo disponible si solicitud está completa
- [ ] Sistema asigna aprobadores automáticamente
- [ ] Solicitante y aprobadores reciben notificación
- [ ] Solicitud cambia a estado "pendiente"

### 3. Revisar Solicitudes Pendientes
**Dado que** soy aprobador (pastor o tesorero)
**Cuando** ingreso al dashboard
**Entonces** veo mis solicitudes pendientes de aprobación

**Criterios de aceptación:**
- [ ] Widget muestra número de pendientes
- [ ] Link lleva a lista filtrada
- [ ] Cada solicitud muestra monto, ministerio, solicitante
- [ ] Puedo hacer click para ver detalles

### 4. Aprobar Solicitud
**Dado que** tengo una solicitud pendiente de aprobación
**Cuando** reviso los detalles
**Entonces** puedo aprobarla con comentario opcional

**Criterios de aceptación:**
- [ ] Modal de aprobación muestra detalles
- [ ] Puedo agregar comentarios
- [ ] Botón "Aprobar" activa cambio de estado
- [ ] Se registra fecha/hora y usuario
- [ ] Notificación enviada a solicitante

### 5. Rechazar Solicitud
**Dado que** tengo una solicitud con problemas
**Cuando** la reviso
**Entonces** puedo rechazarla con motivo

**Criterios de aceptación:**
- [ ] Campo "Razón de rechazo" es obligatorio
- [ ] Puedo agregar comentarios adicionales
- [ ] Solicitante recibe notificación con motivo
- [ ] Solicitud regresa a "pendiente" o "borrador"

### 6. Ver Historial de Solicitud
**Dado que** soy parte de una solicitud
**Cuando** veo sus detalles
**Entonces** puedo ver todo el historial de cambios y comentarios

**Criterios de aceptación:**
- [ ] Timeline muestra todos los eventos
- [ ] Cada evento muestra usuario, acción, fecha
- [ ] Comentarios se muestran inline
- [ ] Cambios de estado se destacan

### 7. Gestionar Usuarios
**Dado que** soy administrador
**Cuando** accedo a gestión de usuarios
**Entonces** puedo crear, editar y asignar roles

**Criterios de aceptación:**
- [ ] Lista muestra todos los usuarios
- [ ] Puedo crear nuevo usuario
- [ ] Puedo cambiar rol de usuario
- [ ] Puedo desactivar usuario sin eliminar

### 8. Configurar Aprobadores
**Dado que** soy administrador
**Cuando** configuro aprobaciones
**Entonces** puedo especificar quién aprueba qué

**Criterios de aceptación:**
- [ ] Puedo asignar aprobador por ministerio
- [ ] Puedo configurar montos de aprobación
- [ ] Cambios se aplican a nuevas solicitudes
- [ ] Solicitudes existentes no se afectan

### 9. Ver Dashboard
**Dado que** ingreso a la aplicación
**Cuando** accedo a la página principal
**Entonces** veo estadísticas y solicitudes recientes

**Criterios de aceptación:**
- [ ] Estadísticas se cargan correctamente
- [ ] Números son precisos
- [ ] Solicitudes recientes se muestran
- [ ] Links funcionan correctamente

### 10. Búsqueda y Filtrado
**Dado que** necesito encontrar una solicitud específica
**Cuando** uso búsqueda y filtros
**Entonces** obtengo los resultados correctos

**Criterios de aceptación:**
- [ ] Búsqueda por código/título funciona
- [ ] Filtro por estado funciona
- [ ] Filtro por ministerio funciona
- [ ] Combinación de filtros funciona
- [ ] Resultados se actualizan en tiempo real

---

## 🚀 Deployment

### Variables de Entorno

```bash
# Database
DB_HOST=localhost
DB_USER=iglesia360
DB_PASSWORD=secure_password
DB_NAME=iglesia360

# API
PORT=8080
NODE_ENV=production

# Email (para notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=alerts@iglesia360.com
SMTP_PASSWORD=app_password

# Seguridad
JWT_SECRET=very_secure_secret_key
SESSION_SECRET=session_secret_key

# Upload
UPLOAD_DIR=/var/uploads/iglesia360
MAX_FILE_SIZE=10485760

# Logs
LOG_LEVEL=info
LOG_DIR=/var/log/iglesia360
```

### Build

```bash
# Frontend
npm run build:client

# Backend
npm run build:server

# Ambos
npm run build
```

### Iniciar en Producción

```bash
npm run start
```

---

## 📞 Soporte

Para reportar bugs o solicitar features, contactar a: support@iglesia360.com

---

## 📄 Licencia

Copyright © 2024 Iglesia 360. All rights reserved.
