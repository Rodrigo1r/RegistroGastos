import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtPaymentsService } from './debt-payments.service';
import { DebtPaymentsController } from './debt-payments.controller';
import { DebtPayment } from './entities/debt-payment.entity';
import { DebtsModule } from '../debts/debts.module';

@Module({
  imports: [TypeOrmModule.forFeature([DebtPayment]), DebtsModule],
  controllers: [DebtPaymentsController],
  providers: [DebtPaymentsService],
  exports: [DebtPaymentsService],
})
export class DebtPaymentsModule {}
