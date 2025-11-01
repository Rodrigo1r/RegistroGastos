# 🔍 Cómo Ver los Logs Correctos en Railway

## 🔴 Problema Actual

Los logs que estás viendo son de **Railway Edge** (el proxy/router), no de tu aplicación.

```json
"upstreamErrors": "connection refused"
```

Esto significa que **tu aplicación NestJS no está ejecutándose**.

---

## ✅ Cómo Ver los Logs de la Aplicación

### **Paso 1: Ir a Deployments**

1. Ve a [railway.app](https://railway.app)
2. Abre tu proyecto
3. Click en el servicio **Backend** (el cuadro de tu aplicación)
4. Click en la pestaña **"Deployments"** (arriba)

### **Paso 2: Ver el Deployment Activo**

Deberías ver una lista de deployments. El más reciente está arriba.

**Busca uno que tenga:**
- Estado: **"Active"** (verde) o **"Failed"** (rojo) o **"Building"** (amarillo)
- Es el deployment más reciente

### **Paso 3: Click en el Deployment**

Click en ese deployment para abrirlo.

### **Paso 4: Ver los Logs de Build y Runtime**

Verás dos pestañas o secciones:

1. **"Build Logs"** - Logs de compilación (`npm install`, `npm run build`)
2. **"Deploy Logs"** o **"Runtime Logs"** - Logs de ejecución (tu app corriendo)

**Necesito que veas ambos.**

---

## 🔍 Qué Buscar en los Logs

### **En Build Logs:**

Busca errores como:

```bash
❌ Error: Cannot find module 'X'
❌ npm ERR! code ELIFECYCLE
❌ TypeScript compilation failed
❌ Build failed
```

Si el build falla, la app nunca se ejecuta.

### **En Deploy/Runtime Logs:**

Busca la salida de tu aplicación:

**✅ Logs buenos (app funcionando):**
```
🔍 Database Configuration Debug:
  - NODE_ENV: production
  - DATABASE_URL exists: true
✅ Using DATABASE_URL for database connection
Application is running on: http://localhost:8080
Swagger documentation: http://localhost:8080/api/docs
```

**❌ Logs malos (app fallando):**
```
Error: connect ECONNREFUSED ::1:5432
Unable to connect to the database
Error: crypto is not defined
Module not found
Application failed to start
```

---

## 📋 Posibles Problemas y Soluciones

### **Problema 1: Build Falla**

**Síntomas en Build Logs:**
```
npm ERR! code ELIFECYCLE
Error: Command failed with exit code 1
```

**Causa:** Error de TypeScript o dependencias faltantes.

**Solución:**
```bash
# Localmente, verifica que compile
cd backend
npm run build
```

Si falla localmente, arregla los errores de TypeScript primero.

---

### **Problema 2: Database Connection Refused**

**Síntomas en Runtime Logs:**
```
Error: connect ECONNREFUSED ::1:5432
Unable to connect to the database
```

**Causa:** PostgreSQL no está conectado o `DATABASE_URL` no existe.

**Solución:**
1. Ve a tu proyecto en Railway
2. Verifica que haya un servicio **PostgreSQL** (cuadro separado)
3. Ve a Backend → **Variables** → Verifica que exista `DATABASE_URL`

---

### **Problema 3: Puerto Incorrecto**

**Síntomas en Runtime Logs:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Causa:** La app no está usando el puerto que Railway asigna.

**Solución:**
Verifica `src/main.ts`:
```typescript
const port = configService.get('PORT') || 3000;
await app.listen(port);
```

Ya debería estar correcto en tu código.

---

### **Problema 4: App No Inicia (Sin Logs)**

**Síntomas:**
- No ves logs de runtime
- O ves: "Application exited"

**Causas posibles:**
1. El comando `start:prod` no existe
2. Falta el archivo `dist/main.js`
3. Error inmediato al iniciar

**Solución:**
Verifica `package.json`:
```json
{
  "scripts": {
    "start:prod": "node dist/main"
  }
}
```

---

### **Problema 5: Variables de Entorno Faltantes**

**Síntomas en Runtime Logs:**
```
Database configuration missing!
JWT_SECRET not defined
```

**Solución:**
Railway → Backend → **Variables** → Agregar:
```
NODE_ENV=production
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRATION=7d
```

---

## 🎯 Instrucciones Específicas

**Por favor, haz esto:**

### **1. Ve a Railway:**
```
Railway → Tu Proyecto → Backend → Deployments
```

### **2. Click en el último deployment**

### **3. Copia TODOS los logs que veas**

Especialmente:
- Los últimos 20-30 líneas de **Build Logs**
- Los últimos 20-30 líneas de **Deploy/Runtime Logs**

### **4. Búscame líneas que contengan:**
- "Error"
- "Failed"
- "Unable"
- "Cannot"
- "ECONNREFUSED"
- Cualquier texto en rojo

---

## 🔧 Acceso Rápido a Logs

### **Opción 1: Railway CLI**

Si tienes Railway CLI instalado:

```bash
railway login
railway link
railway logs
```

Esto te mostrará los logs en tiempo real.

### **Opción 2: Dashboard**

Railway → Backend → Deployments → [Último deployment]

---

## 📸 Captura de Pantalla

Si es más fácil, toma una captura de pantalla de:

1. La página de Deployments (lista de deployments)
2. Los logs del último deployment

Y compártelos.

---

## ✅ Checklist para Diagnóstico

- [ ] Ir a Railway → Backend → Deployments
- [ ] Identificar el deployment más reciente
- [ ] Ver si el estado es "Active", "Failed" o "Building"
- [ ] Abrir ese deployment
- [ ] Ver Build Logs - buscar errores
- [ ] Ver Deploy/Runtime Logs - buscar errores
- [ ] Copiar los errores específicos que veas

---

## 💡 Lo Que Necesito Saber

Para ayudarte mejor, necesito:

1. **Estado del deployment:** ¿Dice "Active", "Failed", "Building", etc.?
2. **Build Logs:** ¿Se completó el build correctamente?
3. **Runtime Logs:** ¿Qué dice cuando intenta iniciar?
4. **Errores específicos:** Copia el texto exacto de cualquier error

---

## 🚨 Solución Temporal: Forzar Redeploy

Mientras vemos los logs, intenta esto:

1. Railway → Backend → **Settings**
2. Scroll hasta **"Danger"** o **"Deployments"**
3. Busca **"Trigger Deploy"** o **"Redeploy"**
4. Click para forzar un nuevo deploy
5. Espera 2-3 minutos
6. Ve a Deployments y revisa los logs del nuevo deploy

---

Una vez que vea los logs específicos de la aplicación, podré ayudarte a solucionar el problema exacto. 🚀
