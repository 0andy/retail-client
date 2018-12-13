import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ProductComponent } from './index/index.component';
import { ProductRoutingModule } from './product-routing.module';
import { CategoryService, ProductService } from 'app/services/product';
import { ProductDetailComponent } from './index/product-detail/product-detail.component';
import { ProductConfirmComponent } from './index/product-confirm/product-confirm.component';

const COMPONENT = [
  ProductComponent,
  ProductDetailComponent,
  ProductConfirmComponent
];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [CommonModule, SharedModule, ProductRoutingModule],
  providers: [CategoryService, ProductService],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class ProductModule { }
