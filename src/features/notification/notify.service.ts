import { InjectRepository } from '@nestjs/typeorm';
import { NotifiEntity } from './entities/notify.entity';
import { Repository } from 'typeorm';

export class NotifyService {
  constructor(
    @InjectRepository(NotifiEntity)
    private notifyRepository: Repository<NotifiEntity>,
  ) {}

  async createNotification(
    fromUser: string,
    toUser: string,
    postId: string| null,
    type: 'like' | 'commentReply' | 'follow' | 'commentPost',
  ) {
    const newNoti = {
      fromUserId: fromUser,
      toUserId: toUser,
      postId,
      type,
    };

    const notification = await this.notifyRepository.save(newNoti);

    return notification;
  }

  async getAllNotification(userId: string, isRead: boolean) {
    const queryBuilder = await this.notifyRepository
      .createQueryBuilder('notify')
      .leftJoinAndSelect('notify.fromUser', 'user')
      .leftJoinAndSelect('notify.post', 'post')
      .leftJoinAndSelect('post.user', 'postUser')
      .leftJoinAndSelect('post.likes', 'like')
      .leftJoinAndSelect('post.comments', 'comment')
      .where('notify.toUserId = :userId', { userId })
      .andWhere('notify.isRead = :isRead', { isRead })
      .orderBy('notify.createdAt', 'DESC')
      .getMany();


    return queryBuilder;
  }

  async markAsRead(notifyId: string) {
    return await this.notifyRepository.update({ notifyId }, { isRead: true });
  }
}
