import { Injectable } from '@angular/core';
import { ResultDto, PutForm, PagedResultDto, ResultEntity, PutDetail } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { NodeHttpClient } from '../common';
import { SettingsService } from '@delon/theme';
import { v } from '@angular/core/src/render3';

@Injectable()
export class putFormService {
    tableName = 'putForm';

    constructor(private nodeComService: NodeCommonService,
        private sqlite3Service: Sqlite3Service,
        private nodeHttpClient: NodeHttpClient,
        private settingsService: SettingsService) {
    }

    // save(user: PutForm): Promise<ResultDto> {
    //     if (user.id) {//更新
    //         user.lastModificationTime = new Date();
    //         return this.sqlite3Service.execSql(`update ${this.tableName} set account=?, password=?, name=?, role=?, isEnable=?, lastModificationTime=?, lastModifierUserId=? where id=?`,
    //             [user.account, user.password, user.name, user.role, user.isEnable, user.lastModificationTime, user.lastModifierUserId, user.id], 'run');
    //     } else {//新增
    //         user.creationTime = new Date();
    //         user.id = this.nodeComService.guidV1();
    //         user.password = this.nodeComService.md5(user.password);//加密
    //         return this.sqlite3Service.execSql(`insert into ${this.tableName} (id, account, password, name, role, isEnable, creationTime, creatorUserId) values(?, ?, ?, ?, ?, ?, ?, ?)`,
    //             [user.id, user.account, user.password, user.name, user.role, user.isEnable, user.creationTime, user.creatorUserId], 'run');
    //     }
    // }

    get(id: string): Promise<PutForm> {
        return new Promise<PutForm>((resolve, reject) => {
            this.sqlite3Service.execSql(`select * from ${this.tableName} where id=?`, [id], 'get').then((res) => {
                if (res.code == 0) {
                    if (res.data) {
                        resolve(PutForm.fromJS(res.data));
                    } else {
                        reject(null);
                    };
                } else {
                    reject(null);
                }
            });
        });
    }

    getAll(keyWord: string, skipCount: number, maxResultCount: number): Promise<PagedResultDto<PutForm>> {
        const _self = this;
        if (!keyWord) {
            keyWord = '';
        }
        keyWord = '%' + keyWord + '%';
        return new Promise<PagedResultDto<PutForm>>((resolve, reject) => {
            _self.sqlite3Service.connectDataBase().then((dres) => {
                if (dres.code == 0) {
                    _self.sqlite3Service.sql(`select count(*) cnum from ${this.tableName} where formNo like ?`, [keyWord], 'get').then((cres) => {
                        const result = new PagedResultDto<PutForm>();
                        if (cres.code == 0) {
                            result.totalCount = cres.data.cnum;
                            _self.sqlite3Service.sql(`select * from ${this.tableName} where formNo like ? limit ${maxResultCount} offset ${skipCount}`, [keyWord], 'all').then((res) => {
                                if (res.code == 0) {
                                    if (res.data) {
                                        result.items = PutForm.fromJSArray(res.data);
                                    } else {
                                        result.items = [];
                                        result.totalCount = 0;
                                    }
                                    resolve(result);
                                } else {
                                    console.log(res);
                                    reject(null);
                                }
                            });
                        } else {
                            console.log(cres);
                            reject(null);
                        }
                    });
                } else {
                    reject(null);
                }
            });
        });
    }


    save(putForm: PutForm, putDetailList: PutDetail[]) {
        console.log(putForm);
        console.log(putDetailList);
        putForm.id = this.nodeComService.guidV1();
        putForm.creationTime = new Date();
        this.sqlite3Service.execSql(`insert into putDetail 
            (id,shopId,formNo,type,deliverer,putTime,refOrderNo
                ,remark,userAccount,creationTime,creatorUserId
                ) putFormalues(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [putForm.id, putForm.shopId, putForm.formNo, putForm.type, putForm.deliverer
                , putForm.putTime, putForm.refOrderNo, putForm.remark, putForm.userAccount
                , putForm.creationTime, putForm.creatorUserId], 'run');

        putDetailList.forEach(v => {
            v.creationTime = new Date();
            v.id = this.nodeComService.guidV1();
            return this.sqlite3Service.execSql(`insert into putDetail 
                        (id,putFormId,productId,barCode
                            ,purchasePrice,orderNum,num,remark,creationTime
                            ) values(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [v.id, v.putFormId, v.productId, v.barCode, v.purchasePrice
                    , v.orderNum, v.num, v.remark
                    , v.creationTime], 'run');
        });
    }

}


