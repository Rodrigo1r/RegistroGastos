# 📱 Configuración del Frontend - Ejemplos de Código

## 🎯 Tu URL de Railway

Una vez que obtengas tu URL de Railway (ver [GET-BACKEND-URL.md](./GET-BACKEND-URL.md)), será algo como:

```
https://backend-production-xxxx.up.railway.app
```

---

## 📂 Estructura Recomendada en Flutter

```
lib/
├── config/
│   └── api_config.dart          # Configuración de la API
├── services/
│   ├── http_client.dart         # Cliente HTTP configurado
│   ├── auth_service.dart        # Servicio de autenticación
│   └── expense_service.dart     # Servicio de gastos
└── models/
    ├── user.dart
    └── expense.dart
```

---

## 1️⃣ Archivo de Configuración (api_config.dart)

**Ubicación:** `lib/config/api_config.dart`

```dart
class ApiConfig {
  // ⚠️ REEMPLAZA ESTO CON TU URL DE RAILWAY
  static const String baseUrl = 'https://tu-backend.railway.app';

  // Endpoints de autenticación
  static const String login = '$baseUrl/auth/login';
  static const String register = '$baseUrl/auth/register';
  static const String me = '$baseUrl/auth/me';
  static const String forgotPassword = '$baseUrl/auth/forgot-password';
  static const String resetPassword = '$baseUrl/auth/reset-password';

  // Endpoints de gastos
  static const String expenses = '$baseUrl/expenses';
  static const String expensesSummary = '$baseUrl/expenses/summary';
  static const String expensesPending = '$baseUrl/expenses/pending';
  static const String expensesCompleted = '$baseUrl/expenses/completed';
  static const String expensesPartial = '$baseUrl/expenses/partial';

  // Endpoints de tipos de gastos
  static const String expenseTypes = '$baseUrl/expense-types';
  static const String expenseDetails = '$baseUrl/expense-types/details';

  // Endpoints de pagos
  static const String payments = '$baseUrl/expenses/payments';

  // Endpoints de usuarios (admin)
  static const String users = '$baseUrl/users';
  static const String roles = '$baseUrl/users/roles';
  static const String permissions = '$baseUrl/users/permissions';

  // Configuración
  static const Duration timeout = Duration(seconds: 30);

  // URLs útiles
  static const String swaggerDocs = '$baseUrl/api/docs';

  // Métodos helper para construir URLs dinámicas
  static String getExpense(int id) => '$expenses/$id';
  static String updateExpense(int id) => '$expenses/$id';
  static String deleteExpense(int id) => '$expenses/$id';

  static String getExpenseType(int id) => '$expenseTypes/$id';
  static String getExpenseTypeDetails(int typeId) => '$expenseTypes/$typeId/details';

  static String getUser(int id) => '$users/$id';

  static String getExpensePayments(int expenseId) => '$expenses/$expenseId/payments';
}
```

---

## 2️⃣ Cliente HTTP (http_client.dart)

**Ubicación:** `lib/services/http_client.dart`

```dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';

class HttpClient {
  static final HttpClient _instance = HttpClient._internal();
  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  factory HttpClient() {
    return _instance;
  }

  HttpClient._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: ApiConfig.timeout,
      receiveTimeout: ApiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Interceptor para agregar token automáticamente
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Agregar token JWT si existe
        final token = await getToken();
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }

        print('📤 ${options.method} ${options.uri}');
        return handler.next(options);
      },
      onResponse: (response, handler) {
        print('📥 ${response.statusCode} ${response.requestOptions.uri}');
        return handler.next(response);
      },
      onError: (DioException error, handler) async {
        print('❌ Error: ${error.message}');

        // Si es 401, el token expiró
        if (error.response?.statusCode == 401) {
          await clearToken();
          // Aquí puedes navegar al login o refrescar el token
        }

        return handler.next(error);
      },
    ));
  }

  // Métodos para manejar el token
  Future<void> saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }

  Future<void> clearToken() async {
    await _storage.delete(key: 'auth_token');
  }

  // Getter para acceder al cliente Dio
  Dio get dio => _dio;

  // Métodos de conveniencia
  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) {
    return _dio.get(path, queryParameters: queryParameters);
  }

  Future<Response> post(String path, {dynamic data}) {
    return _dio.post(path, data: data);
  }

  Future<Response> put(String path, {dynamic data}) {
    return _dio.put(path, data: data);
  }

  Future<Response> patch(String path, {dynamic data}) {
    return _dio.patch(path, data: data);
  }

  Future<Response> delete(String path) {
    return _dio.delete(path);
  }
}
```

