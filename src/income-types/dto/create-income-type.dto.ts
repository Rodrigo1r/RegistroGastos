import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateIncomeTypeDto {
  @ApiProperty({
    description: 'Nombre del tipo de ingreso',
    example: 'Sueldo Quincenal',
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descripción del tipo de ingreso',
    example: 'Pago de sueldo recibido cada quincena',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  description?: string;
}
