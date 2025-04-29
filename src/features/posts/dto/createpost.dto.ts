import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreatePostDto{

    @IsString()
    content: string

    @IsArray()
    @IsOptional()
    imgsUrl: string[];


}


@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  content: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  imgsUrl?: string[];
}