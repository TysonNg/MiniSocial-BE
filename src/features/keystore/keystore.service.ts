import { Injectable  } from "@nestjs/common";
import {  Raw, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { KeyTokenDto } from "./dto/keytoken";
import { KeyStoreEntity } from "./entities/keystore.entity";


@Injectable()
export class KeyStoreService{
    constructor(
        @InjectRepository(KeyStoreEntity)
        private keystoreRepository : Repository<KeyStoreEntity>
    ){}


    async createKeyToken({
        accessToken,
        privateKey,
        userId,
        publicKey,
        refreshToken,
    } : KeyTokenDto) {

        const keyStore = await this.keystoreRepository.findOne({where: {userId}})
        
        if(keyStore){
            await this.keystoreRepository.update(keyStore.id,{
                accessToken,
                privateKey,
                publicKey,
                refreshToken
            })
        }else{
            await this.keystoreRepository.save({
                accessToken,
                privateKey,
                publicKey,
                refreshToken,
                userId
            })
        }
    }

    async findByRefreshTokenUsed(refreshToken: string) {
        return await this.keystoreRepository.findOne({
            where: {
                refreshTokenUsed: Raw(
                    (alias) => `${alias} @> '["${refreshToken}"]'::jsonb`
                  ),
            },
        });
    }

    async findByRefreshToken(refreshToken: string){
        return await this.keystoreRepository.findOne({where:{refreshToken}})
    }

    async findByUserId(userId :string){
        return await this.keystoreRepository.findOne({where: {userId}})
    }

}