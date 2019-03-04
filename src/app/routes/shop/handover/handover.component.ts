import { Component, OnInit, Injector, Inject } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base/modal-component-base';
import { CartService } from 'app/services/shop';
import { Handover } from 'app/entities';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
    selector: 'handover',
    templateUrl: 'handover.component.html',
    styleUrls: ['handover.component.less']
})
export class HandoverComponent extends ModalComponentBase implements OnInit {
    handover: Handover = new Handover();
    curUserName: string;
    handoverLoading: boolean = false;
    constructor(private cartService: CartService
        , injector: Injector
        , private router: Router
        , @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {
        super(injector);
    }
    ngOnInit(): void {
        this.getHandoverTime();
    }

    getHandoverTime() {
        this.curUserName = this.settings.user['name'];
        let otherInfo: any = {};
        otherInfo.userId = this.settings.user['id'];
        otherInfo.shopId = this.settings.user['shopId'];
        otherInfo.curTime = new Date().getTime();
        this.cartService.getHandovered(otherInfo).then((res) => {
            if (res) {
                this.handover = res;
            } else {
                this.message.error('没有获取到交接班信息');
            }
        }).then(() => {
            if (this.handover.loginTime) {
                otherInfo.loginTime = this.handover.loginTime;
                this.cartService.getOrderResult(otherInfo).then((res) => {
                    if (res) {
                        this.handover.orderAmount = res.orderAmount;
                        this.handover.orderCount = res.orderCount;
                    } else {
                        this.message.error('没有获取到订单信息');
                    }
                }).then(() => {
                    this.cartService.getRefundResult(otherInfo).then((res) => {
                        if (res) {
                            this.handover.refundAmount = res.refundAmount;
                            this.handover.refundCount = res.refundCount;
                        } else {
                            this.message.error('没有获取到退款信息');
                        }
                    });
                });
            } else {
                this.message.error('没有获取到交接班信息');
            }
        });
    }

    save() {
        this.modalService.confirm({
            // nzTitle: '确定交接班并退出登陆吗?',
            nzContent: `确定交接班并退出登陆吗?`,
            nzOnOk: () => {
                this.handover.orderAmount == null ? 0 : this.handover.orderAmount;
                this.handover.refundAmount == null ? 0 : this.handover.refundAmount;
                this.cartService.saveHandover(this.handover, this.settings.user['id']).then((res) => {
                    this.handoverLoading = false;
                    if (res.code == 0) {
                        this.tokenService.clear();
                        this.router.navigateByUrl(this.tokenService.login_url);
                        // this.message.success('退款成功');
                    } else {
                        this.message.error('交接班失败');
                    }
                });
            },
            nzOnCancel: () => {
                this.handoverLoading = false;
            }
        });
    }

    close() {
        this.modalService.closeAll();
    }
}
