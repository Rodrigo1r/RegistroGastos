import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDebtPaymentDto {
  @IsUUID()
  debtId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  paymentDate: string;

  @IsString()
  @MaxLength(255)
  paymentReason: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
