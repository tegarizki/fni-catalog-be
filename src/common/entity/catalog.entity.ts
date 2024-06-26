import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"mst_catalog", schema:"public"})
export class CatalogEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_name', nullable: true})
    productName: string;

    @Column({ name: 'vendor', nullable: true})
    vendor: string;

    @Column({ name: 'type_radio', nullable: true})
    typeRadio: string;

    @Column({ name: 'id_detail_product', nullable: true})
    idDetailProduct: number;  

    @Column({ name: 'image_name', nullable: true})
    imageName: string;
}