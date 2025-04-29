import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PostModel } from 'src/features/posts/models/post.model';
import { UserModel } from 'src/features/users/models/user.model';
import { CommentEntity } from '../entities/comment.entity';

@ObjectType()
export class CommentModel {    
  @Field(() => ID)
  commentId: string;

  @Field(() => UserModel)
  user: UserModel;

  @Field()
  userId: string;

  @Field(() => PostModel)
  post: PostModel;

  @Field()
  postId: string;

  @Field()
  content: string;

  @Field()
  comment_left: number;

  @Field()
  comment_right: number;

  @Field(() => CommentModel, { nullable: true })
  parent_comment?: CommentModel;

  @Field({ nullable: true })
  parent_comment_id?: string;

  @Field()
  isDeleted: boolean;

  @Field()
  createdAt: Date;


  static fromEntity(commentEntity : CommentEntity) : CommentModel{
    const commentModel = new CommentModel()
    commentModel.commentId = commentEntity.commentId
    commentModel.content = commentEntity.content
    commentModel.postId = commentEntity.postId
    commentModel.comment_left = commentEntity.comment_left
    commentModel.comment_right = commentEntity.comment_right
    commentModel.parent_comment_id = commentEntity.parent_comment_id
    commentModel.createdAt = commentEntity.createdAt
    commentModel.userId = commentEntity.userId
    commentModel.isDeleted = commentEntity.isDeleted
    commentModel.parent_comment = commentEntity.parent_comment
    commentModel.user = UserModel.fromEntity(commentEntity.user)
    commentModel.post = PostModel.fromEntity(commentEntity.post)
    

    return commentModel
}

}
