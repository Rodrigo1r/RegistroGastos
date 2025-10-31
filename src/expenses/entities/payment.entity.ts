import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Expense } from './expense.entity';
import { User } from '../../users/entities/user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // Monto del pago/abono

  @Column({ type: 'date' })
  paymentDate: Date; // Fecha en que se realizó el pago

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Expense, (expense) => expense.payments)
  @JoinColumn({ name: 'expense_id' })
  expense: Expense;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'registered_by_id' })
  registeredBy: User; // Usuario que registró el pago

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
