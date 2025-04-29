import {  PostEntity } from "src/features/posts/entities/post.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn ,Column, CreateDateColumn } from "typeorm";


@Entity()
export class LikeEntity{
    @PrimaryGeneratedColumn('uuid')
    likeId: string

    @ManyToOne(() => UserEntity, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: UserEntity;

    @Column()
    userId: string

    @ManyToOne(() => PostEntity, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'postId'})
    post: PostEntity

    @Column()
    postId: string
    
    @CreateDateColumn()
    createdAt: Date


}