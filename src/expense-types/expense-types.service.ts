import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseType } from './entities/expense-type.entity';
import { ExpenseDetail } from './entities/expense-detail.entity';
import { User } from '../users/entities/user.entity';
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
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Métodos para Tipos de Gastos
  async createType(createExpenseTypeDto: CreateExpenseTypeDto, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const expenseType = this.expenseTypeRepository.create({
      ...createExpenseTypeDto,
      isSystem: false, // Los tipos creados por usuarios nunca son del sistema
      createdBy: user,
    });
    return this.expenseTypeRepository.save(expenseType);
  }

  async findAllTypes(userId: string) {
    // Retornar tipos del sistema + tipos creados por el usuario
    return this.expenseTypeRepository.find({
      where: [
        { isSystem: true }, // Tipos del sistema (visibles para todos)
        { createdBy: { id: userId } }, // Tipos personalizados del usuario
      ],
      relations: ['details'],
      order: { name: 'ASC' },
    });
  }

  async findOneType(id: string, userId: string) {
    const expenseType = await this.expenseTypeRepository.findOne({
      where: [
        { id, isSystem: true }, // Tipo del sistema
        { id, createdBy: { id: userId } }, // Tipo del usuario
      ],
      relations: ['details'],
    });

    if (!expenseType) {
      throw new NotFoundException('Tipo de gasto no encontrado');
    }

    return expenseType;
  }

  async updateType(id: string, updateExpenseTypeDto: UpdateExpenseTypeDto, userId: string) {
    const expenseType = await this.expenseTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!expenseType) {
      throw new NotFoundException('Tipo de gasto no encontrado');
    }

    // Los tipos del sistema no se pueden modificar
    if (expenseType.isSystem) {
      throw new ForbiddenException('No se pueden modificar los tipos de gasto predeterminados del sistema');
    }

    // Verificar que el tipo pertenece al usuario
    if (expenseType.createdBy?.id !== userId) {
      throw new ForbiddenException('No tienes permisos para modificar este tipo de gasto');
    }

    Object.assign(expenseType, updateExpenseTypeDto);
    return this.expenseTypeRepository.save(expenseType);
  }

  async removeType(id: string, userId: string) {
    const expenseType = await this.expenseTypeRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!expenseType) {
      throw new NotFoundException('Tipo de gasto no encontrado');
    }

    // Los tipos del sistema no se pueden eliminar
    if (expenseType.isSystem) {
      throw new ForbiddenException('No se pueden eliminar los tipos de gasto predeterminados del sistema');
    }

    // Verificar que el tipo pertenece al usuario
    if (expenseType.createdBy?.id !== userId) {
      throw new ForbiddenException('No tienes permisos para eliminar este tipo de gasto');
    }

    await this.expenseTypeRepository.remove(expenseType);
    return { message: 'Tipo de gasto eliminado exitosamente' };
  }

  // Métodos para Detalles de Gastos
  async createDetail(createExpenseDetailDto: CreateExpenseDetailDto, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el tipo de gasto existe y el usuario tiene acceso a él
    const expenseType = await this.expenseTypeRepository.findOne({
      where: [
        { id: createExpenseDetailDto.expenseTypeId, isSystem: true },
        { id: createExpenseDetailDto.expenseTypeId, createdBy: { id: userId } },
      ],
    });

    if (!expenseType) {
      throw new NotFoundException('Tipo de gasto no encontrado o no tienes acceso a él');
    }

    const expenseDetail = this.expenseDetailRepository.create({
      ...createExpenseDetailDto,
      expenseType,
      isSystem: false, // Los detalles creados por usuarios nunca son del sistema
      createdBy: user,
    });

    return this.expenseDetailRepository.save(expenseDetail);
  }

  async findAllDetails(userId: string) {
    // Retornar detalles del sistema + detalles creados por el usuario
    return this.expenseDetailRepository.find({
      where: [
        { isSystem: true }, // Detalles del sistema (visibles para todos)
        { createdBy: { id: userId } }, // Detalles personalizados del usuario
      ],
      relations: ['expenseType'],
      order: { name: 'ASC' },
    });
  }

  async findDetailsByType(typeId: string, userId: string) {
    // Verificar que el usuario tiene acceso al tipo
    const expenseType = await this.expenseTypeRepository.findOne({
      where: [
        { id: typeId, isSystem: true },
        { id: typeId, createdBy: { id: userId } },
      ],
    });

    if (!expenseType) {
      throw new NotFoundException('Tipo de gasto no encontrado o no tienes acceso a él');
    }

    // Retornar detalles del sistema + detalles del usuario para ese tipo
    return this.expenseDetailRepository.find({
      where: [
        { expenseType: { id: typeId }, isSystem: true },
        { expenseType: { id: typeId }, createdBy: { id: userId } },
      ],
      relations: ['expenseType'],
      order: { name: 'ASC' },
    });
  }

  async findOneDetail(id: string, userId: string) {
    const expenseDetail = await this.expenseDetailRepository.findOne({
      where: [
        { id, isSystem: true }, // Detalle del sistema
        { id, createdBy: { id: userId } }, // Detalle del usuario
      ],
      relations: ['expenseType'],
    });

    if (!expenseDetail) {
      throw new NotFoundException('Detalle de gasto no encontrado');
    }

    return expenseDetail;
  }

  async updateDetail(id: string, updateExpenseDetailDto: UpdateExpenseDetailDto, userId: string) {
    const expenseDetail = await this.expenseDetailRepository.findOne({
      where: { id },
      relations: ['expenseType', 'createdBy'],
    });

    if (!expenseDetail) {
      throw new NotFoundException('Detalle de gasto no encontrado');
    }

    // Los detalles del sistema no se pueden modificar
    if (expenseDetail.isSystem) {
      throw new ForbiddenException('No se pueden modificar los detalles de gasto predeterminados del sistema');
    }

    // Verificar que el detalle pertenece al usuario
    if (expenseDetail.createdBy?.id !== userId) {
      throw new ForbiddenException('No tienes permisos para modificar este detalle de gasto');
    }

    if (updateExpenseDetailDto.expenseTypeId) {
      const expenseType = await this.expenseTypeRepository.findOne({
        where: [
          { id: updateExpenseDetailDto.expenseTypeId, isSystem: true },
          { id: updateExpenseDetailDto.expenseTypeId, createdBy: { id: userId } },
        ],
      });

      if (!expenseType) {
        throw new NotFoundException('Tipo de gasto no encontrado o no tienes acceso a él');
      }

      expenseDetail.expenseType = expenseType;
    }

    Object.assign(expenseDetail, updateExpenseDetailDto);
    return this.expenseDetailRepository.save(expenseDetail);
  }

  async removeDetail(id: string, userId: string) {
    const expenseDetail = await this.expenseDetailRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!expenseDetail) {
      throw new NotFoundException('Detalle de gasto no encontrado');
    }

    // Los detalles del sistema no se pueden eliminar
    if (expenseDetail.isSystem) {
      throw new ForbiddenException('No se pueden eliminar los detalles de gasto predeterminados del sistema');
    }

    // Verificar que el detalle pertenece al usuario
    if (expenseDetail.createdBy?.id !== userId) {
      throw new ForbiddenException('No tienes permisos para eliminar este detalle de gasto');
    }

    await this.expenseDetailRepository.remove(expenseDetail);
    return { message: 'Detalle de gasto eliminado exitosamente' };
  }
}
