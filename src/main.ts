// Polyfill para crypto en entornos donde no está disponible globalmente
import * as crypto from 'crypto';
if (!globalThis.crypto) {
  (globalThis as any).crypto = crypto;
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { runSeed } from './database/seed-runner';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 🌱 Ejecutar seed si la variable RUN_SEED está configurada
  const runSeedFlag = configService.get('RUN_SEED');
  if (runSeedFlag === 'true' || runSeedFlag === '1') {
    console.log('\n========================================');
    console.log('🌱 RUN_SEED detected - Running database seed...');
    console.log('========================================\n');

    try {
      const result = await runSeed(configService);
      console.log('\n========================================');
      console.log('✅ Seed completed successfully!');
      console.log('========================================');
      console.log('📋 Result:', JSON.stringify(result, null, 2));
      console.log('========================================');
      console.log('⚠️  REMEMBER: Delete RUN_SEED variable from Railway after this deployment');
      console.log('========================================\n');
    } catch (error) {
      console.error('\n========================================');
      console.error('❌ Seed failed:', error.message);
      console.error('========================================\n');
      // No detener la aplicación si el seed falla
      // (puede ser que ya se haya ejecutado antes)
    }
  }

  // Enable CORS for Flutter app
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Sistema de Control de Gastos')
    .setDescription('API para gestión de gastos personales')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);
  console.log(`Swagger documentation: http://0.0.0.0:${port}/api/docs`);
}
bootstrap();
