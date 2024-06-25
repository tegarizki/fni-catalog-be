import { Trim } from 'class-sanitizer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    public readonly username: string;

    @IsString()
    public readonly password: string;
}