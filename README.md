# Sistema de Control de Gastos - Backend

API REST desarrollada con NestJS, TypeScript, PostgreSQL y TypeORM para gestionar gastos personales.

## Características

- Autenticación JWT con roles y permisos
- Gestión de usuarios con roles (admin, manager, user)
- Mantenimiento de tipos de gastos y detalles
- Registro de gastos con status automático
- Sistema de pagos (completos y abonos)
- Reportes de gastos pendientes, completados y parciales
- Documentación automática con Swagger

## Tecnologías

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT (Passport)
- **Validación**: class-validator
- **Documentación**: Swagger/OpenAPI

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v13 o superior)
- npm o yarn

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
Copiar `.env.example` a `.env` y configurar:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=gastos_control

JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRATION=7d

PORT=3000
NODE_ENV=development
```

3. Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE gastos_control;
```

4. Ejecutar seed para poblar datos iniciales:
```bash
npm run seed
```

Este comando creará:
- Roles: admin, manager, user
- Permisos básicos
- Usuario administrador (admin@gastos.com / admin123)
- Tipos de gastos: Educación, Salud, Vivienda, Vestimenta, Alimentación
- Detalles de gastos para cada tipo

## Ejecución

### Modo desarrollo
```bash
npm run start:dev
```

### Modo producción
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener perfil del usuario actual

### Usuarios
- `POST /users` - Crear usuario (admin)
- `GET /users` - Listar usuarios (admin/manager)
- `GET /users/:id` - Obtener usuario por ID (admin/manager)
- `PATCH /users/:id` - Actualizar usuario (admin)
- `DELETE /users/:id` - Eliminar usuario (admin)

### Roles
- `POST /users/roles` - Crear rol (admin)
- `GET /users/roles/all` - Listar roles (admin)
- `GET /users/roles/:id` - Obtener rol por ID (admin)
- `PATCH /users/roles/:id` - Actualizar rol (admin)
- `DELETE /users/roles/:id` - Eliminar rol (admin)

### Permisos
- `POST /users/permissions` - Crear permiso (admin)
- `GET /users/permissions/all` - Listar permisos (admin)
- `POST /users/roles/:roleId/permissions` - Asignar permisos a rol (admin)

### Tipos de Gastos
- `POST /expense-types` - Crear tipo de gasto (admin/manager)
- `GET /expense-types` - Listar tipos de gastos
- `GET /expense-types/:id` - Obtener tipo de gasto por ID
- `PATCH /expense-types/:id` - Actualizar tipo de gasto (admin/manager)
- `DELETE /expense-types/:id` - Eliminar tipo de gasto (admin)

### Detalles de Gastos
- `POST /expense-types/details` - Crear detalle de gasto (admin/manager)
- `GET /expense-types/details/all` - Listar todos los detalles
- `GET /expense-types/:typeId/details` - Listar detalles por tipo
- `GET /expense-types/details/:id` - Obtener detalle por ID
- `PATCH /expense-types/details/:id` - Actualizar detalle (admin/manager)
- `DELETE /expense-types/details/:id` - Eliminar detalle (admin/manager)

### Gastos
- `POST /expenses` - Crear gasto
- `GET /expenses` - Listar todos los gastos
- `GET /expenses/summary` - Obtener resumen de gastos
- `GET /expenses/pending` - Listar gastos pendientes
- `GET /expenses/completed` - Listar gastos completados
- `GET /expenses/partial` - Listar gastos con pagos parciales
- `GET /expenses/status/:status` - Listar gastos por status
- `GET /expenses/:id` - Obtener gasto por ID
- `PATCH /expenses/:id` - Actualizar gasto
- `DELETE /expenses/:id` - Eliminar gasto (admin/manager)

### Pagos
- `POST /expenses/payments` - Registrar pago o abono
- `GET /expenses/payments/all` - Listar todos los pagos
- `GET /expenses/:expenseId/payments` - Listar pagos de un gasto

## Status de Gastos

El sistema calcula automáticamente el status de cada gasto:

- **UPCOMING** (Verde): Faltan más de 6 días para la fecha de pago
- **NEAR_DUE** (Naranja): Faltan 5 días o menos para la fecha de pago
- **OVERDUE** (Rojo): La fecha de pago ya pasó
- **PARTIAL** (Amarillo): Se ha realizado un pago parcial
- **COMPLETED** (Azul): El pago se ha completado

## Documentación API

Una vez iniciado el servidor, la documentación Swagger está disponible en:
```
http://localhost:3000/api/docs
```

## Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── dto/             # DTOs de autenticación
│   ├── guards/          # Guards JWT y Roles
│   └── strategies/      # Estrategia JWT
├── users/               # Módulo de usuarios
│   ├── dto/             # DTOs de usuarios
│   └── entities/        # Entidades User, Role, Permission
├── expense-types/       # Módulo de tipos de gastos
│   ├── dto/             # DTOs de tipos y detalles
│   └── entities/        # Entidades ExpenseType, ExpenseDetail
├── expenses/            # Módulo de gastos
│   ├── dto/             # DTOs de gastos y pagos
│   └── entities/        # Entidades Expense, Payment
├── common/              # Recursos compartidos
│   ├── decorators/      # Decoradores personalizados
│   └── enums/           # Enumeraciones
└── database/            # Scripts de base de datos
    └── seed.ts          # Script de seed
```

## Desarrollo

### Compilar proyecto
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Tests
```bash
npm run test
npm run test:watch
npm run test:cov
```

## Seguridad

- Las contraseñas se encriptan con bcrypt
- Autenticación mediante JWT
- Sistema de roles y permisos
- Validación de datos con class-validator
- Guards para proteger endpoints

## Notas Importantes

1. Asegurar que PostgreSQL esté ejecutándose antes de iniciar la aplicación
2. En desarrollo, TypeORM sincroniza automáticamente el esquema de la base de datos
3. En producción, desactivar `synchronize` y usar migraciones
4. Cambiar `JWT_SECRET` en producción por una clave segura
5. El usuario administrador por defecto es: admin@gastos.com / admin123

## Próximos Pasos

Para continuar con el frontend en Flutter, revisar el directorio correspondiente.
