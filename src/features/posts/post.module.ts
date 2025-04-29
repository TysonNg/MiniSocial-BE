import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/user.entity";
import { LikeEntity } from "../likes/entities/like.entity";
import { CommentEntity } from "../comments/entities/comment.entity";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostEntity } from "./entities/post.entity";
import { KeyStoreModule } from "../keystore/keystore.module";
import { RedisModule } from "src/redis/redis.module";
// import { PostResolver } from "./post.resolver";

@Module({
    imports:[
        TypeOrmModule.forFeature([UserEntity,LikeEntity,CommentEntity, PostEntity]),
        KeyStoreModule,
        RedisModule
    ],
    controllers:[PostController],
    providers: [PostService],
    exports: [PostService]
})

export class PostModule{}