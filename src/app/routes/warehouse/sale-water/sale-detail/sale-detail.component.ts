import { Component, Injector } from '@angular/core';
import { OrderDetail, Order } from 'app/entities';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { warehouseWaterService } from 'app/services/warehouse';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from 'app/services/shop';

@Component({
    selector: 'sale-detail',
    templateUrl: 'sale-detail.component.html',
    styleUrls: ['sale-detail.component.less'],
    providers: [CartService]
})
export class SaleDetailComponent extends PagedListingComponentBase<OrderDetail>{
    keyWord: string;
    order: Order = new Order();
    refundLoading = false;

    isSelectedAll: boolean = false; // 是否全选
    checkboxCount: number = 0; // 所有Checkbox数量
    checkedLength: number = 0; // 已选中的数量

    constructor(
        injector: Injector
        , private cartService: CartService
        , private waterService: warehouseWaterService
        , private actRouter: ActivatedRoute
        , private router: Router
    ) {
        super(injector);
        this.keyWord = this.actRouter.snapshot.params['id'];
    }

    ngOnInit() {
        this.getOrderInfo();
        this.refreshData();
    }

    getOrderInfo() {
        this.waterService.getOrderInfo(this.keyWord).then((res) => {
            if (res) {
                // console.log(res);
                this.order = res;
            } else {
                this.message.error('没有获取到订单信息');
            }
        });
    }

    refreshData() {
        this.isSelectedAll = false;
        this.checkedLength = 0;
        this.pageNumber = 1;
        this.getDataPage(this.pageNumber);
    }


    protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.waterService.getSaleDetail(this.keyWord).finally(() => {
            finishedCallback();
        }).then((res) => {
            if (res) {
                this.dataList = res.items;
                this.totalItems = res.totalCount;
            } else {
                this.dataList = [];
                this.totalItems = 0;
            }
        });
    }

    protected delete(entity: OrderDetail): void {
    }

    return() {
        this.router.navigate(['warehouse/sale-water']);
    }

    isCancelCheck(x: any) {
        this.checkedLength = this.dataList.filter(v => v.selected && v.isRefund == false).length;
        this.checkboxCount = this.dataList.filter(v => v.isRefund == false).length;
        if (this.checkboxCount - this.checkedLength > 0) {
            this.isSelectedAll = false;
        } else {
            this.isSelectedAll = true;
        }
    }

    checkAll(e) {
        var v = this.isSelectedAll;
        this.dataList.filter(v => v.isRefund == false).forEach(u => {
            u.selected = v;
        });
        if (this.isSelectedAll == false) {
            this.checkedLength = 0;
        } else {
            this.checkedLength = this.dataList.filter(v => v.selected && v.isRefund == false).length;
        }
    }

    createNumber() {
        var date = new Date();
        var year = date.getFullYear().toString(); //获取当前年份
        var mon = (date.getMonth() + 1); //获取当前月份
        var da = date.getDate(); //获取当前日
        var h = date.getHours(); //获取小时
        var m = date.getMinutes(); //获取分钟
        var s = date.getSeconds(); //获取秒
        var formNo = year
            + (mon > 9 ? mon : '0' + mon).toString()
            + (da > 9 ? da : '0' + da).toString()
            + (h > 9 ? h : '0' + h).toString()
            + (m > 9 ? m : '0' + m).toString()
            + (s > 9 ? s : '0' + s).toString();
        return formNo;
    }

    getOtherInfo() {
        let otherInfo: any = {};
        otherInfo.userId = this.settings.user['id'];
        otherInfo.account = this.settings.user['account'];
        otherInfo.shopId = this.settings.user['shopId'];
        var formNo = this.createNumber();
        otherInfo.number = 'WR' + formNo;
        return otherInfo;
    }

    refundAll() {
        if (this.checkedLength > 0) {
            if (this.order.id) {
                this.refundLoading = true;
                let orderDetail: OrderDetail[] = [];
                orderDetail = this.dataList.filter(v => v.selected && v.isRefund == false);
                var totalPrice = 0;
                this.dataList.filter(v => v.selected && v.isRefund == false).forEach(v => {
                    totalPrice += v.price;
                });
                var curOrder: Order = new Order();
                curOrder = this.order.clone();
                curOrder.orderId = orderDetail.map(v => {
                    return v.id;
                }).join(',');
                curOrder.remark = '现金退款';
                curOrder.orderId = this.order.id;
                this.modalService.confirm({
                    nzTitle: '确定要退款所选商品吗?',
                    nzContent: `<b>总计金额：¥ ${totalPrice}</b>`,
                    nzOnOk: () => {
                        this.cartService.refund(this.order, orderDetail, this.getOtherInfo()).then((res) => {
                            this.refundLoading = false;
                            if (res.code == 0) {
                                this.message.success('退款成功');
                                this.refresh();
                            } else {
                                this.message.error('退款失败');
                            }
                        });
                    },
                    nzOnCancel: () => {
                        this.refundLoading = false;
                    }
                });
            }
        } else {
            this.message.error('没有选中订单');
        }
    }
    // refund(item: OrderDetail) {
    //     this.modalService.confirm({
    //         nzTitle: '确定要退款该商品吗?',
    //         nzContent: `<b>商品名称[${item.productName}]，金额：¥ ${item.price}</b>`,
    //         nzOnOk: () => {
    //             let orderDetail: OrderDetail[] = [];
    //             orderDetail.push(item);
    //             var curOrder: Order = new Order();
    //             curOrder = this.order.clone();
    //             curOrder.orderId = this.order.id;
    //             curOrder.remark = '现金退款';
    //             this.cartService.refund(curOrder, orderDetail, this.getOtherInfo()).then((res) => {
    //                 if (res.code == 0) {
    //                     this.message.success('退款成功');
    //                     this.refresh();
    //                 } else {
    //                     this.message.error('退款失败');
    //                 }
    //             });
    //         }
    //     });
    // }
}