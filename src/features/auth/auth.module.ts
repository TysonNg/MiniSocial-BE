import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { KeyStoreEntity } from '../keystore/entities/keystore.entity';
import { KeyStoreModule } from '../keystore/keystore.module';
import { RedisModule } from 'src/redis/redis.module';
import EslasticSearchModule from 'src/elasticsearch/elasticsearch.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity,KeyStoreEntity]),
    KeyStoreModule,
    RedisModule,
    EslasticSearchModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
