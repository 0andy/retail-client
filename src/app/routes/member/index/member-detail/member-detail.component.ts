import { Component, Injector } from '@angular/core';
import { FormComponentBase } from '@shared/component-base/form-component-base';
import { Member, RetailProduct } from 'app/entities';
import { MemberService } from 'app/services/member';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';

@Component({
    selector: 'member-detail',
    templateUrl: 'member-detail.component.html',
    styleUrls: ['member-detail.component.less']
})
export class MemberDetailComponent extends PagedListingComponentBase<Member>{
    id: string;
    cardTitle: string;
    member: Member = new Member();
    isConfirmLoading = false;
    phone: string;
    constructor(
        injector: Injector
        , private memberService: MemberService
        , private actRouter: ActivatedRoute
        , private router: Router
    ) {
        super(injector);
        this.id = this.actRouter.snapshot.params['id'];
        this.phone = this.actRouter.snapshot.params['phone'];
    }

    ngOnInit() {
        this.getMemberInfo();
    }

    getMemberInfo() {
        if (this.id) {
            this.memberService.getMemberById(this.id).then((result: Member) => {
                this.member = result;
            });
        }
    }
    protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        // console.log(this.keyWord);

        // this.memberService.getAll(this.keyWord, request.skipCount, request.maxResultCount).finally(() => {
        //     finishedCallback();
        // }).then((res) => {
        //     if (res) {
        //         this.dataList = res.items;
        //         this.totalItems = res.totalCount;
        //     } else {
        //         this.dataList = [];
        //         this.totalItems = 0;
        //     }
        // });
    }

    refresh(): void {
        this.getDataPage(this.pageNumber);
    }

    protected delete(entity: Member): void {
    }

    return() {
        this.router.navigate(['member/index']);
    }
}
