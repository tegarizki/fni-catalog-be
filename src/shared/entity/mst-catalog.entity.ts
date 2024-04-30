import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MstAauEntity } from "./mst-aau.entity";

@Entity({name:"mst_catalog", schema:"public"})
export class MstCatalogEntity{
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

    @OneToOne(type => MstAauEntity)
    @JoinColumn([
        { name: 'id_detail_product', referencedColumnName: 'id' }
    ])
    mstAau: MstAauEntity;
}