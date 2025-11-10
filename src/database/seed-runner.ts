import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

export async function runSeed(configService: ConfigService) {
  const databaseUrl = configService.get('DATABASE_URL');

  console.log('🌱 Starting seed process...');
  console.log('🔍 DATABASE_URL exists:', !!databaseUrl);

  let dataSourceConfig: any = {
    type: 'postgres',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  };

  if (databaseUrl) {
    console.log('✅ Using DATABASE_URL for seed');
    dataSourceConfig = {
      ...dataSourceConfig,
      url: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  } else {
    console.log('⚠️  Using individual DB variables for seed');
    dataSourceConfig = {
      ...dataSourceConfig,
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
    };
  }

  const AppDataSource = new DataSource(dataSourceConfig);

  try {
    await AppDataSource.initialize();
    console.log('✅ Connected to database');

    // Verificar si ya existen datos
    const expenseTypeRepository = AppDataSource.getRepository('expense_types');
    const existingExpenseTypes = await expenseTypeRepository.count();

    if (existingExpenseTypes > 0) {
      console.log('⚠️  Database already has expense types. Skipping seed.');
      await AppDataSource.destroy();
      return {
        success: true,
        message: 'Database already seeded',
        skipped: true,
      };
    }

    console.log('📝 Creating system types and details...\n');

    // ===================================================================
    // TIPOS DE GASTOS DEL SISTEMA
    // ===================================================================
    const expenseTypes = [
      { name: 'Educación', description: 'Gastos relacionados con educación, cursos, libros, etc.', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Salud', description: 'Gastos médicos, medicinas, seguros de salud, etc.', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Vivienda', description: 'Alquiler, hipoteca, servicios básicos, mantenimiento', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Alimentación', description: 'Supermercado, restaurantes, comida', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Transporte', description: 'Gasolina, transporte público, mantenimiento de vehículo', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Vestimenta', description: 'Ropa, calzado, accesorios', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Entretenimiento', description: 'Ocio, hobbies, suscripciones, salidas', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Servicios', description: 'Internet, teléfono, streaming, otros servicios', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Seguros', description: 'Seguros de vida, auto, hogar, etc.', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Impuestos', description: 'Impuestos y obligaciones fiscales', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Ahorro e Inversión', description: 'Ahorros, inversiones, fondos', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Mascotas', description: 'Comida, veterinario, accesorios para mascotas', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Otros', description: 'Gastos varios no categorizados', isActive: true, isSystem: true, created_by_id: null },
    ];

    const savedTypes: any[] = [];
    for (const type of expenseTypes) {
      const saved = await expenseTypeRepository.save(type);
      savedTypes.push(saved);
    }

    console.log('✅ Created', savedTypes.length, 'expense types');

    // ===================================================================
    // DETALLES DE GASTOS DEL SISTEMA
    // ===================================================================
    const expenseDetailRepository = AppDataSource.getRepository('expense_details');

    const expenseDetailsData = [
      // Educación - savedTypes[0]
      { typeIndex: 0, details: [
        { name: 'Matrícula escolar', description: 'Pago de matrícula' },
        { name: 'Pensión escolar', description: 'Pago mensual de pensión' },
        { name: 'Útiles escolares', description: 'Cuadernos, lápices, material escolar' },
        { name: 'Uniformes', description: 'Uniformes escolares' },
        { name: 'Cursos y capacitaciones', description: 'Cursos, talleres, seminarios' },
        { name: 'Libros y material de estudio', description: 'Libros, manuales, material educativo' },
      ]},
      // Salud - savedTypes[1]
      { typeIndex: 1, details: [
        { name: 'Consulta médica', description: 'Consultas con médicos' },
        { name: 'Medicinas', description: 'Compra de medicamentos' },
        { name: 'Exámenes y análisis', description: 'Exámenes de laboratorio' },
        { name: 'Hospitalización', description: 'Gastos de hospital' },
        { name: 'Seguro médico', description: 'Pago de seguro de salud' },
        { name: 'Odontología', description: 'Dentista y tratamientos dentales' },
        { name: 'Óptica', description: 'Lentes, examen de vista' },
        { name: 'Terapias', description: 'Fisioterapia, psicología, etc.' },
      ]},
      // Vivienda - savedTypes[2]
      { typeIndex: 2, details: [
        { name: 'Alquiler', description: 'Pago mensual de alquiler' },
        { name: 'Hipoteca', description: 'Pago de crédito hipotecario' },
        { name: 'Agua', description: 'Servicio de agua' },
        { name: 'Luz', description: 'Servicio de electricidad' },
        { name: 'Gas', description: 'Servicio de gas' },
        { name: 'Mantenimiento', description: 'Reparaciones y mantenimiento del hogar' },
        { name: 'Impuesto predial', description: 'Impuestos de la propiedad' },
        { name: 'Condominio', description: 'Cuota de mantenimiento de condominio' },
      ]},
      // Alimentación - savedTypes[3]
      { typeIndex: 3, details: [
        { name: 'Supermercado', description: 'Compras de supermercado' },
        { name: 'Restaurantes', description: 'Comidas fuera de casa' },
        { name: 'Delivery', description: 'Pedidos a domicilio' },
        { name: 'Cafetería', description: 'Café, snacks' },
        { name: 'Despensa', description: 'Alimentos no perecederos' },
      ]},
      // Transporte - savedTypes[4]
      { typeIndex: 4, details: [
        { name: 'Gasolina', description: 'Combustible para vehículo' },
        { name: 'Transporte público', description: 'Bus, metro, taxi' },
        { name: 'Uber/Taxi', description: 'Servicios de transporte privado' },
        { name: 'Mantenimiento vehículo', description: 'Reparaciones y mantenimiento' },
        { name: 'Estacionamiento', description: 'Pago de parqueo' },
        { name: 'Peaje', description: 'Pago de peajes' },
        { name: 'Seguro de auto', description: 'Seguro del vehículo' },
      ]},
      // Entretenimiento - savedTypes[6]
      { typeIndex: 6, details: [
        { name: 'Cine', description: 'Entradas de cine' },
        { name: 'Conciertos y eventos', description: 'Eventos culturales y musicales' },
        { name: 'Gimnasio', description: 'Membresía de gimnasio' },
        { name: 'Deportes', description: 'Actividades deportivas' },
        { name: 'Hobbies', description: 'Gastos en pasatiempos' },
        { name: 'Viajes y turismo', description: 'Vacaciones y viajes' },
      ]},
      // Servicios - savedTypes[7]
      { typeIndex: 7, details: [
        { name: 'Internet', description: 'Servicio de internet' },
        { name: 'Teléfono móvil', description: 'Plan de celular' },
        { name: 'TV Cable/Streaming', description: 'Netflix, cable, etc.' },
        { name: 'Spotify/Música', description: 'Servicios de música' },
        { name: 'Suscripciones', description: 'Otras suscripciones' },
      ]},
    ];

    let detailCount = 0;
    for (const group of expenseDetailsData) {
      for (const detail of group.details) {
        await expenseDetailRepository.save({
          name: detail.name,
          description: detail.description,
          isActive: true,
          isSystem: true,
          expense_type_id: savedTypes[group.typeIndex].id,
          created_by_id: null,
        });
        detailCount++;
      }
    }

    console.log('✅ Created', detailCount, 'expense details');

    // ===================================================================
    // TIPOS DE INGRESOS DEL SISTEMA
    // ===================================================================
    const incomeTypeRepository = AppDataSource.getRepository('income_types');

    const incomeTypes = [
      { name: 'Salario', description: 'Ingresos por trabajo dependiente', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Negocio Propio', description: 'Ingresos por actividad empresarial', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Freelance', description: 'Trabajos independientes y servicios profesionales', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Inversiones', description: 'Rendimientos de inversiones, dividendos', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Alquiler', description: 'Ingresos por alquiler de propiedades', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Bonos y Comisiones', description: 'Bonificaciones, comisiones por ventas', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Regalos y Donaciones', description: 'Dinero recibido como regalo', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Venta de Activos', description: 'Venta de bienes, propiedades, vehículos', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Reembolsos', description: 'Devoluciones y reembolsos', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Pensión/Jubilación', description: 'Ingresos por pensión o jubilación', isActive: true, isSystem: true, created_by_id: null },
      { name: 'Otros Ingresos', description: 'Ingresos varios no categorizados', isActive: true, isSystem: true, created_by_id: null },
    ];

    for (const type of incomeTypes) {
      await incomeTypeRepository.save(type);
    }

    console.log('✅ Created', incomeTypes.length, 'income types');

    console.log('\n========================================');
    console.log('🎉 Seed completed successfully!');
    console.log('========================================');
    console.log('📊 Summary:');
    console.log('  - Expense Types:', savedTypes.length);
    console.log('  - Expense Details:', detailCount);
    console.log('  - Income Types:', incomeTypes.length);
    console.log('========================================\n');

    await AppDataSource.destroy();

    return {
      success: true,
      message: 'Database seeded successfully',
      stats: {
        expenseTypes: savedTypes.length,
        expenseDetails: detailCount,
        incomeTypes: incomeTypes.length,
      },
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await AppDataSource.destroy();
    throw error;
  }
}
