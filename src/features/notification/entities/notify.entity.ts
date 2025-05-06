import { PostEntity } from 'src/features/posts/entities/post.entity';
import { UserEntity } from '../../users/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class NotifiEntity {
  @PrimaryGeneratedColumn('uuid')
  notifyId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fromUserId' })
  fromUser: UserEntity;

  @Column()
  fromUserId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'toUserId' })
  toUser: UserEntity;

  @Column()
  toUserId: string;

  @ManyToOne(() => PostEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @Column({nullable: true})
  postId: string|null;

  @Column({type: 'enum', enum: ['like','commentPost','commentReply','follow']})
  type: 'like' | 'commentPost' | 'follow' | 'commentReply';

  @Column({type: 'boolean',default: false})
  isRead: boolean

  @CreateDateColumn()
  createdAt: Date;
}
