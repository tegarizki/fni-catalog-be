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
export class CatalogService {
    @InjectRepository(MstCatalogEntity)
    private readonly repository: Repository<MstCatalogEntity>;

    public async findAll(
        filterDto: FindAllCatalogDto
    ): Promise<PageDto<object>> {
        const queryBuilder = this.repository.createQueryBuilder();
        
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

    public async findOne(id: number): Promise<MstCatalogEntity> {
        return await this.repository.findOneBy({ id: id });
    }
    
    public async findOneByIdDetail(id: number): Promise<MstCatalogEntity> {
        return await this.repository.findOneBy({ idDetailProduct: id });
    }

    public async update(id: number, body: MstCatalogEntity): Promise<object> {
        return await this.repository.update(id, body);
    }

    public async remove(id: number): Promise<object> {
        return await this.repository.delete(id);
    }
    public async create(body: MstCatalogEntity): Promise<MstCatalogEntity> {
        return await this.repository.save(body);
    }
}