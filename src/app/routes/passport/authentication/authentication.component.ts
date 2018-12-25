import { Component, OnInit, Injector } from '@angular/core';
import { ModalFormComponentBase } from '@shared/component-base/modal-form-component-base';
import { Validators } from '@angular/forms';
import { AuthenticationService, SystemInitService } from 'app/services/system';
import { PullService } from 'app/services/syn';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styles: [],
    providers: [AuthenticationService, PullService, SystemInitService]
})
export class AuthenticationComponent extends ModalFormComponentBase<any> implements OnInit {
    licenseKey: string;
    authorizationCode: string;
    loading = false;
    isAuthorization = false;

    constructor(
        injector: Injector,
        private authenticationService: AuthenticationService,
        private systemInitService: SystemInitService

    ) {
        super(injector);
    }

    ngOnInit() {
        this.validateForm = this.formBuilder.group({
            licenseKey: ['', [Validators.required]],
            authorizationCode: ['', [Validators.required]]
        });
        this.fetchData();
    }

    fetchData(): void {

    }

    protected submitExecute(finisheCallback: Function): void {
        this.loading = true;
        this.authenticationService.authenticationAsync(this.licenseKey, this.authorizationCode).then((res) => {
            if (res.code != 0) {
                this.loading = false;
                finisheCallback();
                this.message.error(res.msg);
            } else {
                //this.percent = 10;
                this.systemInitService.initShop(this.licenseKey)
                    .then(() => { 
                        //this.percent = 50;
                        return this.systemInitService.initDatabase(); 
                    })
                    .then((res) => {
                        console.log('init database:' + res);
                        this.loading = false;
                        finisheCallback();
                        this.isAuthorization = true;
                        //this.percent = 100;
                        //this.success(true);
                    }).catch((err) => {
                        console.error(err);
                    });
            }
        }).catch(() => {
            this.loading = false;
            finisheCallback();
            this.message.error('网络异常，请检查网络是否可用');
        });
        /*finisheCallback();
        if (res.code == 0) {
            this.message.success('保存数据成功');
            this.success(true);
        } else {
            this.message.error('保存数据失败');
            console.log(res.data);
        }*/
    }

    protected setFormValues(entity: any): void {
        this.setControlVal('licenseKey', this.licenseKey);
        this.setControlVal('authorizationCode', this.authorizationCode);
    }

    protected getFormValues(): void {
        this.licenseKey = this.getControlVal('licenseKey');
        this.authorizationCode = this.getControlVal('authorizationCode');
    }

    complete(){
        this.success(true);
    }
}
