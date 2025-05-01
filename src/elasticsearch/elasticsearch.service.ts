// elasticsearch.service.ts
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { SearchUserDto } from './dto/searchUser.dto';

@Injectable()
export default class EslasticsearchService {
  async searchUserByUsername(payload: SearchUserDto): Promise<AxiosResponse<any>> {
    try {
      const response = await axios.post(`${process.env.ELASTICSEARCH_URL?? 'http://elasticsearch:9200/users_v2/_search'}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = response.data.hits.hits.map((hit: any) => hit._source);
      return result;

    } catch (error) {
      console.error('Error calling Elasticsearch:', error);
      throw error;
    }
  }
}
