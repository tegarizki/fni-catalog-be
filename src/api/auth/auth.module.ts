import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@/common/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthHelper } from '@/common/helper/auth.helper';
import { AuthService } from '@/common/services/auth.service';
import { JwtStrategy } from '@/common/strategy/jwt.strategy';
import { UserService } from '@/common/services/user.service';
import { UserModule } from '@/api/user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_KEY'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, JwtStrategy, UserService],
})
export class AuthModule {}