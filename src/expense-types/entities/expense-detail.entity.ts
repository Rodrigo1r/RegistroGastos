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

  @ManyToOne(() => ExpenseType, (type) => type.details, { eager: true })
  @JoinColumn({ name: 'expense_type_id' })
  expenseType: ExpenseType;

  @OneToMany(() => Expense, (expense) => expense.expenseDetail)
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
