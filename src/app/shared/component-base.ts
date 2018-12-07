import { Injector } from "@angular/core";
import { ModalHelper } from "@delon/theme";
import { NzMessageService } from "ng-zorro-antd";

export abstract class AppComponentBase {
    query: any = {
        pageIndex: 1,
        pageSize: 10,
        skipCount: function () { return (this.pageIndex - 1) * this.pageSize; },
        total: 0,
        sorter: '',
        status: -1,
        statusList: []
      };
      modalHelper: ModalHelper;
      message: NzMessageService;
      
      constructor(injector: Injector) {
        this.modalHelper = injector.get(ModalHelper);
        this.message = injector.get(NzMessageService);
      }

}