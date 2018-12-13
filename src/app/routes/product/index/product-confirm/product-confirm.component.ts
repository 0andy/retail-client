import { Component, Output, EventEmitter, OnInit, Injector } from '@angular/core';
import { ProductService } from 'app/services/product';
import { RetailProduct } from 'app/entities';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalFormComponentBase } from '@shared/component-base/modal-form-component-base';

@Component({
    selector: 'app-product-confirm',
    templateUrl: 'product-confirm.component.html',
    styleUrls: ['product-confirm.component.less']
})
export class ProductConfirmComponent implements OnInit {
    // @Output() modalSelect: EventEmitter<any> = new EventEmitter<any>();
    loading = false;
    isVisible = false;
    product: RetailProduct = new RetailProduct();
    validateForm: FormGroup;
    constructor(
        private productService: ProductService
        , private formBuilder: FormBuilder
        , private router: Router
        // , 
        , injector: Injector
    ) {
        // super(injector);
        this.formBuilder = injector.get(FormBuilder);
    }

    ngOnInit() {
        this.validateForm = this.formBuilder.group({
            barCode: [null, [Validators.compose([Validators.pattern(/^\+?[1-9][0-9]*$/), Validators.maxLength(50)])]],
        });
    }
    show() {
        this.product.barCode = null;
        this.isVisible = true;
    }

    handleCancel = (e) => {
        this.isVisible = false;
        this.loading = false;
    }

    protected setFormValues(entity: RetailProduct): void {
        this.setControlVal('barCode', entity.barCode);
    }

    protected getFormValues(): void {
        this.product.barCode = this.getControlVal('barCode');
    }
    getControlVal(name: string): any {
        return this.validateForm.controls[name].value;
    }

    setControlVal(name: string, val: any) {
        this.validateForm.controls[name].setValue(val);
    }
    save() {
        this.loading = true;
        console.log(this.product.barCode);
        this.productService.getProductByBarCode(this.product.barCode).then((res) => {
            if (res) {
                this.product = res;
                console.log(this.product);
            } else {
                this.isVisible = false;
                this.router.navigate(['routes/product/product-detail', this.product.barCode])
            }
            this.loading = false;
        });
    }
}
