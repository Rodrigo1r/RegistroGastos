import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ExpenseType } from './expense-type.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { User } from '../../users/entities/user.entity';

@Entity('expense_details')
export class ExpenseDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Pago Pensión Escuela, Pago luz, etc.

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isSystem: boolean; // true = detalle predeterminado del sistema, false = creado por usuario

  @ManyToOne(() => ExpenseType, (type) => type.details, { eager: true })
  @JoinColumn({ name: 'expense_type_id' })
  expenseType: ExpenseType;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User; // NULL para detalles del sistema, ID del usuario para detalles personalizados

  @OneToMany(() => Expense, (expense) => expense.expenseDetail)
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
