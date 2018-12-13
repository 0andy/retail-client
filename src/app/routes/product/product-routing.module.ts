import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './index/index.component';
import { ProductDetailComponent } from './index/product-detail/product-detail.component';

const routes: Routes = [
  { path: 'index', component: ProductComponent },
  {
    path: 'product-detail',
    component: ProductDetailComponent,
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule { }
