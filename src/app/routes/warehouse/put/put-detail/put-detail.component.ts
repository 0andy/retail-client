import { Component, Injector } from '@angular/core';
import { putFormService } from 'app/services/warehouse';
import { Router, ActivatedRoute } from '@angular/router';
import { FormComponentBase } from '@shared/component-base/form-component-base';
import { PutForm } from 'app/entities';
import { Validators } from '@angular/forms';

@Component({
    selector: 'put-detail',
    templateUrl: 'put-detail.component.html',
    styleUrls: ['put-detail.component.less']
})
export class PutDetailComponent extends FormComponentBase<PutForm> {
    id: string;
    keyWord: string;
    types: any[] = [{ text: '采购入库', value: 1 }];
    putForm: PutForm = new PutForm();
    constructor(
        injector: Injector
        , private putFormService: putFormService
        , private router: Router
        , private actRouter: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit() {
        this.validateForm = this.formBuilder.group({
            formNo: ['', [Validators.required, Validators.maxLength(50)]],
            deliverer: ['', [Validators.maxLength(50)]],
            type: [''],
            remark: ['', [Validators.maxLength(200)]]
        });
        this.getPutForm();
    }

    getPutForm(): void {
        this.validateForm.get('formNo').disable();
        if (this.id) {
            // this.productService.get(this.id).then((res) => {
            //     if (res) {
            //         this.product = res;
            //         this.tempGrade = res.grade;
            //         this.setFormValues(this.product);
            //     } else {
            //         this.message.error('没有获取到商品信息');
            //     }
            // });
        }
        else {
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
            var newFormNo = 'WP' + formNo;
            this.setControlVal('formNo', newFormNo);
            this.setControlVal('type', 1);
        }
    }

    protected setFormValues(entity: PutForm): void {
        this.setControlVal('formNo', entity.formNo);
        this.setControlVal('deliverer', entity.deliverer);
        this.setControlVal('type', entity.type);
        this.setControlVal('remark', entity.remark);
    }

    protected getFormValues(): void {
        this.putForm.formNo = this.getControlVal('formNo');
        this.putForm.deliverer = this.getControlVal('deliverer');
        this.putForm.type = this.getControlVal('type');
        this.putForm.remark = this.getControlVal('remark');
        if (!this.putForm.id) {
            this.putForm.creatorUserId = this.settings.user['id'];
        }
    }

    protected submitExecute(finisheCallback: Function): void {
    }

    return() {
        this.router.navigate(['warehouse/put']);
    }

}
