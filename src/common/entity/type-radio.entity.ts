import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'mst_type_radio', schema:"public" })
export class TypeRadioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name : 'type_radio',nullable : true})
  typeRadio: string;

  @Column({name : 'description',nullable : true})
  description: string;
}