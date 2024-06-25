import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'mst_software', schema:"public" })
export class SoftwareEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  vendor: string;

  @Column({ nullable: true })
  product: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'main_key_features', nullable: true })
  mainKeyFeatures: string;

  @Column({ name: 'lab_certification', nullable: true })
  labCertification: string;

  @Column({ name: 'hardware_not_compatible', nullable: true })
  hardwareNotCompatible: string;

  @Column({ name: 'num_new_features', nullable: true })
  numNewFeatures: string;

  @Column({ name: 'num_delete_features', nullable: true })
  numDeleteFeatures: string;

  @Column({ name: 'num_new_counter', nullable: true })
  numNewCounter: string;

  @Column({ name: 'num_delete_counter', nullable: true })
  numDeleteCounter: string;

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
