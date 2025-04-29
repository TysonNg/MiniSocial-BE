import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "./entities/comment.entity";
import { PostEntity } from "../posts/entities/post.entity";
import { KeyStoreModule } from "../keystore/keystore.module";
import { RedisModule } from "src/redis/redis.module";


@Module({
    imports: [TypeOrmModule.forFeature([CommentEntity, PostEntity]),
        KeyStoreModule,
        RedisModule
    ],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService]
})


export class CommentModule{}