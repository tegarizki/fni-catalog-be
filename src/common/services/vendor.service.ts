import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TypeRadioEntity } from "../entity/type-radio.entity";
import { OptionDto } from "../dto/option.dto";
import { VendorEntity } from "../entity/vendor.entity";

@Injectable()
export class VendorService {
    @InjectRepository(VendorEntity)
    private readonly repository: Repository<VendorEntity>;
    
    public async findOption() {
        const data = await this.repository.find();

        const result = data.map(x =>  {
            const options = new OptionDto();
            options.name = x.vendor;
            options.value = x.vendor;
            options.description = "";

            return options;
        });

        return result;
    }
}