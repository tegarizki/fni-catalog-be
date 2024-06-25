import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'mst_vendor', schema:"public" })
export class VendorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name : 'vendor',nullable : true})
  vendor: string;
}