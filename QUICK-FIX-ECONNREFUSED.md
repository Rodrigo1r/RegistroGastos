# ⚡ Solución Rápida: Error ECONNREFUSED ::1:5432

## 🔴 El Problema

```
ERROR [TypeOrmModule] Unable to connect to the database. Retrying...
Error: connect ECONNREFUSED ::1:5432
```

**Causa:** Railway no tiene una base de datos PostgreSQL, o no está vinculada al backend.

---

## ✅ Solución en 3 Pasos

### 1️⃣ Agregar PostgreSQL en Railway

1. Abre tu proyecto en [railway.app](https://railway.app)
2. Click en **"+ New"** (botón arriba a la derecha)
3. Selecciona **"Database"** → **"Add PostgreSQL"**
4. Espera unos segundos a que se cree

### 2️⃣ Verificar que DATABASE_URL existe

1. Click en tu servicio **backend** (no en la base de datos)
2. Ve a la pestaña **"Variables"**
3. Busca la variable **`DATABASE_URL`**
   - ✅ Si existe → Continúa al Paso 3
   - ❌ Si NO existe → Sigue las instrucciones de vinculación abajo

**Si DATABASE_URL no existe:**

1. En tu servicio backend, ve a **"Settings"**
2. Busca **"Service Variables"** o **"Connect"**
3. Vincula la base de datos PostgreSQL que acabas de crear
4. Railway agregará automáticamente `DATABASE_URL`

### 3️⃣ Redesplegar

1. Ve a tu servicio backend
2. Click en **"Deployments"**
3. Click en el último deployment
4. Click en **"Redeploy"** (icono de reinicio)

**O simplemente haz push de nuevo código:**
```bash
git push
```

---

## 🔍 Verificar que Funcionó

Después de redesplegar, revisa los logs:

1. Backend → "Deployments" → Click en el último
2. Busca en los logs:

```
🔍 Database Configuration Debug:
  - NODE_ENV: production
  - DATABASE_URL exists: true
✅ Using DATABASE_URL for database connection
```

Si ves `✅ Using DATABASE_URL`, ¡está funcionando!

---

## 📋 Checklist

- [ ] PostgreSQL agregado en Railway
- [ ] `DATABASE_URL` visible en variables del backend
- [ ] Backend redesplegado
- [ ] Logs muestran "✅ Using DATABASE_URL"
- [ ] No hay errores de conexión

---

## 🆘 ¿Sigue sin funcionar?

Ver guía completa: [RAILWAY-POSTGRESQL-SETUP.md](./RAILWAY-POSTGRESQL-SETUP.md)

O revisa que tengas estas variables configuradas:
- `NODE_ENV=production`
- `JWT_SECRET=tu_clave_secreta_aquí`
- `JWT_EXPIRATION=7d`

**NO configures:** DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
(Railway usa DATABASE_URL en su lugar)
