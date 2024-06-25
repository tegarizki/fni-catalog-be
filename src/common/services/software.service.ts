
import { SoftwareEntity } from "@/common/entity/software.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SoftwareService {
    @InjectRepository(SoftwareEntity)
    private readonly repository: Repository<SoftwareEntity>;

    public async create(body: SoftwareEntity): Promise<SoftwareEntity> {
        return await this.repository.save(body);
    }

    public async findOne(id: number): Promise<SoftwareEntity> {
        return await this.repository.findOneBy({ id });
    }

    public async update(id: number, body: SoftwareEntity): Promise<object> {
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