import { Component, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { Member } from 'app/entities';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from 'app/services/member';
import { Router } from '@angular/router';

@Component({
    selector: 'app-member-confirm',
    templateUrl: 'member-confirm.component.html',
    styleUrls: ['member-confirm.component.less']
})
export class MemberConfirmComponent extends PagedListingComponentBase<Member>{
    isVisible = false;
    // phone: string;
    validateForm: FormGroup;
    isConfirmLoading = false;
    title: string;
    btnSave: string;
    member: Member = new Member();
    sexTypes: any = [{ text: '男', value: 1 }, { text: '女', value: 0 }];
    constructor(
        private memberService: MemberService
        , private router: Router
        , private fb: FormBuilder
        , injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            phone: [null, [Validators.compose([Validators.required, Validators.pattern(/^\+?[0-9][0-9]*$/), Validators.maxLength(50), Validators.minLength(3)])]],
            name: ['', [Validators.maxLength(50)]],
            sex: ['']
        });
    }

    show() {
        this.validateForm.get('phone').enable();
        this.title = '新增会员';
        this.btnSave = '确定';
        this.setControlVal('phone', null);
        this.isVisible = true;
        this.dataList = null;
        this.totalItems = -1;
    }

    handleCancel = (e) => {
        this.isVisible = false;
    }

    setFormValues(phone: string): void {
        this.setControlVal('phone', this.member.phone);
    }

    getFormValues(): void {
        this.member.phone = this.getControlVal('phone');
        this.member.name = this.getControlVal('name');
        this.member.sex = this.getControlVal('sex');
    }

    getControlVal(name: string) {
        return this.validateForm.controls[name].value;
    }

    setControlVal(name: string, val: any) {
        this.validateForm.controls[name].setValue(val);
    }

    goDetail(id: string) {
        this.router.navigate(['product/product-detail', id]);
    }

    setDefault() {
        this.setControlVal('phone', null);
        this.setControlVal('name', null);
        this.setControlVal('sex', 1);
    }

    setNull() {
        this.member.phone = null;
        this.member.name = null;
        this.member.sex = 1;
    }

    refreshData() {
        this.pageNumber = 1;
        this.refresh();
    }

    protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        console.log(this.member);

        this.memberService.getAll(this.member.phone, request.skipCount, request.maxResultCount).finally(() => {
            finishedCallback();
            this.isConfirmLoading = false;
        }).then((res) => {
            if (res.totalCount) {
                this.dataList = res.items;
                this.totalItems = res.totalCount;
            } else {
                this.dataList = null;
                this.setControlVal('sex', 1);
                this.totalItems = 0;
                this.btnSave = '保存';
                this.validateForm.get('phone').disable();
            }
        });
    }

    commit(): void {
        if (this.totalItems == -1) {
            this.member.phone = this.getControlVal('phone');
            this.isConfirmLoading = true;
            this.getDataPage(this.pageNumber);
        } else {
            this.getFormValues();
            this.memberService.getIsExistByPhoneAsync(this.member.phone).then((res) => {
                this.isConfirmLoading = true;
                if (!res) {
                    this.memberService.createMemberAsync(this.member).then((data) => {
                        if (data) {
                            this.message.success('保存会员成功');
                            this.isVisible = false;
                            this.setNull();
                            this.refreshData();
                        } else {
                            this.message.error('保存数据失败');
                        }
                    })
                } else {
                    this.message.error('该手机号码已注册');
                }
            });
        }
    }

    protected delete(entity: Member): void {
    }
}
