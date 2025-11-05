import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncomeType } from './entities/income-type.entity';
import { CreateIncomeTypeDto } from './dto/create-income-type.dto';
import { UpdateIncomeTypeDto } from './dto/update-income-type.dto';

@Injectable()
export class IncomeTypesService {
  constructor(
    @InjectRepository(IncomeType)
    private readonly incomeTypeRepository: Repository<IncomeType>,
  ) {}

  async create(createIncomeTypeDto: CreateIncomeTypeDto): Promise<IncomeType> {
    // Verificar si ya existe un tipo de ingreso con el mismo nombre
    const existingIncomeType = await this.incomeTypeRepository.findOne({
      where: { name: createIncomeTypeDto.name },
    });

    if (existingIncomeType) {
      throw new ConflictException(
        `Ya existe un tipo de ingreso con el nombre "${createIncomeTypeDto.name}"`,
      );
    }

    const incomeType = this.incomeTypeRepository.create(createIncomeTypeDto);
    return await this.incomeTypeRepository.save(incomeType);
  }

  async findAll(): Promise<IncomeType[]> {
    return await this.incomeTypeRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findActive(): Promise<IncomeType[]> {
    return await this.incomeTypeRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<IncomeType> {
    const incomeType = await this.incomeTypeRepository.findOne({
      where: { id },
    });

    if (!incomeType) {
      throw new NotFoundException(
        `Tipo de ingreso con ID "${id}" no encontrado`,
      );
    }

    return incomeType;
  }

  async update(
    id: string,
    updateIncomeTypeDto: UpdateIncomeTypeDto,
  ): Promise<IncomeType> {
    const incomeType = await this.findOne(id);

    // Verificar si el nuevo nombre ya existe en otro registro
    if (updateIncomeTypeDto.name && updateIncomeTypeDto.name !== incomeType.name) {
      const existingIncomeType = await this.incomeTypeRepository.findOne({
        where: { name: updateIncomeTypeDto.name },
      });

      if (existingIncomeType) {
        throw new ConflictException(
          `Ya existe un tipo de ingreso con el nombre "${updateIncomeTypeDto.name}"`,
        );
      }
    }

    Object.assign(incomeType, updateIncomeTypeDto);
    return await this.incomeTypeRepository.save(incomeType);
  }

  async remove(id: string): Promise<void> {
    const incomeType = await this.findOne(id);
    await this.incomeTypeRepository.remove(incomeType);
  }

  async toggleActive(id: string): Promise<IncomeType> {
    const incomeType = await this.findOne(id);
    incomeType.isActive = !incomeType.isActive;
    return await this.incomeTypeRepository.save(incomeType);
  }
}
