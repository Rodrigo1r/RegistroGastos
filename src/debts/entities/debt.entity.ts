import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Debtor } from '../../debtors/entities/debtor.entity';
import { DebtPayment } from '../../debt-payments/entities/debt-payment.entity';

export enum DebtStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
}

@Entity('debts')
export class Debt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Debtor, (debtor) => debtor.debts, { eager: true })
  debtor: Debtor;

  @Column({ type: 'varchar', length: 255 })
  reason: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'remaining_amount',
  })
  remainingAmount: number;

  @Column({ type: 'date', name: 'debt_date' })
  debtDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: DebtStatus,
    default: DebtStatus.PENDING,
  })
  status: DebtStatus;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  createdBy: User;

  @OneToMany(() => DebtPayment, (payment) => payment.debt)
  payments: DebtPayment[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
