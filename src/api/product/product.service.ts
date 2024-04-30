import { FindAllCatalogDto } from "@/shared/dto/find-all-catalog.dto";
import { PageMetaDto } from "@/shared/dto/page-meta.dto";
import { PageDto } from "@/shared/dto/page.dto";
import { MstAauEntity } from "@/shared/entity/mst-aau.entity";
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

    public async findCatalog(
        filterDto: FindAllCatalogDto
    ): Promise<PageDto<object>> {
        const queryBuilder = this.mstcatalogRepository.createQueryBuilder();
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

    public async findProduct(id: number): Promise<object> {
        const catalog =  await this.mstcatalogRepository.findOneBy({
            id: id
        });
        const productId = catalog.idDetailProduct

        const product = await this.mstcatalogRepository
            .createQueryBuilder('a')
            .leftJoinAndSelect("a.mstAau", "mstAau")
            .where("a.id = :id", { id: productId })
            .getOne();

        return product;
    }
}