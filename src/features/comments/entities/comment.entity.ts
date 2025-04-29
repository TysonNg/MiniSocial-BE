import { PostEntity } from "src/features/posts/entities/post.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn ,Column, CreateDateColumn, OneToOne } from "typeorm";


@Entity()
export class CommentEntity{
    @PrimaryGeneratedColumn('uuid')
    commentId: string

    @ManyToOne(() => UserEntity,  { onDelete: 'CASCADE' })
    @JoinColumn({name: 'userId'})
    user: UserEntity;

    @Column()
    userId: string

    @ManyToOne(() => PostEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: PostEntity;
  
    @Column()
    postId: string;

    @Column({ type: 'text' })
    content: string;

    @Column()
    comment_left: number

    @Column()
    comment_right: number

    @ManyToOne(() => CommentEntity,{nullable:true, onDelete: 'CASCADE'})
    @JoinColumn({name: 'parent_comment_id'})
    parent_comment: CommentEntity

    @Column({nullable: true})
    parent_comment_id: string

    @Column({default: false})
    isDeleted: boolean

    @CreateDateColumn()
    createdAt: Date;
  

}