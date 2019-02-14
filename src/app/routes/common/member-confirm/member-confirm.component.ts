import { Component, Injector, Output, EventEmitter } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { Member } from 'app/entities';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from 'app/services/member';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-member-confirm',
    templateUrl: 'member-confirm.component.html',
    styleUrls: ['member-confirm.component.less']
})
export class MemberConfirmComponent extends PagedListingComponentBase<Member>{
    @Output() modalSelect: EventEmitter<any> = new EventEmitter<any>();
    isVisible = false;
    // phone: string;
    validateForm: FormGroup;
    isConfirmLoading = false;
    title: string;
    btnSave: string;
    isShowForm: boolean = false;
    member: Member = new Member();
    searchPhone: string;
    pageType: string;
    sexTypes: any = [{ text: '男', value: 1 }, { text: '女', value: 0 }];
    private searchText$ = new Subject<string>();
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
            phone: [null, [Validators.compose([Validators.required
                // , Validators.pattern(/^\+?[0-9][0-9]*$/)
                // , Validators.maxLength(11)
                // , Validators.minLength(4)
                , Validators.pattern(/^[1][0-9]{10}$/)
            ])]],
            name: ['', [Validators.maxLength(50)]],
            sex: ['']
        });
        this.searchText$.pipe(
            debounceTime(800),
            distinctUntilChanged()).subscribe(term => {
                this.refreshData();
            });
    }

    onKey(event: any) {
        // if (this.search.filter.length >= 1)
        //     this.endTime = event.timeStamp;
        // setTimeout(() => {
        //     if (this.endTime - event.timeStamp == 0) {
        //         this.refreshData();
        //     }
        // }, 0.5e3);
        // if (this.validateForm.valid) {
        //     this.member.phone = null;
        //     this.member.phone = this.getControlVal('phone');
        //     if (this.member.phone.length >= 4) {
        //         console.log(this.member.phone);
        //         this.searchText$.next(this.member.phone);
        //     }
        if (this.searchPhone.length > 3) {
            this.member.phone = this.getControlVal('phone');
            // console.log('[searchPhone]' + this.searchPhone);
            this.searchText$.next(this.searchPhone);
        }
    }

    show(type?: boolean) {
        // this.validateForm.get('phone').enable();
        this.isVisible = true;
        this.setDefault();
        this.searchPhone = null;
        this.isTableLoading = false;
        this.isShowForm = false;
        this.title = '会员搜索';
        this.btnSave = '确定';
        this.dataList = [];
        if (type == true) {
            this.pageType = 'cart';
        }
        // this.totalItems = -1;
    }

    handleCancel = (e) => {
        this.isVisible = false;
    }

    setFormValues(): void {
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
        this.memberService.getAll(this.searchPhone, request.skipCount, request.maxResultCount).finally(() => {
            // this.memberService.getAll(this.member.phone, request.skipCount, request.maxResultCount).finally(() => {
            finishedCallback();
            // this.isConfirmLoading = false;
        }).then((res) => {
            if (res.totalCount) {
                this.dataList = res.items;
                this.totalItems = res.totalCount;
            } else {
                this.dataList = [];
                this.totalItems = 0;
            }
        });
    }

    createForm() {
        this.isShowForm = true;
        // this.validateForm.get('phone').disable();
        // this.setControlVal('sex', 1);
        this.btnSave = '保存';
        this.title = '会员新增';
        if (this.searchPhone) {
            this.setControlVal('phone', this.searchPhone);
        }
    }

    commit(): void {
        // if (this.totalItems == -1) {
        //     this.member.phone = this.getControlVal('phone');
        //     this.isConfirmLoading = true;
        //     this.getDataPage(this.pageNumber);
        // } else {
        //     this.getFormValues();
        //     this.memberService.getIsExistByPhoneAsync(this.member.phone).then((res) => {
        //         this.isConfirmLoading = true;
        //         console.log(res);

        //         if (!res) {
        //             this.memberService.createMemberAsync(this.member).then((data) => {
        //                 if (data) {
        //                     this.message.success('保存会员成功');
        //                     this.isVisible = false;
        //                     this.modalSelect.emit();
        //                 } else {
        //                     this.message.error('保存数据失败');
        //                 }
        //             });
        //         } else {
        //             this.message.error('该手机号码已注册');
        //         }
        //     });
        // }
        this.getFormValues();
        if (this.validateForm.valid) {
            this.isConfirmLoading = true;
            this.memberService.getIsExistByPhoneAsync(this.member.phone).then((res) => {
                this.isConfirmLoading = false;
                if (!res) {
                    this.memberService.createMemberAsync(this.member).then((data) => {
                        if (data) {
                            this.message.success('保存会员成功');
                            this.isVisible = false;
                            this.modalSelect.emit();
                        } else {
                            this.message.error('保存数据失败');
                        }
                    });
                } else {
                    this.message.error('该手机号码已注册');
                }
            });
        }
    }

    protected delete(entity: Member): void {
    }

    chooseMember(member: Member): void {
        this.modalSelect.emit(member);
        this.isVisible = false;
    }
}
