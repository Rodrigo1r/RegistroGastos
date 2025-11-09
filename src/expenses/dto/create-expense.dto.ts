import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({ example: 150.50 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: '2025-11-08' })
  @IsDateString()
  @IsNotEmpty()
  expenseDate: string;

  @ApiProperty({ example: '2025-11-15' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({ example: 'uuid-del-detalle-de-gasto' })
  @IsUUID()
  @IsNotEmpty()
  expenseDetailId: string;

  @ApiProperty({ example: 'Nota adicional sobre el gasto', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'https://storage.example.com/receipts/file.pdf', required: false })
  @IsString()
  @IsOptional()
  attachmentUrl?: string;
}
