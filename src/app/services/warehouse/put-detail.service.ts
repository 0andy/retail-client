import { Injectable } from '@angular/core';
import { ResultDto, PutForm, PagedResultDto, ResultEntity, PutDetail } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { NodeHttpClient } from '../common';
import { SettingsService } from '@delon/theme';

@Injectable()
export class putDetailService {
    tableName = 'putDetail';

    constructor(private nodeComService: NodeCommonService,
        private sqlite3Service: Sqlite3Service,
        private nodeHttpClient: NodeHttpClient,
        private settingsService: SettingsService) {
    }

    getAllNoPage(id: string): Promise<PutDetail[]> {
        return new Promise<PutDetail[]>((resolve, reject) => {
            this.sqlite3Service.execSql(`select p.productId,r.name productName,p.barCode,p.purchasePrice,p.orderNum,p.num,p.remark from ${this.tableName} p inner join retailProduct r on p.productId = r.id where p.putFormId=?`, [id], 'all').then((res) => {
                if (res.code == 0) {
                    if (res.data) {
                        resolve(PutDetail.fromJSArray(res.data));
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