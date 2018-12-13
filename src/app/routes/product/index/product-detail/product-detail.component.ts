import { Component, OnInit, Injector } from '@angular/core';
import { ProductService, CategoryService } from 'app/services/product';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectGroup, RetailProduct } from 'app/entities';
import { FormComponentBase } from '@shared/component-base/form-component-base';

@Component({
    selector: 'product-detail',
    templateUrl: 'product-detail.component.html',
    styleUrls: ['product-detail.component.less'],
})

export class ProductDetailComponent extends FormComponentBase<RetailProduct> implements OnInit {
    id: string;
    cardTitle: string;
    product: RetailProduct = new RetailProduct();
    gradeTypes: any = [
        { text: '一类烟', value: 1 }, { text: '二类烟', value: 2 }, { text: '三类烟', value: 3 }
        , { text: '四类烟', value: 4 }, { text: '五类烟', value: 5 }
    ];
    isEnableTypes: any[] = [{ text: '启用', value: 1 }, { text: '禁用', value: 0 }];
    isConfirmLoading = false;
    isDelete = false;
    productTypes: SelectGroup[] = [];
    tempGrade?: number;
    lableList: string[] = [];
    lablesText: string;
    constructor(
        injector: Injector
        , private productService: ProductService
        , private categoryService: CategoryService
        , private actRouter: ActivatedRoute
        , private router: Router
    ) {
        super(injector);
    }
    ngOnInit() {
        this.validateForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(200)]],
            pinYinCode: ['', [Validators.maxLength(200)]],
            productType: ['', [Validators.required]],
            unit: ['', [Validators.maxLength(50)]],
            barCode: ['', [Validators.pattern(/^\+?[1-9][0-9]*$/), Validators.maxLength(50)]],
            purchasePrice: ['', [Validators.pattern(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/), Validators.maxLength(18)]],
            retailPrice: ['', [Validators.pattern(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/), Validators.maxLength(18)]],
            sellPrice: ['', [Validators.pattern(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/), Validators.maxLength(18)]],
            memberPrice: ['', [Validators.pattern(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/), Validators.maxLength(18)]],
            desc: ['', [Validators.maxLength(500)]],
            isEnableMember: ['', [Validators.required]],
            grade: [''],
            lable: ['', [Validators.maxLength(30)]],
            stock: ['', [Validators.pattern(/^([1-9]\d*|[0]{1,1})$/)]]
        });
        this.fetchData();
    }

    getProductTypes() {
        this.categoryService.getCategorySelectGroup().finally(() => {
        }).then((res) => {
            if (res) {
                this.productTypes = res;
            } else {
                this.productTypes = [];
            }
        });
    }

    fetchData(): void {
        if (this.id) {
            this.cardTitle = '编辑商品';
            this.productService.get(this.id).then((res) => {
                if (res) {
                    this.product = res;
                    this.tempGrade = res.grade;
                    // if (result.photoUrl) {
                    //     this.product.showPhoto = this.host + this.product.photoUrl;
                    // }
                    // if (this.product.lable != null && this.product.lable.length != 0) {
                    //     this.lableList = this.product.lable.split(',');
                    // }
                    this.setFormValues(this.product);
                } else {
                    this.message.error('没有获取到商品信息');
                }
            });
        } else {
            this.cardTitle = '新增商品';
            this.product.grade = 1;
        }
    }

    protected setFormValues(entity: RetailProduct): void {
        this.setControlVal('name', entity.name);
        this.setControlVal('pinYinCode', entity.pinYinCode);
        this.setControlVal('unit', entity.unit);
        this.setControlVal('barCode', entity.barCode);
        this.setControlVal('purchasePrice', entity.purchasePrice);
        this.setControlVal('retailPrice', entity.retailPrice);
        this.setControlVal('desc', entity.desc);
        this.setControlVal('grade', entity.grade);
        this.setControlVal('lable', entity.lable);
        this.setControlVal('categoryId', entity.categoryId);
        this.setControlVal('isEnableMember', entity.isEnableMember);
        this.setControlVal('memberPrice', entity.memberPrice);
        this.setControlVal('stock', entity.stock);
        this.setControlVal('sellPrice', entity.sellPrice);
        // this.setControlVal('lablesText', entity.lablesText);
    }

    protected getFormValues(): void {
        this.product.name = this.getControlVal('name');
        this.product.pinYinCode = this.getControlVal('pinYinCode');
        this.product.unit = this.getControlVal('unit');
        this.product.barCode = this.getControlVal('barCode');
        this.product.purchasePrice = this.getControlVal('purchasePrice');
        this.product.retailPrice = this.getControlVal('retailPrice');
        this.product.desc = this.getControlVal('desc');
        this.product.grade = this.getControlVal('grade');
        this.product.lable = this.getControlVal('lable');
        this.product.categoryId = this.getControlVal('categoryId');
        this.product.isEnableMember = this.getControlVal('isEnableMember');
        this.product.memberPrice = this.getControlVal('memberPrice');
        this.product.stock = this.getControlVal('stock');
        this.product.sellPrice = this.getControlVal('sellPrice');
        // this.product.lablesText = this.getControlVal('lablesText');
        if (this.product.id) {
            this.product.lastModifierUserId = this.settings.user['id'];
        } else {
            this.product.creatorUserId = this.settings.user['id'];
        }
    }

    protected submitExecute(finisheCallback: Function): void {
        this.productService.save(this.product).finally(() => {
            this.saving = false;
        }).then((res) => {
            finisheCallback();
            if (res.code == 0) {
                this.message.success('保存数据成功');
                // this.success(true);
            } else {
                this.message.error('保存数据失败');
                console.log(res.data);
            }
        });
    }

    return() {
        this.router.navigate(['product/index']);
    }
}
