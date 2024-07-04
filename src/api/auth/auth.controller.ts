import { Body, Controller, Post, ClassSerializerInterceptor, UseInterceptors, Inject, Logger, InternalServerErrorException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { RegisterDto } from '@/common/dto/register.dto';
import { LoginDto } from '@/common/dto/login.dto';
import Responses from '@/common/helper/responses.helper';
import { AuthHelper } from '@/common/helper/auth.helper';
import { UserService } from '@/common/services/user.service';
import { UserEntity } from '@/common/entity/user.entity';

@Controller('auth')
export class AuthController {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  @Inject(UserService)
  private readonly userService: UserService;

  @Post('sign-up')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() body: RegisterDto): Promise<object> {
    try{
      if (await this.userService.findByUsername(body.username)) {
        throw new BadRequestException("Username already exist");
      }
      
      if(await this.userService.create(body) == null) {
        throw new BadRequestException("Failed to create user");
      }

      return Responses("success","Create user successfullly",null);
    } catch (err) {
      Logger.log("Error encountered: ", err);
      return Responses("failed", err.message, null);
    }
  }

  @Post('sign-in')
  async login(@Body() body: LoginDto): Promise<object> {
    try{
      const { username, password }: LoginDto = body;
      const user: UserEntity = await this.userService.findByUsername(username);
  
      if (!user) {
        throw new NotFoundException("User doesn't exist");
      }
  
      const isPasswordValid: boolean = this.helper.isPasswordValid(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException("Username or password invalid");
      }
  
      this.userService.updateLastLogin(user.id)

      return Responses("success","Ok",this.helper.generateToken(user));
    } catch (err) {
      Logger.log("Error encountered: ", err);
      return Responses("failed", err.message, null);
    }
  }
}