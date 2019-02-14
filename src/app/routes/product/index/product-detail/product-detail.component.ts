import { Component, Injector } from '@angular/core';
import { ProductService, CategoryService } from 'app/services/product';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectGroup, RetailProduct } from 'app/entities';
import { FormComponentBase } from '@shared/component-base/form-component-base';

@Component({
    selector: 'product-detail',
    templateUrl: 'product-detail.component.html',
    styleUrls: ['product-detail.component.less'],
})

export class ProductDetailComponent extends FormComponentBase<RetailProduct>{
    id: string;
    cardTitle: string;
    product: RetailProduct = new RetailProduct();
    gradeTypes: any = [
        { text: '一类烟', value: 1 }, { text: '二类烟', value: 2 }, { text: '三类烟', value: 3 }
        , { text: '四类烟', value: 4 }, { text: '五类烟', value: 5 }
    ];
    isActionTypes: any[] = [{ text: '启用', value: 1 }, { text: '禁用', value: 0 }];
    productTypes: SelectGroup[] = [];
    tempGrade?: number;
    barCode: string;
    constructor(
        injector: Injector
        , private productService: ProductService
        , private categoryService: CategoryService
        , private actRouter: ActivatedRoute
        , private router: Router
    ) {
        super(injector);
        this.id = this.actRouter.snapshot.params['id'];
        this.barCode = this.actRouter.snapshot.params['barCode'];
    }
    ngOnInit() {
        this.validateForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(200)]],
            pinYinCode: ['', [Validators.maxLength(200)]],
            categoryId: ['', [Validators.required]],
            unit: ['', [Validators.maxLength(50)]],
            barCode: ['', [Validators.pattern(/^\+?[1-9][0-9]*$/), Validators.maxLength(50)]],
            purchasePrice: ['', [Validators.pattern(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/), Validators.maxLength(18)]],
            sellPrice: ['', [Validators.pattern(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/), Validators.maxLength(18)]],
            memberPrice: ['', [Validators.pattern(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/), Validators.maxLength(18)]],
            desc: ['', [Validators.maxLength(500)]],
            isEnableMember: ['', [Validators.required]],
            grade: [''],
            // stock: ['', [Validators.pattern(/^([1-9]\d*|[0]{1,1})$/)]]
            stock: ['']
        });
        // this.fetchData();
        this.getProductTypes();
    }

    typeChange(): void {
        this.product.categoryId = this.getControlVal('categoryId');
        if (this.product.categoryId == 1 && this.tempGrade == null) {
            this.setControlVal('grade', 1);
        }
    }

    getProductTypes() {
        this.categoryService.getCategorySelectGroup().then((res) => {
            if (res) {
                this.productTypes = res;
            } else {
                this.productTypes = [];
            }
        }).then((r) => { this.fetchData() });
    }

    isEnableChange(): void {
        this.product.isEnableMember = this.getControlVal('isEnableMember');
        // this.setControlVal('isEnableMember', this.product.isEnableMember);
    }

    fetchData(): void {
        this.validateForm.get('stock').disable();
        if (this.id) {
            this.cardTitle = '编辑商品';
            this.productService.get(this.id).then((res) => {
                if (res) {
                    this.product = res;
                    this.tempGrade = res.grade;
                    this.setFormValues(this.product);
                } else {
                    this.message.error('没有获取到商品信息');
                }
            });
        } else {
            this.cardTitle = '新增商品';
            if (JSON.stringify(this.gradeTypes) !== '[]') {
                this.setControlVal('categoryId', 1);
            }
            this.setControlVal('grade', 1);
            this.setControlVal('barCode', this.barCode);
            this.setControlVal('stock', 0);
            this.setControlVal('isEnableMember', 0);
        }
    }

    protected setFormValues(entity: RetailProduct): void {
        this.setControlVal('name', entity.name);
        this.setControlVal('pinYinCode', entity.pinYinCode);
        this.setControlVal('unit', entity.unit);
        this.setControlVal('barCode', entity.barCode);
        this.setControlVal('purchasePrice', entity.purchasePrice);
        this.setControlVal('desc', entity.desc);
        this.setControlVal('grade', entity.grade);
        this.setControlVal('categoryId', entity.categoryId);
        this.setControlVal('isEnableMember', entity.isEnableMember);
        this.setControlVal('memberPrice', entity.memberPrice);
        this.setControlVal('stock', entity.stock);
        this.setControlVal('sellPrice', entity.sellPrice);
    }

    protected getFormValues(): void {
        this.product.name = this.getControlVal('name');
        this.product.pinYinCode = this.getControlVal('pinYinCode');
        this.product.unit = this.getControlVal('unit');
        this.product.barCode = this.getControlVal('barCode');
        this.product.purchasePrice = this.getControlVal('purchasePrice');
        this.product.desc = this.getControlVal('desc');
        this.product.grade = this.getControlVal('grade');
        this.product.categoryId = this.getControlVal('categoryId');
        this.product.isEnableMember = this.getControlVal('isEnableMember');
        this.product.memberPrice = this.getControlVal('memberPrice');
        this.product.stock = this.getControlVal('stock');
        this.product.sellPrice = this.getControlVal('sellPrice');
        if (this.product.id) {
            this.product.lastModifierUserId = this.settings.user['id'];
        } else {
            this.product.creatorUserId = this.settings.user['id'];
        }
    }

    protected submitExecute(finisheCallback: Function): void {
        if (this.product.categoryId != 1) {
            this.product.grade = null;
        }
        if (!this.product.isEnableMember) {
            this.product.memberPrice = 0;
        }
        this.product.shopId = this.settings.user['shopId'];
        if (this.validateForm.valid) {
            if (!this.id) {
                this.productService.getIsExistByBarCodeAsync(this.product.barCode).then((res) => {
                    if (!res) {
                        this.productService.save(this.product).then((res) => {
                            finisheCallback();
                            if (res.code == 0) {
                                this.message.success('保存数据成功');
                                this.return();
                            } else {
                                this.message.error('保存数据失败');
                                console.log(res.data);
                            }
                        });
                    } else {
                        this.saving = false;
                        this.message.error('该商品条码已存在');
                    }
                });
            } else {
                this.productService.getCurrentIdIsExistByBarCodeAsync(this.product.barCode, this.id).then((res) => {
                    if (!res) {
                        this.productService.save(this.product).then((res) => {
                            finisheCallback();
                            if (res.code == 0) {
                                this.message.success('保存数据成功');
                                this.return();
                            } else {
                                this.message.error('保存数据失败');
                                console.log(res.data);
                            }
                        });
                    } else {
                        this.saving = false;
                        this.message.error('该商品条码已存在');
                    }
                });
            }
        }
    }

    return() {
        this.router.navigate(['product/index']);
    }
}
