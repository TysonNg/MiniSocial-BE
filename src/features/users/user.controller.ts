import { Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import {UserService} from './user.service'
import { AuthGuard } from 'src/guards/auth.guards';
import { Request } from 'express';
import { UpdateUserDto } from './dto/updateUser.dto';



@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @UseGuards(AuthGuard)
    @Post('/follow/:userIdToFollow')
    async follow(@Req() req:Request, @Param('userIdToFollow') userIdToFollow:string){
        return await this.userService.follow(req,userIdToFollow)
    }
   
    @UseGuards(AuthGuard)
    @Post('/unfollow/:userIdToUnFollow')
    async unfollow(@Req() req:Request, @Param('userIdToUnFollow') userIdToUnFollow:string){
        return await this.userService.unfollow(req,userIdToUnFollow)
    }

    @UseGuards(AuthGuard)
    @Get('/getFollowingUser/:userId')
    async getFollowingOfUser(@Param('userId') userId:string){
        return await this.userService.getFollowingOfUser(userId)
    }

    @UseGuards(AuthGuard)
    @Get('/getFollowersUser/:userId')
    async getFollowersOfUser(@Param('userId') userId:string){
        return await this.userService.getFollowersOfUser(userId)
    }

    @UseGuards(AuthGuard)
    @Get('/myFollowers')
    async getMyFollowers(@Req() req:Request){
        return await this.userService.getMyFollowers(req)
    }

    @UseGuards(AuthGuard)
    @Get('/myFollowing')
    async getMyFollowing(@Req() req:Request){
        return await this.userService.getMyFollowing(req)
    }

    @Get('/search/:name')
    async searchUser(@Param('name') name:string){
        return await this.userService.searchUser(name)
    }
    
    @UseGuards(AuthGuard)
    @Get('/find/:userId')
    async findUserById(@Param('userId') userId: string){
        return await this.userService.findByUserId(userId)
    }

    @UseGuards(AuthGuard)
    @Post('/update')
    async updateUser(@Req() req:Request, @Body() payload: UpdateUserDto){
        return await this.userService.updateUser(req,payload)
    }
}
