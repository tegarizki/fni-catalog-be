import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from "class-transformer";

@Entity({name:'mst_users', schema:'public'})
export class MstUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ length: 50 })
  username: string;

  @Exclude()
  @Column({ length: 255 })
  password: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 255 })
  email: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  status: string;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'last_login_at', default: () => 'CURRENT_TIMESTAMP' })
  lastLoginAt: Date;
}
