import { Component, Injector } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { PutForm } from 'app/entities';
import { Router } from '@angular/router';
import { putFormService } from 'app/services/warehouse';
import { ProductService } from 'app/services/product';

@Component({
  selector: 'warehouse-put',
  templateUrl: './put.component.html',
  styleUrls: ['./put.component.less'],
  providers: [ProductService]
})
export class WarehousePutComponent extends PagedListingComponentBase<PutForm>{
  keyWord: string;
  constructor(
    injector: Injector
    , private putFormService: putFormService
    , private productService: ProductService
    , private router: Router
  ) {
    super(injector);
  }

  protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.putFormService.getAll(this.keyWord, request.skipCount, request.maxResultCount).finally(() => {
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

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  refreshData() {
    // this.keyWord = null;
    this.pageNumber = 1;
    this.refresh();
  }

  protected delete(entity: PutForm): void {
  }

  createPutFrom() {
    this.router.navigate(['warehouse/put-detail']);
  }

  goDetail(id: string, status: number) {
    this.router.navigate(['warehouse/put-detail', id, status]);
  }

  approval(item: PutForm) {
    let lastModifierUserId: string = this.settings.user['id'];
    this.modalService.confirm({
      nzTitle: '确定要入库当前订单吗?',
      nzContent: `<b>入库单号[${item.formNo}]</b>`,
      nzOnOk: () => {
        this.productService.updateStockByFormId(item.id, lastModifierUserId, this.settings.user['shopId']).then((res) => {
          if (res.code == 0) {
            this.productService.updatePutFormStatus(item.id, lastModifierUserId, this.settings.user['name']).then((r) => {
              if (r.code == 0) {
                this.message.success('入库成功');
                this.refresh();
              } else {
                this.message.error('入库失败');
              }
            });
          } else {
            this.message.error('入库失败');
          }
        });
      }
    });
  }
}
