import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm'
import { UserEntity } from '../../users/entities/user.entity';


@Entity()
export class KeyStoreEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: 'userId'})
    user: UserEntity;

    @Column()
    userId: string

    @Column()
    accessToken: string;

    @Column()
    refreshToken: string;


    @Column('jsonb',{default: []})
    refreshTokenUsed: string[];

    @Column()
    publicKey: string;

    @Column()
    privateKey: string;
}