import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database');

    // Crear usuario de prueba por defecto
    const userRepository = AppDataSource.getRepository('users');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await userRepository.save({
      email: 'admin@gastos.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Sistema',
      isActive: true,
    });

    console.log('Test user created: admin@gastos.com / admin123');

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

    console.log('Expense types created');

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

    console.log('Expense details created');

    console.log('\n========================================');
    console.log('Seed completed successfully!');
    console.log('========================================');
    console.log('Test user credentials:');
    console.log('Email: admin@gastos.com');
    console.log('Password: admin123');
    console.log('========================================\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
