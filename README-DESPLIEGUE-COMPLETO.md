# ✅ Backend Desplegado en Railway - Guía Completa

## 🎉 Estado Actual

- ✅ Backend corriendo en Railway
- ✅ PostgreSQL conectado
- ✅ Errores de crypto solucionados
- ✅ Errores de conexión a DB solucionados
- ✅ CORS configurado para Flutter

---

## 📍 Obtener la URL del Backend

### Paso 1: Ir a Railway
1. Ve a [railway.app](https://railway.app)
2. Abre tu proyecto
3. Click en el servicio **backend**

### Paso 2: Obtener la URL
**Opción A:**
- Ve a **Settings** → **Networking** o **Domains**
- Copia la URL pública (ej: `https://backend-production-xxxx.up.railway.app`)

**Opción B:**
- Si no hay URL, click en **"Generate Domain"**
- Railway creará una URL automáticamente

### Paso 3: Verificar que funciona
Abre en tu navegador:
```
https://tu-backend.railway.app/api/docs
```

Deberías ver la documentación Swagger de tu API.

---

## 🌱 Ejecutar Seed (Primera vez)

Para poblar la base de datos con datos iniciales:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Iniciar sesión
railway login

# Vincular proyecto
railway link

# Ejecutar seed
railway run npm run seed
```

Esto creará:
- ✅ Roles: admin, manager, user
- ✅ Usuario admin: `admin@gastos.com` / `admin123`
- ✅ Tipos de gastos: Educación, Salud, Vivienda, Vestimenta, Alimentación
- ✅ Detalles de cada tipo de gasto

---

## 🧪 Probar el Backend

### 1. Health Check
```bash
curl https://tu-backend.railway.app/
```

### 2. Login (después del seed)
```bash
curl -X POST https://tu-backend.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gastos.com",
    "password": "admin123"
  }'
```

Deberías recibir un token JWT.

### 3. Ver documentación
```
https://tu-backend.railway.app/api/docs
```

---

## 📱 Configurar en Flutter

### 1. Crear archivo de configuración

**Archivo:** `lib/config/api_config.dart`

```dart
class ApiConfig {
  // ⚠️ REEMPLAZA CON TU URL DE RAILWAY
  static const String baseUrl = 'https://tu-backend.railway.app';

  // Endpoints
  static const String login = '$baseUrl/auth/login';
  static const String register = '$baseUrl/auth/register';
  static const String expenses = '$baseUrl/expenses';
  static const String expenseTypes = '$baseUrl/expense-types';

  // Timeout
  static const Duration timeout = Duration(seconds: 30);
}
```

### 2. Agregar dependencias

**Archivo:** `pubspec.yaml`

```yaml
dependencies:
  dio: ^5.4.0
  flutter_secure_storage: ^9.0.0
```

Luego ejecuta:
```bash
flutter pub get
```

### 3. Ver ejemplos completos

📖 Todos los ejemplos de código están en:
- [FRONTEND-CONFIG-EXAMPLE.md](./FRONTEND-CONFIG-EXAMPLE.md)

Incluye:
- ✅ Cliente HTTP configurado
- ✅ Servicio de autenticación completo
- ✅ Servicio de gastos completo
- ✅ Manejo de tokens JWT
- ✅ Ejemplos de uso en widgets

---

## 🔧 Variables de Entorno en Railway

Verifica que tengas estas variables configuradas en tu servicio backend:

### Variables que Railway proporciona automáticamente:
- ✅ `DATABASE_URL` - URL de PostgreSQL
- ✅ `PORT` - Puerto asignado

### Variables que debes agregar manualmente:
- `NODE_ENV=production`
- `JWT_SECRET=<clave-segura-aquí>`
- `JWT_EXPIRATION=7d`

### Generar JWT_SECRET seguro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📋 Endpoints Disponibles

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener perfil
- `POST /auth/forgot-password` - Olvidé mi contraseña
- `POST /auth/verify-reset-code` - Verificar código
- `POST /auth/reset-password` - Resetear contraseña

### Gastos
- `GET /expenses` - Listar todos los gastos
- `GET /expenses/summary` - Resumen de gastos
- `GET /expenses/pending` - Gastos pendientes
- `GET /expenses/completed` - Gastos completados
- `GET /expenses/partial` - Gastos parciales
- `POST /expenses` - Crear gasto
- `GET /expenses/:id` - Obtener gasto
- `PATCH /expenses/:id` - Actualizar gasto
- `DELETE /expenses/:id` - Eliminar gasto

### Pagos
- `POST /expenses/payments` - Registrar pago
- `GET /expenses/payments/all` - Listar pagos
- `GET /expenses/:id/payments` - Pagos de un gasto

### Tipos de Gastos
- `GET /expense-types` - Listar tipos
- `GET /expense-types/:id` - Obtener tipo
- `GET /expense-types/:id/details` - Detalles de un tipo
- `POST /expense-types` - Crear tipo (admin/manager)
- `PATCH /expense-types/:id` - Actualizar tipo (admin/manager)
- `DELETE /expense-types/:id` - Eliminar tipo (admin)

### Usuarios (Admin)
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario
- `POST /users` - Crear usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

Ver documentación completa en: `https://tu-backend.railway.app/api/docs`

