import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from "@/common/helper/env.helper";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/config/typeorm.config';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { CatalogModule } from './api/catalog/catalog.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath, isGlobal: true}),
    TypeOrmModule.forRootAsync({useClass: TypeOrmConfigService}),
    AuthModule,
    UserModule,
    CatalogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