---

## 3️⃣ Servicio de Autenticación (auth_service.dart)

**Ubicación:** `lib/services/auth_service.dart`

```dart
import 'package:dio/dio.dart';
import '../config/api_config.dart';
import 'http_client.dart';

class AuthService {
  final HttpClient _httpClient = HttpClient();

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _httpClient.post(
        ApiConfig.login,
        data: {
          'email': email,
          'password': password,
        },
      );

      // Guardar token
      final token = response.data['access_token'];
      await _httpClient.saveToken(token);

      return response.data;
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        throw Exception('Credenciales incorrectas');
      }
      throw Exception('Error al iniciar sesión: ${e.message}');
    }
  }

  // Register
  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _httpClient.post(
        ApiConfig.register,
        data: {
          'name': name,
          'email': email,
          'password': password,
        },
      );

      // Guardar token
      final token = response.data['access_token'];
      await _httpClient.saveToken(token);

      return response.data;
    } on DioException catch (e) {
      if (e.response?.statusCode == 400) {
        throw Exception('El email ya está registrado');
      }
      throw Exception('Error al registrarse: ${e.message}');
    }
  }

  // Get current user
  Future<Map<String, dynamic>> getCurrentUser() async {
    try {
      final response = await _httpClient.get(ApiConfig.me);
      return response.data;
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        throw Exception('No autenticado');
      }
      throw Exception('Error al obtener usuario: ${e.message}');
    }
  }

  // Logout
  Future<void> logout() async {
    await _httpClient.clearToken();
  }

  // Verificar si está autenticado
  Future<bool> isAuthenticated() async {
    final token = await _httpClient.getToken();
    return token != null && token.isNotEmpty;
  }

  // Forgot password
  Future<void> forgotPassword(String email) async {
    try {
      await _httpClient.post(
        ApiConfig.forgotPassword,
        data: {'email': email},
      );
    } on DioException catch (e) {
      throw Exception('Error al enviar email: ${e.message}');
    }
  }

  // Reset password
  Future<void> resetPassword({
    required String email,
    required String code,
    required String newPassword,
  }) async {
    try {
      await _httpClient.post(
        ApiConfig.resetPassword,
        data: {
          'email': email,
          'code': code,
          'newPassword': newPassword,
        },
      );
    } on DioException catch (e) {
      throw Exception('Error al resetear contraseña: ${e.message}');
    }
  }
}
```

---

## 4️⃣ Servicio de Gastos (expense_service.dart)

**Ubicación:** `lib/services/expense_service.dart`

