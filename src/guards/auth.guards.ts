import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import { KeyStoreService } from "src/features/keystore/keystore.service";


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private keyStoreService: KeyStoreService){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const request: Request = context.switchToHttp().getRequest()

        // const gqlContext = GqlExecutionContext.create(context);
        // const request = gqlContext.getContext().req;
        const authHeader = request.headers['authorization'];
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            throw new UnauthorizedException("You need to login!!!")
        }
        const token = authHeader.split(' ')[1]
        if(!token){
            throw new UnauthorizedException("invalid token!!!");
        }

        const userId = request.headers['x-user-id']
        if(!userId || typeof(userId) !== 'string'){
            throw new UnauthorizedException("You need to login!!!")
        }
        
        const keyStore = await this.keyStoreService.findByUserId(userId)

        if(!keyStore){
            throw new NotFoundException("Not found keyStore!")
        }
        
        try {
            const decodeUser =  verify(token,keyStore?.publicKey, {algorithms: ['RS256']})
            const {id, email} = decodeUser as {id: string, email: string}

            if(userId !== id){
                throw new UnauthorizedException("Auth error")
            }
            (request as any).user = {id, email}

        } catch (error) {
            throw new UnauthorizedException("Invalid or expired token");            
        }

        return true
    }
}