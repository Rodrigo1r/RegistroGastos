import { PartialType } from '@nestjs/swagger';
import { CreateDebtPaymentDto } from './create-debt-payment.dto';

export class UpdateDebtPaymentDto extends PartialType(CreateDebtPaymentDto) {}
