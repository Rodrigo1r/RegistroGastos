import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Income } from '../../incomes/entities/income.entity';
import { User } from '../../users/entities/user.entity';

@Entity('income_types')
export class IncomeType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isSystem: boolean; // true = tipo predeterminado del sistema, false = creado por usuario

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User; // NULL para tipos del sistema, ID del usuario para tipos personalizados

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Income, (income) => income.incomeType)
  incomes: Income[];
}
