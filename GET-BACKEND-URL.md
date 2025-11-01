# 🌐 Obtener la URL del Backend en Railway

## Método 1: Desde el Dashboard de Railway (Recomendado)

### Opción A: Desde el Servicio
1. Ve a [railway.app](https://railway.app)
2. Abre tu proyecto
3. Click en tu servicio **backend**
4. Ve a la pestaña **"Settings"**
5. Busca la sección **"Domains"** o **"Networking"**
6. Verás una URL como:
   ```
   https://tu-proyecto-production.up.railway.app
   ```
   O algo similar como:
   ```
   https://backend-production-xxxx.up.railway.app
   ```

### Opción B: Desde Deployments
1. Ve a tu servicio backend
2. Click en **"Deployments"**
3. Click en el último deployment (el verde/activo)
4. Arriba verás un botón **"View Logs"** y un ícono de enlace 🔗
5. Click en el ícono de enlace o busca la URL en la parte superior

### Opción C: Generar un Dominio Público
Si no ves ninguna URL:

1. Ve a tu servicio backend
2. Click en **"Settings"**
3. Busca **"Networking"** o **"Domains"**
4. Click en **"Generate Domain"** o **"Add Public Domain"**
5. Railway generará una URL pública automáticamente

---

## Método 2: Usando Railway CLI

```bash
# Instalar Railway CLI (si no lo tienes)
npm install -g @railway/cli

# Iniciar sesión
railway login

# Vincular al proyecto
railway link

# Obtener información del servicio
railway status

# Ver variables (incluye la URL si está configurada)
railway variables
```

---

## 🧪 Verificar que el Backend Funciona

Una vez que tengas la URL, prueba estos endpoints:

### 1. Verificar que el servidor responde
```bash
curl https://tu-backend.railway.app/
```

Deberías ver algo como:
```json
{"message": "Hello World!"}
```

### 2. Verificar Swagger (Documentación de la API)
Abre en tu navegador:
```
https://tu-backend.railway.app/api/docs
```

Deberías ver la interfaz de Swagger con todos los endpoints documentados.

### 3. Probar Login (después de ejecutar seed)
```bash
curl -X POST https://tu-backend.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gastos.com",
    "password": "admin123"
  }'
```

Deberías recibir un token JWT:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@gastos.com",
    "name": "Administrador"
  }
}
```

---

## 📱 Configurar en el Frontend (Flutter)

### Opción 1: Archivo de Configuración

Crea un archivo `lib/config/api_config.dart`:

```dart
class ApiConfig {
  // URL del backend en Railway
  static const String baseUrl = 'https://tu-backend.railway.app';

  // Endpoints
  static const String apiUrl = '$baseUrl/api';
  static const String authUrl = '$baseUrl/auth';

  // Timeout
  static const Duration timeout = Duration(seconds: 30);
}
```

### Opción 2: Variables de Entorno (Recomendado)

**1. Crear archivo `.env` en la raíz del proyecto Flutter:**

```env
# .env
API_BASE_URL=https://tu-backend.railway.app
API_TIMEOUT=30000
```

**2. Agregar al `.gitignore`:**
```
.env
.env.local
.env.production
```

**3. Crear archivos para diferentes entornos:**

`.env.development`:
```env
API_BASE_URL=http://localhost:3000
```

`.env.production`:
```env
API_BASE_URL=https://tu-backend.railway.app
```

**4. Usar en tu código:**
```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConfig {
  static String get baseUrl => dotenv.env['API_BASE_URL'] ?? '';
}
```

### Opción 3: Directo en el Código (Desarrollo Rápido)

```dart
// lib/services/api_service.dart
class ApiService {
  static const String baseUrl = 'https://tu-backend.railway.app';

  final Dio _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
    headers: {
      'Content-Type': 'application/json',
    },
  ));

  // Tus métodos de API...
}
```

---

## 🔧 Ejemplo Completo de Configuración en Flutter

```dart
// lib/config/api_config.dart
class ApiConfig {
  // Railway Backend URL
  static const String baseUrl = 'https://tu-backend.railway.app';

  // Endpoints principales
  static const String auth = '$baseUrl/auth';
  static const String users = '$baseUrl/users';
  static const String expenses = '$baseUrl/expenses';
  static const String expenseTypes = '$baseUrl/expense-types';

