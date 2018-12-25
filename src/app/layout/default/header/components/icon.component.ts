import { Component } from '@angular/core';

@Component({
  selector: 'header-icon',
  template: `
  <nz-dropdown nzTrigger="click" nzPlacement="bottomRight" (nzVisibleChange)="change()">
    <div class="alain-default__nav-item" style="color: rgba(0,0,0,.85)" nz-dropdown>
      <i class="anticon anticon-appstore-o"></i>
    </div>
    <div nz-menu class="wd-xl animated jello">
      <nz-spin [nzSpinning]="loading" [nzTip]="'正在读取数据...'">
        <div nz-row [nzType]="'flex'" [nzJustify]="'center'" [nzAlign]="'middle'" class="app-icons">
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-calendar bg-error text-white"></i>
            <small>交接班</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-file bg-geekblue text-white"></i>
            <small>销售流水</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-pay-circle-o bg-cyan text-white"></i>
            <small>退款</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-printer bg-grey text-white"></i>
            <small>票据补打</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-team bg-purple text-white"></i>
            <small>会员</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-cloud bg-success text-white"></i>
            <small>入库</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-star-o bg-magenta text-white"></i>
            <small>盘点</small>
          </div>
          <div nz-col [nzSpan]="6">
            <i class="anticon anticon-scan bg-warning text-white"></i>
            <small>二维码</small>
          </div> 
        </div>
      </nz-spin>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderIconComponent {
  loading = true;

  change() {
    setTimeout(() => (this.loading = false), 500);
  }
}
