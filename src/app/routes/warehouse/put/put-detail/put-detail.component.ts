import { Component, Injector } from '@angular/core';
import { putFormService } from 'app/services/warehouse';
import { Router, ActivatedRoute } from '@angular/router';
import { FormComponentBase } from '@shared/component-base/form-component-base';
import { PutForm, SelectProduct, PutDetail, RetailProduct, selectGroup, EditCache } from 'app/entities';
import { Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from 'app/services/product';
import { v } from '@angular/core/src/render3';

@Component({
    selector: 'put-detail',
    templateUrl: 'put-detail.component.html',
    styleUrls: ['put-detail.component.less'],
    providers: [ProductService]
})
export class PutDetailComponent extends FormComponentBase<PutForm> {
    id: string;
    keyWord: string;
    types: any[] = [{ text: '采购入库', value: 1 }];
    putForm: PutForm = new PutForm();
    dataList: PutDetail[] = [];
    editCache: EditCache[] = [];
    searchChange$ = new BehaviorSubject('');
    optionList: selectGroup[] = [];
    isLoading = false;

    constructor(
        injector: Injector
        , private putFormService: putFormService
        , private router: Router
        , private actRouter: ActivatedRoute
        , private productService: ProductService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.validateForm = this.formBuilder.group({
            formNo: ['', [Validators.required, Validators.maxLength(50)]],
            deliverer: ['', [Validators.maxLength(50)]],
            type: [''],
            remark: ['', [Validators.maxLength(200)]]
        });
        this.getPutForm();
        this.searchChange$.pipe(
            debounceTime(500),
            distinctUntilChanged()).subscribe(term => {
                this.getProductSelectGroup(term);
            });
    }

    onSearch(keyWord: string): void {
        this.isLoading = true;
        this.optionList = [];
        this.searchChange$.next(keyWord);
    }

    getProductSelectGroup(term: string) {
        this.productService.getProductSelectGroup(term).then((res) => {
            this.isLoading = false;
            this.optionList = [];
            if (res) {
                res.forEach(v => {
                    var temp: selectGroup = new selectGroup();
                    temp.id = v.id;
                    temp.text = `${v.name}(${v.barCode})`;
                    this.optionList.push(temp);
                });
            } else {
                this.optionList = [];
            }
        });
    }

    addTable(id: any) {
        if (id) {
            this.productService.getProuductPutById(id).then((res) => {
                if (res) {
                    if (!this.existsProduct(id)) {
                        if (!res.orderNum || res.orderNum === 0) {
                            res.orderNum = 1;
                        }
                        if (!res.purchasePrice) {
                            res.purchasePrice = 0;
                        }
                        if (!res.num || res.num === 0) {
                            res.num = res.orderNum;
                        }
                        this.dataList.push(res);
                        this.syncEditCache();
                    }
                } else {
                    this.message.error('没有获取到商品信息');
                }
            });
        }
    }

    existsProduct(id: string): boolean {
        console.log('In');
        let bo = false;
        this.dataList.forEach(v => {
            console.log(id);
            if (v.productId == id) {
                v.orderNum++;
                bo = true;
                return;
            }
        });
        return bo;
    }

    deleteProduct(id: string) {
        let i = 0;
        this.dataList.forEach(v => {
            if (v.productId == id) {
                this.dataList.splice(i, 1);
                this.syncEditCache();
                return;
            }
            i++;
        });
    }

    startEdit(key: any): void {
        // console.log('Edit:' + JSON.stringify(this.editCache));
        // console.log('Entity:' + JSON.stringify(this.dataList));
        this.editCache[key].edit = true
    }

    cancelEdit(key: string): void {
        // console.log('cancelEdit:' + JSON.stringify(this.editCache));
        // console.log('cancelEntity:' + JSON.stringify(this.dataList));
        this.editCache[key].edit = false;
    }

    saveEdit(key: any, id: string): void {
        Object.assign(this.dataList[key], this.editCache[key].data);
        this.editCache[key].edit = false;
    }

    syncEditCache() {
        this.editCache = [];
        this.dataList.forEach(v => {
            var temp: EditCache = new EditCache();
            temp.edit = false;
            temp.data = v.clone();
            this.editCache.push(temp);
            // this.editCache = {
            //     edit: false,
            //     data: { ...v.clone() }
            // };
        });
    }

    getPutForm(): void {
        this.validateForm.get('formNo').disable();
        if (this.id) {
            // this.productService.get(this.id).then((res) => {
            //     if (res) {
            //         this.product = res;
            //         this.tempGrade = res.grade;
            //         this.setFormValues(this.product);
            //     } else {
            //         this.message.error('没有获取到商品信息');
            //     }
            // });
        }
        else {
            var date = new Date();
            var year = date.getFullYear().toString(); //获取当前年份
            var mon = (date.getMonth() + 1); //获取当前月份
            var da = date.getDate(); //获取当前日
            var h = date.getHours(); //获取小时
            var m = date.getMinutes(); //获取分钟
            var s = date.getSeconds(); //获取秒
            var formNo = year
                + (mon > 9 ? mon : '0' + mon).toString()
                + (da > 9 ? da : '0' + da).toString()
                + (h > 9 ? h : '0' + h).toString()
                + (m > 9 ? m : '0' + m).toString()
                + (s > 9 ? s : '0' + s).toString();
            var newFormNo = 'WP' + formNo;
            this.setControlVal('formNo', newFormNo);
            this.setControlVal('type', 1);
        }
    }

    protected setFormValues(entity: PutForm): void {
        this.setControlVal('formNo', entity.formNo);
        this.setControlVal('deliverer', entity.deliverer);
        this.setControlVal('type', entity.type);
        this.setControlVal('remark', entity.remark);
    }

    protected getFormValues(): void {
        this.putForm.formNo = this.getControlVal('formNo');
        this.putForm.deliverer = this.getControlVal('deliverer');
        this.putForm.type = this.getControlVal('type');
        this.putForm.remark = this.getControlVal('remark');
        if (!this.putForm.id) {
            this.putForm.creatorUserId = this.settings.user['id'];
        }
    }

    protected submitExecute(finisheCallback: Function): void {
    }

    return() {
        this.router.navigate(['warehouse/put']);
    }

}
