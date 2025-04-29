import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { AuthGuard } from "src/guards/auth.guards";
import { Request } from "express";
import { CommentDto } from "./dto/comment.dto";
import { GetCommentDto } from "./dto/getComment.dto";
import { DeleteCommentDto } from "./dto/deletecomment.dto";


@UseGuards(AuthGuard)
@Controller('comments')
export class CommentController{
    constructor(
        private readonly commentService :CommentService
    ){}


    @Post('')
    async comment(@Body() {content,parent_comment_id,postId} : CommentDto, @Req() req:Request){
        return await this.commentService.comment({postId, content,parent_comment_id},req)
    }

    @Get('')
    async getComments(@Query() {postId,parent_comment_id} : GetCommentDto){
        return await this.commentService.getComments(postId, parent_comment_id)
    }

    @Delete('')
    async deleteComment(@Body() {postId, comment_id} : DeleteCommentDto){
        return await this.commentService.deleteComment(postId,comment_id)
    }
}