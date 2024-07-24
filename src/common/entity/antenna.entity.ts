import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'mst_antenna', schema:"public" })
export class AntennaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  vendor: string;

  @Column({ nullable: true })
  product: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'frequency_band', nullable: true })
  frequencyBand: string;

  @Column({ name: 'antenna_gain', nullable: true })
  antennaGain: string;

  @Column({ nullable: true })
  port: string;

  @Column({ nullable: true })
  mimo: string;

  @Column({ nullable: true })
  tilt: string;

  @Column({ nullable: true })
  beam: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  sizes: string;

  @Column({ name: 'power_supply', nullable: true })
  powerSupply: string;

  @Column({ nullable: true })
  temperature: string;

  @Column({ nullable: true })
  ga: string;

  @Column({ nullable: true })
  eos: string;

  @Column({ name: 'image_name'})
  imageName: string;

  @Column({ name: 'document_name'})
  documentName: string;

  @Column({ name: 'document_technical_name'})
  documentTechnicalName: string;
}
