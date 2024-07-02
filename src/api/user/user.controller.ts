
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { UserService } from '@/common/services/user.service';
import { PageDto } from '@/common/dto/page.dto';
import { FindAllUserDto } from '@/common/dto/find-all-user.dto';
import { UserEntity } from '@/common/entity/user.entity';
import { JwtAuthGuard } from '@/common/guard/auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
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
        @Body() user: UserEntity
    ): Promise<object> {
        return await this.create(user);
    }

    @Put(":id")
    private async update(
        @Param('id') id: number,
        @Body() user: UserEntity
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
