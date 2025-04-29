// src/firebase/firebase.module.ts
import { Module } from '@nestjs/common';
import { FireBaseService } from './firebase.service';

@Module({
  providers: [FireBaseService],
  exports: [FireBaseService],
})
export class FirebaseModule {}
