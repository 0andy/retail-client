import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { WarehousePutComponent } from './put/put.component';
import { WarehouseStockComponent } from './stock/stock.component';
import { WarehouseWaterComponent } from './water/water.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseInventoryComponent } from './inventory/inventory.component';
import { putFormService, putDetailService, warehouseWaterService } from 'app/services/warehouse';
import { PutDetailComponent } from './put/put-detail/put-detail.component';

const COMPONENT = [
  WarehousePutComponent,
  WarehouseStockComponent,
  WarehouseWaterComponent,
  WarehouseInventoryComponent,
  PutDetailComponent
];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [CommonModule, SharedModule, WarehouseRoutingModule],
  providers: [putFormService, putDetailService, warehouseWaterService],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class WarehouseModule { }
