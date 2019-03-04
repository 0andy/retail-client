import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ACLGuard } from '@delon/acl';
import { WarehousePutComponent } from './put/put.component';
import { WarehouseStockComponent } from './stock/stock.component';
import { WarehouseWaterComponent } from './water/water.component';
import { InventoryComponent } from './inventory/inventory.component';
import { PutDetailComponent } from './put/put-detail/put-detail.component';
import { SaleWaterComponent } from './sale-water/sale-water.component';
import { SaleDetailComponent } from './sale-water/sale-detail/sale-detail.component';
import { InventoryDetailComponent } from './inventory/inventory-detail/inventory-detail.component';
// import { RefundModalComponent } from './sale-water/refund-modal/refund-modal.component';

const routes: Routes = [
  { path: 'put', component: WarehousePutComponent },
  { path: 'put-detail', component: PutDetailComponent },
  { path: 'put-detail/:id/:status', component: PutDetailComponent },
  { path: 'stock', component: WarehouseStockComponent },
  { path: 'water', component: WarehouseWaterComponent },
  { path: 'water/:barCode', component: WarehouseWaterComponent },
  { path: 'sale-water', component: SaleWaterComponent },
  { path: 'sale-detail/:id', component: SaleDetailComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'inventory-detail', component: InventoryDetailComponent },
  { path: 'inventory-detail/:id', component: InventoryDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseRoutingModule { }
