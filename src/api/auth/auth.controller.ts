import { Body, Controller, Post, ClassSerializerInterceptor, UseInterceptors, Inject } from '@nestjs/common';
import { AuthService } from '@/common/services/auth.service';
import { RegisterDto } from '@/common/dto/register.dto';
import { LoginDto } from '@/common/dto/login.dto';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @Post('sign-up')
  @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: RegisterDto): Promise<object> {
    return this.service.register(body);
  }

  @Post('sign-in')
  private login(@Body() body: LoginDto): Promise<object> {
    return this.service.login(body);
  }
}