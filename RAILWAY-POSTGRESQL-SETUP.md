# Configuración de PostgreSQL en Railway - Guía Paso a Paso

## 🔴 Error Actual

Si ves este error:
```
ERROR [TypeOrmModule] Unable to connect to the database. Retrying...
Error: connect ECONNREFUSED ::1:5432
```

**Significa que:** Railway no tiene una base de datos PostgreSQL vinculada a tu proyecto backend.

---

## ✅ Solución: Agregar PostgreSQL en Railway

### Paso 1: Acceder a tu Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión
3. Abre tu proyecto (donde desplegaste el backend)

### Paso 2: Agregar PostgreSQL

**Método 1: Desde el Dashboard**

1. En tu proyecto, haz clic en el botón **"+ New"** (arriba a la derecha)
2. Selecciona **"Database"**
3. Haz clic en **"Add PostgreSQL"**
4. Railway creará automáticamente una base de datos PostgreSQL

**Método 2: Desde el Service**

1. Haz clic en tu servicio backend
2. Ve a la pestaña **"Settings"**
3. En la sección **"Services"**, haz clic en **"Connect"**
4. Selecciona **"New PostgreSQL Database"**

### Paso 3: Verificar que DATABASE_URL está configurado

Railway vincula automáticamente la base de datos a tu servicio backend:

1. Haz clic en tu servicio **backend** (no en la base de datos)
2. Ve a la pestaña **"Variables"**
3. Deberías ver una variable llamada **`DATABASE_URL`**
   - Ejemplo: `postgresql://postgres:password@hostname:5432/railway`
   - Si NO la ves, continúa al Paso 4

### Paso 4: Vincular manualmente la base de datos (si es necesario)

Si `DATABASE_URL` no aparece automáticamente:

1. Haz clic en tu servicio **backend**
2. Ve a **"Settings"** → **"Service"**
3. Busca la sección **"Service Variables"**
4. Haz clic en **"+ Add Variable Reference"**
5. En "Variable Name", escribe: `DATABASE_URL`
6. En "Service", selecciona tu base de datos PostgreSQL
7. En "Variable", selecciona `DATABASE_URL`
8. Guarda

### Paso 5: Verificar las Variables de Entorno

En tu servicio backend, deberías tener estas variables:

**Variables que Railway proporciona automáticamente:**
- ✅ `DATABASE_URL` - URL completa de conexión a PostgreSQL
- ✅ `PORT` - Puerto asignado por Railway

**Variables que TÚ debes agregar manualmente:**
- `NODE_ENV=production`
- `JWT_SECRET=<tu_clave_secreta_aquí>` (genera una segura)
- `JWT_EXPIRATION=7d`

**Variables que NO debes agregar:**
- ❌ `DB_HOST` - No necesario, usa DATABASE_URL
- ❌ `DB_PORT` - No necesario, usa DATABASE_URL
- ❌ `DB_USERNAME` - No necesario, usa DATABASE_URL
- ❌ `DB_PASSWORD` - No necesario, usa DATABASE_URL
- ❌ `DB_DATABASE` - No necesario, usa DATABASE_URL

### Paso 6: Redesplegar el Backend

Después de agregar PostgreSQL:

1. Ve a tu servicio backend
2. Haz clic en **"Deployments"**
3. Haz clic en **"Redeploy"** en el último deployment
4. O simplemente haz un nuevo push a GitHub (si está conectado)

### Paso 7: Verificar los Logs

1. Ve a tu servicio backend
2. Haz clic en la pestaña **"Deployments"**
3. Haz clic en el último deployment
4. Revisa los logs, deberías ver:

```
🔍 Database Configuration Debug:
  - NODE_ENV: production
  - DATABASE_URL exists: true
✅ Using DATABASE_URL for database connection
Application is running on: http://localhost:XXXX
```

Si ves esto, ¡la conexión es exitosa! ✅

---

## 🐛 Diagnóstico de Problemas

### Ver los logs en tiempo real:

**Opción 1: Dashboard de Railway**
1. Servicio backend → "Deployments" → Click en el deployment actual
2. Los logs se muestran en tiempo real

**Opción 2: Railway CLI**
```bash
railway login
railway link
railway logs
```

### Problema: DATABASE_URL no existe

**Síntomas:**
```
⚠️  Using individual DB variables:
  - DB_HOST: NOT SET
  - DB_PORT: NOT SET
```

**Solución:**
- Asegúrate de haber agregado PostgreSQL (Paso 2)
- Verifica que está vinculado al backend (Paso 4)
- Redesplega el servicio (Paso 6)

### Problema: Error de autenticación con PostgreSQL

