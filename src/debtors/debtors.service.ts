import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { UpdateDebtorDto } from './dto/update-debtor.dto';
import { Debtor } from './entities/debtor.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DebtorsService {
  constructor(
    @InjectRepository(Debtor)
    private readonly debtorRepository: Repository<Debtor>,
  ) {}

  async create(
    createDebtorDto: CreateDebtorDto,
    user: User,
  ): Promise<Debtor> {
    const debtor = this.debtorRepository.create({
      ...createDebtorDto,
      createdBy: user,
    });

    return await this.debtorRepository.save(debtor);
  }

  async findAll(userId: string): Promise<Debtor[]> {
    return await this.debtorRepository.find({
      where: { createdBy: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Debtor> {
    const debtor = await this.debtorRepository.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['debts'],
    });

    if (!debtor) {
      throw new NotFoundException(`Deudor con ID "${id}" no encontrado`);
    }

    return debtor;
  }

  async update(
    id: string,
    updateDebtorDto: UpdateDebtorDto,
    userId: string,
  ): Promise<Debtor> {
    const debtor = await this.findOne(id, userId);

    Object.assign(debtor, updateDebtorDto);

    return await this.debtorRepository.save(debtor);
  }

  async remove(id: string, userId: string): Promise<void> {
    const debtor = await this.findOne(id, userId);
    await this.debtorRepository.remove(debtor);
  }

  async getSummary(userId: string): Promise<{
    totalDebtors: number;
    activeDebtors: number;
    totalDebtAmount: number;
    totalPendingAmount: number;
  }> {
    const debtors = await this.debtorRepository.find({
      where: { createdBy: { id: userId } },
      relations: ['debts'],
    });

    const activeDebtors = debtors.filter((d) => d.isActive).length;

    let totalDebtAmount = 0;
    let totalPendingAmount = 0;

    debtors.forEach((debtor) => {
      if (debtor.debts && debtor.debts.length > 0) {
        debtor.debts.forEach((debt) => {
          totalDebtAmount += Number(debt.totalAmount);
          totalPendingAmount += Number(debt.remainingAmount);
        });
      }
    });

    return {
      totalDebtors: debtors.length,
      activeDebtors,
      totalDebtAmount,
      totalPendingAmount,
    };
  }
}
