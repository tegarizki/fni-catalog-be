import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"mst_catalog", schema:"public"})
export class CatalogEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_name'})
    productName: string;

    @Column({ name: 'vendor'})
    vendor: string;

    @Column({ name: 'type_radio'})
    typeRadio: string;

    @Column({ name: 'id_detail_product'})
    idDetailProduct: number;  

    @Column({ name: 'image_name'})
    imageName: string;
}