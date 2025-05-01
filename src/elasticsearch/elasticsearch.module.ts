import { Module } from '@nestjs/common';
import EslasticsearchService from './elasticsearch.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [EslasticsearchService],
  exports: [EslasticsearchService],
})
export default class EslasticSearchModule {}
