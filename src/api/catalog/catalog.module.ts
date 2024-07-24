import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogEntity } from '@/common/entity/catalog.entity';
import { AuthModule } from '../auth/auth.module';
import { AauEntity } from '@/common/entity/aau.entity';
import { RruEntity } from '@/common/entity/rru.entity';
import { BbuEntity } from '@/common/entity/bbu.entity';
import { SoftwareEntity } from '@/common/entity/software.entity';
import { CatalogController } from './catalog.controller';
import { CatalogService } from '@/common/services/catalog.service';
import { AauService } from '@/common/services/aau.service';
import { BbuService } from '@/common/services/bbu.service';
import { RruService } from '@/common/services/rru.service';
import { SoftwareService } from '@/common/services/software.service';
import { AntennaEntity } from '@/common/entity/atenna.entity';
import { AntennaService } from '@/common/services/antenna.service';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogEntity,AauEntity,RruEntity,BbuEntity,SoftwareEntity,AntennaEntity]), AuthModule],
  controllers: [CatalogController],
  providers: [CatalogService, AauService,BbuService,RruService,SoftwareService,AntennaService]
})
export class CatalogModule {}
