import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { KeyStoreModule } from '../keystore/keystore.module';
import { RedisModule } from 'src/redis/redis.module';
import EslasticSearchModule from 'src/elasticsearch/elasticsearch.module';


@Module({
    imports:[
        TypeOrmModule.forFeature([UserEntity]),
        KeyStoreModule,
        RedisModule,
        EslasticSearchModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
