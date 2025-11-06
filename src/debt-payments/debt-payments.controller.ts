import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { DebtPaymentsService } from './debt-payments.service';
import { CreateDebtPaymentDto } from './dto/create-debt-payment.dto';

@Controller('debt-payments')
@UseGuards(JwtAuthGuard)
export class DebtPaymentsController {
  constructor(private readonly debtPaymentsService: DebtPaymentsService) {}

  @Post()
  create(@Body() createDebtPaymentDto: CreateDebtPaymentDto, @CurrentUser() user: User) {
    return this.debtPaymentsService.create(createDebtPaymentDto, user.id);
  }

  @Get('report/debtor/:debtorId')
  getPaymentReportByDebtor(
    @Param('debtorId') debtorId: string,
    @CurrentUser() user: User,
  ) {
    return this.debtPaymentsService.getPaymentReportByDebtor(
      debtorId,
      user.id,
    );
  }

  @Get()
  findByDebt(@Query('debtId') debtId: string, @CurrentUser() user: User) {
    return this.debtPaymentsService.findByDebt(debtId, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.debtPaymentsService.findOne(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.debtPaymentsService.remove(id, user.id);
  }
}
