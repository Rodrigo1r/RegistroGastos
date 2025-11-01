import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExpenseTypesModule } from './expense-types/expense-types.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        const nodeEnv = configService.get('NODE_ENV', 'development');

        console.log('🔍 Database Configuration Debug:');
        console.log('  - NODE_ENV:', nodeEnv);
        console.log('  - DATABASE_URL exists:', !!databaseUrl);

        if (databaseUrl) {
          // Railway o Heroku proporcionan DATABASE_URL
          console.log('✅ Using DATABASE_URL for database connection');
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: nodeEnv === 'development', // Solo en desarrollo
            logging: nodeEnv === 'development',
            ssl: {
              rejectUnauthorized: false, // Requerido para servicios cloud
            },
          };
        }

        // Configuración local con variables separadas
        const dbHost = configService.get('DB_HOST');
        const dbPort = configService.get('DB_PORT');
        const dbUsername = configService.get('DB_USERNAME');
        const dbPassword = configService.get('DB_PASSWORD');
        const dbDatabase = configService.get('DB_DATABASE');

        console.log('⚠️  Using individual DB variables:');
        console.log('  - DB_HOST:', dbHost || 'NOT SET');
        console.log('  - DB_PORT:', dbPort || 'NOT SET');
        console.log('  - DB_USERNAME:', dbUsername ? '***' : 'NOT SET');
        console.log('  - DB_DATABASE:', dbDatabase || 'NOT SET');

        // Validar que las variables requeridas estén configuradas
        if (nodeEnv === 'production' && (!dbHost || !dbPort || !dbUsername || !dbPassword || !dbDatabase)) {
          throw new Error(
            '❌ Database configuration missing! In Railway, make sure to:\n' +
            '1. Add PostgreSQL to your project (New -> Database -> Add PostgreSQL)\n' +
            '2. Railway will automatically set DATABASE_URL\n' +
            '3. No need to set individual DB_HOST, DB_PORT variables'
          );
        }

        return {
          type: 'postgres',
          host: dbHost || 'localhost',
          port: parseInt(dbPort) || 5432,
          username: dbUsername || 'postgres',
          password: dbPassword || '',
          database: dbDatabase || 'gastos_control',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: nodeEnv === 'development',
          logging: nodeEnv === 'development',
        };
      },
    }),
    AuthModule,
    UsersModule,
    ExpenseTypesModule,
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
