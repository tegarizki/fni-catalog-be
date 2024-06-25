import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TypeRadioEntity } from "../entity/type-radio.entity";
import { OptionDto } from "../dto/option.dto";

@Injectable()
export class TypeRadioService {
    @InjectRepository(TypeRadioEntity)
    private readonly repository: Repository<TypeRadioEntity>;
    
    public async findOption() {
        const data = await this.repository.find();

        const result = data.map(x =>  {
            const options = new OptionDto();
            options.name = x.description;
            options.value = x.typeRadio;
            options.description = "";

            return options;
        });

        return result;
    }
}