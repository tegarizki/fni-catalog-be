import { JwtAuthGuard } from "@/common/guard/auth.guard";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { FindAllCatalogDto } from "@/shared/dto/find-all-catalog.dto";
import { PageDto } from "@/shared/dto/page.dto";

@Controller('catalog')
@UseGuards(JwtAuthGuard)
export class CatalogController {
    constructor(private readonly _catalogService: CatalogService) {}

    @Get()
    private findAll(
        @Query() dto: FindAllCatalogDto,
    ): Promise<PageDto<object>> {
        return this._catalogService.getCatalog(dto);
    }

}