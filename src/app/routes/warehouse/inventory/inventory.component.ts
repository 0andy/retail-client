import { Component, Injector } from '@angular/core';
import { ProductService } from 'app/services/product';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import { Inventory } from 'app/entities';
import { putFormService } from 'app/services/warehouse';
import { Router } from '@angular/router';

@Component({
    selector: 'inventory',
    templateUrl: 'inventory.component.html',
    styleUrls: ['inventory.component.less'],
    providers: [ProductService]

})
export class InventoryComponent extends PagedListingComponentBase<Inventory> {
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
        this.putFormService.getAllInventory(this.keyWord, request.skipCount, request.maxResultCount).finally(() => {
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

    resetSearch() {
        this.pageNumber = 1;
        this.keyWord = null;
        this.refresh();
    }

    protected delete(entity: Inventory): void {
    }

    createInventory() {
        this.router.navigate(['warehouse/inventory-detail']);
    }

    goDetail(id: string) {
        this.router.navigate(['warehouse/inventory-detail', id]);
    }
}
