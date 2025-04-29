import {
  BadRequestException,
  Injectable,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';
import EslasticsearchService from 'src/elasticsearch/elasticsearch.service';
import { UserModel } from './models/user.model';
import { PostModel } from '../posts/models/post.model';
import { UpdateUserDto } from './dto/updateUser.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private redisService: RedisService,
    private eslasticsearchService: EslasticsearchService
  ) {}

  async findByUserId(userId: string){
    return await this.userRepository.findOne({where: {id: userId}})
  }

  async follow(@Req() req:Request, userIdToFollow:string){
    const user = (req as any).user
   
    
    const isAlreadyFollow = await this.redisService.SISMEMBER(`user:${user.id}:following`,JSON.stringify(userIdToFollow))
  
    if(isAlreadyFollow === true){
      return {message: "You already followed this user!!!"}
    }

    const foundUser = await this.userRepository.findOne({where: {id: user.id}})
    const userTargetFollow = await this.userRepository.findOne({where: {id: userIdToFollow}})

    if(foundUser && userTargetFollow){

      await this.userRepository.createQueryBuilder()
      .relation(UserEntity,'following')
      .of(foundUser.id)
      .add(userTargetFollow)

     
      await this.userRepository.createQueryBuilder()
      .relation(UserEntity,'followers')
      .of(userTargetFollow.id)
      .add(foundUser)

      await this.redisService.SADD(`user:${foundUser.id}:following`,JSON.stringify(userTargetFollow.id))
      await this.redisService.SADD(`user:${userTargetFollow.id}:followers`,JSON.stringify(foundUser.id))

      return {message: `You are following ${userTargetFollow?.name}`}
    }
    return new BadRequestException("User not valid!")
  }


  async unfollow(@Req() req:Request, userIdToUnFollow:string){
    const user = (req as any).user
    const isAlreadyFollow = await this.redisService.SISMEMBER(`user:${user.id}:following`,JSON.stringify(userIdToUnFollow))
    if(isAlreadyFollow === false){
      return {message: "You already unfollowed user!!!"}
    }
    const foundUser = await this.userRepository.findOne({where: {id: user.id}})
    const userTargetUnFollow = await this.userRepository.findOne({where: {id: userIdToUnFollow}})
    
    if(foundUser && userTargetUnFollow){

      await this.userRepository.createQueryBuilder()
      .relation(UserEntity,'following')
      .of(foundUser.id)
      .remove(userTargetUnFollow)

      await this.userRepository.createQueryBuilder()
      .relation(UserEntity,'followers')
      .of(userTargetUnFollow.id)
      .remove(foundUser)

      await this.redisService.SREM(`user:${foundUser.id}:following`, JSON.stringify(userTargetUnFollow.id))
      await this.redisService.SREM(`user:${userTargetUnFollow.id}:followers`, JSON.stringify(foundUser.id))

      return {message: `You unfollow ${userTargetUnFollow?.name}`}
    }
    return new BadRequestException("User not valid!")
  }

  async getFollowingOfUser(userIdToGet:string){
    const cacheUsersFollowing = await this.redisService.SMEMBERS(`user:${userIdToGet}:following`)
    if(cacheUsersFollowing){
      const cacheUsersFollowingParse = cacheUsersFollowing.map(user => JSON.parse(user))
      return {usersId: cacheUsersFollowingParse}
    }
    const usersFollowing = await this.userRepository.findOne({
      where:{id: userIdToGet},
      relations: ['following']
    })

    const users: string[] = []
    usersFollowing?.following.forEach( async(user) => {
      if((await this.redisService.SISMEMBER(`user:${userIdToGet}:following`,user.id)) === false){
        await this.redisService.SADD(`user:${userIdToGet}:following`,JSON.stringify(user.id))
      }
      users.push(user.id)
    })
    return {users}
    
  }

  async getFollowersOfUser(userIdToGet:string){
    const cacheUsersFollowers = await this.redisService.SMEMBERS(`user:${userIdToGet}:followers`)

    if(cacheUsersFollowers){
      const cacheUsersFollowersParse = cacheUsersFollowers.map(user => JSON.parse(user))
      return {users: cacheUsersFollowersParse}
    }
    
    const usersFollowers = await this.userRepository.findOne({
      where:{id: userIdToGet},
      relations: ['followers']
    })

    const users:string[] = []

    usersFollowers?.followers.forEach( async(user) => {
      if((await this.redisService.SISMEMBER(`user:${userIdToGet}:followers`,user.id)) === false){
        await this.redisService.SADD(`user:${userIdToGet}:followers`,JSON.stringify(user.id))
      }
      users.push(user.id)
    })
    return {users}
  }

  async getMyFollowers(@Req() req:Request){
    const user = (req as any).user
    const cacheUsersFollowers = await this.redisService.SMEMBERS(`user:${user.id}:followers`)
    if(cacheUsersFollowers){
      const cacheUsersFollowersParse = cacheUsersFollowers.map(user => JSON.parse(user))
      return {users: cacheUsersFollowersParse}
    }

    const usersFollowers = await this.userRepository.findOne({
      where:{id: user.id},
      relations: ['followers']
    })

    const users:string[] = []

    usersFollowers?.followers.forEach( async(user) => {
      if((await this.redisService.SISMEMBER(`user:${user.id}:followers`,user.id)) === false){
        await this.redisService.SADD(`user:${user.id}:followers`,JSON.stringify(user.id))
      }
      users.push(user.id)
    })
    return {users}
  }

  async getMyFollowing(@Req() req:Request){
    const user = (req as any).user
    const cacheUsersFollowing = await this.redisService.SMEMBERS(`user:${user.id}:following`)
    if(cacheUsersFollowing){
      const cacheUsersFollowersParse = cacheUsersFollowing.map(user => JSON.parse(user))
      return {users: cacheUsersFollowersParse}
    }

    const usersFollowing = await this.userRepository.findOne({
      where:{id: user.id},
      relations: ['following']
    })

    const users:string[] = []

    usersFollowing?.followers.forEach( async(user) => {
      if((await this.redisService.SISMEMBER(`user:${user.id}:followers`,user.id)) === false){
        await this.redisService.SADD(`user:${user.id}:followers`,JSON.stringify(user.id))
      }
      users.push(user.id)
    })
    return {users}
  }

  async findUserById(userId: string){
    return await this.userRepository.findOne({where: {id: userId}})
  }

  async searchUser(name:string){
    const user = await this.eslasticsearchService.searchUserByUsername({
      _source: ['name','bio','avatarurl','id'],
      query: {
        match:{
          name:{
            query: name,
            fuzziness: 'AUTO'
          }
        }
      }
    })

    return user
  }


  async updateUser(req: Request, payload: UpdateUserDto) {
    const user = (req as any).user
    
    const updatedUser = await this.userRepository
    .createQueryBuilder()
    .update(UserEntity)
    .where('id = :id',{id: user.id})
    .set({name: payload.userName,bio: payload.bio, avatarUrl: payload.imgUrl})
    .execute()

    return updatedUser
  }

  // private transformToUserModel(userEntity: UserEntity): UserModel {
  //   const userModel = new UserModel();
  //   userModel.userId = userEntity.userId;
  //   userModel.username = userEntity.username;
  //   // Chuyển đổi posts từ PostEntity sang PostModel
  //   userModel.posts = userEntity.posts.map(post => {
  //     const postModel = new PostModel();
  //     postModel.postId = post.postId;
  //     postModel.content = post.content;
  //     postModel.user = post.user;  // Chuyển đối tượng UserEntity thành UserModel
  //     postModel.imgsUrl = post.imgsUrl;
  //     postModel.createdAt = post.createdAt;
  //     postModel.updatedAt = post.updatedAt;
  //     return postModel;
  //   });
  //   return userModel;
  // }

 
}
