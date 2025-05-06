import { Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { PostEntity } from '../posts/entities/post.entity';
import { Repository } from 'typeorm';
import { LikeEntity } from './entities/like.entity';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from '../users/user.service';

export class LikeService {
  constructor(
    @InjectRepository(LikeEntity)
    private likeRepository: Repository<LikeEntity>,

    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,

    private userService: UserService,
    private redisService: RedisService,
  ) {}

  async getLikesOfPost(postId: string) {
    const numOfLikes = await this.redisService.SCARD(`post:${postId}:likes`);
    console.log(numOfLikes);

    if (!numOfLikes) {
      const post = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.likes', 'like')
        .where('post.postId =:postId', { postId })
        .getOne();

      
      return post?.likes.length;
    }

    return numOfLikes;
  }

  async likePost(postId: string, @Req() req: Request) {
    const user = (req as any).user;
    const cacheUserLike = await this.redisService.SISMEMBER(`post:${postId}:likes`, user.id)
    if(cacheUserLike){
      return false
    }
    const newLike = this.likeRepository.create({
      post: { postId },
      user: { id: user.id },
    });

    await this.likeRepository.save(newLike);
    await this.redisService.SADD(`post:${postId}:likes`, newLike.userId);

    return true
  }

  async dislike(postId: string, @Req() req: Request) {
    const user = (req as any).user;
    await this.likeRepository.delete({ postId });
    const dislikeRedis = await this.redisService.SREM(
      `post:${postId}:likes`,
      user.id,
    );
    const likesOfPost = await this.getLikesOfPost(postId);
    if (likesOfPost === 0) {
      await this.redisService.delete(`post:${postId}:likes`);
    }
    if (dislikeRedis === 0) {
      return {
        message: 'You already dislike this post!',
      };
    }
    return {
      message: 'dislike successfully!',
    };
  }

  async getUsersLikeOfPost(postId: string) {
    const cacheUsers = await this.redisService.SMEMBERS(`post:${postId}:likes`);
    if (cacheUsers) {

      return {
        
        users: cacheUsers,
      };
    }

    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.likes', 'like')
      .where('post.postId =:postId', { postId })
      .getOne();
    return {
      users: post?.likes.length,
    };
  }
}
