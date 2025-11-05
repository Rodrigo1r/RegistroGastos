import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeTypesService } from './income-types.service';
import { IncomeTypesController } from './income-types.controller';
import { IncomeType } from './entities/income-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IncomeType])],
  controllers: [IncomeTypesController],
  providers: [IncomeTypesService],
  exports: [IncomeTypesService],
})
export class IncomeTypesModule {}
