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
import { DebtPaymentsService } from './debt-payments.service';
import { CreateDebtPaymentDto } from './dto/create-debt-payment.dto';

@Controller('debt-payments')
@UseGuards(JwtAuthGuard)
export class DebtPaymentsController {
  constructor(private readonly debtPaymentsService: DebtPaymentsService) {}

  @Post()
  create(@Body() createDebtPaymentDto: CreateDebtPaymentDto) {
    return this.debtPaymentsService.create(createDebtPaymentDto);
  }

  @Get('report/debtor/:debtorId')
  getPaymentReportByDebtor(
    @Param('debtorId') debtorId: string,
    @Request() req,
  ) {
    return this.debtPaymentsService.getPaymentReportByDebtor(
      debtorId,
      req.user.sub,
    );
  }

  @Get()
  findByDebt(@Query('debtId') debtId: string) {
    return this.debtPaymentsService.findByDebt(debtId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtPaymentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtPaymentsService.remove(id);
  }
}
