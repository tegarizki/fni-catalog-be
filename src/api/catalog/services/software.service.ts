
import { MstSoftwareEntity } from "@/shared/entity/mst-software.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SoftwareService {
    @InjectRepository(MstSoftwareEntity)
    private readonly repository: Repository<MstSoftwareEntity>;

    public async create(body: MstSoftwareEntity): Promise<MstSoftwareEntity> {
        return await this.repository.save(body);
    }

    public async findOne(id: number): Promise<MstSoftwareEntity> {
        return await this.repository.findOneBy({ id });
    }

    public async update(id: number, body: MstSoftwareEntity): Promise<object> {
        return await this.repository.update(id, body);
    }

    public async remove(id: number): Promise<object> {
        return await this.repository.delete(id);
    }

    public async findColumnName(): Promise<any> {
        const columns = await this.repository.metadata.columns;
        return columns.map(column => column.propertyName);
    }
}