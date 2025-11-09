import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncomeType } from './entities/income-type.entity';
import { User } from '../users/entities/user.entity';
import { CreateIncomeTypeDto } from './dto/create-income-type.dto';
import { UpdateIncomeTypeDto } from './dto/update-income-type.dto';

@Injectable()
export class IncomeTypesService {
  constructor(
    @InjectRepository(IncomeType)
    private readonly incomeTypeRepository: Repository<IncomeType>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createIncomeTypeDto: CreateIncomeTypeDto, userId: string): Promise<IncomeType> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const incomeType = this.incomeTypeRepository.create({
      ...createIncomeTypeDto,
      isSystem: false, // Los tipos creados por usuarios nunca son del sistema
      createdBy: user,
    });
    return await this.incomeTypeRepository.save(incomeType);
  }

  async findAll(userId: string): Promise<IncomeType[]> {
    // Retornar tipos del sistema + tipos creados por el usuario
    return await this.incomeTypeRepository.find({
      where: [
        { isSystem: true }, // Tipos del sistema (visibles para todos)
        { createdBy: { id: userId } }, // Tipos personalizados del usuario
      ],
      order: { name: 'ASC' },
    });
  }

  async findActive(userId: string): Promise<IncomeType[]> {
    // Retornar tipos activos del sistema + tipos activos del usuario
    return await this.incomeTypeRepository.find({
      where: [
        { isSystem: true, isActive: true }, // Tipos del sistema activos
        { createdBy: { id: userId }, isActive: true }, // Tipos del usuario activos
      ],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<IncomeType> {
    const incomeType = await this.incomeTypeRepository.findOne({
      where: [
        { id, isSystem: true }, // Tipo del sistema
        { id, createdBy: { id: userId } }, // Tipo del usuario
      ],
    });

    if (!incomeType) {
      throw new NotFoundException(
        `Tipo de ingreso con ID "${id}" no encontrado o no tienes permisos`,
      );
    }

    return incomeType;
  }

  async update(
    id: string,
    updateIncomeTypeDto: UpdateIncomeTypeDto,
    userId: string,
  ): Promise<IncomeType> {
    const incomeType = await this.incomeTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!incomeType) {
      throw new NotFoundException('Tipo de ingreso no encontrado');
    }

    // Los tipos del sistema no se pueden modificar
    if (incomeType.isSystem) {
      throw new ConflictException('No se pueden modificar los tipos de ingreso predeterminados del sistema');
    }

    // Verificar que el tipo pertenece al usuario
    if (incomeType.createdBy?.id !== userId) {
      throw new ConflictException('No tienes permisos para modificar este tipo de ingreso');
    }

    Object.assign(incomeType, updateIncomeTypeDto);
    return await this.incomeTypeRepository.save(incomeType);
  }

  async remove(id: string, userId: string): Promise<void> {
    const incomeType = await this.incomeTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!incomeType) {
      throw new NotFoundException('Tipo de ingreso no encontrado');
    }

    // Los tipos del sistema no se pueden eliminar
    if (incomeType.isSystem) {
      throw new ConflictException('No se pueden eliminar los tipos de ingreso predeterminados del sistema');
    }

    // Verificar que el tipo pertenece al usuario
    if (incomeType.createdBy?.id !== userId) {
      throw new ConflictException('No tienes permisos para eliminar este tipo de ingreso');
    }

    await this.incomeTypeRepository.remove(incomeType);
  }

  async toggleActive(id: string, userId: string): Promise<IncomeType> {
    const incomeType = await this.incomeTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!incomeType) {
      throw new NotFoundException('Tipo de ingreso no encontrado');
    }

    // Los tipos del sistema no se pueden modificar
    if (incomeType.isSystem) {
      throw new ConflictException('No se pueden modificar los tipos de ingreso predeterminados del sistema');
    }

    // Verificar que el tipo pertenece al usuario
    if (incomeType.createdBy?.id !== userId) {
      throw new ConflictException('No tienes permisos para modificar este tipo de ingreso');
    }

    incomeType.isActive = !incomeType.isActive;
    return await this.incomeTypeRepository.save(incomeType);
  }
}
