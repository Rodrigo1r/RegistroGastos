import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    const { password, ...result } = user;
    return {
      ...result,
      isLicenseActive: user.isLicenseActive(),
      remainingDays: user.getRemainingDays(),
    };
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => {
      const { password, ...result } = user;
      return {
        ...result,
        isLicenseActive: user.isLicenseActive(),
        remainingDays: user.getRemainingDays(),
      };
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { password, ...result } = user;
    return {
      ...result,
      isLicenseActive: user.isLicenseActive(),
      remainingDays: user.getRemainingDays(),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    const { password, ...result } = user;
    return {
      ...result,
      isLicenseActive: user.isLicenseActive(),
      remainingDays: user.getRemainingDays(),
    };
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.userRepository.remove(user);
    return { message: 'Usuario eliminado exitosamente' };
  }
}
