import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/createpost.dto";
import { AuthGuard } from "src/guards/auth.guards";
import { Request } from "express";
import { UpdatePostDto } from "./dto/updatepost.dto";
import { TranformInterceptor } from "src/tranform.interceptor";


@UseGuards(AuthGuard)
@UseInterceptors(TranformInterceptor)
@Controller('post')
export class PostController{
    constructor(
        private readonly postService : PostService
    ){}

    @Post('')
    async createPost(@Body() post: CreatePostDto, @Req() req: Request){
        return await this.postService.createPost(post,req)
    }

    @Put('/update/:postId')
    async updatePost(@Param('postId') postId:string, @Body() payload:UpdatePostDto,@Req() req:Request){
        return await this.postService.updatePost(payload,postId,req)
    }

    @Delete('/delete/:postId')
    async delete(@Param('postId') postId: string, @Req() req: Request){
        return await this.postService.deletePost(postId,req)
    }

    @Get('')
    async getAllPosts(@Query(){limit,cursor}:{limit: number, cursor?:string}){
        let cursorDate:Date | undefined
        if(cursor){
            cursorDate = new Date(cursor)
        }
        return await this.postService.getAllPosts(limit,cursorDate)
    }

    @Get('/find')
    async findPostById(@Query(){postId, userId}: {postId: string, userId: string}){
        return await this.postService.findPostById({postId,userId})
    }

    @Get('allPosts/:userId')
    async getAllPostsOfUser(@Param('userId') userId: string){
        return await this.postService.getAllPostByUserId(userId)
    }
}