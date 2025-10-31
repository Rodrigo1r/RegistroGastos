# Cambios para Despliegue en Railway

## Fecha: 31 de octubre de 2025

### 🔧 Solución: ReferenceError: crypto is not defined

#### Problema
Al desplegar en Railway, la aplicación fallaba con el error:
```
ReferenceError: crypto is not defined
at generateString (/app/node_modules/@nestjs/typeorm/dist/common/typeorm.utils.js:123:37)
```

Este error ocurre porque algunas versiones de `@nestjs/typeorm` intentan usar `crypto.randomUUID()` sin importar explícitamente el módulo crypto.

#### Solución Implementada

**1. Polyfill de crypto en `src/main.ts`** (líneas 1-5)
```typescript
// Polyfill para crypto en entornos donde no está disponible globalmente
import * as crypto from 'crypto';
if (!globalThis.crypto) {
  (globalThis as any).crypto = crypto;
}
```

Este código:
- Importa el módulo nativo `crypto` de Node.js
- Lo asigna al objeto global `globalThis.crypto` si no existe
- Se ejecuta antes de cargar cualquier otro módulo de NestJS/TypeORM
- Es compatible con Node.js 14+ y no afecta el rendimiento

**2. Configuración de TypeScript actualizada en `tsconfig.json`**

Cambios realizados:
```diff
- "module": "nodenext",
- "moduleResolution": "nodenext",
- "resolvePackageJsonExports": true,
+ "module": "commonjs",
+ "moduleResolution": "node",
  "esModuleInterop": true,

- "target": "ES2023",
+ "target": "ES2021",
```

Razones:
- `commonjs` es más compatible con Railway y Node.js en producción
- `node` es la resolución de módulos estándar para aplicaciones Node.js
- `ES2021` es más estable que `ES2023` en entornos de producción
- Eliminada `resolvePackageJsonExports` que puede causar problemas con algunos paquetes

**3. Configuración de base de datos mejorada en `src/app.module.ts`**

Se agregó detección automática de `DATABASE_URL` con SSL:
```typescript
const databaseUrl = configService.get('DATABASE_URL');

if (databaseUrl) {
  // Railway proporciona DATABASE_URL
  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false, // NUNCA en producción
    ssl: {
      rejectUnauthorized: false, // Requerido para Railway
    },
  };
}
```

### 📋 Archivos Modificados

1. **src/main.ts**
   - Agregado polyfill de crypto (líneas 1-5)

2. **src/app.module.ts**
   - Agregado soporte para DATABASE_URL
   - Configuración SSL para PostgreSQL
   - Desactivado synchronize en producción

3. **tsconfig.json**
   - Cambiado module a `commonjs`
   - Cambiado moduleResolution a `node`
   - Reducido target a `ES2021`

### 📦 Archivos Nuevos

1. **railway.toml** - Configuración de Railway
2. **.railwayignore** - Archivos a excluir del deploy
3. **DEPLOYMENT.md** - Guía completa de despliegue
4. **CHANGELOG-RAILWAY.md** - Este archivo

### ✅ Verificación

Para verificar que la compilación funciona correctamente:

```bash
# Limpiar y recompilar
rm -rf dist
npm run build

# Verificar que el polyfill esté en el archivo compilado
# El archivo dist/main.js debe contener (líneas 36-39):
# const crypto = __importStar(require("crypto"));
# if (!globalThis.crypto) {
#     globalThis.crypto = crypto;
# }
```

### 🚀 Próximos Pasos

1. Hacer commit de los cambios:
   ```bash
   git add .
   git commit -m "fix: agregar polyfill de crypto y configuración para Railway"
   git push
   ```

2. En Railway:
   - Hacer un nuevo deploy (automático si está conectado a GitHub)
   - El error de crypto debería estar resuelto
   - Verificar logs: `railway logs`

3. Configurar variables de entorno en Railway:
   ```env
   NODE_ENV=production
   JWT_SECRET=<generar una clave segura>
   JWT_EXPIRATION=7d
   ```

4. Ejecutar seed (primera vez):
   ```bash
   railway run npm run seed
   ```

### 🔍 Testing

Después del deploy, verificar:
- [ ] La aplicación inicia sin errores
- [ ] Se conecta correctamente a PostgreSQL
- [ ] Swagger está disponible en `/api/docs`
- [ ] Los endpoints de autenticación funcionan
- [ ] El CORS permite solicitudes desde tu frontend

### 📚 Referencias

- [Railway Docs](https://docs.railway.app/)
- [NestJS Deployment](https://docs.nestjs.com/faq/deployment)
- [TypeORM Configuration](https://typeorm.io/data-source-options)
- [Node.js crypto module](https://nodejs.org/api/crypto.html)

### ⚠️ Notas Importantes

1. **No usar synchronize: true en producción**
   - Puede causar pérdida de datos
   - Usar migraciones en su lugar

2. **JWT_SECRET debe ser seguro**
   - Generar con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - No usar valores de ejemplo

3. **SSL en PostgreSQL**
   - `rejectUnauthorized: false` es necesario para Railway
   - Railway maneja la seguridad de la conexión

4. **Variables de entorno**
   - Nunca hacer commit del archivo `.env`
   - Configurar todas las variables en Railway antes del deploy

5. **Backups de base de datos**
   - Railway proporciona snapshots automáticos
   - Configurar backups adicionales para producción
