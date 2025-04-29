// import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { PostModel } from './models/post.model';
// import { PostService } from './post.service';
// import { UseGuards } from '@nestjs/common';
// import { AuthGuard } from 'src/guards/auth.guards';
// import { CreatePostInput } from './dto/createpost.dto';

// @Resolver(() => PostModel)
// @UseGuards(AuthGuard)
// export class PostResolver {
//   constructor(private readonly postService: PostService) {}

//   @Query(() => [PostModel])
//   async getAllPosts() : Promise<PostModel[]> {
//     return await this.postService.getAllPosts();
//   }

//   @Query(() => PostModel, {nullable: true})
//   async findPostById(@Args('postId',{type: () => String}) postId : string): Promise<PostModel>{
//     return await this.postService.findPostById(postId)
//   }


//   @Mutation(() => PostModel)
//   async createPost(
//     @Args('payload') payload: CreatePostInput,
//     @Context() context: any,
//   ): Promise<PostModel> {
//     const user = context.req.user;
//     console.log(user); 
//     return await this.postService.createPostGraphQl(payload, user);
//   }

// }
