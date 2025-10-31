import { PartialType } from '@nestjs/swagger';
import { CreateExpenseDetailDto } from './create-expense-detail.dto';

export class UpdateExpenseDetailDto extends PartialType(CreateExpenseDetailDto) {}
