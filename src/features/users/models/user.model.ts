import { Field, ID, ObjectType } from "@nestjs/graphql";
import { LikeModel } from "src/features/likes/models/like.model";
import {  PostModel } from "src/features/posts/models/post.model";
import { UserEntity } from "../entities/user.entity";
import { CommentModel } from "src/features/comments/models/comment.model";


@ObjectType()
export class UserModel {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    avatarUrl?: string;

    @Field({ nullable: true })
    bio?: string;

    @Field(() => [PostModel])
    posts: PostModel[];

    @Field(() => [CommentModel])
    comments: CommentModel[];

    @Field(() => [LikeModel])
    likes: LikeModel[];

    @Field(() => [UserModel])
    following: UserModel[];

    @Field(() => [UserModel])
    followers: UserModel[];

    @Field()
    createdAt: Date;

    static fromEntity(userEntity: UserEntity): UserModel {
        const userModel = new UserModel();
        if(userEntity){
            userModel.id = userEntity.id;
            userModel.name = userEntity.name;
            userModel.posts = userEntity.posts?.map((post) => PostModel.fromEntity(post));
        }
        return userModel;
      }
}