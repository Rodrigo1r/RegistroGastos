import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDebtDto {
  @IsUUID()
  debtorId: string;

  @IsString()
  @MaxLength(255)
  reason: string;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsDateString()
  debtDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
