import { IsString } from "class-validator";

export class DeleteCommentDto{
    
    @IsString()
    postId: string;

    @IsString()
    comment_id: string;
}