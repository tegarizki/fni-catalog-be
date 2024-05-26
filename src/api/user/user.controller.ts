
import { Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import { UserService } from './user.service';
import { PageDto } from '@/shared/dto/page.dto';
import { FindAllUserDto } from '@/shared/dto/find-all-user.dto';
import { MstUserEntity } from '@/shared/entity/mst-user.entity';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get("/")
    private findAll(
        @Query() dto: FindAllUserDto,
    ): Promise<PageDto<object>> {
        return null;
    }

    @Get(":id")
    private findById(
        @Param('id') id: number
    ): Promise<object> {
        return null;
    }

    @Post()
    private create(
        @Body() user: MstUserEntity
    ): Promise<object> {
        return null;
    }

    @Put(":id")
    private update(
        @Param('id') id: number,
        @Body() user: MstUserEntity
    ): Promise<object> {
        return null;
    }

    @Delete(":id")
    private delete(
        @Param('id') id: number
    ): Promise<object> {
        return null;
    }
}
