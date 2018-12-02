import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ProductComponent } from './index/index.component';
import { ProductRoutingModule } from './product-routing.module';

const COMPONENT = [
    ProductComponent,
];

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [CommonModule, SharedModule, ProductRoutingModule],
  providers: [],
  declarations: [...COMPONENT, ...COMPONENT_NOROUNT],
  entryComponents: COMPONENT_NOROUNT,
})
export class ProductModule {}
