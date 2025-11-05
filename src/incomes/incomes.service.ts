import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Income } from './entities/income.entity';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { User } from '../users/entities/user.entity';
import { IncomeType } from '../income-types/entities/income-type.entity';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(IncomeType)
    private readonly incomeTypeRepository: Repository<IncomeType>,
  ) {}

  async create(
    createIncomeDto: CreateIncomeDto,
    user: User,
  ): Promise<Income> {
    // Verificar que el tipo de ingreso existe
    const incomeType = await this.incomeTypeRepository.findOne({
      where: { id: createIncomeDto.incomeTypeId },
    });

    if (!incomeType) {
      throw new NotFoundException(
        `Tipo de ingreso con ID "${createIncomeDto.incomeTypeId}" no encontrado`,
      );
    }

    const income = this.incomeRepository.create({
      ...createIncomeDto,
      incomeDate: new Date(createIncomeDto.incomeDate),
      incomeType,
      createdBy: user,
    });

    return await this.incomeRepository.save(income);
  }

  async findAll(userId: string): Promise<Income[]> {
    return await this.incomeRepository.find({
      where: { createdBy: { id: userId } },
      order: { incomeDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Income> {
    const income = await this.incomeRepository.findOne({
      where: { id, createdBy: { id: userId } },
    });

    if (!income) {
      throw new NotFoundException(`Ingreso con ID "${id}" no encontrado`);
    }

    return income;
  }

  async update(
    id: string,
    updateIncomeDto: UpdateIncomeDto,
    userId: string,
  ): Promise<Income> {
    const income = await this.findOne(id, userId);

    // Si se está actualizando el tipo de ingreso, verificar que existe
    if (updateIncomeDto.incomeTypeId) {
      const incomeType = await this.incomeTypeRepository.findOne({
        where: { id: updateIncomeDto.incomeTypeId },
      });

      if (!incomeType) {
        throw new NotFoundException(
          `Tipo de ingreso con ID "${updateIncomeDto.incomeTypeId}" no encontrado`,
        );
      }

      income.incomeType = incomeType;
    }

    if (updateIncomeDto.amount !== undefined) {
      income.amount = updateIncomeDto.amount;
    }

    if (updateIncomeDto.incomeDate) {
      income.incomeDate = new Date(updateIncomeDto.incomeDate);
    }

    if (updateIncomeDto.notes !== undefined) {
      income.notes = updateIncomeDto.notes;
    }

    return await this.incomeRepository.save(income);
  }

  async remove(id: string, userId: string): Promise<void> {
    const income = await this.findOne(id, userId);
    await this.incomeRepository.remove(income);
  }

  async getMonthlySummary(
    userId: string,
    year: number,
    month: number,
  ): Promise<{
    totalIncome: number;
    incomesByType: Array<{
      incomeTypeName: string;
      total: number;
      count: number;
    }>;
    incomesByDay: Array<{ date: string; total: number; count: number }>;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const incomes = await this.incomeRepository.find({
      where: {
        createdBy: { id: userId },
        incomeDate: Between(startDate, endDate),
      },
      relations: ['incomeType'],
      order: { incomeDate: 'ASC' },
    });

    // Calcular total
    const totalIncome = incomes.reduce(
      (sum, income) => sum + Number(income.amount),
      0,
    );

    // Agrupar por tipo de ingreso
    const incomesByTypeMap = new Map<
      string,
      { incomeTypeName: string; total: number; count: number }
    >();

    incomes.forEach((income) => {
      const typeName = income.incomeType.name;
      if (!incomesByTypeMap.has(typeName)) {
        incomesByTypeMap.set(typeName, {
          incomeTypeName: typeName,
          total: 0,
          count: 0,
        });
      }
      const typeData = incomesByTypeMap.get(typeName)!;
      typeData.total += Number(income.amount);
      typeData.count += 1;
    });

    const incomesByType = Array.from(incomesByTypeMap.values()).sort(
      (a, b) => b.total - a.total,
    );

    // Agrupar por día
    const incomesByDayMap = new Map<
      string,
      { date: string; total: number; count: number }
    >();

    incomes.forEach((income) => {
      // Convertir a Date si es string (PostgreSQL devuelve date como string)
      const date = income.incomeDate instanceof Date
        ? income.incomeDate
        : new Date(income.incomeDate);
      const dateKey = date.toISOString().split('T')[0];
      if (!incomesByDayMap.has(dateKey)) {
        incomesByDayMap.set(dateKey, {
          date: dateKey,
          total: 0,
          count: 0,
        });
      }
      const dayData = incomesByDayMap.get(dateKey)!;
      dayData.total += Number(income.amount);
      dayData.count += 1;
    });

    const incomesByDay = Array.from(incomesByDayMap.values()).sort(
      (a, b) => a.date.localeCompare(b.date),
    );

    return {
      totalIncome,
      incomesByType,
      incomesByDay,
    };
  }

  async getYearlySummary(
    userId: string,
    year: number,
  ): Promise<{
    totalIncome: number;
    incomesByMonth: Array<{ month: number; total: number; count: number }>;
  }> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const incomes = await this.incomeRepository.find({
      where: {
        createdBy: { id: userId },
        incomeDate: Between(startDate, endDate),
      },
      order: { incomeDate: 'ASC' },
    });

    const totalIncome = incomes.reduce(
      (sum, income) => sum + Number(income.amount),
      0,
    );

    // Agrupar por mes
    const incomesByMonthMap = new Map<
      number,
      { month: number; total: number; count: number }
    >();

    // Inicializar todos los meses
    for (let i = 1; i <= 12; i++) {
      incomesByMonthMap.set(i, { month: i, total: 0, count: 0 });
    }

    incomes.forEach((income) => {
      // Convertir a Date si es string (PostgreSQL devuelve date como string)
      const date = income.incomeDate instanceof Date
        ? income.incomeDate
        : new Date(income.incomeDate);
      const month = date.getMonth() + 1;
      const monthData = incomesByMonthMap.get(month)!;
      monthData.total += Number(income.amount);
      monthData.count += 1;
    });

    const incomesByMonth = Array.from(incomesByMonthMap.values());

    return {
      totalIncome,
      incomesByMonth,
    };
  }
}
