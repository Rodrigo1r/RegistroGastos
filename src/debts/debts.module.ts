import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { Debt } from './entities/debt.entity';
import { DebtorsModule } from '../debtors/debtors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Debt]), DebtorsModule],
  controllers: [DebtsController],
  providers: [DebtsService],
  exports: [DebtsService, TypeOrmModule],
})
export class DebtsModule {}
