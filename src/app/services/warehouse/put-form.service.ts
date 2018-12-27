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

    get(id: string): Promise<PutForm> {
        return new Promise<PutForm>((resolve, reject) => {
            this.sqlite3Service.execSql(`select p.* from ${this.tableName} p where p.id=?`, [id], 'get').then((res) => {
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
                    _self.sqlite3Service.sql(`select count(1) cnum from ${this.tableName} where formNo like ?`, [keyWord], 'get').then((cres) => {
                        const result = new PagedResultDto<PutForm>();
                        if (cres.code == 0) {
                            result.totalCount = cres.data.cnum;
                            _self.sqlite3Service.sql(`select p.id, p.formNo,p.deliverer,p.type,p.putTime,p.creationTime,p.status,p.userAccount from ${this.tableName} p where p.formNo like ? order by p.status,p.creationTime desc limit ${maxResultCount} offset ${skipCount}`, [keyWord], 'all').then((res) => {
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

    //TODO:
    save(putForm: PutForm, putDetailList: PutDetail[], name: string) {
        return new Promise<ResultDto>((resolve, reject) => {
            const _self = this;
            if (!putForm.id) {
                this.sqlite3Service.connectDataBase().then((conn) => {
                    if (conn.code != 0) {
                        console.error(conn);
                        reject(null);
                    } else {
                        _self.sqlite3Service.sql(`begin;`, [], 'run');
                        putForm.id = this.nodeComService.guidV1();
                        putForm.creationTime = new Date();
                        putForm.userAccount = name;
                        this.sqlite3Service.sql(`insert into ${this.tableName} 
                                        (id,shopId,formNo,type,deliverer,putTime,refOrderNo
                                            ,remark,userAccount,creationTime,creatorUserId,status
                                            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
                            [putForm.id, putForm.shopId, putForm.formNo, putForm.type, putForm.deliverer
                                , putForm.putTime, putForm.refOrderNo, putForm.remark, putForm.userAccount
                                , putForm.creationTime, putForm.creatorUserId, putForm.status], 'run').then(res => {
                                    // console.log(res);
                                    if (res.code == 0) {
                                        const promises = putDetailList.map(function (item) {
                                            item.creationTime = new Date();
                                            item.id = _self.nodeComService.guidV1();
                                            return _self.sqlite3Service.sql(`insert into putDetail 
                                                                (id,putFormId,productId,barCode
                                                                    ,purchasePrice,orderNum,num,remark,creationTime
                                                                    ) values(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                                [item.id, putForm.id, item.productId, item.barCode, item.purchasePrice
                                                    , item.orderNum, item.num, item.remark
                                                    , item.creationTime], 'run');
                                        });
                                        Promise.all(promises).then((pro) => {
                                            const result = new ResultDto();
                                            result.code = 0;
                                            result.msg = '入库订单详情记录生成成功';
                                            // console.log(result);
                                            _self.sqlite3Service.sql(`commit;`, [], 'run');
                                            resolve(result);
                                        }).catch((cat) => {
                                            _self.sqlite3Service.sql(`rollback;`, [], 'run');
                                            const result = new ResultDto();
                                            result.code = -1;
                                            result.msg = '入库订单详情记录生成失败';
                                            result.data = cat;
                                            console.error(result);
                                        });
                                    }
                                    else {
                                        _self.sqlite3Service.sql(`rollback;`, [], 'run');
                                        console.error(res);
                                    }
                                });
                        // const result = new ResultDto();
                        // result.code = 0;
                        // result.msg = '入库订单详情记录生成成功';
                        // resolve(result);
                    }
                });
            }
        });
        // console.log(putDetailList);
        // return new Promise<ResultDto>((resolve, reject) => {
        //     if (!putForm.id) {
        //         putForm.id = this.nodeComService.guidV1();
        //         putForm.creationTime = new Date();
        //         console.log(putForm);
        //         this.sqlite3Service.execSql(`BEGIN;insert into ${this.tableName} 
        //     (id,shopId,formNo,type,deliverer,putTime,refOrderNo
        //         ,remark,userAccount,creationTime,creatorUserId
        //         ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        //             [putForm.id, putForm.shopId, putForm.formNo, putForm.type, putForm.deliverer
        //                 , putForm.putTime, putForm.refOrderNo, putForm.remark, putForm.userAccount
        //                 , putForm.creationTime, putForm.creatorUserId], 'run').then(res => {
        //                     console.log(res);
        //                     if (res.code == 0) {
        //                         if (putDetailList && putDetailList.length > 0) {
        //                             putDetailList.forEach(v => {
        //                                 v.creationTime = new Date();
        //                                 v.id = this.nodeComService.guidV1();
        //                                 this.sqlite3Service.execSql(`insert into putDetail 
        //                                             (id,putFormId,productId,barCode
        //                                                 ,purchasePrice,orderNum,num,remark,creationTime
        //                                                 ) values(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        //                                     [v.id, putForm.id, v.productId, v.barCode, v.purchasePrice
        //                                         , v.orderNum, v.num, v.remark
        //                                         , v.creationTime], 'run').then(r => {
        //                                             console.log(r);
        //                                             if (r.code == 0) {
        //                                                 this.sqlite3Service.execSql(`commit `, [], 'run');
        //                                                 resolve(res);
        //                                             } else {
        //                                                 this.sqlite3Service.execSql(`rollback `, [], 'run');
        //                                                 reject(res);
        //                                                 return;
        //                                             }
        //                                         });
        //                             });
        //                         } else {
        //                             console.log('[空]');
        //                             resolve(res);
        //                         }
        //                     } else {
        //                         this.sqlite3Service.execSql(`rollback `, [], 'run');
        //                         const result = new ResultDto();
        //                         result.code = 0;
        //                         result.msg = '入库单创建失败';
        //                         reject(result);
        //                     }
        //                 });
        //     }
        // });
    }
}
