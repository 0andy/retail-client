import { NgModule } from '@angular/core';
import { NodeCommonService, Sqlite3Service, NodeHttpClient } from '.';

@NgModule({
  providers: [
    NodeCommonService,
    Sqlite3Service,
    NodeHttpClient,
  ],
})
export class CommonServiceModule { }
