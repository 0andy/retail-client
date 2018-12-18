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
    phone: string;
    validateForm: FormGroup;
    isConfirmLoading = false;
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
            phone: [null, [Validators.compose([Validators.pattern(/^\+?[0-9][0-9]*$/), Validators.maxLength(50)])]],
        });
    }

    show() {
        this.setControlVal('phone', null);
        this.isVisible = true;
        this.dataList = null;
    }

    handleCancel = (e) => {
        this.isVisible = false;
    }

    setFormValues(phone: string): void {
        this.setControlVal('phone', this.phone);
    }

    getFormValues(): void {
        this.phone = this.getControlVal('phone');
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

    refreshData() {
        this.phone = null;
        this.pageNumber = 1;
        this.refresh();
    }

    protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.memberService.getAll(this.phone, request.skipCount, request.maxResultCount).finally(() => {
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

    search(): void {
        this.getFormValues();
        this.isConfirmLoading = true;
        this.getDataPage(this.pageNumber);
    }

    protected delete(entity: Member): void {
    }
}
