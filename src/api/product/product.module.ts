import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MstCatalogEntity } from '@/shared/entity/mst-catalog.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MstAauEntity } from '@/shared/entity/mst-aau.entity';
import { MstRruEntity } from '@/shared/entity/mst-rru.entity';
import { MstBbuEntity } from '@/shared/entity/mst-bbu.entity';
import { MstSoftwareEntity } from '@/shared/entity/mst-software.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MstCatalogEntity,MstAauEntity,MstRruEntity,MstBbuEntity,MstSoftwareEntity]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
