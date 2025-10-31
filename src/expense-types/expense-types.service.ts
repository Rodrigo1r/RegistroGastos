import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseType } from './entities/expense-type.entity';
import { ExpenseDetail } from './entities/expense-detail.entity';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';
import { CreateExpenseDetailDto } from './dto/create-expense-detail.dto';
import { UpdateExpenseDetailDto } from './dto/update-expense-detail.dto';

@Injectable()
export class ExpenseTypesService {
  constructor(
    @InjectRepository(ExpenseType)
    private expenseTypeRepository: Repository<ExpenseType>,
    @InjectRepository(ExpenseDetail)
    private expenseDetailRepository: Repository<ExpenseDetail>,
  ) {}

  // Métodos para Tipos de Gastos
  async createType(createExpenseTypeDto: CreateExpenseTypeDto) {
    const existingType = await this.expenseTypeRepository.findOne({
      where: { name: createExpenseTypeDto.name },
    });

    if (existingType) {
      throw new ConflictException('El tipo de gasto ya existe');
    }

    const expenseType = this.expenseTypeRepository.create(createExpenseTypeDto);
    return this.expenseTypeRepository.save(expenseType);
  }

  async findAllTypes() {
    return this.expenseTypeRepository.find({
      relations: ['details'],
      order: { name: 'ASC' },
    });
  }

  async findOneType(id: string) {
    const expenseType = await this.expenseTypeRepository.findOne({
      where: { id },
      relations: ['details'],
    });

    if (!expenseType) {
      throw new NotFoundException('Tipo de gasto no encontrado');
    }

    return expenseType;
  }

  async updateType(id: string, updateExpenseTypeDto: UpdateExpenseTypeDto) {
    const expenseType = await this.expenseTypeRepository.findOne({
      where: { id },
    });

    if (!expenseType) {
      throw new NotFoundException('Tipo de gasto no encontrado');
    }

    if (
      updateExpenseTypeDto.name &&
      updateExpenseTypeDto.name !== expenseType.name
    ) {
      const existingType = await this.expenseTypeRepository.findOne({
        where: { name: updateExpenseTypeDto.name },
      });
      if (existingType) {
        throw new ConflictException('El tipo de gasto ya existe');
      }
    }

    Object.assign(expenseType, updateExpenseTypeDto);
    return this.expenseTypeRepository.save(expenseType);
  }

  async removeType(id: string) {
    const expenseType = await this.expenseTypeRepository.findOne({
      where: { id },
    });

    if (!expenseType) {
      throw new NotFoundException('Tipo de gasto no encontrado');
    }

    await this.expenseTypeRepository.remove(expenseType);
    return { message: 'Tipo de gasto eliminado exitosamente' };
  }

  // Métodos para Detalles de Gastos
  async createDetail(createExpenseDetailDto: CreateExpenseDetailDto) {
    const expenseType = await this.expenseTypeRepository.findOne({
      where: { id: createExpenseDetailDto.expenseTypeId },
    });

    if (!expenseType) {
      throw new NotFoundException('Tipo de gasto no encontrado');
    }

    const expenseDetail = this.expenseDetailRepository.create({
      ...createExpenseDetailDto,
      expenseType,
    });

    return this.expenseDetailRepository.save(expenseDetail);
  }

  async findAllDetails() {
    return this.expenseDetailRepository.find({
      relations: ['expenseType'],
      order: { name: 'ASC' },
    });
  }

  async findDetailsByType(typeId: string) {
    return this.expenseDetailRepository.find({
      where: { expenseType: { id: typeId } },
      relations: ['expenseType'],
      order: { name: 'ASC' },
    });
  }

  async findOneDetail(id: string) {
    const expenseDetail = await this.expenseDetailRepository.findOne({
      where: { id },
      relations: ['expenseType'],
    });

    if (!expenseDetail) {
      throw new NotFoundException('Detalle de gasto no encontrado');
    }

    return expenseDetail;
  }

  async updateDetail(id: string, updateExpenseDetailDto: UpdateExpenseDetailDto) {
    const expenseDetail = await this.expenseDetailRepository.findOne({
      where: { id },
      relations: ['expenseType'],
    });

    if (!expenseDetail) {
      throw new NotFoundException('Detalle de gasto no encontrado');
    }

    if (updateExpenseDetailDto.expenseTypeId) {
      const expenseType = await this.expenseTypeRepository.findOne({
        where: { id: updateExpenseDetailDto.expenseTypeId },
      });

      if (!expenseType) {
        throw new NotFoundException('Tipo de gasto no encontrado');
      }

      expenseDetail.expenseType = expenseType;
    }

    Object.assign(expenseDetail, updateExpenseDetailDto);
    return this.expenseDetailRepository.save(expenseDetail);
  }

  async removeDetail(id: string) {
    const expenseDetail = await this.expenseDetailRepository.findOne({
      where: { id },
    });

    if (!expenseDetail) {
      throw new NotFoundException('Detalle de gasto no encontrado');
    }

    await this.expenseDetailRepository.remove(expenseDetail);
    return { message: 'Detalle de gasto eliminado exitosamente' };
  }
}