---

## 🔒 Seguridad

### CORS
✅ Ya está configurado para aceptar solicitudes desde cualquier origen (perfecto para Flutter)

**Configuración actual en `src/main.ts`:**
```typescript
app.enableCors({
  origin: true,
  credentials: true,
});
```

### Autenticación
- ✅ JWT con Bearer token
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Sistema de roles y permisos
- ✅ Validación de datos con class-validator

### Base de Datos
- ✅ Conexión SSL a PostgreSQL
- ✅ `synchronize: false` en producción
- ✅ Variables de entorno para credenciales

---

## 🐛 Solución de Problemas

### Error: "Network error" en Flutter
- ✅ Verifica que la URL sea correcta (con https://)
- ✅ Asegúrate de que el backend esté en estado "Active" en Railway
- ✅ Prueba la URL en el navegador primero

### Error: "401 Unauthorized"
- ✅ Verifica que el token JWT se esté enviando en el header
- ✅ Header debe ser: `Authorization: Bearer <token>`
- ✅ Asegúrate de haber ejecutado el seed

### Error: "404 Not Found"
- ✅ Verifica la ruta (ejemplo: `/auth/login`, no `/api/auth/login`)
- ✅ Consulta `/api/docs` para las rutas exactas

### Backend no inicia en Railway
- ✅ Revisa los logs: Backend → Deployments → Click en el deployment
- ✅ Verifica que PostgreSQL esté agregado y conectado
- ✅ Verifica que `DATABASE_URL` exista en las variables

---

## 📚 Documentación Adicional

- **[GET-BACKEND-URL.md](./GET-BACKEND-URL.md)** - Cómo obtener la URL paso a paso
- **[FRONTEND-CONFIG-EXAMPLE.md](./FRONTEND-CONFIG-EXAMPLE.md)** - Código completo para Flutter
- **[RAILWAY-POSTGRESQL-SETUP.md](./RAILWAY-POSTGRESQL-SETUP.md)** - Configurar PostgreSQL
- **[QUICK-FIX-ECONNREFUSED.md](./QUICK-FIX-ECONNREFUSED.md)** - Solución rápida de errores
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía completa de despliegue
- **[CHANGELOG-RAILWAY.md](./CHANGELOG-RAILWAY.md)** - Cambios técnicos realizados

---

## ✅ Checklist Final

### Backend en Railway:
- [ ] Backend desplegado y corriendo
- [ ] PostgreSQL agregado y conectado
- [ ] Variables de entorno configuradas
- [ ] Seed ejecutado
- [ ] `/api/docs` funciona
- [ ] Login con admin@gastos.com funciona

### Frontend en Flutter:
- [ ] URL del backend obtenida
- [ ] `api_config.dart` creado con la URL correcta
- [ ] Dependencias agregadas (dio, flutter_secure_storage)
- [ ] Servicios implementados (auth, expenses)
- [ ] Login probado desde la app
- [ ] Token JWT guardado correctamente
- [ ] CRUD de gastos funcionando

---

## 🎯 Credenciales por Defecto

Después de ejecutar el seed:

**Admin:**
- Email: `admin@gastos.com`
- Password: `admin123`
- Permisos: Todos

**Usuarios de prueba:**
Puedes crear más usuarios desde la app o usando el endpoint de registro.

---

## 🚀 Próximos Pasos

1. **Terminar el frontend:**
   - Implementar todas las pantallas
   - Agregar manejo de estados (Provider/Riverpod)
   - Implementar caché local si es necesario

2. **Mejorar seguridad:**
   - Cambiar credenciales por defecto
   - Implementar refresh tokens
   - Agregar rate limiting

3. **Optimizaciones:**
   - Agregar paginación en listas largas
   - Implementar búsqueda y filtros
   - Agregar notificaciones push

4. **Monitoreo:**
   - Configurar alertas en Railway
   - Implementar logs estructurados
   - Agregar métricas de uso

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs en Railway:**
   ```bash
   railway logs --tail 100
   ```

2. **Verifica el estado:**
   - Backend: ¿Active?
   - PostgreSQL: ¿Active?
   - Deployments: ¿Errores?

3. **Consulta la documentación:**
   - Todos los archivos MD en este directorio
   - Swagger: `/api/docs`

4. **Railway Support:**
   - Discord: [railway.app/discord](https://railway.app/discord)
   - Email: team@railway.app

---

## 🎉 ¡Felicidades!

Tu backend está desplegado en la nube y listo para conectar con tu app Flutter.

**URLs importantes:**
- 🌐 Backend: `https://tu-backend.railway.app`
- 📖 Docs: `https://tu-backend.railway.app/api/docs`
- 🎛️ Railway: `https://railway.app`

---

**Desarrollado con:**
- NestJS + TypeScript
- PostgreSQL + TypeORM
- JWT Authentication
- Swagger Documentation
- Desplegado en Railway

¡A programar! 🚀