  // Configuración
  static const Duration timeout = Duration(seconds: 30);

  // Endpoints específicos
  static String login() => '$auth/login';
  static String register() => '$auth/register';
  static String me() => '$auth/me';

  static String getExpenses() => expenses;
  static String createExpense() => expenses;
  static String getExpense(int id) => '$expenses/$id';

  // URLs de documentación (útil para debug)
  static String swaggerDocs() => '$baseUrl/api/docs';
}
```

```dart
// lib/services/http_client.dart
import 'package:dio/dio.dart';
import '../config/api_config.dart';

class HttpClient {
  late final Dio _dio;

  HttpClient() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: ApiConfig.timeout,
      receiveTimeout: ApiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    // Interceptor para agregar token
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Agregar token si existe
        final token = await _getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        // Manejar errores
        print('Error: ${error.message}');
        return handler.next(error);
      },
    ));
  }

  Future<String?> _getToken() async {
    // Obtener token de SharedPreferences o SecureStorage
    return null;
  }

  Dio get dio => _dio;
}
```

---

## 🔒 Configurar CORS (Si tienes problemas)

Si tu frontend Flutter (web) tiene problemas de CORS, actualiza `src/main.ts` en el backend:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',           // Flutter web local
    'https://tu-frontend.vercel.app',  // Tu frontend en producción
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

O permite todo (solo para desarrollo):
```typescript
app.enableCors({
  origin: true,
  credentials: true,
});
```

Nota: El CORS ya está configurado para aceptar cualquier origen en tu proyecto actual.

---

## 📋 Checklist de Configuración

- [ ] Obtener URL del backend en Railway
- [ ] Verificar que `/api/docs` funciona
- [ ] Probar endpoint de login con curl
- [ ] Crear archivo de configuración en Flutter (`api_config.dart`)
- [ ] Actualizar la URL base en el frontend
- [ ] Probar login desde la app Flutter
- [ ] Verificar que los requests llevan el token
- [ ] Probar CRUD de gastos

---

## 🐛 Solución de Problemas

### Error: "Network error" o "Connection refused"
- ✅ Verifica que la URL sea correcta (https, no http)
- ✅ Asegúrate de que el backend esté ejecutándose (verde en Railway)
- ✅ Prueba la URL en el navegador primero

### Error: "CORS policy"
- ✅ Solo aplica para Flutter Web
- ✅ Flutter Mobile no tiene problemas de CORS
- ✅ Actualiza la configuración CORS en `src/main.ts`

### Error: "401 Unauthorized"
- ✅ Verifica que el token JWT se esté enviando correctamente
- ✅ El header debe ser: `Authorization: Bearer tu-token-aqui`
- ✅ Verifica que el token no haya expirado

### Error: "404 Not Found"
- ✅ Verifica que la ruta sea correcta
- ✅ Recuerda que las rutas son: `/auth/login`, no `/api/auth/login`
- ✅ Consulta `/api/docs` para ver las rutas exactas

---

## 📚 URLs Útiles

Una vez que tengas tu URL de Railway, guarda estos enlaces:

```
Backend:       https://tu-backend.railway.app
Documentación: https://tu-backend.railway.app/api/docs
Health Check:  https://tu-backend.railway.app/
```

---

## 🎯 Ejemplo de Uso en Flutter

```dart
// Ejemplo: Login
Future<void> login(String email, String password) async {
  try {
    final response = await dio.post(
      '${ApiConfig.baseUrl}/auth/login',
      data: {
        'email': email,
        'password': password,
      },
    );

    final token = response.data['access_token'];
    final user = response.data['user'];

    // Guardar token
    await _saveToken(token);

    print('Login exitoso: ${user['name']}');
  } catch (e) {
    print('Error en login: $e');
    rethrow;
  }
}
```

---

## 🚀 Siguiente Paso

Después de configurar la URL:
1. Ejecutar el seed si aún no lo hiciste: `railway run npm run seed`
2. Probar login con: admin@gastos.com / admin123
3. Implementar autenticación en Flutter
4. Conectar los demás endpoints

¡Tu backend está listo en la nube! 🎉
