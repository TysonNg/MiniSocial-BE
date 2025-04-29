import { Module } from '@nestjs/common';
import EslasticsearchService from './elasticsearch.service';

@Module({
  providers: [EslasticsearchService],
  exports: [EslasticsearchService],
})
export default class EslasticSearchModule {}
