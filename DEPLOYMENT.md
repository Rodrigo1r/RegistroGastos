# Guía de Despliegue en Railway

## Pasos para desplegar en Railway

### 1. Preparación del proyecto
El proyecto ya está configurado con:
- ✅ `railway.toml` para configuración de build/deploy
- ✅ `.railwayignore` para excluir archivos innecesarios
- ✅ Soporte para `DATABASE_URL` de Railway
- ✅ Configuración SSL para PostgreSQL en la nube
- ✅ Polyfill de crypto para compatibilidad con NestJS/TypeORM
- ✅ TypeScript configurado para CommonJS (compatibilidad con Railway)

### 2. Crear cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Regístrate o inicia sesión con GitHub

### 3. Crear nuevo proyecto
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Autoriza Railway para acceder a tu repositorio
4. Selecciona tu repositorio backend

### 4. Agregar PostgreSQL ⚠️ IMPORTANTE
1. En tu proyecto Railway, click en "**+ New**"
2. Selecciona "**Database**" → "**Add PostgreSQL**"
3. Railway creará automáticamente la base de datos y la variable `DATABASE_URL`

**🚨 ESTO ES CRÍTICO:** Sin PostgreSQL, la aplicación no podrá conectarse a ninguna base de datos y fallará con error `ECONNREFUSED ::1:5432`.

**📖 Guía detallada:** Ver [RAILWAY-POSTGRESQL-SETUP.md](./RAILWAY-POSTGRESQL-SETUP.md) si tienes problemas.

### 5. Configurar Variables de Entorno
En el panel de tu servicio backend, ve a "Variables" y agrega:

```env
NODE_ENV=production
JWT_SECRET=tu_clave_jwt_muy_segura_aqui
JWT_EXPIRATION=7d
```

**IMPORTANTE:** NO agregues las variables de DB_HOST, DB_PORT, etc. Railway ya proporciona `DATABASE_URL` automáticamente.

### 6. Generar un JWT_SECRET seguro
Puedes generar uno con:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 7. Deploy
1. Railway detectará automáticamente que es un proyecto Node.js
2. Ejecutará `npm install` y `npm run build`
3. Iniciará el servidor con `npm run start:prod`

### 8. Ejecutar Seed (Primera vez)
Para poblar la base de datos con datos iniciales:

1. En Railway, ve a tu servicio backend
2. Click en "Settings" → "Deploy Triggers"
3. Agrega una variable temporal: `RUN_SEED=true`
4. Despliega nuevamente
5. Luego elimina la variable `RUN_SEED`

**Alternativa:** Usar Railway CLI:
```bash
railway run npm run seed
```

### 9. Verificar el despliegue
1. Railway te proporcionará una URL pública
2. Verifica que la API funcione: `https://tu-app.railway.app/api/docs`
3. Deberías ver la documentación Swagger

### 10. Configurar CORS (si es necesario)
Si tu frontend está en un dominio específico, actualiza la configuración CORS en `src/main.ts`:

```typescript
app.enableCors({
  origin: ['https://tu-dominio-frontend.com', 'http://localhost:3000'],
  credentials: true,
});
```

## Variables de Entorno Completas

| Variable | Descripción | Valor |
|----------|-------------|-------|
| `DATABASE_URL` | URL de PostgreSQL | Railway lo proporciona automáticamente |
| `NODE_ENV` | Entorno de ejecución | `production` |
| `JWT_SECRET` | Clave secreta para JWT | Generar una clave segura |
| `JWT_EXPIRATION` | Tiempo de expiración del token | `7d` |
| `PORT` | Puerto del servidor | Railway lo asigna automáticamente |

## Comandos Railway CLI (Opcional)

### Instalar Railway CLI
```bash
npm i -g @railway/cli
```

### Iniciar sesión
```bash
railway login
```

### Vincular proyecto
```bash
railway link
```

### Ver logs
```bash
railway logs
```

### Ejecutar comandos
```bash
railway run npm run seed
```

## Solución de Problemas

### ❌ ReferenceError: crypto is not defined
**Error resuelto** - El proyecto ya incluye un polyfill de crypto en `src/main.ts` que soluciona este problema común con NestJS/TypeORM en Railway.

Si el error persiste:
1. Verifica que el build se haya completado correctamente
2. Asegúrate de que el archivo `dist/main.js` incluya el polyfill (líneas 36-39)
3. Revisa que `tsconfig.json` use `"module": "commonjs"`

### Error de conexión a la base de datos
- Verifica que PostgreSQL esté agregado al proyecto
- Asegúrate de que `DATABASE_URL` esté disponible
- Revisa los logs: `railway logs`

### Error de build
- Verifica que todas las dependencias estén en `dependencies` (no en `devDependencies`)
- Asegúrate de que TypeScript compile correctamente: `npm run build`
- Si hay errores de TypeScript, revisa `tsconfig.json`

### Error de puerto
- Railway asigna el puerto automáticamente via la variable `PORT`
- No hardcodees el puerto en tu código

### SSL/TLS Error
- Ya está configurado en `app.module.ts` con `rejectUnauthorized: false`

### Module not found errors
- Ejecuta `npm install` localmente y asegúrate de que todas las dependencias estén en `package.json`
- Verifica que el `package-lock.json` esté actualizado
- Railway ejecutará `npm install` automáticamente durante el deploy

## Monitoreo

Railway proporciona:
- Logs en tiempo real
- Métricas de uso (CPU, RAM, Network)
- Reinicio automático en caso de fallos

## Costos

Railway ofrece:
- $5 de crédito gratuito mensualmente
- Plan de pago basado en uso
- PostgreSQL incluido en el costo

## Seguridad

✅ Ya implementado:
- SSL/TLS para conexión a base de datos
- Variables de entorno para secretos
- Contraseñas encriptadas con bcrypt
- Autenticación JWT
- `synchronize: false` en producción

## Próximos Pasos

1. Configura un dominio personalizado (opcional)
2. Implementa migraciones de TypeORM para cambios en el esquema
3. Configura alertas y monitoreo
4. Implementa backups de la base de datos
5. Configura CI/CD desde GitHub
