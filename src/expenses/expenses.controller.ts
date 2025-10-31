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
  findAll() {
    return this.expensesService.findAll();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Obtener resumen de gastos' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'month', required: false, description: 'Mes (1-12)' })
  @ApiQuery({ name: 'year', required: false, description: 'Año (ej: 2025)' })
  getSummary(
    @Query('userId') userId?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.expensesService.getExpensesSummary(
      userId,
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get('pending')
  @ApiOperation({ summary: 'Obtener gastos pendientes' })
  getPending() {
    return this.expensesService.getPendingExpenses();
  }

  @Get('completed')
  @ApiOperation({ summary: 'Obtener gastos completados' })
  getCompleted() {
    return this.expensesService.getCompletedExpenses();
  }

  @Get('partial')
  @ApiOperation({ summary: 'Obtener gastos con pagos parciales' })
  getPartial() {
    return this.expensesService.getPartialExpenses();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtener gastos por status' })
  getByStatus(@Param('status') status: PaymentStatus) {
    return this.expensesService.getExpensesByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un gasto por ID' })
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar gasto' })
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar gasto' })
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
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
  findAllPayments() {
    return this.expensesService.findAllPayments();
  }

  @Get(':expenseId/payments')
  @ApiOperation({ summary: 'Obtener pagos de un gasto específico' })
  findPaymentsByExpense(@Param('expenseId') expenseId: string) {
    return this.expensesService.findPaymentsByExpense(expenseId);
  }
}
