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
import { ExpenseDetail } from './expense-detail.entity';
import { User } from '../../users/entities/user.entity';

@Entity('expense_types')
export class ExpenseType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Educación, Salud, Vivienda, Vestimenta, Alimentación

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isSystem: boolean; // true = tipo predeterminado del sistema, false = creado por usuario

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User; // NULL para tipos del sistema, ID del usuario para tipos personalizados

  @OneToMany(() => ExpenseDetail, (detail) => detail.expenseType)
  details: ExpenseDetail[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
