import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/features/users/entities/user.entity';
import { ElasticsearchService } from './elasticsearch.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),ScheduleModule.forRoot()],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticSearchModule {}
