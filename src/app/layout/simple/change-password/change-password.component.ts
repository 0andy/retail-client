import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalFormComponentBase } from '@shared/component-base/modal-form-component-base';
import { ChangePasswordDto, ShopUser } from 'app/entities';
import { ShopUserService } from 'app/services/system';
import { NodeCommonService } from 'app/services/common';

@Component({
    selector: 'app-change-password-modal',
    templateUrl: './change-password.component.html',
    providers: [ShopUserService, NodeCommonService]
})
export class ChangePasswordComponent extends ModalFormComponentBase<ChangePasswordDto> implements OnInit {
    id: string;
    modalVisible = false;
    isConfirmLoading = false;
    isDisablec = false;
    changePassword: ChangePasswordDto = new ChangePasswordDto();
    oldUser: ShopUser = new ShopUser();
    isOldPasswordValid = false;
    validateForm: FormGroup;
    roles: any = [];

    constructor(
        injector: Injector,
        private shopUserService: ShopUserService,
        private nodeComService: NodeCommonService
    ) {
        super(injector);
        this.id = this.settings.user['id'];
    }

    ngOnInit(): void {
        this.validateForm = this.formBuilder.group({
            orgPassword: [null, [Validators.required]],
            newPassword: [null, [Validators.required]],
            checkPassword: [null, Validators.compose([Validators.required, this.confirmationValidator])]
        });

    }

    updateConfirmValidator(): void {
        this.getFormControl('checkPassword').updateValueAndValidity();
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.getControlVal('newPassword')) {
            return { confirm: true, error: true };
        }
    }

    protected setFormValues(entity: ChangePasswordDto): void {
        this.setControlVal('orgPassword', entity.orgPassword);
        this.setControlVal('newPassword', entity.newPassword);
        this.setControlVal('checkPassword', entity.checkPassword);
    }
    protected getFormValues(): void {
        this.changePassword.orgPassword = this.getControlVal('orgPassword');
        this.changePassword.newPassword = this.getControlVal('newPassword');
        this.changePassword.checkPassword = this.getControlVal('checkPassword');
    }

    protected submitExecute(finisheCallback: Function): void {
        this.shopUserService.get(this.id).finally(() => {
            finisheCallback();
        }).then((res) => {
            if (this.nodeComService.md5(this.changePassword.orgPassword) === res.password) {
                this.shopUserService.updatePwd(this.id, this.changePassword.newPassword).finally(() => {
                }).then((r) => {
                    if (r.code === 0) {
                        this.message.success('修改成功!');
                        this.success(true);
                    } else {
                        this.message.error('修改失败，请重试!');
                        console.log(r.data);
                    }
                });
            } else {
                this.message.error('原密码错误!');
            }
        });
    }
}
