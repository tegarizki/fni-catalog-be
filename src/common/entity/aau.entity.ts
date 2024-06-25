import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'mst_aau', schema:"public" })
export class AauEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  vendor: string;

  @Column({ nullable: true })
  product: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'sw_requirement', nullable: true })
  swRequirement: string;

  @Column({ name: 'type', nullable: true })
  type: string;

  @Column({ name: 'frequency_band', nullable: true })
  frequencyBand: string;

  @Column({ name: 'support_sdr', nullable: true })
  supportSDR: string;

  @Column({ name: 'ibw_mhz', nullable: true })
  ibwMHz: number;

  @Column({ nullable: true })
  mimo: string;

  @Column({ name: 'pa_output_power', nullable: true })
  paOutputPower: number;

  @Column({ name: 'power_consumption', nullable: true })
  powerConsumption: number;

  @Column({ nullable: true })
  weight: string;

  @Column({ name: 'size', nullable: true })
  size: string;

  @Column({ name: 'ip_rating', nullable: true })
  ipRating: string;

  @Column({ name: 'power_supply', nullable: true })
  powerSupply: string;

  @Column({ name: 'cpri_port', nullable: true })
  cpriPort: string;

  @Column({ nullable: true })
  temperature: string;

  @Column({ name: 'relative_humidity', nullable: true })
  relativeHumidity: string;

  @Column({ name: 'recommended_cb_rating', nullable: true })
  recommendedCBRating: string;

  @Column({ name: 'gain_antenna', nullable: true })
  gainAntenna: string;

  @Column({ name: 'typical_bw_transport', nullable: true })
  typicalBWTransport: string;

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