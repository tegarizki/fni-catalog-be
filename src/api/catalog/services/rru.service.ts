import { MstRruEntity } from "@/shared/entity/mst-rru.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class RruService {
    @InjectRepository(MstRruEntity)
    private readonly repository: Repository<MstRruEntity>;

    public async create(body: MstRruEntity): Promise<MstRruEntity> {
        return await this.repository.save(body);
    }

    public async findOne(id: number): Promise<MstRruEntity> {
        return await this.repository.findOneBy({ id });
    }

    public async update(id: number, body: MstRruEntity): Promise<object> {
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