import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseTypesService } from './expense-types.service';
import { ExpenseTypesController } from './expense-types.controller';
import { ExpenseType } from './entities/expense-type.entity';
import { ExpenseDetail } from './entities/expense-detail.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseType, ExpenseDetail, User])],
  controllers: [ExpenseTypesController],
  providers: [ExpenseTypesService],
  exports: [ExpenseTypesService],
})
export class ExpenseTypesModule {}
