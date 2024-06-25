import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '@/common/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/common/entity/user.entity';
import { AuthHelper } from '@/common/helper/auth.helper';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthHelper, JwtService]
})
export class UserModule {}