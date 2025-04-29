import { IsOptional, IsString } from "class-validator"

export class GetCommentDto{

    @IsString()
    postId: string

    @IsOptional()
    parent_comment_id: string
}