import { Injectable, Inject } from '@angular/core';
import { ResultDto } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';

@Injectable()
export class ShopUserService {

    //private _nodeComService: NodeCommonService;
    //private _sqlite3Service: Sqlite3Service;

    constructor(private nodeComService: NodeCommonService, private sqlite3Service: Sqlite3Service) { 
        //this._nodeComService = nodeComService;
        //this._sqlite3Service = sqlite3Service;
    }

    createTable(){
        this.sqlite3Service.connectDataBase().then((res) => {
            if(res.code == 0){
                this.sqlite3Service.createShopUserTable().then((res) => {
                    if(res.code == 0){
                        console.log('表创建成功');
                    } else {
                        console.log('表创建失败：'+  res.data);
                    }
                });
            } else{
                console.log('连接失败：' + res.data);
            }
        });
    }

}


