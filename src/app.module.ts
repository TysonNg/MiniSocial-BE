import { Module } from '@nestjs/common';
import { UserModule } from './features/users/user.module';
import { DatabaseModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './db/db.validation';
import { KeyStoreModule } from './features/keystore/keystore.module';
import { RedisModule } from './redis/redis.module';
import { PostModule } from './features/posts/post.module';
import { AuthModule } from './features/auth/auth.module';
import { LikeModule } from './features/likes/like.module';
import { CommentModule } from './features/comments/comment.module';
import { ChatModule } from './features/chat/chat.module';
import ElasticSearchModule from './elasticsearch/elasticsearch.module';
import { StoryModule } from './features/story/story.module';
// import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    UserModule,
    KeyStoreModule,
    RedisModule,
    PostModule,
    AuthModule,
    LikeModule,
    CommentModule,
    ChatModule,
    ElasticSearchModule,
    StoryModule
    // GraphqlModule
  ],
})
export class AppModule {}
