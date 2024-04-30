import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from "@/common/helper/env.helper";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/config/typeorm.config';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductModule } from './api/product/product.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'public'),
      serveRoot: '/public'
    }),
    ConfigModule.forRoot({envFilePath, isGlobal: true}),
    TypeOrmModule.forRootAsync({useClass: TypeOrmConfigService}),
    AuthModule,
    UserModule,
    ProductModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
