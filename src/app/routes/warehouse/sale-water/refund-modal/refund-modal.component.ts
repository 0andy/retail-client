import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { OrderDetail, Order } from 'app/entities';
import { warehouseWaterService } from 'app/services/warehouse';
import { CartService } from 'app/services/shop';
import { ModalComponentBase } from '@shared/component-base/modal-component-base';

@Component({
    selector: 'refund-modal',
    templateUrl: 'refund-modal.component.html',
    styleUrls: ['refund-modal.component.less'],
    providers: [CartService, warehouseWaterService]
})
export class RefundModalComponent extends ModalComponentBase implements OnInit {
    keyWord: string;
    totalItems: number = 0;
    order: Order = new Order();
    dataList: OrderDetail[] = [];
    refundLoading = false;
    isSelectedAll: boolean = false; // 是否全选
    checkboxCount: number = 0; // 所有Checkbox数量
    checkedLength: number = 0; // 已选中的数量
    isTableLoading: boolean = false;

    id: string;
    modalVisible = false;
    isConfirmLoading = false;
    constructor(private waterService: warehouseWaterService
        , private cartService: CartService
        , injector: Injector
    ) {
        super(injector);
    }
    ngOnInit(): void {
        // console.log(this.settings.user['time']);
    }

    refreshData() {
        this.isSelectedAll = false;
        this.checkedLength = 0;
        if (this.keyWord != '') {
            this.isTableLoading = true;
            this.waterService.getOrderInfoByNo(this.keyWord).then((res) => {
                if (res) {
                    this.order = res;
                } else {
                    this.isTableLoading = false;
                    this.message.error('没有获取到订单信息');
                }
            }).then(() => {
                if (this.order.id) {
                    this.getOrderDetailInfo();
                }
            })
        }
    }

    getOrderDetailInfo() {
        this.waterService.getSaleDetail(this.order.id).finally(() => {
        }).then((res) => {
            this.isTableLoading = false;
            if (res) {
                this.dataList = res.items;
                this.totalItems = res.totalCount;
            } else {
                this.dataList = [];
                this.totalItems = 0;
            }
        });
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
                                this.refreshData();
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
}
