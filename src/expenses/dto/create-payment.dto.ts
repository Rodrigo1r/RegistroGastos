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

export class CreatePaymentDto {
  @ApiProperty({ example: 50.00 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: '2025-10-29' })
  @IsDateString()
  @IsNotEmpty()
  paymentDate: string;

  @ApiProperty({ example: 'uuid-del-gasto' })
  @IsUUID()
  @IsNotEmpty()
  expenseId: string;

  @ApiProperty({ example: 'Abono parcial del gasto', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
