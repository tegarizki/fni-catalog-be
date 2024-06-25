import { BbuEntity } from "@/common/entity/bbu.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class BbuService {
    @InjectRepository(BbuEntity)
    private readonly repository: Repository<BbuEntity>;

    public async create(body: BbuEntity): Promise<BbuEntity> {
        return await this.repository.save(body);
    }

    public async findOne(id: number): Promise<BbuEntity> {
        return await this.repository.findOneBy({ id });
    }

    public async update(id: number, body: BbuEntity): Promise<object> {
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