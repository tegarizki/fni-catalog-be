import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/shared/entity/user.entity';
import { RegisterDto } from '@/shared/dto/register.dto';
import { AuthHelper } from '@/common/helper/auth.helper';

@Injectable()
export class UserService {
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>;

    @Inject(AuthHelper)
    private readonly helper: AuthHelper;

    public async create(body: RegisterDto): Promise<UserEntity | never> {
        const { username, password,role,status, fullName, phone, email }: RegisterDto = body;

        let user = new UserEntity();
        user.fullName = fullName;
        user.username = username;
        user.password = this.helper.encodePassword(password);
        user.phone = phone;
        user.email = email;
        user.role = role;
        user.status = status;

        return this.repository.save(user);
        
    }

    public async findByUsername(username: string): Promise<UserEntity | never> {
        let res: UserEntity = await this.repository.findOne({ where: { username } });

        return res;
    }

    public async updateLastLogin(id: number): Promise<UserEntity | never> {
        const update = await this.repository.update(id, { lastLoginAt: new Date() });
        if (update.affected === 0) {
            throw new Error("User not found");
        }
        return await this.repository.findOne({ where : { id } });
    }
}
 