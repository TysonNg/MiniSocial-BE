import { Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { LikeService } from "./like.service";
import { AuthGuard } from "src/guards/auth.guards";

@UseGuards(AuthGuard)
@Controller('/post/like')
export class LikeController{
    constructor(
        private readonly likeService:LikeService
    ){}

    @Post('/:postId')
    async like(@Param('postId') postId:string,@Req() req:Request){
        return await this.likeService.likePost(postId,req)
    }

    @Put('/:postId')
    async dislike(@Param('postId') postId: string,@Req() req: Request){
        return await this.likeService.dislike(postId,req)
    }

    @Get('/:postId')
    async likesOfPost(@Param('postId') postId: string){
        return await this.likeService.getLikesOfPost(postId)
    }

    @Get('/getUsers/:postId')
    async getUsersLikeOfPost(@Param('postId') postId: string){
        return await this.likeService.getUsersLikeOfPost(postId)
    }
}