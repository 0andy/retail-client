import { Injector, Inject } from "@angular/core";
import { ModalHelper, SettingsService } from "@delon/theme";
import { NzMessageService, NzModalService } from "ng-zorro-antd";

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
  settings: SettingsService;
  modalService: NzModalService;

  constructor(injector: Injector) {
    this.modalHelper = injector.get(ModalHelper);
    this.message = injector.get(NzMessageService);
    this.settings = injector.get(SettingsService);
    this.modalService = injector.get(NzModalService);
  }
}