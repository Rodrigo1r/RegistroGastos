import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDebtPaymentDto } from './dto/create-debt-payment.dto';
import { UpdateDebtPaymentDto } from './dto/update-debt-payment.dto';
import { DebtPayment } from './entities/debt-payment.entity';
import { Debt } from '../debts/entities/debt.entity';
import { DebtsService } from '../debts/debts.service';

@Injectable()
export class DebtPaymentsService {
  constructor(
    @InjectRepository(DebtPayment)
    private readonly paymentRepository: Repository<DebtPayment>,
    @InjectRepository(Debt)
    private readonly debtRepository: Repository<Debt>,
    private readonly debtsService: DebtsService,
  ) {}

  async create(
    createDebtPaymentDto: CreateDebtPaymentDto,
  ): Promise<DebtPayment> {
    // Verificar que la deuda existe
    const debt = await this.debtRepository.findOne({
      where: { id: createDebtPaymentDto.debtId },
    });

    if (!debt) {
      throw new NotFoundException(
        `Deuda con ID "${createDebtPaymentDto.debtId}" no encontrada`,
      );
    }

    // Validar que el pago no exceda el monto pendiente
    const paymentAmount = Number(createDebtPaymentDto.amount);
    const remainingAmount = Number(debt.remainingAmount);

    if (paymentAmount > remainingAmount) {
      throw new BadRequestException(
        `El monto del pago ($${paymentAmount}) excede el monto pendiente ($${remainingAmount})`,
      );
    }

    // Crear el pago
    const payment = this.paymentRepository.create({
      ...createDebtPaymentDto,
      debt,
      paymentDate: new Date(createDebtPaymentDto.paymentDate),
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Actualizar el saldo de la deuda
    debt.remainingAmount = remainingAmount - paymentAmount;
    await this.debtRepository.save(debt);

    // Actualizar el estado de la deuda
    await this.debtsService.updateDebtStatus(debt);

    return savedPayment;
  }

  async findByDebt(debtId: string): Promise<DebtPayment[]> {
    return await this.paymentRepository.find({
      where: { debt: { id: debtId } },
      order: { paymentDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<DebtPayment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['debt', 'debt.debtor'],
    });

    if (!payment) {
      throw new NotFoundException(`Pago con ID "${id}" no encontrado`);
    }

    return payment;
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    const debtId = payment.debt.id;

    await this.paymentRepository.remove(payment);

    // Recalcular la deuda después de eliminar el pago
    await this.debtsService.recalculateDebtFromPayments(debtId);
  }

  // Get payment report by debtor
  async getPaymentReportByDebtor(
    debtorId: string,
    userId: string,
  ): Promise<{
    debtor: any;
    totalPaid: number;
    payments: Array<{
      id: string;
      amount: number;
      paymentDate: Date;
      paymentReason: string;
      debtReason: string;
      notes: string;
    }>;
  }> {
    // Get all debts for this debtor
    const debts = await this.debtsService.findByDebtor(debtorId, userId);

    if (debts.length === 0) {
      throw new NotFoundException(
        `No se encontraron deudas para el deudor con ID "${debtorId}"`,
      );
    }

    const debtor = debts[0].debtor;

    // Get all payments for all debts
    const allPayments: DebtPayment[] = [];
    for (const debt of debts) {
      const payments = await this.findByDebt(debt.id);
      allPayments.push(...payments);
    }

    // Sort payments by date
    allPayments.sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
    );

    // Calculate total paid
    const totalPaid = allPayments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    // Format payments
    const formattedPayments = allPayments.map((payment) => ({
      id: payment.id,
      amount: Number(payment.amount),
      paymentDate: payment.paymentDate,
      paymentReason: payment.paymentReason,
      debtReason: payment.debt.reason,
      notes: payment.notes || '',
    }));

    return {
      debtor: {
        id: debtor.id,
        firstName: debtor.firstName,
        lastName: debtor.lastName,
        fullName: `${debtor.firstName} ${debtor.lastName}`,
      },
      totalPaid,
      payments: formattedPayments,
    };
  }
}
