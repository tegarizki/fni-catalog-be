import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'mst_bbu', schema:"public" })
export class MstBbuEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  vendor: string;

  @Column({ nullable: true })
  product: string;

  @Column({ name: 'type', nullable: true })
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  capacity: string;

  @Column({ nullable: true })
  port: string;

  @Column({ nullable: true })
  chipset: string;

  @Column({ name: 'sw_requirement', nullable: true })
  swRequirement: string;

  @Column({ name: 'power_consumption', nullable: true })
  powerConsumption: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ name: 'size', nullable: true })
  size: string;

  @Column({ nullable: true })
  temperature: string;

  @Column({ name: 'relative_humidity', nullable: true })
  relativeHumidity: string;
  
  @Column({ nullable: true })
  ga: number;

  @Column({ nullable: true })
  eos: number;

  @Column({ name: 'image_name'})
  imageName: string;

  @Column({ name: 'document_name'})
  documentName: string;

  @Column({ name: 'document_technical_name'})
  documentTechnicalName: string;
}