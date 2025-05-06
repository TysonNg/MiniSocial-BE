import { Module } from '@nestjs/common';
import { ChatGateWay } from './chat.gateway';
import { KeyStoreModule } from '../keystore/keystore.module';
import { FirebaseModule } from 'src/firebase/firebase.module';


@Module({
  imports: [
    KeyStoreModule,
    FirebaseModule,
  ],
  providers: [ChatGateWay],
})
export class ChatModule {}
