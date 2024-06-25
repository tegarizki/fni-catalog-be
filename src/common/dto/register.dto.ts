import { Trim } from 'class-sanitizer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    public readonly username: string;

    @IsString()
    @MinLength(5)
    public readonly password: string;
    
    @IsString()
    public readonly fullName: string;
    
    @IsString()
    public readonly phone: string;
    
    @IsString()
    public readonly email: string;
    
    @IsString()
    public readonly role: string;
    
    @IsString()
    public readonly status: string;
}
