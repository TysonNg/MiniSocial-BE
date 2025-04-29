import { CommentEntity } from 'src/features/comments/entities/comment.entity';
import { LikeEntity } from 'src/features/likes/entities/like.entity';
import { PostEntity } from 'src/features/posts/entities/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true , default: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg' })
  avatarUrl: string;

  @Column({ nullable: true })
  bio?: string;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    onDelete: 'CASCADE',
  })
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user, { onDelete: 'CASCADE' })
  likes: LikeEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  following: UserEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  followers: UserEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
