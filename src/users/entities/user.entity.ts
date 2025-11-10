import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  // Campos de licencia
  @Column({
    type: 'enum',
    enum: ['demo', 'full', 'premium'],
    default: 'demo',
  })
  licenseType: string;

  @Column({ type: 'timestamp', nullable: true })
  licenseStartDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  licenseEndDate: Date;

  @OneToMany(() => Expense, (expense) => expense.createdBy)
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método para verificar si la licencia está activa
  isLicenseActive(): boolean {
    if (this.licenseType === 'full' || this.licenseType === 'premium') {
      return true;
    }

    if (this.licenseType === 'demo') {
      if (!this.licenseEndDate) {
        return false;
      }
      const now = new Date();
      return now <= new Date(this.licenseEndDate);
    }

    return false;
  }

  // Método para obtener días restantes de licencia
  getRemainingDays(): number | null {
    if (this.licenseType === 'full' || this.licenseType === 'premium') {
      return null; // Ilimitado (no aplica)
    }

    if (!this.licenseEndDate) {
      return 0;
    }

    const now = new Date();
    const endDate = new Date(this.licenseEndDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeInsert()
  setLicenseDates() {
    // Si no se ha establecido el tipo de licencia, usar demo
    if (!this.licenseType) {
      this.licenseType = 'demo';
    }

    // Establecer fechas para licencias demo
    if (this.licenseType === 'demo' && !this.licenseStartDate) {
      this.licenseStartDate = new Date();
      // 7 días de prueba
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      this.licenseEndDate = endDate;
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
