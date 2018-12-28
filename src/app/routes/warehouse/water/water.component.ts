import { Component, Injector } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { WarehouseWater } from 'app/entities';
import { warehouseWaterService } from 'app/services/warehouse/warehouse.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'warehouse-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.less'],
})
export class WarehouseWaterComponent extends PagedListingComponentBase<WarehouseWater> {

  keyWord: string;
  dateRange: Date[] = [];
  sumSearch: any = { startTime: null, endTime: null };
  shedateFormat = 'yyyy-MM-dd';
  constructor(
    injector: Injector
    , private waterService: warehouseWaterService
    , private actRouter: ActivatedRoute
    , private router: Router
  ) {
    super(injector);
    this.keyWord = this.actRouter.snapshot.params['barCode'];
  }

  dateFormat(date: any): number {
    if (date === null) {
      return null;
    }
    let d = new Date(date);
    let y = d.getFullYear().toString();
    let m = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    let result = y + '-' + m + '-' + day + ' 00:00:00';
    let time: Date = new Date(result);
    return time.getTime();
  }

  changeTime(times: any[]) {
    if (times.length != 0) {
      this.sumSearch.startTime = this.dateFormat(this.dateRange[0].getTime());
      this.sumSearch.endTime = this.dateFormat(this.dateRange[1].getTime() + 24 * 60 * 60 * 1000);
    } else {
      this.sumSearch.startTime = null;
      this.sumSearch.endTime = null;
    }
  }

  /**
   * 时间范围重置
   */
  resetTime() {
    this.dateRange = [];
    this.sumSearch.startTime = null;
    this.sumSearch.endTime = null;
  }

  protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.waterService.getAll(this.keyWord, this.sumSearch, request.skipCount, request.maxResultCount).finally(() => {
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
    // this.resetTime();
    this.pageNumber = 1;
    this.refresh();
  }

  resetSearch() {
    this.pageNumber = 1;
    this.keyWord = null;
    this.resetTime();
    this.refresh();
  }

  goPutDetail(refNo: string) {
    this.router.navigate(['warehouse/put-detail', refNo, '1']);
  }

  protected delete(entity: WarehouseWater): void {
  }
}
