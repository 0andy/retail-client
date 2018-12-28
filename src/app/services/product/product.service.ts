import { Injectable } from '@angular/core';
import { ResultDto, PagedResultDto, ResultEntity, Category, TreeNode, RetailProduct, SelectProduct, PutDetail, PutFormToProduct, ResultListDto } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';
import { Observable } from "rxjs";
import { resolve } from 'path';

@Injectable()
export class ProductService {
    tableName = 'retailProduct';
    constructor(private nodeComService: NodeCommonService, private sqlite3Service: Sqlite3Service) {
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
                                _self.sqlite3Service.sql(`select r.id, r.barCode, r.name,c.name categoryName,r.unit,r.isEnable,r.stock from ${this.tableName} r inner join category c on r.categoryId = c.id where categoryId =? and (r.name like ? or r.barCode like ?) limit ${maxResultCount} offset ${skipCount}`, [key, keyWord, keyWord], 'all').then((res) => {
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
                                _self.sqlite3Service.sql(`select r.id,r.barCode, r.name,c.name categoryName,r.unit,r.isEnable,r.stock from ${this.tableName} r inner join category c on r.categoryId = c.id where r.name like ? or r.barCode like ? limit ${maxResultCount} offset ${skipCount}`, [keyWord, keyWord], 'all').then((res) => {
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

    getAllWithStatus(key: string, keyWord: string, skipCount: number, maxResultCount: number): Promise<PagedResultDto<RetailProduct>> {
        const _self = this;
        if (!keyWord) {
            keyWord = '';
        }
        keyWord = '%' + keyWord + '%';
        return new Promise<PagedResultDto<RetailProduct>>((resolve, reject) => {
            _self.sqlite3Service.connectDataBase().then((dres) => {
                if (dres.code == 0) {
                    if (key != 'root') {
                        _self.sqlite3Service.sql(`select count(1) cnum from ${this.tableName} r inner join category c on r.categoryId = c.id where categoryId =? and (r.name like ? or r.barCode like ?) and r.isEnable = 1`, [key, keyWord, keyWord], 'get').then((cres) => {
                            const result = new PagedResultDto<RetailProduct>();
                            if (cres.code == 0) {
                                result.totalCount = cres.data.cnum;
                                _self.sqlite3Service.sql(`select r.id, r.barCode, r.name,c.name categoryName,r.unit,r.isEnable, r.stock from ${this.tableName} r inner join category c on r.categoryId = c.id where categoryId =? and (r.name like ? or r.barCode like ?)  and r.isEnable = 1 limit ${maxResultCount} offset ${skipCount}`, [key, keyWord, keyWord], 'all').then((res) => {
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
                        _self.sqlite3Service.sql(`select count(1) cnum from ${this.tableName} r inner join category c on r.categoryId = c.id  where r.isEnable = 1 and (r.name like ? or r.barCode like ?)`, [keyWord, keyWord], 'get').then((cres) => {
                            const result = new PagedResultDto<RetailProduct>();
                            if (cres.code == 0) {
                                result.totalCount = cres.data.cnum;
                                _self.sqlite3Service.sql(`select r.id,r.barCode, r.name,c.name categoryName,r.unit,r.isEnable, r.stock from ${this.tableName} r inner join category c on r.categoryId = c.id where r.isEnable = 1 and (r.name like ? or r.barCode like ?) limit ${maxResultCount} offset ${skipCount}`, [keyWord, keyWord], 'all').then((res) => {
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

    getProductByBarCode(barCode: string, skipCount: number, maxResultCount: number): Promise<PagedResultDto<RetailProduct>> {
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
                ) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [product.id, product.shopId, product.barCode, product.name, product.categoryId
                    , product.grade, product.purchasePrice, product.sellPrice
                    , product.isEnableMember, product.memberPrice, product.unit
                    , product.pinYinCode, 0, true, product.desc
                    , product.creationTime, product.creatorUserId], 'run');
        }
    }

    getProductByBarCod1e(barCode: string): Promise<RetailProduct> {
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

    getIsExistByBarCodeAsync(barCode: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.sqlite3Service.execSql(`select count(1) num from ${this.tableName} where barCode=?`, [barCode], 'get').then((res) => {
                if (res.code == 0) {
                    if (res.data.num > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    reject(null);
                }
            });
        });
    }

    getCurrentIdIsExistByBarCodeAsync(barCode: string, id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.sqlite3Service.execSql(`select count(1) num,id from ${this.tableName} where barCode=?`, [barCode], 'get').then((res) => {
                if (res.code == 0) {
                    if (res.data.num > 0 && res.data.id != id) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
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

    getProductSelectGroup(keyWord: string): Promise<SelectProduct[]> {
        console.log('In');
        const _self = this;
        if (!keyWord) {
            keyWord = '';
        }
        keyWord = '%' + keyWord + '%';
        return new Promise<SelectProduct[]>((resolve, reject) => {
            _self.sqlite3Service.connectDataBase().then((dres) => {
                if (dres.code == 0) {
                    var result: SelectProduct[] = [];
                    _self.sqlite3Service.sql(`select r.id, r.barCode, r.name from ${this.tableName} r where (r.name like ? or r.barCode like ?)  and r.isEnable = 1 limit 5`, [keyWord, keyWord], 'all').then((res) => {
                        if (res.code == 0) {
                            if (res.data) {
                                result = SelectProduct.fromJSArray(res.data);
                            } else {
                                result = [];
                            }
                            resolve(result);
                        } else {
                            console.log(res);
                            reject(null);
                        }
                    });
                } else {
                    reject(null);
                }
            });
        });
    }

    getProuductPutById(id: string): Promise<PutDetail> {
        return new Promise<PutDetail>((resolve, reject) => {
            this.sqlite3Service.execSql(`select r.id productId,r.name productName,r.purchasePrice,r.barCode from ${this.tableName} r where id=?`, [id], 'get').then((res) => {
                if (res.code == 0) {
                    if (res.data) {
                        resolve(PutDetail.fromJS(res.data));
                    } else {
                        reject(null);
                    }
                } else {
                    reject(null);
                }
            });
        });
    }

    updateStockByFormId(putFormId: string, lastModifierUserId: string, shopId: string, formNo: string) {
        return new Promise<ResultEntity<PutFormToProduct[]>>((resolve, reject) => {
            const _self = this;
            const result = new ResultEntity<PutFormToProduct[]>();
            this.sqlite3Service.connectDataBase().then((conn) => {
                if (conn.code != 0) {
                    console.error(conn);
                    reject(null);
                } else {
                    _self.sqlite3Service.sql(`begin;`, [], 'run');
                    // putForm.id = this.nodeComService.guidV1();
                    // putForm.creationTime = new Date();
                    this.sqlite3Service.sql(`
                        select pd.barCode, pd.putFormId putFormId, pd.productId productId
                        ,pd.purchasePrice pPrice, pd.num pNum
                        ,r.purchasePrice rPrice,r.stock rNum from putDetail pd
                         inner join ${this.tableName} r on pd.productId = r.id
                          where pd.putFormId = ?;`,
                        [putFormId], 'all').then(res => {
                            result.data = PutFormToProduct.fromJSArray(res.data);
                            if (res.code == 0) {
                                if (res.data) {
                                    const promises = [];
                                    result.data.forEach(function (item) {
                                        item.lastModificationTime = new Date();
                                        if (!item.pNum) {
                                            item.pNum = 0;
                                        }
                                        if (!item.rNum) {
                                            item.rNum = 0;
                                        }
                                        // 如果价格改变，更新商品进货价格
                                        // if (item.pPrice && item.pPrice != item.rPrice) {
                                        let sum = item.rNum + item.pNum;
                                        let waterId = _self.nodeComService.guidV1();
                                        // console.log(sum);

                                        promises.push(_self.sqlite3Service.sql(`update ${_self.tableName} set purchasePrice=?,
                                        stock=?, lastModificationTime=?, lastModifierUserId=? where id=?`,
                                            [item.pPrice, sum, item.lastModificationTime, lastModifierUserId, item.productId], 'run'));

                                        promises.push(_self.sqlite3Service.sql(`insert into warehouseWater (id,shopId,productId,barCode,type,refNo
                                            ,initial,stock,final,desc,creationTime,formCode
                                            ) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                            [waterId, shopId, item.productId, item.barCode, 1, putFormId, item.rNum, item.pNum, sum, '采购入库', item.lastModificationTime, formNo
                                            ], 'run'));
                                        // }
                                        // 如果入库单数量和库存不等
                                        // if (item.pNum > 0 && item.pNum != item.rNum) {
                                        //     console.log('增加库存');
                                        //     let sum = item.rNum + item.pNum;
                                        //     return _self.sqlite3Service.sql(`update ${this.tableName} set stock=?
                                        //     lastModificationTime=?, lastModifierUserId=? where id=?`,
                                        //         [sum, item.lastModificationTime, lastModifierUserId, item.productId], 'run');
                                        // }
                                    });
                                    // let lastModificationTime: Date = new Date();
                                    // const promises2 =
                                    //     _self.sqlite3Service.sql(`update putForm set status=?
                                    // lastModificationTime=?, lastModifierUserId=? where id=?`,
                                    //         [1, lastModificationTime, lastModifierUserId, putFormId], 'run');
                                    Promise.all(promises).then((pro) => {
                                        const result = new ResultDto();
                                        result.code = 0;
                                        result.msg = '入库成功';
                                        // console.log(result);
                                        // _self.sqlite3Service.sql(`commit;`, [], 'run');
                                        resolve(result);
                                    }).catch((cat) => {
                                        _self.sqlite3Service.sql(`rollback;`, [], 'run');
                                        const result = new ResultDto();
                                        result.code = -1;
                                        result.msg = '入库失败';
                                        result.data = cat;
                                        console.error(result);
                                    });
                                }
                            }
                            else {
                                _self.sqlite3Service.sql(`rollback;`, [], 'run');
                                console.error(res);
                            }
                        });
                }
            });
        });
    }

    updatePutFormStatus(formId: string, lastModifierUserId: string, name: string) {
        return new Promise<ResultDto>((resolve, reject) => {
            const lasttime = new Date();
            this.sqlite3Service.sql(`update putForm set status=?, approvalTime=?,putTime=?,approvalUserId=?, approvalName=? where id=?`, [1, lasttime, lasttime, lastModifierUserId, name, formId], 'run')
                .then(r => {
                    if (r.code == 0) {
                        this.sqlite3Service.sql(`commit;`, [], 'run');
                        const result = new ResultDto();
                        result.code = 0;
                        result.msg = '入库单更新成功';
                        // console.log(result);
                        resolve(result);
                    } else {
                        this.sqlite3Service.sql(`rollback;`, [], 'run');
                        const result = new ResultDto();
                        result.code = -1;
                        result.msg = '入库单更新失败';
                        console.error(result);
                        reject(null);
                    }
                });
        });
    }
}