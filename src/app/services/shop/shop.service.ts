import { Injectable } from '@angular/core';
import { ResultDto, Shop } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { NodeHttpClient } from '../common';
import { SettingsService } from '@delon/theme';;

@Injectable()
export class ShopService {

    //private _nodeComService: NodeCommonService;
    //private _sqlite3Service: Sqlite3Service;
    tableName = 'shop';

    constructor(private nodeComService: NodeCommonService,
        private sqlite3Service: Sqlite3Service,
        private nodeHttpClient: NodeHttpClient,
        private settingsService: SettingsService) {
        //this._nodeComService = nodeComService;
        //this._sqlite3Service = sqlite3Service;
    }

    save(shop: Shop): Promise<ResultDto> {
        shop.lastModificationTime = new Date();
        return this.sqlite3Service.execSql(`insert into ${this.tableName} (id,name,retailId,retailName,licenseKey,authorizationCode,aaddress,qRCode,longitude,latitude,creationTime,creatorUserId,lastModificationTime,lastModifierUserId) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [shop.id,shop.name,shop.retailId,shop.retailName,shop.licenseKey,shop.authorizationCode,shop.aaddress,shop.qRCode,shop.longitude,shop.latitude,shop.creationTime,shop.creatorUserId,shop.lastModificationTime,shop.lastModifierUserId,], 'run');
    }

    get(): Promise<Shop> {
        return new Promise<Shop>((resolve, reject) => {
            this.sqlite3Service.execSql(`select * from ${this.tableName}`, [], 'get').then((res) => {
                if (res.code == 0) {
                    if (res.data) {
                        resolve(Shop.fromJS(res.data));
                    } else {
                        reject(null);
                    };
                } else {
                    reject(null);
                }
            });
        });
    }
}


