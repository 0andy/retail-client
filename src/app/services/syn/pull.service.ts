import { Injectable } from '@angular/core';
import { ResultDto, Category, Shop } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { Observable } from "rxjs";
import { NodeHttpClient } from '../common';
import { SettingsService } from '@delon/theme';

@Injectable()
export class PullService {

    constructor(private nodeComService: NodeCommonService,
        private sqlite3Service: Sqlite3Service,
        private nodeHttpClient: NodeHttpClient,
        private settingsService: SettingsService) {
    }

    pullCategory(): Promise<ResultDto> {
        const _self = this;
        return new Promise<ResultDto>((resolve, reject) => {
            this.nodeHttpClient.get('/api/services/app/ProductTag/GetSynProductTagAsync').then((res) => {
                console.log(res);
                if (res.code != 0) {
                    reject(res);
                } else {
                    const categoryList = Category.fromJSArray(res.data);
                    if(categoryList.length == 0){
                        const result = new ResultDto();
                        result.code = 0;
                        result.msg = '没有商品分类数据';
                        resolve(result);
                    } else {
                        this.sqlite3Service.connectDataBase().then((conn) => {
                            if(conn.code != 0) {
                                reject(res);
                            } else {
                                const promises = categoryList.map(function(item) {
                                    return _self.sqlite3Service.sql(`insert into category values(${item.id}, '${item.name}', ${item.seq}, '${item.creationTimeStr}');`,[], 'run');
                                });
                                Promise.all(promises).then((pro) => {
                                        const result = new ResultDto();
                                        result.code = 0;
                                        result.msg = '拉取商品分类成功';
                                        resolve(result);
                                }).catch((cat) => {
                                    const result = new ResultDto();
                                    result.code = -1;
                                    result.msg = '拉取商品分类失败';
                                    result.data = cat;
                                    reject(result);
                                });
                            }
                        });
                    }
                }
            });
        });
    }

    pullShop(licenseKey: string){
        return new Promise<ResultDto>((resolve, reject) => {
            this.nodeHttpClient.post('/api/services/app/Shop/SynInitShopAsync', null, { 'licenseKey': licenseKey}).then((res) => {
                console.log(res);
                if (res.code != 0) {
                    reject(res);
                } else {
                    const shop = Shop.fromJS(res.data);
                    if(shop){
                        return this.sqlite3Service.execSql(`insert into shop (id,name,retailId,retailName,licenseKey,authorizationCode,aaddress,qRCode,longitude,latitude,creationTime,creatorUserId,lastModificationTime,lastModifierUserId) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                        [shop.id,shop.name,shop.retailId,shop.retailName,shop.licenseKey,shop.authorizationCode,shop.aaddress,shop.qRCode,shop.longitude,shop.latitude,shop.creationTime,shop.creatorUserId,shop.lastModificationTime,shop.lastModifierUserId,], 'run');
                    } else {
                        const result = new ResultDto();
                        result.code = 0;
                        result.msg = '没有匹配licenseKey的数据';
                        resolve(result);
                    }
                }
            });
        });
    }

    pullPoduct(skipCount: number){

    }


}


