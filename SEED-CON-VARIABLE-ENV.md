# 🌱 Ejecutar Seed con Variable de Entorno

## 🎯 Solución Elegante y Segura

Esta solución ejecuta el seed automáticamente durante el despliegue usando una variable de entorno temporal.

**Ventajas:**
- ✅ No hay endpoint público expuesto
- ✅ Se ejecuta automáticamente durante el deploy
- ✅ Más seguro que un endpoint HTTP
- ✅ Práctica común en DevOps

---

## 🚀 Pasos para Ejecutar el Seed

### **Paso 1: Commit y Push del Código**

```bash
git add .
git commit -m "feat: ejecutar seed automáticamente con variable RUN_SEED"
git push
```

**⏸️ Espera** a que el deploy termine (NO agregues la variable aún).

---

### **Paso 2: Agregar Variable RUN_SEED en Railway**

1. Ve a [railway.app](https://railway.app)
2. Abre tu proyecto
3. Click en el servicio **backend**
4. Ve a la pestaña **"Variables"**
5. Click en **"+ New Variable"** o **"Add Variable"**
6. Agrega:
   ```
   Variable name: RUN_SEED
   Value: true
   ```
7. Click en **"Add"** o **"Save"**

Railway redesplegará automáticamente.

---

### **Paso 3: Ver los Logs del Seed**

1. Ve a tu servicio backend en Railway
2. Click en **"Deployments"**
3. Click en el deployment más reciente (el que acaba de iniciar)
4. Revisa los logs, deberías ver:

```
========================================
🌱 RUN_SEED detected - Running database seed...
========================================

🔍 Seed Configuration:
  - DATABASE_URL exists: true
✅ Using DATABASE_URL for seed
✅ Connected to database
✅ Test user created: admin@gastos.com / admin123
✅ Expense types created
✅ Expense details created

========================================
✅ Seed completed successfully!
========================================
📋 Result: {
  "success": true,
  "message": "Database seeded successfully",
  "credentials": {
    "email": "admin@gastos.com",
    "password": "admin123"
  }
}
========================================
⚠️  REMEMBER: Delete RUN_SEED variable from Railway after this deployment
========================================

Application is running on: http://localhost:XXXX
```

---

### **Paso 4: Verificar que Funcionó**

Prueba hacer login en Swagger:

```
https://tu-backend.railway.app/api/docs
```

O con curl:

```bash
curl -X POST https://tu-backend.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gastos.com",
    "password": "admin123"
  }'
```

Deberías recibir un token JWT. ✅

---

### **Paso 5: Eliminar la Variable RUN_SEED**

**⚠️ IMPORTANTE:** Una vez que el seed se haya ejecutado correctamente, elimina la variable:

1. Ve a Railway → Backend → **Variables**
2. Encuentra la variable `RUN_SEED`
3. Click en el icono de **basura** o **eliminar** (🗑️)
4. Confirma la eliminación

Railway puede redesplegar automáticamente, pero esta vez NO ejecutará el seed (porque la variable ya no existe).

---

## 🔍 Cómo Funciona

### En `src/main.ts`:

```typescript
// Verifica si existe la variable RUN_SEED
const runSeedFlag = configService.get('RUN_SEED');

if (runSeedFlag === 'true' || runSeedFlag === '1') {
  console.log('🌱 RUN_SEED detected - Running database seed...');

  try {
    await runSeed(configService);
    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    // La app continúa ejecutándose aunque el seed falle
  }
}

// Luego continúa con el inicio normal del servidor...
```

**Características:**
- ✅ Solo se ejecuta si `RUN_SEED=true` o `RUN_SEED=1`
- ✅ Se ejecuta ANTES de iniciar el servidor
- ✅ Si el seed falla, la app continúa ejecutándose
- ✅ Muestra logs claros en Railway
- ✅ Detecta si la base de datos ya tiene datos (evita duplicados)

---

## 📋 ¿Qué Crea el Seed?

✅ **Usuario Admin:**
- Email: `admin@gastos.com`
- Password: `admin123`

✅ **5 Tipos de Gastos:**
- Educación
- Salud
- Vivienda
- Vestimenta
- Alimentación

✅ **17 Detalles de Gastos:**
- Educación: Pensión Escuela, Colegio, Universidad, Material Escolar
- Salud: Seguro Médico, Consultas, Medicamentos
- Vivienda: Agua, Luz, Teléfono, Internet, Alquiler
- Vestimenta: Ropa, Calzado
- Alimentación: Supermercado, Restaurante

---

## 🐛 Solución de Problemas

### No veo los logs del seed

**Posibles causas:**
1. La variable `RUN_SEED` no está configurada como `true` (verifica que sea exactamente `true`)
2. El deploy no se completó (revisa el estado del deployment)
3. El seed ya se ejecutó antes

**Solución:**
- Verifica que la variable sea `RUN_SEED=true` (todo en mayúsculas)
- Revisa los logs completos del deployment

### Error: "Database already has data"

```
⚠️  Database already has data. Skipping seed.
```

**Causa:** El seed ya se ejecutó antes. La base de datos ya tiene datos.

**Solución:** Esto es normal. Intenta hacer login con las credenciales por defecto.

### Error 500 o fallo en el seed

**Ver en los logs:**
```
❌ Seed failed: [mensaje de error]
```

**Solución:**
1. Revisa los logs completos
2. Verifica que `DATABASE_URL` esté configurada
3. Verifica que PostgreSQL esté activo en Railway
4. Si el error persiste, contacta soporte

### El seed se ejecuta cada vez que depliego

**Causa:** No eliminaste la variable `RUN_SEED`.

**Solución:** Elimina la variable `RUN_SEED` de Railway (Paso 5).

---

## 🔒 Seguridad

**Ventajas de esta solución:**

1. ✅ **No hay endpoint público:** No hay riesgo de que alguien ejecute el seed sin autorización
2. ✅ **Control total:** Solo se ejecuta cuando tú agregas la variable
3. ✅ **Temporal:** La variable se elimina después de usarla
4. ✅ **Logs visibles:** Puedes ver exactamente qué pasó en los logs
5. ✅ **Protección contra duplicados:** Verifica si ya hay datos antes de ejecutar

**Mejores prácticas:**
- ❌ NO dejes la variable `RUN_SEED` permanentemente
- ✅ Elimínala después de cada uso
- ✅ Solo úsala cuando necesites poblar una base de datos nueva
- ✅ Documenta cuándo y por qué se ejecutó el seed

---

## 📊 Comparación con Otras Soluciones

| Solución | Seguridad | Facilidad | Logs |
|----------|-----------|-----------|------|
| Variable ENV (esta) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Endpoint HTTP | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Railway CLI | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Conexión directa | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

---

## ✅ Checklist Completo

- [ ] Commit y push del código
- [ ] Esperar a que el deploy termine
- [ ] Agregar variable `RUN_SEED=true` en Railway
- [ ] Esperar a que redespliegue (1-2 min)
- [ ] Ver los logs del seed
- [ ] Verificar que el seed fue exitoso
- [ ] Probar login con admin@gastos.com / admin123
- [ ] **Eliminar la variable `RUN_SEED`**
- [ ] Confirmar que la app sigue funcionando

---

## 🎯 Cuándo Usar Esta Solución

**Usa esta solución cuando:**
- ✅ Necesites poblar una base de datos nueva
- ✅ Estés migrando a una nueva instancia
- ✅ Necesites resetear la base de datos (con cuidado)
- ✅ Estés configurando el ambiente por primera vez

**NO uses esta solución para:**
- ❌ Agregar datos regularmente (crea endpoints CRUD protegidos)
- ❌ Actualizar datos existentes (usa migraciones)
- ❌ Operaciones de producción frecuentes

---

## 🔄 Para Ejecutar el Seed Nuevamente

Si necesitas ejecutar el seed otra vez (por ejemplo, después de resetear la base de datos):

1. Agrega nuevamente la variable `RUN_SEED=true` en Railway
2. Railway redesplegará y ejecutará el seed
3. Elimina la variable después

**⚠️ Advertencia:** El seed está protegido contra duplicados, pero si la base de datos ya tiene datos, se saltará la ejecución.

---

## 📚 Archivos Modificados

1. ✅ **src/main.ts** - Ejecuta seed si RUN_SEED está configurada
2. ✅ **src/database/seed-runner.ts** - Función reusable de seed
3. ✅ **src/database/seed.ts** - Actualizado para soportar DATABASE_URL
4. ✅ **src/app.controller.ts** - Endpoint temporal eliminado (más seguro)

---

## 🎉 ¡Listo!

Tu base de datos está poblada y lista para usar. Ahora puedes:

1. 🔗 Conectar tu app Flutter al backend
2. 👤 Hacer login con admin@gastos.com / admin123
3. 💰 Comenzar a registrar gastos
4. 📊 Ver reportes y estadísticas

**Siguiente paso:** Configurar la URL del backend en Flutter ([FRONTEND-CONFIG-EXAMPLE.md](./FRONTEND-CONFIG-EXAMPLE.md))

---

## 💡 Tips

- **No olvides eliminar `RUN_SEED`** después de usarla
- Los logs del seed son muy útiles para debugging
- Si algo falla, la app continúa ejecutándose
- Puedes usar `RUN_SEED=1` en lugar de `RUN_SEED=true`
- El seed verifica duplicados automáticamente

---

**¿Necesitas ayuda?** Revisa los logs en Railway o consulta [FIX-SEED-ERROR.md](./FIX-SEED-ERROR.md) para soluciones alternativas.
