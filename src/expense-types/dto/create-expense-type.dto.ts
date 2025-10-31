import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseTypeDto {
  @ApiProperty({ example: 'Educación' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Gastos relacionados con educación', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