**Síntomas:**
```
ERROR [TypeOrmModule] password authentication failed
```

**Solución:**
- Elimina cualquier variable `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- Deja que Railway use solo `DATABASE_URL`
- Redesplega

### Problema: SSL error

**Síntomas:**
```
ERROR [TypeOrmModule] no pg_hba.conf entry for host
```

**Solución:**
- Ya está configurado en el código con `ssl: { rejectUnauthorized: false }`
- Si persiste, verifica que `DATABASE_URL` tenga el formato correcto

---

## 📊 Verificar la Conexión

### 1. Probar el endpoint de salud

```bash
curl https://tu-app.railway.app/
```

Deberías obtener una respuesta exitosa.

### 2. Probar Swagger

Abre en tu navegador:
```
https://tu-app.railway.app/api/docs
```

Deberías ver la documentación de la API.

### 3. Probar autenticación

```bash
curl -X POST https://tu-app.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gastos.com","password":"admin123"}'
```

Si la base de datos está conectada pero no tiene datos, obtendrás un error 401 (normal).

---

## 🌱 Ejecutar Seed (Poblar Base de Datos)

Una vez que la base de datos esté conectada, necesitas poblarla con datos iniciales:

### Opción 1: Railway CLI (Recomendado)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Iniciar sesión
railway login

# Vincular al proyecto
railway link

# Ejecutar seed
railway run npm run seed
```

### Opción 2: Desde el código (temporal)

1. Crea un endpoint temporal de seed:

```typescript
// En app.controller.ts - SOLO TEMPORALMENTE
@Get('seed-database')
async seedDatabase() {
  // Importar y ejecutar tu script de seed
  return { message: 'Database seeded' };
}
```

2. Accede a: `https://tu-app.railway.app/seed-database`
3. **ELIMINA el endpoint después de usarlo** (seguridad)

### Opción 3: Conectarte directamente a PostgreSQL

```bash
# Desde Railway, copia las credenciales de PostgreSQL
# Luego conéctate con psql o un cliente GUI

psql "postgresql://postgres:password@hostname:5432/railway"
```

---

## 🔒 Generar JWT_SECRET Seguro

No uses valores de ejemplo en producción:

```bash
# En tu terminal local
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y agrégalo como variable `JWT_SECRET` en Railway.

---

## 📋 Checklist Final

Antes de considerar el setup completo, verifica:

- [ ] PostgreSQL agregado en Railway
- [ ] `DATABASE_URL` aparece en las variables del backend
- [ ] Variables `NODE_ENV`, `JWT_SECRET`, `JWT_EXPIRATION` configuradas
- [ ] Backend redesplegado después de agregar la base de datos
- [ ] Logs muestran "✅ Using DATABASE_URL for database connection"
- [ ] Endpoint `/api/docs` funciona
- [ ] Seed ejecutado (datos iniciales cargados)
- [ ] Login funciona con admin@gastos.com / admin123

---

## 📞 Soporte

Si sigues teniendo problemas:

1. **Revisa los logs completos:**
   ```bash
   railway logs --tail 100
   ```

2. **Verifica el estado de los servicios:**
   - Backend: ¿está en estado "Active"?
   - PostgreSQL: ¿está en estado "Active"?

3. **Prueba la conexión localmente:**
   ```bash
   # En tu .env local, usa el DATABASE_URL de Railway temporalmente
   DATABASE_URL=postgresql://postgres:password@hostname:5432/railway
   npm run start:dev
   ```

4. **Contacta soporte de Railway:**
   - Discord: [railway.app/discord](https://railway.app/discord)
   - Email: team@railway.app

---

## 🎯 Resumen Visual

```
┌─────────────────────────────────────────┐
│         Railway Project                 │
│                                         │
│  ┌─────────────┐      ┌──────────────┐ │
│  │   Backend   │◄────►│  PostgreSQL  │ │
│  │   Service   │      │   Database   │ │
│  │             │      │              │ │
│  │ Variables:  │      │ Variables:   │ │
│  │ - DATABASE_ │      │ - DATABASE_  │ │
│  │   URL ✅    │      │   URL        │ │
│  │ - NODE_ENV  │      │ - POSTGRES_  │ │
│  │ - JWT_SECRET│      │   ... (auto) │ │
│  │ - JWT_EXP.. │      │              │ │
│  └─────────────┘      └──────────────┘ │
│                                         │
└─────────────────────────────────────────┘
         ▲
         │
         │ HTTPS
         │
    ┌────┴─────┐
    │  Users   │
    │ (Flutter │
    │   App)   │
    └──────────┘
```

**Clave:** El backend DEBE tener acceso a `DATABASE_URL` que apunta al PostgreSQL.
