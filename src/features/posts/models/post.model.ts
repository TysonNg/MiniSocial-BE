import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CommentModel } from 'src/features/comments/models/comment.model';
import { LikeModel } from 'src/features/likes/models/like.model';
import { UserModel } from 'src/features/users/models/user.model';
import { PostEntity } from '../entities/post.entity';

@ObjectType()
export class PostModel {
  @Field(() => ID)
  postId: string;

  @Field(() => UserModel)
  user: UserModel;

  @Field()
  userId: string;

  @Field()
  content: string;

  @Field(() => [String])
  imgsUrl: string[];

  @Field(() => [LikeModel])
  likes: LikeModel[];

  @Field(() => [CommentModel])
  comments: CommentModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  static fromEntity(postEntity: PostEntity): PostModel {
    const postModel = new PostModel();
    if (postEntity) {
      postModel.postId = postEntity.postId;
      postModel.content = postEntity.content;
      postModel.imgsUrl = postEntity.imgsUrl;
      postModel.createdAt = postEntity.createdAt;
      postModel.updatedAt = postEntity.updatedAt;
      postModel.likes = postEntity.likes?.map((like) =>
        LikeModel.fromEntity(like),
      );
      postModel.comments = postEntity.comments?.map((comment) =>
        CommentModel.fromEntity(comment),
      );
      postModel.user = UserModel.fromEntity(postEntity.user);
      postModel.userId = postEntity.userId;
    }
    return postModel;

  }
}
