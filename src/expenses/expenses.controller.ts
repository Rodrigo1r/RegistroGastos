import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaymentStatus } from '../common/enums/payment-status.enum';

@ApiTags('Expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo gasto' })
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: User,
  ) {
    return this.expensesService.create(createExpenseDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los gastos' })
  findAll(@CurrentUser() user: User) {
    return this.expensesService.findAll(user.id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Obtener resumen de gastos' })
  @ApiQuery({ name: 'month', required: false, description: 'Mes (1-12)' })
  @ApiQuery({ name: 'year', required: false, description: 'Año (ej: 2025)' })
  getSummary(
    @CurrentUser() user: User,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.expensesService.getExpensesSummary(
      user.id,
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get('pending')
  @ApiOperation({ summary: 'Obtener gastos pendientes' })
  getPending(@CurrentUser() user: User) {
    return this.expensesService.getPendingExpenses(user.id);
  }

  @Get('completed')
  @ApiOperation({ summary: 'Obtener gastos completados' })
  getCompleted(@CurrentUser() user: User) {
    return this.expensesService.getCompletedExpenses(user.id);
  }

  @Get('partial')
  @ApiOperation({ summary: 'Obtener gastos con pagos parciales' })
  getPartial(@CurrentUser() user: User) {
    return this.expensesService.getPartialExpenses(user.id);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtener gastos por status' })
  getByStatus(@Param('status') status: PaymentStatus, @CurrentUser() user: User) {
    return this.expensesService.getExpensesByStatus(status, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un gasto por ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expensesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar gasto' })
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto, @CurrentUser() user: User) {
    return this.expensesService.update(id, updateExpenseDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar gasto' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.expensesService.remove(id, user.id);
  }

  // Endpoints para pagos
  @Post('payments')
  @ApiOperation({ summary: 'Registrar nuevo pago o abono' })
  createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user: User,
  ) {
    return this.expensesService.createPayment(createPaymentDto, user.id);
  }

  @Get('payments/all')
  @ApiOperation({ summary: 'Obtener todos los pagos' })
  findAllPayments(@CurrentUser() user: User) {
    return this.expensesService.findAllPayments(user.id);
  }

  @Get(':expenseId/payments')
  @ApiOperation({ summary: 'Obtener pagos de un gasto específico' })
  findPaymentsByExpense(@Param('expenseId') expenseId: string, @CurrentUser() user: User) {
    return this.expensesService.findPaymentsByExpense(expenseId, user.id);
  }
}
