import { Component, OnInit, Injector } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { PutForm } from 'app/entities';
import { Router, ActivatedRoute } from '@angular/router';
import { putFormService } from 'app/services/warehouse';

@Component({
  selector: 'warehouse-put',
  templateUrl: './put.component.html',
  styleUrls: ['./put.component.less'],
})
export class WarehousePutComponent extends PagedListingComponentBase<PutForm>{
  keyWord: string;
  constructor(
    injector: Injector
    , private putFormService: putFormService
    , private router: Router
    , private actRouter: ActivatedRoute
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
    this.keyWord = null;
    this.pageNumber = 1;
    this.refresh();
  }

  protected delete(entity: PutForm): void {
  }

  createPutFrom() {

  }

  goDetail(id: string) {
    this.router.navigate(['product/product-detail', id]);
  }
}
