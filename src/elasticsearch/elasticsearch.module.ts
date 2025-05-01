import { Module } from '@nestjs/common';
import EslasticsearchService from './elasticsearch.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/features/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),ScheduleModule.forRoot()],
  providers: [EslasticsearchService],
  exports: [EslasticsearchService],
})
export default class EslasticSearchModule {}
