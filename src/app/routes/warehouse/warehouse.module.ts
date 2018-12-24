import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { WarehousePutComponent } from './put/put.component';
import { WarehouseStockComponent } from './stock/stock.component';
import { WarehouseWaterComponent } from './water/water.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseInventoryComponent } from './inventory/inventory.component';
import { putFormService } from 'app/services/warehouse';
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
  providers: [putFormService],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class WarehouseModule { }
