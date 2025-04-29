import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PostModel } from 'src/features/posts/models/post.model';
import { UserModel } from 'src/features/users/models/user.model';
import { LikeEntity } from '../entities/like.entity';

@ObjectType()
export class LikeModel {
   
  @Field(() => ID)
  likeId: string;

  @Field(() => UserModel)
  user: UserModel;

  @Field()
  userId: string;

  @Field(() => PostModel)
  post: PostModel;

  @Field()
  postId: string;

  @Field()
  createdAt: Date;

  static fromEntity(likeEntity : LikeEntity): LikeModel{
    const likeModel = new LikeModel()
    likeModel.createdAt = likeEntity.createdAt
    likeModel.likeId = likeEntity.likeId
    likeModel.postId = likeEntity.postId
    likeModel.userId = likeEntity.userId
    likeModel.post = PostModel.fromEntity(likeEntity.post)
    likeModel.user = UserModel.fromEntity(likeEntity.user)

    return likeModel
  }
}
