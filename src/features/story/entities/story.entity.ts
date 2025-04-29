import { UserEntity } from "src/features/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class StoryEntity{
    @PrimaryGeneratedColumn('uuid')
    storyId: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name:'userId'})
    user: UserEntity

    @Column()
    userId: string

    @Column()
    storyUrl: string

    @CreateDateColumn()
    createdAt: Date;
}