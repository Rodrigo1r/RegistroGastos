import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, Between } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { Payment } from './entities/payment.entity';
import { ExpenseDetail } from '../expense-types/entities/expense-detail.entity';
import { User } from '../users/entities/user.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '../common/enums/payment-status.enum';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(ExpenseDetail)
    private expenseDetailRepository: Repository<ExpenseDetail>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const expenseDetail = await this.expenseDetailRepository.findOne({
      where: { id: createExpenseDto.expenseDetailId },
    });

    if (!expenseDetail) {
      throw new NotFoundException('Detalle de gasto no encontrado');
    }

    const expense = this.expenseRepository.create({
      amount: createExpenseDto.amount,
      paidAmount: 0,
      pendingAmount: createExpenseDto.amount,
      dueDate: new Date(createExpenseDto.dueDate),
      notes: createExpenseDto.notes,
      createdBy: user,
      expenseDetail,
    });

    // Calcular el status inicial
    expense.status = expense.calculateStatus();

    return this.expenseRepository.save(expense);
  }

  async findAll() {
    const expenses = await this.expenseRepository.find({
      relations: ['createdBy', 'expenseDetail', 'expenseDetail.expenseType'],
      order: { createdAt: 'DESC' },
    });

    // Actualizar status de todos los gastos
    for (const expense of expenses) {
      const newStatus = expense.calculateStatus();
      if (expense.status !== newStatus) {
        expense.status = newStatus;
        await this.expenseRepository.save(expense);
      }
    }

    return expenses;
  }

  async findOne(id: string) {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: [
        'createdBy',
        'expenseDetail',
        'expenseDetail.expenseType',
        'payments',
        'payments.registeredBy',
      ],
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    // Actualizar status
    const newStatus = expense.calculateStatus();
    if (expense.status !== newStatus) {
      expense.status = newStatus;
      await this.expenseRepository.save(expense);
    }

    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['expenseDetail'],
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    if (updateExpenseDto.expenseDetailId) {
      const expenseDetail = await this.expenseDetailRepository.findOne({
        where: { id: updateExpenseDto.expenseDetailId },
      });

      if (!expenseDetail) {
        throw new NotFoundException('Detalle de gasto no encontrado');
      }

      expense.expenseDetail = expenseDetail;
    }

    if (updateExpenseDto.amount !== undefined) {
      expense.amount = updateExpenseDto.amount;
      // Convertir explícitamente a números para evitar problemas con decimales de PostgreSQL
      expense.pendingAmount = Number(expense.amount) - Number(expense.paidAmount);
    }

    if (updateExpenseDto.dueDate) {
      expense.dueDate = new Date(updateExpenseDto.dueDate);
    }

    if (updateExpenseDto.notes !== undefined) {
      expense.notes = updateExpenseDto.notes;
    }

    // Recalcular status
    expense.status = expense.calculateStatus();

    return this.expenseRepository.save(expense);
  }

  async remove(id: string) {
    const expense = await this.expenseRepository.findOne({ where: { id } });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    await this.expenseRepository.remove(expense);
    return { message: 'Gasto eliminado exitosamente' };
  }

  // Métodos para pagos
  async createPayment(createPaymentDto: CreatePaymentDto, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const expense = await this.expenseRepository.findOne({
      where: { id: createPaymentDto.expenseId },
      relations: ['payments'],
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    // Validar que el monto del pago no exceda el pendiente
    // Convertir explícitamente a números para evitar problemas con decimales de PostgreSQL
    const currentPaid = Number(expense.paidAmount);
    const totalAmount = Number(expense.amount);
    const paymentAmount = Number(createPaymentDto.amount);

    if (currentPaid + paymentAmount > totalAmount) {
      throw new BadRequestException(
        `El monto del pago (${paymentAmount}) excede el monto pendiente (${totalAmount - currentPaid})`,
      );
    }

    const payment = this.paymentRepository.create({
      amount: createPaymentDto.amount,
      paymentDate: new Date(createPaymentDto.paymentDate),
      notes: createPaymentDto.notes,
      expense,
      registeredBy: user,
    });

    await this.paymentRepository.save(payment);

    // Actualizar montos del gasto
    // Convertir explícitamente a números para evitar problemas con decimales de PostgreSQL
    expense.paidAmount = Number(expense.paidAmount) + Number(createPaymentDto.amount);
    expense.pendingAmount = Number(expense.amount) - Number(expense.paidAmount);
    expense.status = expense.calculateStatus();

    await this.expenseRepository.save(expense);

    return payment;
  }

  async findAllPayments() {
    return this.paymentRepository.find({
      relations: ['expense', 'expense.expenseDetail', 'registeredBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPaymentsByExpense(expenseId: string) {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    return this.paymentRepository.find({
      where: { expense: { id: expenseId } },
      relations: ['registeredBy'],
      order: { paymentDate: 'DESC' },
    });
  }

  // Métodos para reportes
  async getExpensesByStatus(status: PaymentStatus) {
    const expenses = await this.expenseRepository.find({
      where: { status },
      relations: ['createdBy', 'expenseDetail', 'expenseDetail.expenseType'],
      order: { dueDate: 'ASC' },
    });

    return expenses;
  }

  async getPendingExpenses() {
    const expenses = await this.expenseRepository.find({
      relations: ['createdBy', 'expenseDetail', 'expenseDetail.expenseType'],
      order: { dueDate: 'ASC' },
    });

    // Filtrar gastos pendientes (no completados)
    return expenses.filter(
      (expense) => expense.status !== PaymentStatus.COMPLETED,
    );
  }

  async getCompletedExpenses() {
    return this.getExpensesByStatus(PaymentStatus.COMPLETED);
  }

  async getPartialExpenses() {
    return this.getExpensesByStatus(PaymentStatus.PARTIAL);
  }

  async getExpensesSummary(userId?: string, month?: number, year?: number) {
    const queryBuilder = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.expenseDetail', 'expenseDetail')
      .leftJoinAndSelect('expenseDetail.expenseType', 'expenseType')
      .leftJoinAndSelect('expense.createdBy', 'createdBy');

    if (userId) {
      queryBuilder.where('expense.createdBy.id = :userId', { userId });
    }

    // Filtrar por mes y año si se proporcionan
    if (month && year) {
      const startDate = new Date(year, month - 1, 1); // Primer día del mes
      const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Último día del mes

      if (userId) {
        queryBuilder.andWhere('expense.dueDate BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      } else {
        queryBuilder.where('expense.dueDate BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }
    }

    const expenses = await queryBuilder.getMany();

    const summary = {
      total: expenses.length,
      totalAmount: expenses.reduce((sum, e) => sum + Number(e.amount), 0),
      totalPaid: expenses.reduce((sum, e) => sum + Number(e.paidAmount), 0),
      totalPending: expenses.reduce(
        (sum, e) => sum + Number(e.pendingAmount),
        0,
      ),
      byStatus: {
        upcoming: expenses.filter((e) => e.status === PaymentStatus.UPCOMING)
          .length,
        nearDue: expenses.filter((e) => e.status === PaymentStatus.NEAR_DUE)
          .length,
        overdue: expenses.filter((e) => e.status === PaymentStatus.OVERDUE)
          .length,
        partial: expenses.filter((e) => e.status === PaymentStatus.PARTIAL)
          .length,
        completed: expenses.filter((e) => e.status === PaymentStatus.COMPLETED)
          .length,
      },
    };

    return summary;
  }
}
