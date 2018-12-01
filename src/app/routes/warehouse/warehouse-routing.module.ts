import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import { WarehousePutComponent } from './put/put.component';
import { WarehouseStockComponent } from './stock/stock.component';
import { WarehouseWaterComponent } from './water/water.component';
import { WarehouseInventoryComponent } from './inventory/inventory.component';

const routes: Routes = [
  { path: 'put', component: WarehousePutComponent },
  { path: 'stock', component: WarehouseStockComponent },
  { path: 'water', component: WarehouseWaterComponent },
  { path: 'inventory', component: WarehouseInventoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseRoutingModule {}
