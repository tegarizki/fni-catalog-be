import { JwtAuthGuard } from "@/common/guard/auth.guard";
import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { FindAllCatalogDto } from "@/shared/dto/find-all-catalog.dto";
import { PageDto } from "@/shared/dto/page.dto";
import { ProductService } from "./product.service";

@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) {}

    @Get('catalog')
    private findCatalog(
        @Query() dto: FindAllCatalogDto,
    ): Promise<PageDto<object>> {
        return this.productService.findCatalog(dto);
    }

    @Get(':id')
    private findProduct(
        @Param('id') id: number
    ): Promise<object> {
        return this.productService.findProduct(id);
    }
}