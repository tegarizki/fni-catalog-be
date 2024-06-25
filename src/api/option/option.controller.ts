
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { VendorService } from '@/common/services/vendor.service';
import { TypeRadioService } from '@/common/services/type-radio.service';
import { JwtAuthGuard } from '@/common/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('option')
@ApiTags('option')
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
        if (type == 'vendor') {
            return await this.vendorService.findOption();
        } else if(type == 'typeRadio') {
            return await this.typeRadioService.findOption();
        } else {
            return [];
        }
    }
}
