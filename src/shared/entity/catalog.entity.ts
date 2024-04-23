import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"mst_catalog", schema:"public"})
export class CatalogEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_name', length: 255 })
    productName: string;

    @Column({ name: 'vendor', length: 255 })
    vendor: string;

    @Column({ name: 'type_radio', length: 255 })
    typeRadio: string;

    @Column({ name: 'image_url', length: 255 })
    imageUrl: string;

    @Column({ name: 'id_detail_product'})
    idDetailProduct: number;  
}