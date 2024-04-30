import { ConflictException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { MstUserEntity } from '@/shared/entity/mst-user.entity';
import { AuthHelper } from '@/common/helper/auth.helper';
import { UserService } from '../user/user.service';
import  responses  from "@/common/helper/responses.helper";
import { LoginDto } from '@/shared/dto/login.dto';
import { RegisterDto } from '@/shared/dto/register.dto';

@Injectable()
export class AuthService {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  @Inject(UserService)
  private readonly userService: UserService;

  public async register(body: RegisterDto): Promise<object> {
    const username = body.username;
    if (await this.userService.findByUsername(username)) {
      throw new ConflictException(
        responses(HttpStatus.CONFLICT, "Username already exist"),
      );
    }

    try {
      if (this.userService.create(body)) {
        return responses(HttpStatus.OK, "Create user successfullly")
      }
    } catch (err) {
      Logger.log("Error encountered: ", err);
      throw new InternalServerErrorException(
        responses(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong, please try again later"),
      )
    }
  }

  public async login(body: LoginDto): Promise<object> {
    const { username, password }: LoginDto = body;
    const user: MstUserEntity = await this.userService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(
        responses(HttpStatus.NOT_FOUND, "User doesn't exist"),
      );
    }


    const isPasswordValid: boolean = this.helper.isPasswordValid(password, user.password);
    if (!isPasswordValid) {
      return responses(HttpStatus.NOT_FOUND, "Username or password invalid");
    }

    try {
      this.userService.updateLastLogin(user.id)
    } catch(err) {
      Logger.log("Error ecnountered: ", err);
      throw new InternalServerErrorException(
        responses(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong, please try again later"),
      );
    }

    return responses(HttpStatus.OK, "Success",{
      "token": this.helper.generateToken(user)
    });
  }
}