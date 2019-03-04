import { Injectable } from '@angular/core';
import { ResultDto } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { PullService } from '../syn';

@Injectable()
export class SystemInitService {

    fs = (<any>window).require("fs");

    constructor(private nodeComService: NodeCommonService,
        private sqlite3Service: Sqlite3Service,
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


    createWarehouseWaterTable() {
        //WarehouseWater
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `
        create table if not exists warehouseWater(
            id varchar(36) PRIMARY KEY not null,
            shopId varchar(36) not null,
            productId varchar(36) not null,
            barCode nvarchar(50) not null,
            type int,
            refNo nvarchar(50),
            initial decimal(18,2),
            stock decimal(18,2),
            final decimal(18,2),
            desc nvarchar(200),
            creationTime DateTime not null,
            formCode nvarchar(50)
            );`;
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    createPutFormTable() {
        //PutForm
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `
        create table if not exists putForm(
            id varchar(36) PRIMARY KEY not null,
            shopId varchar(36) not null,
            formNo nvarchar(50) not null,
            type int,
            deliverer nvarchar(50),
            putTime DataTime,
            refOrderNo nvarchar(50),
            remark nvarchar(200),
            userAccount nvarchar(50),
            creationTime DateTime not null,
            creatorUserId varchar(36),
            approvalTime DateTime,
            approvalUserId varchar(36),
            approvalName nvarchar(50),
            status int no null
            );`;
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    createPutDetailTable() {
        //PutDetail
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `
        create table if not exists putDetail(
            id varchar(36) PRIMARY KEY not null,
            putFormId varchar(36) not null,
            productId varchar(36) not null,
            barCode nvarchar(50) not null,
            purchasePrice decimal(0,0),
            orderNum decimal(18,2),
            num decimal(18,2),
            remark nvarchar(200),
            creationTime DateTime  );`;
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    createOrderDetailTable() {
        // OrderDetail
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `
        create table if not exists orderDetail(
            id varchar(36) PRIMARY KEY not null,
            orderId varchar(36) not null,
            productId varchar(36) not null,
            barCode nvarchar(50) not null,
            isRefund int not null,
            sellPrice decimal(18,2),
            memberPrice decimal(18,2),
            price decimal(18,2),
            num decimal(18,2),
            creationTime DateTime
            );`;
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    createShopTable() {
        // Shop
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `
        create table if not exists shop(
            id varchar(36) PRIMARY KEY not null,
            name nvarchar(100),
            retailId varchar(36),
            retailName nvarchar(50),
            licenseKey nvarchar(50),
            authorizationCode nvarchar(100),
            aaddress nvarchar(200),
            qRCode nvarchar(500),
            longitude float,
            latitude float,
            creationTime DateTime,
            creatorUserId varchar(36),
            lastModificationTime DateTime,
            lastModifierUserId varchar(36)
            );`;
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    createOrderTable() {
        // Order
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `
        create table if not exists orders (
            id varchar(36) PRIMARY KEY not null,
            shopId varchar(36) not null,
            number nvarchar(20) not null,
            memberId varchar(36),
            phone nvarchar(20),
            amount decimal(18,2),
            discountAmount decimal(18,2),
            payAmount decimal(18,2),
            status int,
            orderId varchar(500),
            paymentType int,
            isPrint int,
            remark nvarchar(50),
            submitTime DateTime,
            submitUserId varchar(36),
            submitUserAccount nvarchar(50),
            creationTime DateTime,
            creatorUserId varchar(36)
            );`;
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    createHandoverTable() {
        // Handover
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `
        create table if not exists handover(
            id varchar(36) PRIMARY KEY not null,
            shopId varchar(36) not null,
            userId varchar(36) not null,
            loginTime DateTime,
            handoverTime DateTime,
            orderCount int,
            orderAmount decimal(18,2),
            refundCount int,
            refundAmount decimal(18,2),
            bottomGold decimal(18,2),
            creationTime DateTime,
            creatorUserId varchar(36)
            );`;
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    createInventoryDetailTable() {
        // InventoryDetail
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `
        create table if not exists inventoryDetail (
            id varchar(36) PRIMARY KEY not null,
            inventoryId varchar(36) not null,
            productId varchar(36) not null,
            barCode nvarchar(50) not null,
            currentNum decimal(18,2),
            num decimal(18,2),
            remark nvarchar(200),
            creationTime DateTime
            );`;
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    createInventoryTable() {
        // Inventory
        // 创建表(如果不存在的话,则创建,存在的话, 不会创建的,但是还是会执行回调)
        const sentence = `create table if not exists inventory(
            id varchar(36) PRIMARY KEY not null,
            shopId varchar(36) not null,
            formNo nvarchar(50) not null,
            remark nvarchar(200),
            userAccount nvarchar(50),
            creationTime DateTime not null,
            creatorUserId varchar(36)
            );`;
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    dropAllTables() {
        return new Promise<ResultDto>((resolve, reject) => {
            this.fs.exists(this.sqlite3Service.databaseFile, (exis) => {
                if (exis) {//存在就删除表
                    this.sqlite3Service.connectDataBase().then((res) => {
                        if (res.code != 0) {
                            reject(res);
                        } else {
                            const sentence = `drop table if exists shopUsers;
                            drop table if exists retailProduct;
                            drop table if exists category;
                            drop table if exists warehouseWater;
                            drop table if exists putForm;
                            drop table if exists putDetail;
                            drop table if exists orderDetail;
                            drop table if exists orders;
                            drop table if exists handover;
                            drop table if exists inventory;
                            drop table if exists inventoryDetail;
                            `;
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

    dropShopTable() {
        const sentence = `drop table if exists shop;`;
        return this.sqlite3Service.createOrDeleteTable(sentence);
    }

    addShopAdmin() {
        return this.sqlite3Service.sql(`select id from shop`, [], 'get').then((res) => {
            if (res.code != 0) {
                return new Promise<ResultDto>((resolve, reject) => {
                    reject(res);
                });
            } else {
                const id = this.nodeComService.guidV1();
                const cdate = new Date();
                const shopId = res.data.id;
                return this.sqlite3Service.sql(`insert into shopUsers values(?,'admin'
                ,'bd53c281ee42a19fae233acdffadec9c','店铺管理员',1,?,1,?,null,null,null)`, [id, shopId, cdate], 'run');
            }
        });
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
                        try {
                            this.pullService.pullPoduct(0);
                            console.log('初始化数据成功');
                            result.code = 0;
                            result.msg = '初始化数据成功';
                            resolve(result);
                        } catch (exp) {
                            result.code = -1;
                            result.msg = '初始化数据异常';
                            result.data = exp;
                            reject(result);
                        }

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
                .then(() => { return this.createWarehouseWaterTable(); })
                .then(() => { return this.createPutFormTable(); })
                .then(() => { return this.createPutDetailTable(); })
                .then(() => { return this.createOrderTable(); })
                .then(() => { return this.createOrderDetailTable(); })
                .then(() => { return this.createHandoverTable(); })
                .then(() => { return this.createInventoryTable(); })
                .then(() => { return this.createInventoryDetailTable(); })
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

    initShop(licenseKey: string): Promise<ResultDto> {
        return this.sqlite3Service.connectDataBase()
            .then(() => { return this.dropShopTable(); })
            .then(() => { return this.createShopTable(); })
            .then(() => { return this.pullService.pullShop(licenseKey); });
    }
}