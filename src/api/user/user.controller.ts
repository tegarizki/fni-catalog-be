
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
    private async findAll(
        @Query() filter: FindAllUserDto,
    ): Promise<PageDto<object>> {
        return await this.userService.findAll(filter);
    }

    @Get(":id")
    private async findById(
        @Param('id') id: number
    ): Promise<object> {
        return await this.findById(id);
    }

    @Post()
    private async create(
        @Body() user: MstUserEntity
    ): Promise<object> {
        return await this.create(user);
    }

    @Put(":id")
    private async update(
        @Param('id') id: number,
        @Body() user: MstUserEntity
    ): Promise<object> {
        return await this.update(id, user);
    }

    @Delete(":id")
    private async delete(
        @Param('id') id: number
    ): Promise<object> {
        return await this.delete(id);
    }
}
