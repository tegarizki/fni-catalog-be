import { FindAllCatalogDto } from "@/shared/dto/find-all-catalog.dto";
import { PageMetaDto } from "@/shared/dto/page-meta.dto";
import { PageDto } from "@/shared/dto/page.dto";
import { CatalogEntity } from "@/shared/entity/catalog.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { filter } from "rxjs";
import { Repository } from "typeorm";

@Injectable()
export class CatalogService {
    @InjectRepository(CatalogEntity)
    private readonly _catalogEntity: Repository<CatalogEntity>;

    public async getCatalog(
        filterDto: FindAllCatalogDto
    ): Promise<PageDto<object>> {

        const queryBuilder = this._catalogEntity.createQueryBuilder();
        if (filterDto.vendor) {
            queryBuilder.where("LOWER(vendor) = :vendor", { vendor : filterDto.vendor.toLowerCase() });
        }
        if (filterDto.typeRadio) {
            queryBuilder.where("LOWER(type_radio) = :typeRadio", { typeRadio : filterDto.typeRadio.toLowerCase() });
        }
        if (filterDto.productName) {
            queryBuilder.where("LOWER(product_name) like :productName", { productName : `%${filterDto.productName.toLowerCase()}%` });
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
}