```dart
import 'package:dio/dio.dart';
import '../config/api_config.dart';
import 'http_client.dart';

class ExpenseService {
  final HttpClient _httpClient = HttpClient();

  // Obtener todos los gastos
  Future<List<dynamic>> getAllExpenses() async {
    try {
      final response = await _httpClient.get(ApiConfig.expenses);
      return response.data;
    } on DioException catch (e) {
      throw Exception('Error al obtener gastos: ${e.message}');
    }
  }

  // Obtener gastos pendientes
  Future<List<dynamic>> getPendingExpenses() async {
    try {
      final response = await _httpClient.get(ApiConfig.expensesPending);
      return response.data;
    } on DioException catch (e) {
      throw Exception('Error al obtener gastos pendientes: ${e.message}');
    }
  }

  // Obtener resumen
  Future<Map<String, dynamic>> getSummary() async {
    try {
      final response = await _httpClient.get(ApiConfig.expensesSummary);
      return response.data;
    } on DioException catch (e) {
      throw Exception('Error al obtener resumen: ${e.message}');
    }
  }

  // Crear gasto
  Future<Map<String, dynamic>> createExpense({
    required String concept,
    required double amount,
    required String paymentDate,
    required int expenseTypeId,
    required int expenseDetailId,
  }) async {
    try {
      final response = await _httpClient.post(
        ApiConfig.expenses,
        data: {
          'concept': concept,
          'amount': amount,
          'paymentDate': paymentDate,
          'expenseTypeId': expenseTypeId,
          'expenseDetailId': expenseDetailId,
        },
      );
      return response.data;
    } on DioException catch (e) {
      throw Exception('Error al crear gasto: ${e.message}');
    }
  }

  // Actualizar gasto
  Future<Map<String, dynamic>> updateExpense(
    int id, {
    String? concept,
    double? amount,
    String? paymentDate,
    int? expenseTypeId,
    int? expenseDetailId,
  }) async {
    try {
      final data = <String, dynamic>{};
      if (concept != null) data['concept'] = concept;
      if (amount != null) data['amount'] = amount;
      if (paymentDate != null) data['paymentDate'] = paymentDate;
      if (expenseTypeId != null) data['expenseTypeId'] = expenseTypeId;
      if (expenseDetailId != null) data['expenseDetailId'] = expenseDetailId;

      final response = await _httpClient.patch(
        ApiConfig.updateExpense(id),
        data: data,
      );
      return response.data;
    } on DioException catch (e) {
      throw Exception('Error al actualizar gasto: ${e.message}');
    }
  }

  // Eliminar gasto
  Future<void> deleteExpense(int id) async {
    try {
      await _httpClient.delete(ApiConfig.deleteExpense(id));
    } on DioException catch (e) {
      throw Exception('Error al eliminar gasto: ${e.message}');
    }
  }

  // Registrar pago
  Future<Map<String, dynamic>> registerPayment({
    required int expenseId,
    required double amount,
    String? paymentDate,
  }) async {
    try {
      final response = await _httpClient.post(
        ApiConfig.payments,
        data: {
          'expenseId': expenseId,
          'amount': amount,
          'paymentDate': paymentDate ?? DateTime.now().toIso8601String(),
        },
      );
      return response.data;
    } on DioException catch (e) {
      throw Exception('Error al registrar pago: ${e.message}');
    }
  }

  // Obtener tipos de gastos
  Future<List<dynamic>> getExpenseTypes() async {
    try {
      final response = await _httpClient.get(ApiConfig.expenseTypes);
      return response.data;
    } on DioException catch (e) {
      throw Exception('Error al obtener tipos de gastos: ${e.message}');
    }
  }

  // Obtener detalles de un tipo de gasto
  Future<List<dynamic>> getExpenseDetails(int typeId) async {
    try {
      final response = await _httpClient.get(
        ApiConfig.getExpenseTypeDetails(typeId),
      );
      return response.data;
    } on DioException catch (e) {
      throw Exception('Error al obtener detalles: ${e.message}');
    }
  }
}
```

---

## 5️⃣ Ejemplo de Uso en un Widget

```dart
import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _authService = AuthService();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  Future<void> _login() async {
    setState(() => _isLoading = true);

    try {
      final result = await _authService.login(
        _emailController.text,
        _passwordController.text,
      );

      // Login exitoso
      print('Usuario: ${result['user']['name']}');

      // Navegar a la pantalla principal
      Navigator.pushReplacementNamed(context, '/home');
    } catch (e) {
      // Mostrar error
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _login,
              child: _isLoading
                  ? CircularProgressIndicator()
                  : Text('Iniciar Sesión'),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 📦 Dependencias Necesarias

Agrega estas dependencias en tu `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter

  # HTTP client
  dio: ^5.4.0

  # Almacenamiento seguro para el token
  flutter_secure_storage: ^9.0.0

  # Opcional: Para manejo de estado
  provider: ^6.1.1
  # O
  riverpod: ^2.4.9
```

---

## ✅ Checklist de Implementación

1. [ ] Obtener URL del backend en Railway
2. [ ] Crear `api_config.dart` con tu URL
3. [ ] Implementar `http_client.dart`
4. [ ] Implementar `auth_service.dart`
5. [ ] Implementar `expense_service.dart`
6. [ ] Probar login con: admin@gastos.com / admin123
7. [ ] Probar CRUD de gastos
8. [ ] Manejar errores y estados de carga
9. [ ] Implementar logout
10. [ ] Probar en dispositivo real

---

## 🚀 Siguiente Paso

1. Reemplaza `'https://tu-backend.railway.app'` con tu URL real de Railway
2. Copia los archivos de configuración a tu proyecto Flutter
3. Prueba el login con las credenciales por defecto
4. Implementa las demás pantallas de tu app

¡Tu app ya está conectada al backend en la nube! 🎉
