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
    // Si hay fecha de fin definida, validar que no haya expirado
    if (this.licenseEndDate) {
      const now = new Date();
      const endDate = new Date(this.licenseEndDate);
      return now <= endDate;
    }

    // Si no hay fecha de fin, solo las licencias full y premium están activas
    if (this.licenseType === 'full' || this.licenseType === 'premium') {
      return true;
    }

    // Para otros tipos sin fecha de fin (como demo), no está activa
    return false;
  }

  // Método para obtener días restantes de licencia
  getRemainingDays(): number | null {
    // Si no hay fecha de fin definida, la licencia es ilimitada
    if (!this.licenseEndDate) {
      // Para licencias full/premium sin fecha de fin, retornar null (ilimitado)
      if (this.licenseType === 'full' || this.licenseType === 'premium') {
        return null;
      }
      // Para otros tipos sin fecha de fin, considerar expirado
      return 0;
    }

    // Si hay fecha de fin definida, calcular días restantes
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
