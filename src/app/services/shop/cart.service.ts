import { Injectable } from '@angular/core';
import { ResultDto, OrderDetail, Order, RetailProduct, Handover } from 'app/entities';
import { NodeCommonService } from '../common/node-common.service';
import { Sqlite3Service } from '../common/sqlite3.service';

@Injectable()
export class CartService {
    tableName = 'orders';
    constructor(private nodeComService: NodeCommonService,
        private sqlite3Service: Sqlite3Service) {
    }
    //结账
    save(order: Order, orderDetailList: OrderDetail[], otherInfo: any) {
        return new Promise<ResultDto>((resolve, reject) => {
            const _self = this;
            this.sqlite3Service.connectDataBase().then((conn) => {
                if (conn.code != 0) {
                    reject(null);
                } else {
                    _self.sqlite3Service.sql(`begin;`, [], 'run');
                    order.id = _self.nodeComService.guidV1();
                    order.creationTime = new Date();
                    order.submitUserAccount = otherInfo.account;
                    this.sqlite3Service.sql(`insert into orders 
                                        (id,shopId,number,memberId,phone,amount,discountAmount
                                            ,payAmount,status,orderId,paymentType,isPrint,remark,submitTime,submitUserId,
                                            submitUserAccount,creationTime,creatorUserId
                                            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)`,
                        [order.id, otherInfo.shopId, otherInfo.number, order.memberId, order.phone
                            , order.amount, order.discountAmount, order.payAmount, 2
                            , order.orderId, order.paymentType, order.isPrint, order.remark
                            , order.creationTime, otherInfo.userId, otherInfo.account,
                        order.creationTime, otherInfo.userId], 'run').then(res => {
                            if (res.code === 0) {
                                const promises = [];
                                // const promises = orderDetailList.map(function (item) {
                                orderDetailList.map(function (item) {
                                    item.creationTime = new Date();
                                    item.id = _self.nodeComService.guidV4();
                                    var wareId = _self.nodeComService.guidV4();
                                    // ------------------  
                                    _self.sqlite3Service.sql(`select stock from retailProduct where id=?`,
                                        [item.productId]
                                        , 'get').then((res) => {
                                            // if (res.code === 0) {
                                            // console.log(res);
                                            var stock = res.data.stock != null ? res.data.stock : 0;
                                            // console.log(stock - item.num);
                                            // console.log(item.productId);
                                            promises.push(_self.sqlite3Service.sql(`update retailProduct set stock=? where id=?`, [stock - item.num, item.productId], 'run'));

                                            promises.push(_self.sqlite3Service.sql(`insert into warehouseWater (id,shopId,productId,barCode,type,refNo
                                                ,initial,stock,final,desc,creationTime,formCode
                                                ) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                                [wareId, otherInfo.shopId, item.productId, item.barCode, 3
                                                    , order.id, stock, -item.num, stock - item.num, '商品销售', item.creationTime, otherInfo.number]
                                                , 'run'));
                                            promises.push(_self.sqlite3Service.sql(`insert into orderDetail 
                                                (id,orderId,productId,barCode,sellPrice,memberPrice,price,num,creationTime,isRefund
                                                    ) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                                [item.id, order.id, item.productId, item.barCode, item.sellPrice
                                                    , item.memberPrice, item.price, item.num, item.creationTime, 0]
                                                , 'run'));
                                            // }
                                        });
                                    //------------------    
                                    // return _self.sqlite3Service.sql(`insert into orderDetail 
                                    //                             (id,orderId,productId,barCode
                                    //                                 ,sellPrice,memberPrice,price,num,creationTime
                                    //                                 ) values(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                    //     [item.id, order.id, item.productId, item.barCode, item.sellPrice
                                    //         , item.memberPrice, item.price, item.num, item.creationTime]
                                    //     , 'run');
                                });
                                Promise.all(promises).then((pro) => {
                                    const result = new ResultDto();
                                    result.code = 0;
                                    result.msg = '订单详情生成成功';
                                    _self.sqlite3Service.sql(`commit;`, [], 'run');
                                    resolve(result);
                                }).catch((cat) => {
                                    _self.sqlite3Service.sql(`rollback;`, [], 'run');
                                    const result = new ResultDto();
                                    result.code = -1;
                                    result.msg = '订单详情生成失败';
                                    result.data = cat;
                                    console.error(result);
                                });
                            }
                            else {
                                _self.sqlite3Service.sql(`rollback;`, [], 'run');
                                console.log('rollback');
                                console.error(res);
                            }
                        });
                }
            });
        });
    }

