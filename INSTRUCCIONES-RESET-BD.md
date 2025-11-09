# ✅ CHECKLIST COMPLETO - RESET BASE DE DATOS

## 📋 PASO 1: VERIFICACIÓN DE ENTIDADES

### ✅ expense-type.entity.ts
```typescript
- ✅ Campo: isSystem (boolean, default: false)
- ✅ Campo: created_by_id (nullable: true)
- ✅ Fechas: createdAt, updatedAt (camelCase)
- ✅ No tiene @Unique en name
```

### ✅ expense-detail.entity.ts
```typescript
- ✅ Campo: isSystem (boolean, default: false)
- ✅ Campo: created_by_id (nullable: true)
- ✅ Fechas: createdAt, updatedAt (camelCase)
- ✅ No tiene @Unique en name
```

### ✅ income-type.entity.ts
```typescript
- ✅ Campo: isSystem (boolean, default: false)
- ✅ Campo: created_by_id (nullable: true)
- ✅ Fechas: createdAt, updatedAt (camelCase) ← CORREGIDO
- ✅ No tiene @Unique en name
```

---

## 🗂️ PASO 2: ARCHIVOS IMPORTANTES

### Backend - Entidades actualizadas:
- ✅ `src/expense-types/entities/expense-type.entity.ts` → tiene isSystem
- ✅ `src/expense-types/entities/expense-detail.entity.ts` → tiene isSystem
- ✅ `src/income-types/entities/income-type.entity.ts` → tiene isSystem

### Backend - Servicios actualizados:
- ✅ `src/expense-types/expense-types.service.ts` → filtra por isSystem + userId
- ✅ `src/income-types/income-types.service.ts` → filtra por isSystem + userId

### SQL - Script de seed:
- ✅ `backend/seed-initial-data.sql` → crea tipos del sistema

---

## 🚀 PASO 3: PROCEDIMIENTO PARA RESET

### 1️⃣ Borrar Base de Datos en Railway
```
1. Ve a tu proyecto en Railway
2. Entra a PostgreSQL
3. Variables → DATABASE_URL
4. Conéctate con un cliente SQL (TablePlus, pgAdmin, etc.)
5. Ejecuta: DROP DATABASE postgres; CREATE DATABASE postgres;
   O simplemente borra el servicio PostgreSQL y crea uno nuevo
```

### 2️⃣ Verificar variables de entorno
```env
# backend/.env
DATABASE_HOST=<railway-host>
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=<password>
DATABASE_NAME=postgres
TYPEORM_SYNCHRONIZE=true  ← IMPORTANTE para primera vez
```

### 3️⃣ Limpiar y ejecutar backend
```bash
cd backend
rm -rf dist node_modules package-lock.json
npm install
npm run start:dev
```

**Espera a ver en logs:**
```
[TypeORM] All metadata loaded successfully
[Nest] Application successfully started
```

Esto significa que TypeORM creó todas las tablas automáticamente.

### 4️⃣ Ejecutar seed de datos iniciales
```bash
# Conéctate a la BD de Railway y ejecuta:
psql -h <railway-host> -U postgres -d postgres -f seed-initial-data.sql

# O copia el contenido de seed-initial-data.sql y ejecútalo
# en TablePlus, pgAdmin, o el cliente que uses
```

### 5️⃣ Verificar que funcionó
```sql
-- Debe retornar:
-- expense_types: 13
-- expense_details: ~50
-- income_types: 11

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

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### Error: "column does not exist"
**Causa:** TypeORM no sincronizó las tablas
**Solución:**
- Verifica que `TYPEORM_SYNCHRONIZE=true` en `.env`
- Reinicia el backend
- Verifica que no haya errores en los logs

### Error: "duplicate key value violates unique constraint"
**Causa:** Ya existen registros con el mismo nombre
**Solución:**
- Ejecuta primero los DELETE en el seed
- O borra completamente la base y empieza de cero

### Error: "relation does not exist"
**Causa:** TypeORM no creó las tablas
**Solución:**
- Asegúrate de que las entidades estén importadas en los módulos
- Verifica `app.module.ts` → TypeOrmModule.forRoot({ entities: ['dist/**/*.entity.js'] })
- Reinicia el backend

---

## 📊 ESTRUCTURA FINAL DE TABLAS

TypeORM creará estas columnas:

### expense_types
```
- id (uuid, PK)
- name (varchar)
- description (text, nullable)
- isActive (boolean, default true)
- isSystem (boolean, default false)
- created_by_id (uuid, nullable, FK → users)
- createdAt (timestamp)
- updatedAt (timestamp)
```

### expense_details
```
- id (uuid, PK)
- name (varchar)
- description (text, nullable)
- isActive (boolean, default true)
- isSystem (boolean, default false)
- expense_type_id (uuid, FK → expense_types)
- created_by_id (uuid, nullable, FK → users)
- createdAt (timestamp)
- updatedAt (timestamp)
```

### income_types
```
- id (uuid, PK)
- name (varchar(100))
- description (text, nullable)
- isActive (boolean, default true)
- isSystem (boolean, default false)
- created_by_id (uuid, nullable, FK → users)
- createdAt (timestamp)
- updatedAt (timestamp)
```

---

## ✅ TODO LISTO

Con estos pasos, cuando borres la base de datos:

1. ✅ TypeORM creará las tablas con la estructura correcta
2. ✅ El seed insertará los tipos predeterminados del sistema
3. ✅ Los servicios funcionarán correctamente (sistema + usuario)
4. ✅ No habrá errores de constraints o columnas faltantes

**¿Listo para borrar la base de datos y empezar limpio? 🚀**
