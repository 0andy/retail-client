import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { ModalFormComponentBase } from '@shared/component-base/modal-form-component-base';
import { Validators, FormControl } from '@angular/forms';
import { ShopUser } from 'app/entities';

@Component({
    selector: 'app-save-user',
    templateUrl: './save-user.component.html',
    styles: []
})
export class SaveShopUserComponent extends ModalFormComponentBase<ShopUser> implements OnInit {
    @Output() modalSelect: EventEmitter<any> = new EventEmitter<any>();
    user: ShopUser = new ShopUser();
    roles = [{ value: 1, label: '店铺管理员' }, { value: 2, label: '收银员' }];

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        this.validateForm = this.formBuilder.group({
            account: ['', [Validators.required]],
            name: ['', [Validators.required]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [this.confirmationValidator]],
            isEnable: [true],
            role: [2]
        });
        this.fetchData();
    }

    updateConfirmValidator(): void {
        this.getFormControl('confirmPassword').updateValueAndValidity();
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.getControlVal('password')) {
            return { confirm: true, error: true };
        }
    }

    fetchData(): void {
       
    }

    protected submitExecute(finisheCallback: Function): void {
       
    }
    protected setFormValues(entity: ShopUser): void {

    }
    protected getFormValues(): void {
        this.user.account = this.getControlVal('account');
        this.user.name = this.getControlVal('name');
        this.user.role = this.getControlVal('role');
        this.user.password = this.getControlVal('password');
        this.user.isEnable = this.getControlVal('isEnable');
    }
}
