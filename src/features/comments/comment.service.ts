import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { LessThan, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { NotFoundException, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { CommentDto } from './dto/comment.dto';
import { PostEntity } from '../posts/entities/post.entity';
import { RedisService } from 'src/redis/redis.service';

export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,

    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    
    private redisService: RedisService
  ) {}

  async comment(
    { postId, content, parent_comment_id = null }: CommentDto,
    req: Request,
  ) {
    const { id } = (req as any).user;

    const newComment = this.commentRepository.create({
      content,
      user: { id },
      post: { postId },
      parent_comment: parent_comment_id
        ? { commentId: parent_comment_id }
        : undefined,
    });

    if (parent_comment_id) {
      //reply here
      const parentComment = await this.commentRepository.findOne({
        where: { commentId: parent_comment_id },
      });
      if (!parentComment)
        throw new NotFoundException('Not found parent comment!!');

      let rightValue = parentComment.comment_right;

      await this.commentRepository
        .createQueryBuilder()
        .update(CommentEntity)
        .set({ comment_right: () => 'comment_right + 2' })
        .where('comment_right >= :right', { right: rightValue })
        .andWhere('postId = :postId', { postId })
        .execute();

      await this.commentRepository
        .createQueryBuilder()
        .update(CommentEntity)
        .set({ comment_left: () => 'comment_left + 2' })
        .where('comment_left > :right', { right: rightValue })
        .andWhere('postId = :postId', { postId })
        .execute();

      newComment.comment_left = rightValue;
      newComment.comment_right = rightValue + 1;

      await this.commentRepository.save(newComment);
      await this.redisService.delete('allPosts')
      return newComment;
    } else {
      let leftValue;

      const maxRightValue = await this.commentRepository
        .createQueryBuilder('comment')
        .select('MAX(comment.comment_right)', 'comment_right')
        .where('comment.postId = :postId', { postId })
        .getRawOne();

      if (maxRightValue) {
        leftValue = maxRightValue.comment_right + 1;
      } else {
        leftValue = 1;
      }

      newComment.comment_left = leftValue;
      newComment.comment_right = leftValue + 1;

      await this.commentRepository.save(newComment);
      await this.redisService.delete('allPosts')

      return newComment;
    }
  }

  async getComments(postId: string, parent_comment_id: string | null) {
    if(parent_comment_id){
        const parent = await this.commentRepository.findOne({where: {commentId: parent_comment_id}})
    
        const comments = await this.commentRepository
          .createQueryBuilder('comment')
          .select([
            'comment.comment_left',
            'comment.comment_right',
            'comment.content',
            'comment.parent_comment_id',
          ])
          .leftJoin('comment.parent_comment', 'parent')
          .where('comment.postId = :postId', { postId })
          .andWhere('comment.comment_left > :left', { left: parent?.comment_left })
          .andWhere('comment.comment_right < :right', {
            right: parent?.comment_right,
          })
          .getRawMany();
    
          return comments
    }else{
        const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .select([
            'comment.commentId',
            'comment.comment_left',
            'comment.comment_right',
            'comment.content',
            'comment.parent_comment_id',
            'comment.userId' 
        ])
        .where('comment.postId = :postId', {postId})
        .getRawMany()

        return comments
    }
  }


  async deleteComment(postId: string, comment_id:string){
    
    console.log(comment_id);
    
    const foundPost = await this.postRepository.findOne({where: {postId}})
    if(!foundPost) throw new NotFoundException("Not found post!!")
    
    const comment = await this.commentRepository.findOne({where: {commentId: comment_id,isDeleted: false}})
    console.log(comment);
    
    if(!comment) throw new NotFoundException("Not found comment!")
    
    //left and rigth of comment which is deleting
    const rightValue = comment.comment_right
    const leftValue = comment.comment_left

    console.log('right', rightValue);
    console.log('left',leftValue);
    
    
    //calculate width
    const width = rightValue - leftValue +1

    //delete comment children
    await this.commentRepository
    .createQueryBuilder()
    .delete()
    .from(CommentEntity)
    .where('postId = :postId', {postId})
    .andWhere('comment_left >= :left', {left: leftValue})
    .andWhere('comment_left <= :right', {right: rightValue})
    .execute()

    //update comment_right all comments
    await this.commentRepository
        .createQueryBuilder()
        .update(CommentEntity)
        .set({comment_right: () => `comment_right - ${width}` })
        .where('comment_right > :right', {right: rightValue})
        .execute()

    //update comment_left all comments
    await this.commentRepository
        .createQueryBuilder()
        .update(CommentEntity)
        .set({comment_left: () => `comment_left - ${width}` })
        .where('comment_left > :right', {right: rightValue})
        .execute()

    return {
        message: "Delete comment successfully!"
    }
  }
}
