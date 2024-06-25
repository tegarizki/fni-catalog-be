import { FindAllCatalogDto } from "@/common/dto/find-all-catalog.dto";
import { PageMetaDto } from "@/common/dto/page-meta.dto";
import { PageDto } from "@/common/dto/page.dto";
import { AauEntity } from "@/common/entity/aau.entity";
import { BbuEntity } from "@/common/entity/bbu.entity";
import { RruEntity } from "@/common/entity/rru.entity";
import { SoftwareEntity } from "@/common/entity/software.entity";
import { CatalogEntity } from "@/common/entity/catalog.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CatalogService {
    @InjectRepository(CatalogEntity)
    private readonly repository: Repository<CatalogEntity>;

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

    public async findOne(id: number): Promise<CatalogEntity> {
        return await this.repository.findOneBy({ id: id });
    }
    
    public async findOneByIdDetail(id: number): Promise<CatalogEntity> {
        return await this.repository.findOneBy({ idDetailProduct: id });
    }

    public async update(id: number, body: CatalogEntity): Promise<object> {
        return await this.repository.update(id, body);
    }

    public async remove(id: number): Promise<object> {
        return await this.repository.delete({ id : id });
    }
    public async create(body: CatalogEntity): Promise<CatalogEntity> {
        return await this.repository.save(body);
    }
}