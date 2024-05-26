import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MstCatalogEntity } from '@/shared/entity/mst-catalog.entity';
import { AuthModule } from '../auth/auth.module';
import { MstAauEntity } from '@/shared/entity/mst-aau.entity';
import { MstRruEntity } from '@/shared/entity/mst-rru.entity';
import { MstBbuEntity } from '@/shared/entity/mst-bbu.entity';
import { MstSoftwareEntity } from '@/shared/entity/mst-software.entity';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './services/catalog.service';
import { AauService } from './services/aau.service';
import { BbuService } from './services/bbu.service';
import { RruService } from './services/rru.service';
import { SoftwareService } from './services/software.service';

@Module({
  imports: [TypeOrmModule.forFeature([MstCatalogEntity,MstAauEntity,MstRruEntity,MstBbuEntity,MstSoftwareEntity]), AuthModule],
  controllers: [CatalogController],
  providers: [CatalogService, AauService,BbuService,RruService,SoftwareService]
})
export class CatalogModule {}
