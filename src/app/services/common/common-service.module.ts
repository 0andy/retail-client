import { NgModule } from '@angular/core';
import { NodeCommonService, Sqlite3Service } from '.';

@NgModule({
  providers: [
    NodeCommonService,
    Sqlite3Service,
  ],
})
export class CommonServiceModule { }
