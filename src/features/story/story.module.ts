import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/user.entity";
import { KeyStoreModule } from "../keystore/keystore.module";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";
import { StoryEntity } from "./entities/story.entity";


@Module({
    imports:[
        TypeOrmModule.forFeature([UserEntity,StoryEntity]),
        KeyStoreModule,
    ],
    controllers: [StoryController],
    providers:[StoryService],
    exports: [StoryService]
})

export class StoryModule{}