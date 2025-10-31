import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDetailDto {
  @ApiProperty({ example: 'Pago Pensión Escuela' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Pago mensual de la pensión escolar', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'uuid-del-tipo-de-gasto' })
  @IsUUID()
  @IsNotEmpty()
  expenseTypeId: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
