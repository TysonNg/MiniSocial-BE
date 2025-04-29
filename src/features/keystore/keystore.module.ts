import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyStoreEntity } from './entities/keystore.entity';
import { KeyStoreService } from './keystore.service';

@Module({
    imports:[TypeOrmModule.forFeature([KeyStoreEntity])],
    providers: [KeyStoreService],
    exports: [TypeOrmModule,KeyStoreService]
})
export class KeyStoreModule {}
