import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { LikeEntity } from './entities/like.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserModule } from '../users/user.module';
import { KeyStoreModule } from '../keystore/keystore.module';
import { PostEntity } from '../posts/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      LikeEntity,
      PostEntity
    ]),
    RedisModule,
    UserModule,
    KeyStoreModule,
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
