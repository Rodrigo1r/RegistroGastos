-- ===================================================================
-- SEED INICIAL: Tipos predeterminados del sistema
-- ===================================================================
-- Este script crea los tipos de gastos e ingresos predeterminados
-- que estarán disponibles para todos los usuarios desde el inicio.
--
-- IMPORTANTE:
-- 1. Ejecuta este script DESPUÉS de que el backend haya creado las tablas
-- 2. TypeORM debe haber ejecutado primero (npm run start:dev)
-- 3. Este script es IDEMPOTENTE (puedes ejecutarlo múltiples veces)
-- ===================================================================

-- ===================================================================
-- PARTE 1: TIPOS DE GASTOS DEL SISTEMA
-- ===================================================================

-- Limpiar tipos del sistema existentes
DELETE FROM expense_details WHERE "isSystem" = TRUE;
DELETE FROM expense_types WHERE "isSystem" = TRUE;

-- Insertar tipos de gastos predeterminados
INSERT INTO expense_types (id, name, description, "isActive", "isSystem", created_by_id, "createdAt", "updatedAt")
VALUES
    (gen_random_uuid(), 'Educación', 'Gastos relacionados con educación, cursos, libros, etc.', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Salud', 'Gastos médicos, medicinas, seguros de salud, etc.', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Vivienda', 'Alquiler, hipoteca, servicios básicos, mantenimiento', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Alimentación', 'Supermercado, restaurantes, comida', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Transporte', 'Gasolina, transporte público, mantenimiento de vehículo', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Vestimenta', 'Ropa, calzado, accesorios', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Entretenimiento', 'Ocio, hobbies, suscripciones, salidas', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Servicios', 'Internet, teléfono, streaming, otros servicios', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Seguros', 'Seguros de vida, auto, hogar, etc.', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Impuestos', 'Impuestos y obligaciones fiscales', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Ahorro e Inversión', 'Ahorros, inversiones, fondos', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Mascotas', 'Comida, veterinario, accesorios para mascotas', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Otros', 'Gastos varios no categorizados', TRUE, TRUE, NULL, NOW(), NOW());

-- ===================================================================
-- PARTE 2: DETALLES DE GASTOS DEL SISTEMA
-- ===================================================================

-- Insertar detalles para Educación
INSERT INTO expense_details (id, name, description, "isActive", "isSystem", expense_type_id, created_by_id, "createdAt", "updatedAt")
SELECT
    gen_random_uuid(),
    detail.name,
    detail.description,
    TRUE,
    TRUE,
    et.id,
    NULL,
    NOW(),
    NOW()
FROM expense_types et
CROSS JOIN (
    VALUES
        ('Matrícula escolar', 'Pago de matrícula'),
        ('Pensión escolar', 'Pago mensual de pensión'),
        ('Útiles escolares', 'Cuadernos, lápices, material escolar'),
        ('Uniformes', 'Uniformes escolares'),
        ('Cursos y capacitaciones', 'Cursos, talleres, seminarios'),
        ('Libros y material de estudio', 'Libros, manuales, material educativo')
) AS detail(name, description)
WHERE et.name = 'Educación' AND et."isSystem" = TRUE;

-- Insertar detalles para Salud
INSERT INTO expense_details (id, name, description, "isActive", "isSystem", expense_type_id, created_by_id, "createdAt", "updatedAt")
SELECT
    gen_random_uuid(),
    detail.name,
    detail.description,
    TRUE,
    TRUE,
    et.id,
    NULL,
    NOW(),
    NOW()
FROM expense_types et
CROSS JOIN (
    VALUES
        ('Consulta médica', 'Consultas con médicos'),
        ('Medicinas', 'Compra de medicamentos'),
        ('Exámenes y análisis', 'Exámenes de laboratorio'),
        ('Hospitalización', 'Gastos de hospital'),
        ('Seguro médico', 'Pago de seguro de salud'),
        ('Odontología', 'Dentista y tratamientos dentales'),
        ('Óptica', 'Lentes, examen de vista'),
        ('Terapias', 'Fisioterapia, psicología, etc.')
) AS detail(name, description)
WHERE et.name = 'Salud' AND et."isSystem" = TRUE;

-- Insertar detalles para Vivienda
INSERT INTO expense_details (id, name, description, "isActive", "isSystem", expense_type_id, created_by_id, "createdAt", "updatedAt")
SELECT
    gen_random_uuid(),
    detail.name,
    detail.description,
    TRUE,
    TRUE,
    et.id,
    NULL,
    NOW(),
    NOW()
FROM expense_types et
CROSS JOIN (
    VALUES
        ('Alquiler', 'Pago mensual de alquiler'),
        ('Hipoteca', 'Pago de crédito hipotecario'),
        ('Agua', 'Servicio de agua'),
        ('Luz', 'Servicio de electricidad'),
        ('Gas', 'Servicio de gas'),
        ('Mantenimiento', 'Reparaciones y mantenimiento del hogar'),
        ('Impuesto predial', 'Impuestos de la propiedad'),
        ('Condominio', 'Cuota de mantenimiento de condominio')
) AS detail(name, description)
WHERE et.name = 'Vivienda' AND et."isSystem" = TRUE;

-- Insertar detalles para Alimentación
INSERT INTO expense_details (id, name, description, "isActive", "isSystem", expense_type_id, created_by_id, "createdAt", "updatedAt")
SELECT
    gen_random_uuid(),
    detail.name,
    detail.description,
    TRUE,
    TRUE,
    et.id,
    NULL,
    NOW(),
    NOW()
