import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AntennaEntity } from "../entity/atenna.entity";

@Injectable()
export class AntennaService {
    @InjectRepository(AntennaEntity)
    private readonly repository: Repository<AntennaEntity>;

    public async create(body: AntennaEntity): Promise<AntennaEntity> {
        return await this.repository.save(body);
    }

    public async findOne(id: number): Promise<AntennaEntity> {
        return await this.repository.findOneBy({ id });
    }

    public async update(id: number, body: AntennaEntity): Promise<object> {
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