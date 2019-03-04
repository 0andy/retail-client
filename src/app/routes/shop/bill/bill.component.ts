import { Component, Output, EventEmitter, Injector } from '@angular/core';
import { FormComponentBase } from '@shared/component-base/form-component-base';
import { OrderDetail, Order, CommPrice, Member } from 'app/entities';
import { Validators, FormControl } from '@angular/forms';
import { CartService } from 'app/services/shop';

@Component({
    selector: 'bill',
    templateUrl: 'bill.component.html',
    styleUrls: ['bill.component.less']
})
export class BillComponent extends FormComponentBase<OrderDetail>{
    @Output() modalSelect: EventEmitter<any> = new EventEmitter<any>();
    order: Order = new Order();
    orderDetail: OrderDetail[] = [];
    member: Member = new Member();
    commPrice: CommPrice = new CommPrice();
    actuallyPaid: number = 0;
    change: number = 0;
    isVisible = false;
    isConfirmLoading = false;
    selectedIndex = 0;
    constructor(
        injector: Injector
        , private cartService: CartService
    ) {
        super(injector);
    }
    ngOnInit() {
        this.validateForm = this.formBuilder.group({
            income: null,
            isPrint: null,
            actuallyPaid: ['', [Validators.pattern(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/), Validators.maxLength(50)]],
        });
    }

    show(commPrice: CommPrice, orderDetail: OrderDetail[], member?: Member) {
        if (member) {
            this.member = member;
        }
        this.orderDetail = orderDetail;
        this.commPrice = commPrice;
        this.setControlVal('isPrint', false);
        this.setControlVal('income', commPrice.totalPrice);
        this.setControlVal('actuallyPaid', commPrice.totalPrice);
        this.isVisible = true;
    }

    changeBill() {
        this.change = (this.getControlVal('actuallyPaid') == null ? 0 : this.getControlVal('actuallyPaid')) - this.getControlVal('income');
    }
    protected setFormValues(entity: any): void {
        // this.setControlVal('change', entity.num);
    }

    protected getFormValues(): void {
        this.order.isPrint = this.getControlVal('isPrint');
    }

    protected submitExecute(finisheCallback: Function): void {
        if (this.validateForm.valid) {
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
            let otherInfo: any = {};
            otherInfo.userId = this.settings.user['id'];
            otherInfo.account = this.settings.user['account'];
            otherInfo.shopId = this.settings.user['shopId'];
            otherInfo.number = 'WO' + formNo;
            if (this.member) {
                this.order.memberId = this.member.id;
                this.order.phone = this.member.phone;
            }
            console.log(this.selectedIndex);
            if (this.selectedIndex == 0) {
                this.order.paymentType = 4;
            }
            this.order.amount = this.commPrice.orderPrice;
            this.order.discountAmount = this.commPrice.offerPrice;
            this.order.payAmount = this.commPrice.totalPrice
            this.cartService.save(this.order, this.orderDetail, otherInfo).then((res) => {
                finisheCallback();
                if (res.code == 0) {
                    this.message.success('结算成功');
                    this.isVisible = false;
                    this.modalSelect.emit();
                } else {
                    this.message.error('结算失败');
                    console.log(res.data);
                }
            });
        }
    }

    handleCancel = (e) => {
        this.isVisible = false;
    }
}