FROM expense_types et
CROSS JOIN (
    VALUES
        ('Supermercado', 'Compras de supermercado'),
        ('Restaurantes', 'Comidas fuera de casa'),
        ('Delivery', 'Pedidos a domicilio'),
        ('Cafetería', 'Café, snacks'),
        ('Despensa', 'Alimentos no perecederos')
) AS detail(name, description)
WHERE et.name = 'Alimentación' AND et."isSystem" = TRUE;

-- Insertar detalles para Transporte
INSERT INTO expense_details (id, name, description, "isActive", "isSystem", expense_type_id, created_by_id, "createdAt", "updatedAt")
SELECT
    gen_random_uuid(),
    detail.name,
    detail.description,
    TRUE,
    TRUE,
    et.id,
    NULL,
    NOW(),
    NOW()
FROM expense_types et
CROSS JOIN (
    VALUES
        ('Gasolina', 'Combustible para vehículo'),
        ('Transporte público', 'Bus, metro, taxi'),
        ('Uber/Taxi', 'Servicios de transporte privado'),
        ('Mantenimiento vehículo', 'Reparaciones y mantenimiento'),
        ('Estacionamiento', 'Pago de parqueo'),
        ('Peaje', 'Pago de peajes'),
        ('Seguro de auto', 'Seguro del vehículo')
) AS detail(name, description)
WHERE et.name = 'Transporte' AND et."isSystem" = TRUE;

-- Insertar detalles para Entretenimiento
INSERT INTO expense_details (id, name, description, "isActive", "isSystem", expense_type_id, created_by_id, "createdAt", "updatedAt")
SELECT
    gen_random_uuid(),
    detail.name,
    detail.description,
    TRUE,
    TRUE,
    et.id,
    NULL,
    NOW(),
    NOW()
FROM expense_types et
CROSS JOIN (
    VALUES
        ('Cine', 'Entradas de cine'),
        ('Conciertos y eventos', 'Eventos culturales y musicales'),
        ('Gimnasio', 'Membresía de gimnasio'),
        ('Deportes', 'Actividades deportivas'),
        ('Hobbies', 'Gastos en pasatiempos'),
        ('Viajes y turismo', 'Vacaciones y viajes')
) AS detail(name, description)
WHERE et.name = 'Entretenimiento' AND et."isSystem" = TRUE;

-- Insertar detalles para Servicios
INSERT INTO expense_details (id, name, description, "isActive", "isSystem", expense_type_id, created_by_id, "createdAt", "updatedAt")
SELECT
    gen_random_uuid(),
    detail.name,
    detail.description,
    TRUE,
    TRUE,
    et.id,
    NULL,
    NOW(),
    NOW()
FROM expense_types et
CROSS JOIN (
    VALUES
        ('Internet', 'Servicio de internet'),
        ('Teléfono móvil', 'Plan de celular'),
        ('TV Cable/Streaming', 'Netflix, cable, etc.'),
        ('Spotify/Música', 'Servicios de música'),
        ('Suscripciones', 'Otras suscripciones')
) AS detail(name, description)
WHERE et.name = 'Servicios' AND et."isSystem" = TRUE;

-- ===================================================================
-- PARTE 3: TIPOS DE INGRESOS DEL SISTEMA
-- ===================================================================

-- Limpiar tipos de ingresos del sistema existentes
DELETE FROM income_types WHERE "isSystem" = TRUE;

-- Insertar tipos de ingresos predeterminados
INSERT INTO income_types (id, name, description, "isActive", "isSystem", created_by_id, "createdAt", "updatedAt")
VALUES
    (gen_random_uuid(), 'Salario', 'Ingresos por trabajo dependiente', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Negocio Propio', 'Ingresos por actividad empresarial', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Freelance', 'Trabajos independientes y servicios profesionales', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Inversiones', 'Rendimientos de inversiones, dividendos', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Alquiler', 'Ingresos por alquiler de propiedades', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Bonos y Comisiones', 'Bonificaciones, comisiones por ventas', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Regalos y Donaciones', 'Dinero recibido como regalo', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Venta de Activos', 'Venta de bienes, propiedades, vehículos', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Reembolsos', 'Devoluciones y reembolsos', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Pensión/Jubilación', 'Ingresos por pensión o jubilación', TRUE, TRUE, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'Otros Ingresos', 'Ingresos varios no categorizados', TRUE, TRUE, NULL, NOW(), NOW());

-- ===================================================================
-- VERIFICACIÓN
-- ===================================================================

-- Ver tipos de gastos del sistema
SELECT 'EXPENSE TYPES' as tipo, id, name, "isActive", "isSystem"
FROM expense_types
WHERE "isSystem" = TRUE
ORDER BY name;

-- Ver detalles de gastos del sistema
SELECT 'EXPENSE DETAILS' as tipo, ed.name, et.name as tipo_gasto
FROM expense_details ed
JOIN expense_types et ON ed.expense_type_id = et.id
WHERE ed."isSystem" = TRUE
ORDER BY et.name, ed.name;

-- Ver tipos de ingresos del sistema
SELECT 'INCOME TYPES' as tipo, id, name, "isActive", "isSystem"
FROM income_types
WHERE "isSystem" = TRUE
ORDER BY name;

-- Contar registros creados
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

-- ===================================================================
-- RESULTADO ESPERADO:
-- - 13 tipos de gastos del sistema
-- - ~50 detalles de gastos del sistema
-- - 11 tipos de ingresos del sistema
-- ===================================================================
