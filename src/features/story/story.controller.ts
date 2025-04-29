import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guards";
import { CreateStoryDto } from "./dto/createstory.dto";
import { StoryService } from "./story.service";



@UseGuards(AuthGuard)
@Controller('story')
export class StoryController{
    constructor(
        private readonly storyService: StoryService
    ){}

    @Post('')
    async createStory(@Req() req:Request,@Body() payload: CreateStoryDto){
       return await this.storyService.createStory(req,payload)
    }

    @Get('')
    async getStories(){
       return await this.storyService.getStories()
    }
}