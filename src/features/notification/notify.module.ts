import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotifiEntity } from "./entities/notify.entity";
import { NotifyService } from "./notify.service";
import { NotifyGateWay } from "./notify.gateway";
import { KeyStoreModule } from "../keystore/keystore.module";




@Module({
    imports: [
        TypeOrmModule.forFeature([
            NotifiEntity
        ]),
        KeyStoreModule
    ],
    providers:[NotifyService,NotifyGateWay],
    exports: [NotifyService]
})


export class NotifyModule{}