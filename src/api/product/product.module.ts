import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MstCatalogEntity } from '@/shared/entity/mst-catalog.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MstAauEntity } from '@/shared/entity/mst-aau.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MstCatalogEntity,MstAauEntity]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
