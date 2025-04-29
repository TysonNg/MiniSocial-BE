import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto{

    @Transform(({ value }) => value === '' ? null : value)
    @IsOptional()
    @IsString()
    imgUrl: string;

    @Transform(({ value }) => value === '' ? null : value)
    @IsOptional()
    @IsString()
    userName: string;

    @Transform(({ value }) => value === '' ? null : value)
    @IsOptional()
    @IsString()
    bio: string;

}