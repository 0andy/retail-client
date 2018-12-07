import { Injectable } from '@angular/core';
import { ResultDto, ShopUser, PagedResultDto } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { Observable } from "rxjs";

@Injectable()
export class ShopUserService {

    //private _nodeComService: NodeCommonService;
    //private _sqlite3Service: Sqlite3Service;
    tableName = 'shopUsers';

    constructor(private nodeComService: NodeCommonService, private sqlite3Service: Sqlite3Service) {
        //this._nodeComService = nodeComService;
        //this._sqlite3Service = sqlite3Service;
    }

    createTable() {
        this.sqlite3Service.connectDataBase().then((res) => {
            if (res.code == 0) {
                this.sqlite3Service.createShopUserTable().then((res) => {
                    if (res.code == 0) {
                        console.log('表创建成功');
                    } else {
                        console.log('表创建失败：' + res.data);
                    }
                    this.sqlite3Service.close();
                });
            } else {
                console.log('连接失败：' + res.data);
            }
        });
    }

    save(user: ShopUser): Promise<ResultDto> {
        if (user.id) {//更新
            user.lastModificationTime = new Date();
            return this.sqlite3Service.execSql(`update ${this.tableName} set account=?, password=?, name=?, role=?, isEnable=?, lastModificationTime=?, lastModifierUserId=? where id=?`,
                [user.account, user.password, user.name, user.role, user.isEnable, user.lastModificationTime, user.lastModifierUserId, user.id], 'run');
        } else {//新增
            user.creationTime = new Date();
            user.id = this.nodeComService.guidV1();
            return this.sqlite3Service.execSql(`insert into ${this.tableName} (id, account, password, name, role, isEnable, creationTime, creatorUserId) values(?, ?, ?, ?, ?, ?, ?, ?)`,
                [user.id, user.account, user.password, user.name, user.role, user.isEnable, user.creationTime, user.creatorUserId], 'run');
        }
    }

    getAll(keyWord: string, skipCount: number, maxResultCount: number): Promise<PagedResultDto<ShopUser>> {
        let _self = this;
        if(!keyWord){
            keyWord = '';
        }
        keyWord = '%' + keyWord + '%';
        return new Promise<PagedResultDto<ShopUser>>((resolve, reject) => {
            _self.sqlite3Service.connectDataBase().then((dres) => {
                if(dres.code == 0){
                    _self.sqlite3Service.sql(`select count(*) from ${this.tableName} where account like ? and name like ?`, [keyWord,keyWord],'get').then((cres) => {
                        let result = new PagedResultDto<ShopUser>();
                        result.totalCount = cres.data;
                        if(cres.code == 0){
                            _self.sqlite3Service.sql(`select * from ${this.tableName} where account like ? and name like ?`, [keyWord,keyWord],'all').then((res) => {
                                if(res.code == 0){
                                    result.items = ShopUser.fromJSArray(res.data);
                                    resolve(result);
                                } else {
                                    reject(null);
                                }
                            });
                        } else {
                            reject(null);
                        }
                    });
                } else {
                    reject(null);
                }
            });
        });
    }

}


