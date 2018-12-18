import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { MemberService } from 'app/services/member/member.service';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { Member } from 'app/entities';
import { Router } from '@angular/router';
import { MemberConfirmComponent } from 'app/routes/common/member-confirm/member-confirm.component';

@Component({
  selector: 'member-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
})
export class MemberComponent extends PagedListingComponentBase<Member>{
  @ViewChild('createModal') createModal: MemberConfirmComponent;
  keyWord: string;
  phone: string;
  // isExist:boolean =true;

  constructor(injector: Injector
    , private router: Router
    , private memberService: MemberService) {
    super(injector);
  }

  protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    console.log(this.keyWord);

    this.memberService.getAll(this.keyWord, request.skipCount, request.maxResultCount).finally(() => {
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

  getIsExistByPhoneAsync() {
    this.memberService.getIsExistByPhoneAsync(this.phone).then(result => {
      // this.isExist = result;
      console.log(result);
      if (!result) {
        //todo
      }
    });
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  refreshData() {
    this.keyWord = null;
    this.pageNumber = 1;
    this.refresh();
  }

  protected delete(entity: Member): void {
  }

  createMember() {
    this.createModal.show();
  }

  goDetail(id: string) {
    // this.router.navigate(['product/product-detail', id]);
  }
}
