import { Component, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { ShopUser } from 'app/entities';
import { SaveShopUserComponent } from './save-user/save-user.component';
//import { ShopUserService } from 'app/services/system/shop-user.service';

@Component({
  selector: 'system-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class SystemUserComponent extends PagedListingComponentBase<ShopUser> {

  keyWord: string;

  constructor(injector: Injector,
    //private shopUserService: ShopUserService
  ) {
    super(injector);
  }

  protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    //throw new Error("Method not implemented.");
    finishedCallback();
    this.dataList = [];
    this.totalItems = 0;
  }
  protected delete(entity: ShopUser): void {
    //throw new Error("Method not implemented.");
  }

  create(): void {
    this.modalHelper
      .open(SaveShopUserComponent, {}, 'md', {
        nzMask: true,
        nzClosable: true,
        nzTitle: '用戶信息',
      })
      .subscribe(isSave => {
        if (isSave) {
          this.refresh();
        }
      });
  }

  edit(item: ShopUser): void {
    this.modalHelper
      .open(SaveShopUserComponent, { id: item.id }, 'md', {
        nzMask: true,
        nzClosable: true,
        nzTitle: '用戶信息',
      })
      .subscribe(isSave => {
        if (isSave) {
          this.refresh();
        }
      });
  }

  createTB() {
    //this.shopUserService.createTable();
  }

}
