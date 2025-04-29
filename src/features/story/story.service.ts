import { Injectable } from '@nestjs/common';
import { StoryEntity } from './entities/story.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoryDto } from './dto/createstory.dto';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private storyRepository: Repository<StoryEntity>,
  ) {}

  async createStory(req: Request, payload: CreateStoryDto) {
    const { storyUrl } = payload;
    const user = (req as any).user;
    const newStory = this.storyRepository.create({
      storyUrl,
      userId: user.id,
    });

    await this.storyRepository.save(newStory);
    return newStory;
  }

  async getStories() {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const queryBuilder = this.storyRepository
      .createQueryBuilder('story')
      .where('story.createdAt > :twentyFourHoursAgo', { twentyFourHoursAgo })
      .leftJoinAndSelect('story.user', 'user')
      .orderBy('story.createdAt','DESC')

      
    return queryBuilder.getMany();
  }
}
