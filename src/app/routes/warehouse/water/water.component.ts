import { Component, OnInit, Injector } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { WarehouseWater, PutForm } from 'app/entities';
import { warehouseWaterService } from 'app/services/warehouse/warehouse.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'warehouse-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.less'],
})
export class WarehouseWaterComponent extends PagedListingComponentBase<WarehouseWater> {

  keyWord: string;
  constructor(
    injector: Injector
    , private waterService: warehouseWaterService
    , private actRouter: ActivatedRoute
  ) {
    super(injector);
    this.keyWord = this.actRouter.snapshot.params['barCode'];
    console.log(this.keyWord);
  }

  protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.waterService.getAll(this.keyWord, request.skipCount, request.maxResultCount).finally(() => {
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

  protected delete(entity: WarehouseWater): void {
  }
}
