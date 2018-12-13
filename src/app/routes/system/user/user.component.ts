import { Component, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { ShopUser } from 'app/entities';
import { SaveShopUserComponent } from './save-user/save-user.component';
import { ShopUserService } from 'app/services/system/shop-user.service';

@Component({
  selector: 'system-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class SystemUserComponent extends PagedListingComponentBase<ShopUser> {

  keyWord: string;
  accessToken: string;

  constructor(injector: Injector,
    private shopUserService: ShopUserService
  ) {
    super(injector);
    this.accessToken = this.settings.user['token'];
  }

  protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    //console.log(request);
    this.shopUserService.getAll(this.keyWord, request.skipCount, request.maxResultCount).finally(() => {
      finishedCallback();
    }).then((res) => {
      console.log(res);
      if (res) {
        this.dataList = res.items;
        this.totalItems = res.totalCount;
      } else {
        this.dataList = [];
        this.totalItems = 0;
      }
    });
  }

  refreshData() {
    this.pageNumber = 1;
    this.refresh();
  }

  protected delete(entity: ShopUser): void {
    this.modalService.confirm({
      nzTitle: '确定要删除该用户吗？',
      nzContent: `<b>用户账号[${entity.account}]</b>`,
      nzOnOk: () => {
        this.shopUserService.delete(entity.id).then((res) => {
          if (res.code == 0) {
            this.message.success('删除成功');
            this.refreshData();
          } else {
            this.message.error('删除失败');
          }
        });
      }
    });
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

  updateStatus(item: ShopUser): void {
    this.modalService.confirm({
      nzTitle: item.isEnable ? '确定要禁用该用户吗？' : '确定要启用该用户吗？',
      nzContent: `<b>用户账号[${item.account}]</b>`,
      nzOnOk: () => {
        this.shopUserService.updateStatus(item.id, !item.isEnable, this.settings.user['id']).then((res) => {
          if (res.code == 0) {
            this.message.success('操作成功');
          } else {
            this.message.error('操作失败');
          }
        });
      }
    });
  }

  createTB() {
    //this.shopUserService.createTable();
  }

  getAccessToken() {
    this.shopUserService.getAccessToken().then((res) => {
      console.log(res);
      this.accessToken =  res.data.accessToken;
    });
  }
}
