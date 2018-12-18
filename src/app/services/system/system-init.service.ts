import { Injectable } from '@angular/core';
import { ResultDto, ShopUser, PagedResultDto, ResultEntity } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { Observable } from "rxjs";
import { NodeHttpClient } from '../common';
import { SettingsService } from '@delon/theme';
import { PullService } from '../syn';

@Injectable()
export class SystemInitService {

    fs = (<any>window).require("fs");
    percent: number;

    constructor(private nodeComService: NodeCommonService,
        private sqlite3Service: Sqlite3Service,
        private nodeHttpClient: NodeHttpClient,
        private settingsService: SettingsService,
        private pullService: PullService) {
    }

    createShopUserTable() {
        //ShopUser
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `
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
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    createCategoryTable() {
        //Category
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `
        create table if not exists category(
            id int PRIMARY KEY not null,
            name varchar(200) not null,
            seq int not null,
            creationTime datetime not null
        );`;
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    createProductTable() {
        //Product
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `
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
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    dropAllTables() {
        return new Promise<ResultDto>((resolve, reject) => {
            this.fs.exists(this.sqlite3Service.databaseFile, (exis) => {
                this.percent = 20;
                if (exis) {//存在就删除表
                    this.sqlite3Service.connectDataBase().then((res) => {
                        if (res.code != 0) {
                            reject(res);
                        } else {
                            const sentence = `drop table if exists shopUsers;
                            drop table if exists retailProduct;
                            drop table if exists category;`;
                            this.sqlite3Service.createOrDeleteTable(sentence).then((res) => {
                                if (res.code != 0) {
                                    reject(res);
                                } else {
                                    res.msg = '删除数据表成功';
                                    console.log('删除数据表成功');
                                    resolve(res);
                                }
                            });
                        }
                    });
                } else {
                    console.log('数据库不存在');
                    const resin = new ResultDto();
                    resin.code = 0;
                    resolve(resin);
                }
            })

        });
    }

    addShopAdmin() {
        const id = this.nodeComService.guidV1();
        const cdate = new Date();
        return this.sqlite3Service.sql(`insert into shopUsers values(?,'admin'
            ,'bd53c281ee42a19fae233acdffadec9c','店铺管理员',1,'',1,?,null,null,null)`, [id, cdate], 'run');
    }

    //初始化数据
    initData(): Promise<ResultDto> {
        return new Promise<ResultDto>((resolve, reject) => {
            const result = new ResultDto();
            this.sqlite3Service.connectDataBase()
                .then(() => { return this.addShopAdmin(); })
                .then(() => { return this.pullService.pullCategory(); })
                .then((res) => {
                    if (res.code != 0) {
                        reject(res);
                    } else {
                        console.log('初始化数据成功');
                        result.code = 0;
                        result.msg = '初始化数据成功';
                        resolve(result);
                    }
                })
                .catch((cat) => {
                    result.code = -1;
                    result.msg = '初始化数据异常';
                    result.data = cat;
                    reject(result);
                });
        });
    }
    //创建所有表
    createTables(): Promise<ResultDto> {
        return new Promise<ResultDto>((resolve, reject) => {
            const result = new ResultDto();
            this.sqlite3Service.connectDataBase()
                .then(() => { return this.createShopUserTable(); })
                .then(() => { return this.createCategoryTable(); })
                .then(() => { return this.createProductTable(); })
                .then((res) => {
                    if (res.code == 0) {
                        result.code = 0;
                        result.msg = '创建数据表成功';
                        console.log('创建数据表成功');
                        resolve(result);
                    } else {
                        reject(res);
                    }
                })
                .catch((cat) => {
                    result.code = -1;
                    result.msg = '创建数据库异常';
                    result.data = cat;
                    reject(result);
                });
        });
    }

    initDatabase(): Promise<ResultDto> {
        return new Promise<ResultDto>((resolve, reject) => {
            const result = new ResultDto();
            this.dropAllTables()
                .then(() => { return this.createTables(); })
                .then(() => { return this.initData(); })
                .then((res2) => {
                    if (res2.code != 0) {
                        reject(res2);
                    } else {
                        result.code = 0;
                        result.msg = '初始化成功';
                        resolve(result);
                    }
                })
                .catch((cat) => {
                    result.code = -1;
                    result.msg = '初始化异常';
                    result.data = cat;
                    reject(result);
                });
        });
    }
}




