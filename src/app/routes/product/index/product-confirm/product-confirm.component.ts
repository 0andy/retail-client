import { Component, Output, EventEmitter, OnInit, Injector } from '@angular/core';
import { ProductService } from 'app/services/product';
import { RetailProduct } from 'app/entities';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalFormComponentBase } from '@shared/component-base/modal-form-component-base';
import { FormComponentBase } from '@shared/component-base/form-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';

@Component({
    selector: 'app-product-confirm',
    templateUrl: 'product-confirm.component.html',
    styleUrls: ['product-confirm.component.less']
})
export class ProductConfirmComponent extends PagedListingComponentBase<RetailProduct>{
    isVisible = false;
    barCode: string;
    validateForm: FormGroup;
    isConfirmLoading = false;
    constructor(
        private productService: ProductService
        , private router: Router
        , private fb: FormBuilder
        , injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            barCode: [null, [Validators.compose([Validators.pattern(/^\+?[1-9][0-9]*$/), Validators.maxLength(50), Validators.required])]],
        });
    }

    updateStatus(item: RetailProduct): void {
        this.modalService.confirm({
            nzTitle: item.isEnable ? '确定要禁用该商品吗?' : '确定要启用该商品吗?',
            nzContent: `<b>商品名称[${item.name}]</b>`,
            nzOnOk: () => {
                this.productService.updateStatus(item.id, !item.isEnable, this.settings.user['id']).then((res) => {
                    if (res.code == 0) {
                        this.message.success('操作成功');
                        this.refresh();
                    } else {
                        this.message.error('操作失败');
                    }
                });
            }
        });
    }

    show() {
        this.setControlVal('barCode', null);
        this.isVisible = true;
        this.dataList = null;
    }

    handleCancel = (e) => {
        this.isVisible = false;
    }

    setFormValues(barCode: string): void {
        this.setControlVal('barCode', this.barCode);
    }

    getFormValues(): void {
        this.barCode = this.getControlVal('barCode');
    }

    getControlVal(name: string) {
        return this.validateForm.controls[name].value;
    }

    setControlVal(name: string, val: any) {
        this.validateForm.controls[name].setValue(val);
    }

    goDetail(id: string) {
        this.router.navigate(['product/product-detail', id]);
    }

    protected fetchData(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.productService.getProductByBarCode(this.barCode, request.skipCount, request.maxResultCount).finally(() => {
            finishedCallback();
            this.isConfirmLoading = false;
        }).then((res) => {
            //先从云端获取Todo
            if (res.totalCount > 0) {
                this.dataList = res.items;
                this.totalItems = res.totalCount;
            } else {
                this.isVisible = false;
                this.router.navigate(['product/product-detail', 'true', this.barCode]);
            }
        });
    }

    search(): void {
        // console.log(this.totalItems);

        // if (this.totalItems) {
        this.getFormValues();
        this.isConfirmLoading = true;
        this.getDataPage(this.pageNumber);
        // } else {
        //     this.modalService.confirm({
        //         nzTitle: '商品已存在，请重新编辑条码',
        //         nzOnOk: () => {
        //             this.getFormValues();
        //             this.isConfirmLoading = true;
        //             this.getDataPage(this.pageNumber);
        //         }
        //     });
        // }
    }

    protected delete(entity: RetailProduct): void {
    }
}
