# 🚨 URGENTE: EJECUTAR SEED DE DATOS

## ❌ Problema Actual:
- La base de datos está vacía (no tiene tipos de gastos ni ingresos)
- Por eso las pantallas de "Nuevo Ingreso" y "Nuevo Gasto" no funcionan
- La información de licencia SÍ está en el perfil, solo revisa la pantalla de perfil

---

## ✅ SOLUCIÓN: Ejecutar el Seed

### Paso 1: Conectarte a tu base de datos de Railway

**Opción A: Usando TablePlus**
1. Abre TablePlus
2. Crea nueva conexión PostgreSQL
3. Ingresa los datos de Railway:
   - Host: `railway-host.railway.app`
   - Port: `5432`
   - User: `postgres`
   - Password: `tu-password`
   - Database: `postgres`
4. Haz clic en "Connect"

**Opción B: Usando pgAdmin**
1. Abre pgAdmin
2. Right-click en Servers → Create → Server
3. En "General" tab: nombre = Railway
4. En "Connection" tab:
   - Host: `railway-host.railway.app`
   - Port: `5432`
   - Username: `postgres`
   - Password: `tu-password`
5. Click Save

**Opción C: Usando la CLI de Railway**
```bash
railway connect
# Selecciona tu proyecto
# Selecciona PostgreSQL
# Se abrirá una conexión psql directa
```

---

### Paso 2: Ejecutar el Script de Seed

1. **Abre el archivo**: `backend/seed-initial-data.sql`

2. **Copia TODO el contenido** del archivo

3. **Pega y ejecuta** en tu cliente SQL:
   - En TablePlus: Pega en la pestaña Query y presiona Cmd+Enter (Mac) o Ctrl+Enter (Windows)
   - En pgAdmin: Pega en Query Tool y presiona F5
   - En psql: Pega directamente y presiona Enter

4. **Verifica que funcionó**:
   ```sql
   SELECT
       'expense_types' as tabla,
       COUNT(*) as cantidad
   FROM expense_types
   WHERE "isSystem" = TRUE

   UNION ALL

   SELECT
       'expense_details' as tabla,
       COUNT(*) as cantidad
   FROM expense_details
   WHERE "isSystem" = TRUE

   UNION ALL

   SELECT
       'income_types' as tabla,
       COUNT(*) as cantidad
   FROM income_types
   WHERE "isSystem" = TRUE;
   ```

   **Resultado esperado:**
   ```
   tabla             | cantidad
   ------------------|---------
   expense_types     |    13
   expense_details   |   ~50
   income_types      |    11
   ```

---

### Paso 3: Reiniciar la App Flutter

1. Haz hot reload/restart en tu app:
   - Presiona `R` en la terminal donde corre Flutter
   - O cierra y abre la app nuevamente

2. Prueba:
   - ✅ Ir a "Nuevo Gasto" → Debe mostrar tipos de gastos
   - ✅ Ir a "Nuevo Ingreso" → Debe mostrar tipos de ingresos
   - ✅ Ir a "Perfil" → Debe mostrar información de licencia

---

## 📋 ¿Qué hace el Seed?

El seed crea:

### Tipos de Gastos (13):
- Educación
- Salud
- Vivienda
- Alimentación
- Transporte
- Vestimenta
- Entretenimiento
- Servicios
- Seguros
- Impuestos
- Ahorro e Inversión
- Mascotas
- Otros

### Detalles de Gastos (~50):
- Matrícula escolar, Pensión escolar, etc. (para Educación)
- Consulta médica, Medicinas, etc. (para Salud)
- Alquiler, Luz, Agua, etc. (para Vivienda)
- Y más...

### Tipos de Ingresos (11):
- Salario
- Negocio Propio
- Freelance
- Inversiones
- Alquiler
- Bonos y Comisiones
- Regalos y Donaciones
- Venta de Activos
- Reembolsos
- Pensión/Jubilación
- Otros Ingresos

---

## ⚠️ IMPORTANTE

- Todos estos tipos tienen `isSystem = TRUE`
- Son visibles para TODOS los usuarios
- NO se pueden editar ni eliminar desde la app
- Los usuarios pueden crear sus propios tipos personalizados además de estos

---

## 🔧 Si tienes problemas

**Error: "duplicate key value"**
- Solución: El seed ya se ejecutó antes, no pasa nada

**Error: "column does not exist"**
- Solución: Reinicia el backend para que TypeORM cree las columnas

**Error: "relation does not exist"**
- Solución: El backend no creó las tablas. Verifica que esté corriendo.

---

## ✅ Después de ejecutar el seed

- Las pantallas de Nuevo Gasto y Nuevo Ingreso funcionarán correctamente
- Los usuarios verán todos los tipos predeterminados del sistema
- Los usuarios pueden crear sus propios tipos personalizados
- Todo funcionará como debe ser

**¡Ejecuta el seed AHORA y todo funcionará!** 🚀
