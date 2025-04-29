import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  imgsUrl: string[];
}
