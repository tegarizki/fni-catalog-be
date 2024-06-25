import { AauEntity } from "@/common/entity/aau.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AauService {
    @InjectRepository(AauEntity)
    private readonly repository: Repository<AauEntity>;

    public async create(body: AauEntity): Promise<AauEntity> {
        return await this.repository.save(body);
    }

    public async findOne(id: number): Promise<AauEntity> {
        return await this.repository.findOneBy({ id });
    }

    public async update(id: number, body: AauEntity): Promise<object> {
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