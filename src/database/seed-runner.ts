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
    const userRepository = AppDataSource.getRepository('users');
    const existingUsers = await userRepository.count();

    if (existingUsers > 0) {
      console.log('⚠️  Database already has data. Skipping seed.');
      await AppDataSource.destroy();
      return {
        success: true,
        message: 'Database already seeded',
        skipped: true,
      };
    }

    // Crear usuario de prueba por defecto
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await userRepository.save({
      email: 'rodrigo1r@hotmail.com',
      password: hashedPassword,
      firstName: 'Rodrigo',
      lastName: 'Ordonez',
      isActive: true,
    });

    console.log('✅ Test user created: rodrigo1r@hotmail.com / admin123');

    // Crear tipos de gastos
    const expenseTypeRepository = AppDataSource.getRepository('expense_types');

    const expenseTypes = [
      { name: 'Educación', description: 'Gastos relacionados con educación', isActive: true },
      { name: 'Salud', description: 'Gastos relacionados con salud', isActive: true },
      { name: 'Vivienda', description: 'Gastos relacionados con vivienda', isActive: true },
      { name: 'Vestimenta', description: 'Gastos relacionados con vestimenta', isActive: true },
      { name: 'Alimentación', description: 'Gastos relacionados con alimentación', isActive: true },
    ];

    const savedTypes: any[] = [];
    for (const type of expenseTypes) {
      const saved = await expenseTypeRepository.save(type);
      savedTypes.push(saved);
    }

    console.log('✅ Expense types created');

    // Crear detalles de gastos
    const expenseDetailRepository = AppDataSource.getRepository('expense_details');

    const expenseDetails = [
      // Educación
      { name: 'Pago Pensión Escuela', description: 'Mensualidad escolar', expense_type_id: savedTypes[0].id, isActive: true },
      { name: 'Pago Pensión Colegio', description: 'Mensualidad colegio', expense_type_id: savedTypes[0].id, isActive: true },
      { name: 'Pago Universidad', description: 'Mensualidad universidad', expense_type_id: savedTypes[0].id, isActive: true },
      { name: 'Material Escolar', description: 'Útiles y materiales', expense_type_id: savedTypes[0].id, isActive: true },

      // Salud
      { name: 'Seguro Médico', description: 'Prima de seguro', expense_type_id: savedTypes[1].id, isActive: true },
      { name: 'Consulta Médica', description: 'Consultas y revisiones', expense_type_id: savedTypes[1].id, isActive: true },
      { name: 'Medicamentos', description: 'Compra de medicinas', expense_type_id: savedTypes[1].id, isActive: true },

      // Vivienda
      { name: 'Pago Agua', description: 'Servicio de agua', expense_type_id: savedTypes[2].id, isActive: true },
      { name: 'Pago Luz', description: 'Servicio eléctrico', expense_type_id: savedTypes[2].id, isActive: true },
      { name: 'Pago Teléfono', description: 'Servicio telefónico', expense_type_id: savedTypes[2].id, isActive: true },
      { name: 'Pago Internet', description: 'Servicio de internet', expense_type_id: savedTypes[2].id, isActive: true },
      { name: 'Alquiler', description: 'Renta mensual', expense_type_id: savedTypes[2].id, isActive: true },

      // Vestimenta
      { name: 'Ropa', description: 'Compra de ropa', expense_type_id: savedTypes[3].id, isActive: true },
      { name: 'Calzado', description: 'Compra de zapatos', expense_type_id: savedTypes[3].id, isActive: true },

      // Alimentación
      { name: 'Supermercado', description: 'Compras del mes', expense_type_id: savedTypes[4].id, isActive: true },
      { name: 'Restaurante', description: 'Comidas fuera de casa', expense_type_id: savedTypes[4].id, isActive: true },
    ];

    for (const detail of expenseDetails) {
      await expenseDetailRepository.save(detail);
    }

    console.log('✅ Expense details created');

    console.log('\n========================================');
    console.log('🎉 Seed completed successfully!');
    console.log('========================================');
    console.log('Test user credentials:');
    console.log('Email: rodrigo1r@hotmail.com');
    console.log('Password: admin123');
    console.log('========================================\n');

    await AppDataSource.destroy();

    return {
      success: true,
      message: 'Database seeded successfully',
      credentials: {
        email: 'rodrigo1r@hotmail.com',
        password: 'admin123',
      },
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await AppDataSource.destroy();
    throw error;
  }
}
