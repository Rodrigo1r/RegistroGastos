# ⚡ Ejecutar Seed - Pasos Rápidos

## 🎯 Solución: Variable de Entorno RUN_SEED

Esta solución ejecuta el seed automáticamente durante el despliegue. **Más segura que un endpoint HTTP.**

---

## 🚀 3 Pasos Simples

### 1️⃣ Commit y Push

```bash
git add .
git commit -m "feat: ejecutar seed con variable RUN_SEED"
git push
```

**⏸️ Espera** a que Railway termine de desplegar (1-2 minutos).

---

### 2️⃣ Agregar Variable en Railway

1. Ve a [railway.app](https://railway.app) → Tu Proyecto → **Backend**
2. Click en **"Variables"**
3. Click en **"+ New Variable"**
4. Agrega:
   ```
   RUN_SEED=true
   ```
5. Click en **"Add"**

Railway redesplegará automáticamente (1-2 min).

---

### 3️⃣ Verificar en los Logs

Railway → Backend → **Deployments** → Click en el último

**Busca en los logs:**

```
========================================
🌱 RUN_SEED detected - Running database seed...
========================================

✅ Seed completed successfully!

📋 Result: {
  "success": true,
  "credentials": {
    "email": "admin@gastos.com",
    "password": "admin123"
  }
}
========================================
```

---

### 4️⃣ Probar Login

Abre Swagger:
```
https://tu-backend.railway.app/api/docs
```

Prueba `/auth/login` con:
- Email: `admin@gastos.com`
- Password: `admin123`

Deberías recibir un token JWT. ✅

---

### 5️⃣ Eliminar Variable (IMPORTANTE)

Railway → Backend → **Variables** → Busca `RUN_SEED` → Click en 🗑️ **Eliminar**

**⚠️ Esto es importante:** Si no eliminas la variable, el seed se ejecutará cada vez que despliegues.

---

## ✅ Checklist

- [ ] Commit y push
- [ ] Esperar deploy
- [ ] Agregar `RUN_SEED=true` en Railway
- [ ] Esperar redespliegue (ver logs)
- [ ] Verificar "✅ Seed completed successfully!"
- [ ] Probar login con admin@gastos.com
- [ ] **Eliminar variable RUN_SEED**

---

## 🐛 Problemas Comunes

### "Database already has data"

El seed ya se ejecutó. Prueba hacer login con las credenciales por defecto.

### No veo logs del seed

Verifica que escribiste exactamente `RUN_SEED=true` (mayúsculas).

### Error en los logs

Revisa que:
- PostgreSQL esté activo
- `DATABASE_URL` exista en las variables
- El deploy se haya completado

---

## 📚 Documentación Completa

Ver [SEED-CON-VARIABLE-ENV.md](./SEED-CON-VARIABLE-ENV.md) para más detalles.

---

## 🎉 ¡Listo!

Tu backend está completo:
- ✅ Desplegado en Railway
- ✅ Base de datos poblada
- ✅ Usuario admin creado
- ✅ Listo para Flutter

**Siguiente:** Configurar URL en Flutter ([FRONTEND-CONFIG-EXAMPLE.md](./FRONTEND-CONFIG-EXAMPLE.md))
