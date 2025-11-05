import { PartialType } from '@nestjs/swagger';
import { CreateIncomeTypeDto } from './create-income-type.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateIncomeTypeDto extends PartialType(CreateIncomeTypeDto) {
  @ApiProperty({
    description: 'Estado activo/inactivo del tipo de ingreso',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive?: boolean;
}
