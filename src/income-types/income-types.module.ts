import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeTypesService } from './income-types.service';
import { IncomeTypesController } from './income-types.controller';
import { IncomeType } from './entities/income-type.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IncomeType, User])],
  controllers: [IncomeTypesController],
  providers: [IncomeTypesService],
  exports: [IncomeTypesService],
})
export class IncomeTypesModule {}
