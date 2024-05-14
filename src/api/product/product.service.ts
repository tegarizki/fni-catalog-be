import { FindAllCatalogDto } from "@/shared/dto/find-all-catalog.dto";
import { PageMetaDto } from "@/shared/dto/page-meta.dto";
import { PageDto } from "@/shared/dto/page.dto";
import { MstAauEntity } from "@/shared/entity/mst-aau.entity";
import { MstBbuEntity } from "@/shared/entity/mst-bbu.entity";
import { MstRruEntity } from "@/shared/entity/mst-rru.entity";
import { MstSoftwareEntity } from "@/shared/entity/mst-software.entity";
import { MstCatalogEntity } from "@/shared/entity/mst-catalog.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ProductService {
    @InjectRepository(MstCatalogEntity)
    private readonly mstcatalogRepository: Repository<MstCatalogEntity>;
    
    @InjectRepository(MstAauEntity)
    private readonly mstAauRepository: Repository<MstAauEntity>;
    
    @InjectRepository(MstBbuEntity)
    private readonly mstBbuRepository: Repository<MstBbuEntity>;
    
    @InjectRepository(MstRruEntity)
    private readonly mstRruRepository: Repository<MstRruEntity>;
    
    @InjectRepository(MstSoftwareEntity)
    private readonly mstSoftwareRepository: Repository<MstSoftwareEntity>;

    public async findCatalog(
        filterDto: FindAllCatalogDto
    ): Promise<PageDto<object>> {
        const queryBuilder = this.mstcatalogRepository.createQueryBuilder();
        
        if (filterDto.vendor) {
            queryBuilder.andWhere("LOWER(vendor) = :vendor", { vendor : filterDto.vendor.toLowerCase() });
        }
        if (filterDto.typeRadio) {
            queryBuilder.andWhere("LOWER(type_radio) = :typeRadio", { typeRadio : filterDto.typeRadio.toLowerCase() });
        }
        if (filterDto.productName) {
            queryBuilder.andWhere("LOWER(product_name) like :productName", { productName : `%${filterDto.productName.toLowerCase()}%` });
        }
        queryBuilder
            .orderBy('id', filterDto.order)
            .skip(filterDto.skip)
            .take(filterDto.take);


        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();
        const pageMetaDto = new PageMetaDto(filterDto.page, filterDto.take, itemCount);

        return new PageDto(entities, pageMetaDto);
    }

    public async findProduct(id: number): Promise<object> {
        const catalog =  await this.mstcatalogRepository.findOneBy({
            id: id
        });
        const productId = catalog.idDetailProduct

        let product;
        if (catalog.typeRadio == 'aau') {
            product = await this.mstAauRepository
                .createQueryBuilder()
                .where("id = :id", { id: productId })
                .getOne();
        }
        if (catalog.typeRadio == 'rru') {
            product = await this.mstRruRepository
                .createQueryBuilder()
                .where("id = :id", { id: productId })
                .getOne();
            
        } else if (catalog.typeRadio == "bbu") {
            product = await this.mstBbuRepository
                .createQueryBuilder()
                .where("id = :id", { id: productId })
                .getOne();
        } else if (catalog.typeRadio == "software") {
            product = await this.mstSoftwareRepository
                .createQueryBuilder()
                .where("id = :id", { id: productId })
                .getOne();
        }

        return product;

    }
}