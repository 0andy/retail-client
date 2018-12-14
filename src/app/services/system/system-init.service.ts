import { Injectable } from '@angular/core';
import { ResultDto, ShopUser, PagedResultDto, ResultEntity } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { Observable } from "rxjs";
import { NodeHttpClient } from '../common';
import { SettingsService } from '@delon/theme';

@Injectable()
export class SystemInitService {

    fs = (<any>window).require("fs");
    percent: number;

    constructor(private nodeComService: NodeCommonService,
        private sqlite3Service: Sqlite3Service,
        private nodeHttpClient: NodeHttpClient,
        private settingsService: SettingsService) {
    }

    createShopUserTable() {
        //ShopUser
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        let sentence = `
        create table if not exists shopUsers(
            id varchar(36) PRIMARY KEY not null,
            account nvarchar(50) not null,
            password varchar(200) not null,
            name varchar(50),
            role int not null,
            shopId varchar(36),
            isEnable int,
            creationTime datetime,
            creatorUserId varchar(36),
            lastModificationTime datetime,
            lastModifierUserId varchar(36)
        );`;
        return this.sqlite3Service.createTable(sentence);
    }

    createCategoryTable() {
        //Category
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        let sentence = `
        create table if not exists category(
            id int PRIMARY KEY not null,
            name varchar(200) not null,
            seq int not null,
            creationTime datetime not null
        );`;
        return this.sqlite3Service.createTable(sentence);
    }

    createProductTable() {
        //Product
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        let sentence = `
        create table if not exists retailProduct(
            id varchar(36) PRIMARY KEY not null,
            shopId varchar(36) not null,
            barCode nvarchar(50),
            name nvarchar(200) not null,
            categoryId int not null,
            grade int,
            retailPrice decimal(18,2),
            purchasePrice decimal(18,2),
            sellPrice decimal(18,2),
            isEnableMember int,
            memberPrice decimal(18,2),
            unit nvarchar(50),
            pinYinCode nvarchar(50),
            lable nvarchar(200),
            stock int,
            isEnable int,
            desc nvarchar(500),
            creationTime DateTime not null,
            creatorUserId varchar(36),
            lastModificationTime DateTime,
            lastModifierUserId varchar(36)
            );`;
        return this.sqlite3Service.createTable(sentence);
    }
    //创建所有表
    createTables(): Promise<ResultDto> {
        return new Promise<ResultDto>((resolve, reject) => {
            const result = new ResultDto();
            this.sqlite3Service.connectDataBase().then((res) => {
                if (res.code != 0) {
                    reject(res);
                } else {
                    try {
                        const id = this.nodeComService.guidV1();
                        const cdate = new Date();
                        this.sqlite3Service.sql(`insert into shopUsers values(?,'admin','店铺管理员','bd53c281ee42a19fae233acdffadec9c',1,'',1,?,null,null,null)`,[id, cdate],'run');
                        
                        result.code = 0;
                        resolve(result);
                    } catch (e) {
                        result.code = -1;
                        result.msg = '创建数据库异常';
                        result.data = e;
                        reject(e);
                    }
                }
            });
        });
    }
    //初始化数据
    initData(): Promise<ResultDto> {
        return new Promise<ResultDto>((resolve, reject) => {
            const result = new ResultDto();
            this.sqlite3Service.connectDataBase().then((res) => {
                if (res.code != 0) {
                    reject(res);
                } else {
                    try {
                        this.createShopUserTable();
                        this.createCategoryTable();
                        this.createProductTable();
                        result.code = 0;
                        resolve(result);
                    } catch (e) {
                        result.code = -1;
                        result.msg = '创建数据库异常';
                        result.data = e;
                        reject(e);
                    }
                }
            });
        });
    }

    initDatabase(): Promise<ResultDto> {
        return new Promise<ResultDto>((resolve, reject) => {
            const result = new ResultDto();
            (new Promise<ResultDto>((resolve, reject) => {
                const resin = new ResultDto();
                this.fs.exists(this.sqlite3Service.databaseFile, (exis) => {
                    this.percent = 20;
                    if (exis) {//存在就删除
                        this.sqlite3Service.close();
                        this.fs.unlink(this.sqlite3Service.databaseFile, (err) => {
                            this.percent = 30;
                            if (err) {
                                resin.code = -1;
                                resin.msg = '数据库删除异常';
                                resin.data = err;
                                console.error(err);
                                reject(resin);
                            } else {
                                console.log('成功删除数据库');
                                resin.code = 0;
                                resolve(resin);
                            }
                        });
                    } else {
                        console.log('数据库不存在');
                        resin.code = 0;
                        resolve(resin);
                    }
                })
            })).then((res) => {
                if(res.code != 0){
                    reject(res);
                } else {
                    this.createTables().then((res) => {
                        this.percent = 50;
                        if (res.code != 0) {
                            reject(res);
                        } else {
                            this.initData().then((res2) => {
                                this.percent = 80;
                                if (res2.code != 0) {
                                    reject(res2);
                                } else {
                                    result.code = 0;
                                    result.msg = '初始化成功';
                                    resolve(result);
                                }
                            });
                        }
                    });
                }
            });
        });
    }
}




