import { Trim } from 'class-sanitizer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class OptionDto {
    @IsString()
    public name: string;

    @IsString()
    public value: string;

    @IsString()
    public description: string;
}