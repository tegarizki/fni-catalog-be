import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionController } from './option.controller';
import { TypeRadioEntity } from '@/common/entity/type-radio.entity';
import { VendorEntity } from '@/common/entity/vendor.entity';
import { VendorService } from '@/common/services/vendor.service';
import { TypeRadioService } from '@/common/services/type-radio.service';

@Module({
  imports: [TypeOrmModule.forFeature([TypeRadioEntity, VendorEntity])],
  controllers: [OptionController],
  providers: [VendorService, TypeRadioService]
})
export class OptionModule {}