import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { Debt, DebtStatus } from './entities/debt.entity';
import { Debtor } from '../debtors/entities/debtor.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(Debt)
    private readonly debtRepository: Repository<Debt>,
    @InjectRepository(Debtor)
    private readonly debtorRepository: Repository<Debtor>,
  ) {}

  async create(createDebtDto: CreateDebtDto, user: User): Promise<Debt> {
    // Verificar que el deudor existe
    const debtor = await this.debtorRepository.findOne({
      where: { id: createDebtDto.debtorId },
    });

    if (!debtor) {
      throw new NotFoundException(
        `Deudor con ID "${createDebtDto.debtorId}" no encontrado`,
      );
    }

    const debt = this.debtRepository.create({
      ...createDebtDto,
      debtor,
      debtDate: new Date(createDebtDto.debtDate),
      totalAmount: createDebtDto.totalAmount,
      remainingAmount: createDebtDto.totalAmount, // Initially, remaining = total
      status: DebtStatus.PENDING,
      createdBy: user,
    });

    return await this.debtRepository.save(debt);
  }

  async findAll(userId: string): Promise<Debt[]> {
    return await this.debtRepository.find({
      where: { createdBy: { id: userId } },
      order: { debtDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByDebtor(debtorId: string, userId: string): Promise<Debt[]> {
    return await this.debtRepository.find({
      where: {
        debtor: { id: debtorId },
        createdBy: { id: userId },
      },
      order: { debtDate: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Debt> {
    const debt = await this.debtRepository.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['payments', 'debtor'],
    });

    if (!debt) {
      throw new NotFoundException(`Deuda con ID "${id}" no encontrada`);
    }

    return debt;
  }

  async update(
    id: string,
    updateDebtDto: UpdateDebtDto,
    userId: string,
  ): Promise<Debt> {
    const debt = await this.findOne(id, userId);

    if (updateDebtDto.debtorId) {
      const debtor = await this.debtorRepository.findOne({
        where: { id: updateDebtDto.debtorId },
      });
      if (!debtor) {
        throw new NotFoundException(
          `Deudor con ID "${updateDebtDto.debtorId}" no encontrado`,
        );
      }
      debt.debtor = debtor;
    }

    if (updateDebtDto.reason !== undefined) {
      debt.reason = updateDebtDto.reason;
    }

    if (updateDebtDto.totalAmount !== undefined) {
      debt.totalAmount = updateDebtDto.totalAmount;
      // Recalcular el estado
      await this.updateDebtStatus(debt);
    }

    if (updateDebtDto.debtDate) {
      debt.debtDate = new Date(updateDebtDto.debtDate);
    }

    if (updateDebtDto.notes !== undefined) {
      debt.notes = updateDebtDto.notes;
    }

    return await this.debtRepository.save(debt);
  }

  async remove(id: string, userId: string): Promise<void> {
    const debt = await this.findOne(id, userId);
    await this.debtRepository.remove(debt);
  }

  // Method to update debt status based on remaining amount
  async updateDebtStatus(debt: Debt): Promise<void> {
    const remaining = Number(debt.remainingAmount);
    const total = Number(debt.totalAmount);

    if (remaining === 0) {
      debt.status = DebtStatus.PAID;
    } else if (remaining === total) {
      debt.status = DebtStatus.PENDING;
    } else if (remaining < total && remaining > 0) {
      debt.status = DebtStatus.PARTIAL;
    }

    await this.debtRepository.save(debt);
  }

  // Method to recalculate remaining amount from payments
  async recalculateDebtFromPayments(debtId: string): Promise<void> {
    const debt = await this.debtRepository.findOne({
      where: { id: debtId },
      relations: ['payments'],
    });

    if (!debt) {
      throw new NotFoundException(`Deuda con ID "${debtId}" no encontrada`);
    }

    // Sum all payments
    const totalPaid = debt.payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    debt.remainingAmount = Number(debt.totalAmount) - totalPaid;

    // Update status
    await this.updateDebtStatus(debt);
  }
}
