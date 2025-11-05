import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({
    description: 'Monto del ingreso',
    example: 2500.0,
  })
  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @IsPositive({ message: 'El monto debe ser mayor a 0' })
  amount: number;

  @ApiProperty({
    description: 'Fecha en que se recibió el ingreso',
    example: '2025-11-05',
  })
  @IsNotEmpty({ message: 'La fecha de ingreso es requerida' })
  @IsDateString({}, { message: 'La fecha debe estar en formato válido' })
  incomeDate: string;

  @ApiProperty({
    description: 'ID del tipo de ingreso',
    example: 'uuid-here',
  })
  @IsNotEmpty({ message: 'El tipo de ingreso es requerido' })
  @IsUUID('4', { message: 'El tipo de ingreso debe ser un UUID válido' })
  incomeTypeId: string;

  @ApiProperty({
    description: 'Notas o comentarios sobre el ingreso',
    example: 'Pago de la primera quincena de noviembre',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  notes?: string;
}
