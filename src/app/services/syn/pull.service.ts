import { Injectable } from '@angular/core';
import { ResultDto, Category } from 'app/entities';
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
        return new Promise<ResultDto>((resolve, reject) => {
            this.nodeHttpClient.get('/api/services/app/ProductTag/GetAll').then((res) => {
                if (res.code != 0) {
                    reject(res);
                } else {
                    const categoryList = Category.fromJSArray(res.data);
                    let sql = '';
                    for (let item of categoryList) {
                        sql = sql + `insert into category values(${item.id}, '${item.name}', ${item.seq}, ${item.creationTime});`;
                    }
                    if (sql !== '') {
                        this.sqlite3Service.execSql(sql, [], 'run').then((res) => {
                            if (res.code != 0) {
                                reject(res);
                            } else {
                                const result = new ResultDto();
                                result.code = 0;
                                result.msg = '下拉商品分类成功';
                                resolve(result);
                            }
                        });
                    } else {
                        const result = new ResultDto();
                        result.code = 0;
                        result.msg = '没有商品分类数据';
                        resolve(result);
                    }
                }
            });
        });
    }
}


