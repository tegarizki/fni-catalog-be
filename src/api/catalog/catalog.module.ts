import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogEntity } from '@/shared/entity/catalog.entity';
import { CatalogService } from './catalog.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogEntity]), AuthModule],
  controllers: [CatalogController],
  providers: [CatalogService]
})
export class CatalogModule {}
