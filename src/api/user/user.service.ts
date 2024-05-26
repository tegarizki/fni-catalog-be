import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MstUserEntity } from '@/shared/entity/mst-user.entity';
import { RegisterDto } from '@/shared/dto/register.dto';
import { AuthHelper } from '@/common/helper/auth.helper';
import { FindAllUserDto } from '@/shared/dto/find-all-user.dto';
import { PageDto } from '@/shared/dto/page.dto';
import { PageMetaDto } from '@/shared/dto/page-meta.dto';

@Injectable()
export class UserService {
    @InjectRepository(MstUserEntity)
    private readonly repository: Repository<MstUserEntity>;

    @Inject(AuthHelper)
    private readonly helper: AuthHelper;

    public async create(body: RegisterDto): Promise<MstUserEntity | never> {
        const { username, password,role,status, fullName, phone, email }: RegisterDto = body;

        let user = new MstUserEntity();
        user.fullName = fullName;
        user.username = username;
        user.password = this.helper.encodePassword(password);
        user.phone = phone;
        user.email = email;
        user.role = role;
        user.status = status;

        return this.repository.save(user);
        
    }

    public async findByUsername(username: string): Promise<MstUserEntity | never> {
        let res: MstUserEntity = await this.repository.findOne({ where: { username } });

        return res;
    }

    public async updateLastLogin(id: number): Promise<MstUserEntity | never> {
        const update = await this.repository.update(id, { lastLoginAt: new Date() });
        if (update.affected === 0) {
            throw new Error("User not found");
        }
        return await this.repository.findOne({ where : { id } });
    }

    public async findAll(
        filterDto: FindAllUserDto
    ): Promise<PageDto<object>> {
        
        const queryBuilder = this.repository.createQueryBuilder();
        
        if (filterDto.username) {
            queryBuilder.andWhere("LOWER(username) = :username", { vendor : filterDto.username.toLowerCase() });
        }
        queryBuilder
            .orderBy('id', filterDto.order)
            .skip(filterDto.skip)
            .take(filterDto.take);


        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();
        const pageMetaDto = new PageMetaDto(filterDto.page, filterDto.take, itemCount);

        return new PageDto(entities, pageMetaDto);
    }

    public async findOne(id: number): Promise<MstUserEntity> {
        return await this.repository.findOneBy({ id });
    }

    public async update(id: number, user: MstUserEntity): Promise<object> {
        return await this.repository.update(id, user);
    }

    public async remove(id: number): Promise<object> {
        return await this.repository.delete(id);
    }
}
 