    //退款
    refund(order: Order, orderDetailList: OrderDetail[], otherInfo: any) {
        // console.log(order);
        // console.log(orderDetailList);
        // console.log(otherInfo);
        return new Promise<ResultDto>((resolve, reject) => {
            const _self = this;
            this.sqlite3Service.connectDataBase().then((conn) => {
                if (conn.code != 0) {
                    reject(null);
                } else {
                    _self.sqlite3Service.sql(`begin;`, [], 'run');
                    order.id = _self.nodeComService.guidV1();
                    order.creationTime = new Date();
                    order.submitUserAccount = otherInfo.account;
                    this.sqlite3Service.sql(`insert into orders 
                                        (id,shopId,number,memberId,phone,amount,discountAmount
                                            ,payAmount,status,orderId,paymentType,isPrint,remark,submitTime,submitUserId,
                                            submitUserAccount,creationTime,creatorUserId
                                            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)`,
                        [order.id, otherInfo.shopId, otherInfo.number, order.memberId, order.phone
                            , order.amount, order.discountAmount, order.payAmount, 9
                            , order.orderId, 4, false, order.remark
                            , order.creationTime, otherInfo.userId, otherInfo.account,
                        order.creationTime, otherInfo.userId], 'run').then(res => {
                            if (res.code === 0) {
                                const promises = [];
                                orderDetailList.map(function (item) {
                                    console.log(item);
                                    item.creationTime = new Date();
                                    var id = _self.nodeComService.guidV4();
                                    var wareId = _self.nodeComService.guidV4();
                                    _self.sqlite3Service.sql(`select stock from retailProduct where id=?`,
                                        [item.productId]
                                        , 'get').then((res) => {
                                            var stock = res.data.stock != null ? res.data.stock : 0;
                                            console.log(stock + item.num);
                                            promises.push(_self.sqlite3Service.sql(`update retailProduct set stock=? where id=?`, [stock + item.num, item.productId], 'run'));
                                            console.log(1);
                                            promises.push(_self.sqlite3Service.sql(`update orderDetail set isRefund = ? where id=?`, [1, item.id], 'run'));
                                            console.log(2);
                                            promises.push(_self.sqlite3Service.sql(`insert into warehouseWater (id,shopId,productId,barCode,type,refNo
                                                ,initial,stock,final,desc,creationTime,formCode
                                                ) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                                [wareId, otherInfo.shopId, item.productId, item.barCode, 4
                                                    , order.id, stock, item.num, stock + item.num, '订单退回', item.creationTime, otherInfo.number]
                                                , 'run'));
                                            console.log(3);
                                            promises.push(_self.sqlite3Service.sql(`insert into orderDetail 
                                                (id,orderId,productId,barCode,sellPrice,memberPrice,price,num,creationTime,isRefund
                                                    ) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                                [id, order.id, item.productId, item.barCode, item.sellPrice
                                                    , item.memberPrice, item.price, item.num, item.creationTime, 1]
                                                , 'run'));
                                            console.log(4);
                                        });
                                });
                                Promise.all(promises).then((pro) => {
                                    const result = new ResultDto();
                                    result.code = 0;
                                    result.msg = '退款订单详情生成成功';
                                    _self.sqlite3Service.sql(`commit;`, [], 'run');
                                    resolve(result);
                                }).catch((cat) => {
                                    _self.sqlite3Service.sql(`rollback;`, [], 'run');
                                    const result = new ResultDto();
                                    result.code = -1;
                                    result.msg = '退款订单详情生成失败';
                                    result.data = cat;
                                    console.error(result);
                                });
                            }
                            else {
                                _self.sqlite3Service.sql(`rollback;`, [], 'run');
                                console.log('rollback');
                                console.error(res);
                            }
                        });
                }
            });
        });
    }

    getHandovered(otherInfo: any): Promise<Handover> {
        return new Promise<Handover>((resolve, reject) => {
            this.sqlite3Service.execSql(`select * from handover where userId = ? and shopId = ? and loginTime <= ? and handoverTime is null`, [otherInfo.userId, otherInfo.shopId, otherInfo.curTime], 'get').then((res) => {
                if (res.code == 0) {
                    if (res.data) {
                        resolve(Handover.fromJS(res.data));
                    } else {
                        resolve(null);
                    };
                } else {
                    reject(null);
                }
            });
        });
    }

    saveHandover(handover: Handover, userId: string): Promise<ResultDto> {
        const curTime = new Date();
        return this.sqlite3Service.execSql(`update handover set handoverTime=?, orderCount=?, orderAmount=?,
        refundCount=?, refundAmount=?, creationTime=?, creatorUserId=? where id=?`,
            [curTime, handover.orderCount, handover.orderAmount, handover.refundCount, handover.refundAmount,
                curTime, userId, handover.id], 'run');
    }

    getRefundResult(otherInfo: any): Promise<Handover> {
        return new Promise<Handover>((resolve, reject) => {
            this.sqlite3Service.execSql(`select sum(o.payAmount) refundAmount, count(1) refundCount
             from orders o where o.submitUserId = ? 
             and o.status = 9 and  ( o.creationTime > ? and o.creationTime <= ?)`,
                [otherInfo.userId, otherInfo.loginTime, otherInfo.curTime], 'get').then((res) => {
                    if (res.code == 0) {
                        if (res.data) {
                            var handover = new Handover();
                            handover.refundAmount = res.data.refundAmount;
                            handover.refundCount = res.data.refundCount;
                            resolve(Handover.fromJS(handover));
                        } else {
                            resolve(null);
                        };
                    } else {
                        reject(null);
                    }
                });
        });
    }

    getOrderResult(otherInfo: any): Promise<Handover> {
        return new Promise<Handover>((resolve, reject) => {
            this.sqlite3Service.execSql(`select sum(o.payAmount) orderAmount, count(1) orderCount
             from orders o where o.submitUserId = ? 
             and o.status = 2 and  ( o.creationTime > ? and o.creationTime <= ?)`,
                [otherInfo.userId, otherInfo.loginTime, otherInfo.curTime], 'get').then((res) => {
                    if (res.code == 0) {
                        console.log(res.data);
                        if (res.data) {
                            var handover = new Handover();
                            handover.orderAmount = res.data.orderAmount;
                            handover.orderCount = res.data.orderCount;
                            resolve(Handover.fromJS(handover));
                        } else {
                            resolve(null);
                        };
                    } else {
                        reject(null);
                    }
                });
        });
    }
}