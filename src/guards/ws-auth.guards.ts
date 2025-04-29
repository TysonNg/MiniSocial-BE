import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';

import { Socket } from 'socket.io';
import { KeyStoreService } from 'src/features/keystore/keystore.service';

export type UserData = {
  userName: string;
  url: string;
  id: string
}
@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private keyStoreService: KeyStoreService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();

   
    const {token,userId, url,userName} = client.handshake?.auth

    if (!token) throw new UnauthorizedException('No token');

    const keyStore = await this.keyStoreService.findByUserId(userId);
    if (!keyStore) throw new NotFoundException('Not found keystore!');

    try {
      const decodeUser = verify(token, keyStore?.publicKey, {
        algorithms: ['RS256'],
      });
      const { id, email } = decodeUser as { id: string; email: string };

      const userData : UserData = { id,url,userName}
      
      if (userId !== id) {
        throw new UnauthorizedException('Auth error');
      }
      client.data.user = userData;

      return true;

    } catch (error) {
        throw new UnauthorizedException('Invalid token');
    }
  }
}
