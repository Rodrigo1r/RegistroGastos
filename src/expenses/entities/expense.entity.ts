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
import { User } from '../../users/entities/user.entity';
import { ExpenseDetail } from '../../expense-types/entities/expense-detail.entity';
import { Payment } from './payment.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // Valor total a pagar

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  paidAmount: number; // Monto pagado

  @Column('decimal', { precision: 10, scale: 2 })
  pendingAmount: number; // Monto pendiente

  @Column({ type: 'date' })
  expenseDate: Date; // Fecha en que se realizó el gasto

  @Column({ type: 'date' })
  dueDate: Date; // Fecha máxima de pago

  @Column({ nullable: true })
  attachmentUrl: string; // URL del archivo adjunto (comprobante)

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UPCOMING,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => User, (user) => user.expenses, { eager: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @ManyToOne(() => ExpenseDetail, (detail) => detail.expenses, { eager: true })
  @JoinColumn({ name: 'expense_detail_id' })
  expenseDetail: ExpenseDetail;

  @OneToMany(() => Payment, (payment) => payment.expense)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método para calcular el status automáticamente
  calculateStatus(): PaymentStatus {
    // Convertir explícitamente a números para evitar problemas con decimales de PostgreSQL
    const paidAmount = Number(this.paidAmount);
    const totalAmount = Number(this.amount);

    const today = new Date();
    const due = new Date(this.dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Verificar si está completamente pagado
    if (paidAmount >= totalAmount) {
      return PaymentStatus.COMPLETED;
    }

    // Verificar si tiene pagos parciales
    if (paidAmount > 0 && paidAmount < totalAmount) {
      return PaymentStatus.PARTIAL;
    }

    // Si no hay pagos, evaluar por fecha de vencimiento
    if (diffDays < 0) {
      return PaymentStatus.OVERDUE;
    }

    if (diffDays <= 5) {
      return PaymentStatus.NEAR_DUE;
    }

    return PaymentStatus.UPCOMING;
  }
}
