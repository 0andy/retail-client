import { Injectable } from '@angular/core';
import { ResultDto, PagedResultDto, ResultEntity, Category, TreeNode, RetailProduct } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { Observable } from "rxjs";
import { resolve } from 'path';

@Injectable()
export class ProductService {
    tableName = 'retailProduct';
    constructor(private nodeComService: NodeCommonService, private sqlite3Service: Sqlite3Service) {
    }

    createTable() {
        this.sqlite3Service.connectDataBase().then((res) => {
            if (res.code == 0) {
                this.sqlite3Service.createProductTable().then((res) => {
                    if (res.code == 0) {
                        console.log('表创建成功');
                    } else {
                        console.log('表创建失败：' + res.data);
                    }
                });
            } else {
                console.log('连接失败：' + res.data);
            }
        });
    }

    getAll(key: string, keyWord: string, skipCount: number, maxResultCount: number): Promise<PagedResultDto<RetailProduct>> {
        const _self = this;
        if (!keyWord) {
            keyWord = '';
        }
        keyWord = '%' + keyWord + '%';
        return new Promise<PagedResultDto<RetailProduct>>((resolve, reject) => {
            _self.sqlite3Service.connectDataBase().then((dres) => {
                if (dres.code == 0) {
                    if (key != 'root') {
                        _self.sqlite3Service.sql(`select count(1) cnum from ${this.tableName} r inner join category c on r.categoryId = c.id where categoryId =? and (r.name like ? or r.barCode like ?)`, [key, keyWord, keyWord], 'get').then((cres) => {
                            const result = new PagedResultDto<RetailProduct>();
                            if (cres.code == 0) {
                                result.totalCount = cres.data.cnum;
                                _self.sqlite3Service.sql(`select r.id, r.barCode, r.name,c.name categoryName,r.unit,r.isEnable from ${this.tableName} r inner join category c on r.categoryId = c.id where categoryId =? and (r.name like ? or r.barCode like ?) limit ${maxResultCount} offset ${skipCount}`, [key, keyWord, keyWord], 'all').then((res) => {
                                    if (res.code == 0) {
                                        if (res.data) {
                                            result.items = RetailProduct.fromJSArray(res.data);
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
                        _self.sqlite3Service.sql(`select count(1) cnum from ${this.tableName} r inner join category c on r.categoryId = c.id  where r.name like ? or r.barCode like ?`, [keyWord, keyWord], 'get').then((cres) => {
                            const result = new PagedResultDto<RetailProduct>();
                            if (cres.code == 0) {
                                result.totalCount = cres.data.cnum;
                                _self.sqlite3Service.sql(`select r.id,r.barCode, r.name,c.name categoryName,r.unit,r.isEnable from ${this.tableName} r inner join category c on r.categoryId = c.id where r.name like ? or r.barCode like ? limit ${maxResultCount} offset ${skipCount}`, [keyWord, keyWord], 'all').then((res) => {
                                    if (res.code == 0) {
                                        if (res.data) {
                                            result.items = RetailProduct.fromJSArray(res.data);
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
                    }
                } else {
                    reject(null);
                }
            });
        });
    }

    get(id: string): Promise<RetailProduct> {
        return new Promise<RetailProduct>((resolve, reject) => {
            this.sqlite3Service.execSql(`select * from ${this.tableName} where id=?`, [id], 'get').then((res) => {
                if (res.code == 0) {
                    if (res.data) {
                        resolve(RetailProduct.fromJS(res.data));
                    } else {
                        reject(null);
                    }
                } else {
                    reject(null);
                }
            });
        });
    }

    getProductByBarCoe(barCode: string, skipCount: number, maxResultCount: number): Promise<PagedResultDto<RetailProduct>> {
        const _self = this;
        return new Promise<PagedResultDto<RetailProduct>>((resolve, reject) => {
            _self.sqlite3Service.connectDataBase().then((dres) => {
                if (dres.code == 0) {
                    _self.sqlite3Service.sql(`select count(1) cnum from ${this.tableName} r inner join category c on r.categoryId = c.id where barCode =?`, [barCode], 'get').then((cres) => {
                        const result = new PagedResultDto<RetailProduct>();
                        if (cres.code == 0) {
                            result.totalCount = cres.data.cnum;
                            _self.sqlite3Service.sql(`select r.id,r.barCode, r.name,c.name categoryName,r.unit,r.isEnable from ${this.tableName} r inner join category c on r.categoryId = c.id where r.barCode =? limit ${maxResultCount} offset ${skipCount}`, [barCode], 'all').then((res) => {
                                if (res.code == 0) {
                                    if (res.data) {
                                        result.items = RetailProduct.fromJSArray(res.data);
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

    save(product: RetailProduct): Promise<ResultDto> {
        if (product.id) {//更新
            product.lastModificationTime = new Date();
            return this.sqlite3Service.execSql(`update ${this.tableName} set barCode=?, name=?, categoryId=?,
            grade=?, purchasePrice=?,
            sellPrice=?, isEnableMember=?, memberPrice=?,
            unit=?, pinYinCode=?,
            stock=?, desc=?,
            lastModificationTime=?, lastModifierUserId=? where id=?`,
                [product.barCode, product.name, product.categoryId
                    , product.grade, product.purchasePrice, product.sellPrice
                    , product.isEnableMember, product.memberPrice, product.unit
                    , product.pinYinCode, product.stock, product.desc
                    , product.lastModificationTime
                    , product.lastModifierUserId, product.id], 'run');
        } else {//新增
            product.creationTime = new Date();
            product.id = this.nodeComService.guidV1();
            return this.sqlite3Service.execSql(`insert into ${this.tableName} 
            (id,shopId,barCode,name,categoryId
                ,grade,purchasePrice
                ,sellPrice,isEnableMember,memberPrice
                ,unit,pinYinCode,stock,isEnable
                ,desc,creationTime,creatorUserId
                ) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [product.id, product.shopId, product.barCode, product.name, product.categoryId
                    , product.grade, product.purchasePrice, product.sellPrice
                    , product.isEnableMember, product.memberPrice, product.unit
                    , product.pinYinCode, product.stock, true, product.desc
                    , product.creationTime, product.creatorUserId], 'run');
        }
    }

    getProductByBarCode(barCode: string): Promise<RetailProduct> {
        return new Promise<RetailProduct>((resolve, reject) => {
            this.sqlite3Service.execSql(`select * from ${this.tableName} where barCode=?`, [barCode], 'get').then((res) => {
                if (res.code == 0) {
                    let result: RetailProduct = new RetailProduct();
                    if (res.data) {
                        result = RetailProduct.fromJS(res.data);
                    } else {
                        result = null;
                    }
                    resolve(result);
                } else {
                    reject(null);
                }
            });
        });
    }

    updateStatus(id: string, isEnable: boolean, userId: string): Promise<ResultDto> {
        const lasttime = new Date();
        return this.sqlite3Service.execSql(`update ${this.tableName} set isEnable=?, lastModificationTime=?, lastModifierUserId=? where id=?`, [isEnable, lasttime, userId, id], 'run');
    }
}


