import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
  } from '@angular/core';
  import { Subscription } from 'rxjs';
  import { DelonLocaleService } from '@delon/theme';
  import { InputNumber, InputBoolean } from '@delon/util';
  
  import { RetailNoticeItem, RetailNoticeIconSelect } from './notice-icon.types';
  
  @Component({
    selector: 'retail-notice-icon',
    template: `
    <nz-badge *ngIf="data?.length === 0" [nzCount]="count">
      <i nz-icon type="bell" style="color: rgba(0,0,0,.85)" ></i>
    </nz-badge>
    <nz-popover *ngIf="data?.length > 0"
      [nzVisible]="popoverVisible" (nzVisibleChange)="onVisibleChange($event)" nzTrigger="click"
      nzPlacement="bottomRight"
      nzOverlayClassName="notice-icon">
      <div nz-popover class="alain-default__nav-item notice-icon__item">
        <nz-badge [nzCount]="count">
          <i nz-icon type="bell" class="alain-default__nav-item-icon" style="color: rgba(0,0,0,.85)" ></i>
        </nz-badge>
      </div>
      <ng-template #nzTemplate>
        <nz-spin [nzSpinning]="loading" [nzDelay]="0">
          <nz-tabset>
            <nz-tab *ngFor="let i of data" [nzTitle]="i.title">
              <retail-notice-icon-tab
                [locale]="locale"
                [data]="i"
                (select)="onSelect($event)"
                (clear)="onClear($event)"></retail-notice-icon-tab>
            </nz-tab>
          </nz-tabset>
        </nz-spin>
      </ng-template>
    </nz-popover>
    `,
    host: { '[class.notice-icon__btn]': 'true' },
    preserveWhitespaces: false,
  })
  export class RetailNoticeIconComponent implements OnDestroy {
    private i18n$: Subscription;
    locale: any = {};
  
    @Input()
    data: RetailNoticeItem[] = [];
  
    /** 图标上的消息总数 */
    @Input()
    @InputNumber()
    count: number;
  
    /** 弹出卡片加载状态 */
    @Input()
    @InputBoolean()
    loading = false;
  
    @Output()
    readonly select = new EventEmitter<RetailNoticeIconSelect>();
    @Output()
    readonly clear = new EventEmitter<string>();
  
    /** 手动控制Popover显示 */
    @Input()
    @InputBoolean()
    popoverVisible = false;
  
    @Output()
    readonly popoverVisibleChange = new EventEmitter<boolean>();
  
    constructor(private i18n: DelonLocaleService) {
      this.i18n$ = this.i18n.change.subscribe(
        () => (this.locale = this.i18n.getData('noticeIcon')),
      );
    }
  
    onVisibleChange(result: boolean) {
      this.popoverVisibleChange.emit(result);
    }
  
    onSelect(i: any) {
      this.select.emit(i);
    }
  
    onClear(title: string) {
      this.clear.emit(title);
    }
  
    ngOnDestroy() {
      this.i18n$.unsubscribe();
    }
  }
  