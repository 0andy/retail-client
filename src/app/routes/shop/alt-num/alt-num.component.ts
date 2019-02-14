import { Component, Injector, Output, EventEmitter } from '@angular/core';
import { FormComponentBase } from '@shared/component-base/form-component-base';
import { Validators } from '@angular/forms';
import { OrderDetail } from 'app/entities';

@Component({
    selector: 'alt-num',
    templateUrl: 'alt-num.component.html',
    styleUrls: ['alt-num.component.less']
})
export class AltNumComponent extends FormComponentBase<OrderDetail>{
    @Output() modalSelect: EventEmitter<any> = new EventEmitter<any>();
    orderDetail: OrderDetail = new OrderDetail();
    isVisible = false;
    isConfirmLoading = false;
    constructor(
        injector: Injector
    ) {
        super(injector);
    }
    ngOnInit() {
        this.validateForm = this.formBuilder.group({
            num: ['', [Validators.required, Validators.pattern(/^\+?[1-9][0-9]*$/), Validators.maxLength(50)]],
        });
    }

    show(data: OrderDetail) {
        this.setControlVal('num', data.num);
        // this.orderDetail.id = data.id;
        // this.orderDetail.num = data.num;
        // this.orderDetail.productName = data.productName;
        this.orderDetail = data;
        this.isVisible = true;
    }

    protected setFormValues(entity: OrderDetail): void {
        this.setControlVal('num', entity.num);
    }

    protected getFormValues(): void {
        this.orderDetail.num = this.getControlVal('num');
    }

    protected submitExecute(finisheCallback: Function): void {
        if (this.validateForm.valid) {
            this.modalSelect.emit(this.orderDetail);
            this.isVisible = false;
        }
    }

    handleCancel = (e) => {
        this.isVisible = false;
    }
}
