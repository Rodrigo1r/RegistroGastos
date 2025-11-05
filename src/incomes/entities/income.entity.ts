import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IncomeType } from '../../income-types/entities/income-type.entity';

@Entity('incomes')
export class Income {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date', name: 'income_date' })
  incomeDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => IncomeType, (incomeType) => incomeType.incomes, {
    eager: true,
  })
  @JoinColumn({ name: 'income_type_id' })
  incomeType: IncomeType;

  @Column({ name: 'income_type_id' })
  incomeTypeId: string;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
