import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  /**
   * Envía un email con el código de recuperación de contraseña
   *
   * En producción, aquí integrarías con un servicio de email como:
   * - Resend (recomendado, free tier generoso)
   * - SendGrid
   * - Mailgun
   * - AWS SES
   *
   * Para desarrollo, solo mostramos el código en consola
   */
  async sendPasswordResetEmail(email: string, code: string): Promise<boolean> {
    const env = this.configService.get('NODE_ENV');

    // En desarrollo, solo mostramos el código en consola
    if (env === 'development') {
      console.log('\n==============================================');
      console.log('📧 EMAIL DE RECUPERACIÓN DE CONTRASEÑA');
      console.log('==============================================');
      console.log(`Para: ${email}`);
      console.log(`Código: ${code}`);
      console.log('Este código expira en 15 minutos.');
      console.log('==============================================\n');
      return true;
    }

    // En producción, usar servicio de email real
    // Ejemplo con Resend (requiere: npm install resend)
    /*
    try {
      const { Resend } = require('resend');
      const resend = new Resend(this.configService.get('RESEND_API_KEY'));

      await resend.emails.send({
        from: 'noreply@tudominio.com',
        to: email,
        subject: 'Recuperación de Contraseña - Control de Gastos',
        html: `
          <h2>Recuperación de Contraseña</h2>
          <p>Has solicitado recuperar tu contraseña.</p>
          <p>Tu código de verificación es:</p>
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #4F46E5;">${code}</h1>
          <p>Este código expira en 15 minutos.</p>
          <p>Si no solicitaste este cambio, ignora este email.</p>
        `,
      });

      return true;
    } catch (error) {
      console.error('Error enviando email:', error);
      return false;
    }
    */

    // Por ahora, en producción también logueamos (cambiar cuando integres el servicio)
    console.log(`[PRODUCCIÓN] Email a ${email} con código: ${code}`);
    return true;
  }

  /**
   * Envía un email de confirmación de cambio de contraseña
   */
  async sendPasswordChangedEmail(email: string): Promise<boolean> {
    const env = this.configService.get('NODE_ENV');

    if (env === 'development') {
      console.log('\n==============================================');
      console.log('✅ CONFIRMACIÓN - CONTRASEÑA CAMBIADA');
      console.log('==============================================');
      console.log(`Para: ${email}`);
      console.log('Tu contraseña ha sido cambiada exitosamente.');
      console.log('==============================================\n');
      return true;
    }

    console.log(`[PRODUCCIÓN] Email de confirmación a ${email}`);
    return true;
  }
}
