import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';
import { UpdatePostDto } from './dto/updatepost.dto';
import {  CreatePostDto } from './dto/createpost.dto';


@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,

    private readonly redisService: RedisService,
  ) {}

  async createPost(payload: CreatePostDto, @Req() req: Request) {
    const { content, imgsUrl } = payload;
    const user = (req as any).user;
    const newPost = this.postRepository.create({
      content,
      imgsUrl,
      userId: user.id,
    });
    await this.postRepository.save(newPost);
    await this.redisService.set(
      `user:${user.id}:post:${newPost.postId}`,
      JSON.stringify(newPost),
    );
    await this.redisService.delete('allPosts')
    return { newPost };
  }

  async updatePost(
    payload: UpdatePostDto,
    postId: string,
    @Req() req: Request,
  ) {
    const { content, imgsUrl } = payload;
    const user = (req as any).user;
    await this.postRepository.update(postId, {
      content,
      imgsUrl,
    });
    const foundPost = await this.postRepository.findOne({ where: { postId } ,relations: ['user','likes','comments']});
    if (!foundPost)
      throw new NotFoundException('Not found post after updated!');
    await this.redisService.set(
      `user:${user.id}:post:${postId}`,
      JSON.stringify(foundPost),
    );

    return {
      updatedPost: foundPost,
    };
  }

  async deletePost(postId: string, @Req() req: Request) {
    const user = (req as any).user;
    const foundPost = await this.postRepository.findOne({ where: { postId } });
    if (!foundPost) throw new NotFoundException('Not found post!');
    await this.redisService.delete(`user:${user.id}:post:${foundPost.postId}`);
    await this.postRepository.delete(postId);
    await this.redisService.delete('allPosts')
    return {
      message: 'Delete post successfully!',
    };
  }


  async findPostById({postId,userId}: {postId: string, userId: string}){
    const cachePost = await this.redisService.get(`user:${userId}:post:${postId}`)
    if(cachePost){
      console.log(cachePost);
      
      return JSON.parse(cachePost);
    }
    const foundPost = await this.postRepository.findOne({where: {postId},relations: ['user','likes','comments']})
    
    if(!foundPost) throw new NotFoundException('Not found post!')
    return foundPost
  }

  async getAllPosts(limit=3,cursor?: Date): Promise<PostEntity[]> {

    if(!cursor){
      const cacheAllPosts = await this.redisService.get('allPosts')
      if(cacheAllPosts){      
        return JSON.parse(cacheAllPosts)
      }
    }

    const queryBuilder = this.postRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.user','user')
    .leftJoinAndSelect('post.likes','like')
    .leftJoinAndSelect('post.comments','comment')
    .orderBy('post.createdAt','DESC')
    .take(limit)

    if(cursor){
      const cursorDate = new Date(cursor)
      queryBuilder.where('post.createdAt < :cursorDate',{cursorDate})
    }

    const allPosts = await queryBuilder.getMany()
    console.log('allPost',allPosts);
    
    if(!cursor){
      await this.redisService.set('allPosts', JSON.stringify(allPosts))
    }
    
    return allPosts;
  }

  async getAllPostByUserId(userId: string){
    // const cacheAllPostsOfUser = await this.redisService.scanKeysAndValueSorted(`user:${userId}:post:*`)
    // if(cacheAllPostsOfUser){
      
    //   return cacheAllPostsOfUser
    // }
    const queryBuilder = this.postRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.user','user')
    .leftJoinAndSelect('post.likes','like')
    .leftJoinAndSelect('post.comments','comment')
    .where('post.userId = :userId',{userId})
    .orderBy('post.createdAt','DESC')
  
    const allPostsOfUser = await queryBuilder.getMany()
    console.log(allPostsOfUser);
    return allPostsOfUser 
  }


 
}
