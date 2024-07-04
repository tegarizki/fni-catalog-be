import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { VendorService } from '@/common/services/vendor.service';
import { TypeRadioService } from '@/common/services/type-radio.service';
import { JwtAuthGuard } from '@/common/guard/auth.guard';
import Responses from '@/common/helper/responses.helper';

@Controller('option')
@UseGuards(JwtAuthGuard)
export class OptionController {
    constructor(
        private readonly vendorService: VendorService,
        private readonly typeRadioService: TypeRadioService
    ) {}

    @Get()
    private async findAll(
        @Query("type") type: string
    ) {
        try{
            if (type == 'vendor') {
                return Responses("success","Ok",await this.vendorService.findOption());
            } else if(type == 'typeRadio') {
                return Responses("success","Ok",await this.typeRadioService.findOption());
            } else {
                return Responses("success","Ok",await this.vendorService.findOption());
            }
        } catch (err) {
            Logger.log("Error encountered: ", err);
            throw new InternalServerErrorException(
            Responses("failed", err),
            )
        }
    }
}
