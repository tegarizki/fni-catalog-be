import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MstUserEntity } from '@/shared/entity/mst-user.entity';
import { AuthHelper } from '@/common/helper/auth.helper';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([MstUserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthHelper, JwtService]
})
export class UserModule {}