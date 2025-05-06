// elasticsearch.service.ts
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { SearchUserDto } from './dto/searchUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/features/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ElasticsearchService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async searchUserByUsername(
    payload: SearchUserDto,
  ): Promise<AxiosResponse<any>> {
    try {
      const response = await axios.post(
        `${process.env.ELASTICSEARCH_URL ?? 'http://elasticsearch:9200'}/users/_search`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const result = response.data.hits.hits.map((hit: any) => hit._source);
      return result;
    } catch (error) {
      console.error('Error calling Elasticsearch:', error);
      throw error;
    }
  }

  @Cron('* * * * *')
  async syncUsersToElasticsearch() {
    try {
      const users = await this.userRepository.find();
      
      for (const user of users) {
        await axios.put(
          `${process.env.ELASTICSEARCH_URL}/users/_doc/${user.id}`,
          {
            id: user.id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            avatarurl: user.avatarUrl,
            createdAt: user.createdAt,
          },
        );
      }
    } catch (error) {
      console.log('error syncUser',error);
      
    }
  }
}
