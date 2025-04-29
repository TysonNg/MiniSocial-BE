import { IsOptional, IsString } from "class-validator";

export class CommentDto{
    @IsString()
    postId: string;

    @IsOptional()
    parent_comment_id: string | null;
    
    @IsString()
    content: string
}